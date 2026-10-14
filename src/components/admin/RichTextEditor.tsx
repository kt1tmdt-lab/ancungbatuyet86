"use client";

import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Fragment } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { TableKit } from '@tiptap/extension-table';
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code, Quote, Undo, Redo, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, Table2, Upload, RemoveFormatting, Minus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { uploadAdminImage } from '@/lib/admin-upload-client';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  coverImageUrl?: string;
}

type ImageLayout = 'full' | 'center' | 'left' | 'right';

const ArticleImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      layout: {
        default: 'full',
        parseHTML: (element) => {
          const value = element.getAttribute('data-layout');
          return value === 'center' || value === 'left' || value === 'right' ? value : 'full';
        },
        renderHTML: (attributes) => ({ 'data-layout': attributes.layout }),
      },
    };
  },
});

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
};

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`p-1.5 rounded transition ${
        isActive
          ? 'bg-primary/20 text-primary-dark'
          : 'text-slate-600 hover:bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, coverImageUrl }: RichTextEditorProps) {
  const { token } = useAuth();
  const imageInput = useRef<HTMLInputElement>(null);
  const tokenRef = useRef(token);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      ArticleImage.configure({
        HTMLAttributes: {
          class: 'article-editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary font-semibold underline hover:text-primary-dark cursor-pointer',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      TableKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'article-editor prose prose-orange max-w-none text-slate-800 min-h-[360px] w-full px-4 py-3 bg-white border-0 focus:outline-none text-sm leading-relaxed',
      },
      handlePaste: (view, event) => {
        const itemFiles = Array.from(event.clipboardData?.items || [])
          .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
          .map((item) => item.getAsFile())
          .filter((file): file is File => file !== null);
        const files = itemFiles.length > 0
          ? itemFiles
          : Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith('image/'));
        const html = event.clipboardData?.getData('text/html') || '';
        const document = html ? new DOMParser().parseFromString(html, 'text/html') : null;
        const images = Array.from(document?.body.querySelectorAll('img') || []);
        if (files.length === 0 && images.length === 0) return false;

        event.preventDefault();
        const pasteSelection = {
          from: view.state.selection.from,
          to: view.state.selection.to,
        };
        setUploadError('');
        setUploading(true);

        void (async () => {
          let position = pasteSelection.from;
          try {
            const unusedFiles = [...files];
            const uploadedImages: Array<{ type: 'image'; attrs: { src: string; alt: string } }> = [];
            let missingImages = 0;

            for (const [index, image] of images.entries()) {
              const source = image.getAttribute('src') || '';
              const clipboardFile = unusedFiles.shift();
              let file: File | undefined;
              if (/^(data:image\/|blob:|https?:\/\/)/i.test(source)) {
                try {
                  const response = await fetch(source);
                  const blob = await response.blob();
                  if (response.ok && blob.type.startsWith('image/')) {
                    const extension = blob.type.split('/')[1]?.split('+')[0] || 'png';
                    file = new File([blob], `pasted-image-${index + 1}.${extension}`, { type: blob.type });
                  }
                } catch {
                  // Clipboard image files below can still provide this image.
                }
              }
              if (!file) file = clipboardFile;
              if (!file) {
                image.remove();
                missingImages += 1;
                continue;
              }
              const { url } = await uploadAdminImage({ file, token: tokenRef.current });
              image.setAttribute('src', url);
              image.setAttribute('alt', image.getAttribute('alt') || file.name);
            }

            for (const file of unusedFiles) {
              const { url } = await uploadAdminImage({ file, token: tokenRef.current });
              uploadedImages.push({ type: 'image', attrs: { src: url, alt: file.name } });
            }

            const currentEditor = editorRef.current;
            if (!currentEditor || currentEditor.isDestroyed) return;
            position = Math.min(position, currentEditor.state.doc.content.size);
            const target = { from: position, to: Math.min(pasteSelection.to, currentEditor.state.doc.content.size) };
            if (document && images.length > 0) {
              currentEditor.chain().insertContentAt(target, document.body.innerHTML).run();
              if (uploadedImages.length > 0) currentEditor.chain().insertContentAt(currentEditor.state.selection.to, uploadedImages).run();
            } else {
              currentEditor.chain().insertContentAt(target, uploadedImages).run();
            }
            if (missingImages > 0) {
              setUploadError(`${missingImages} ảnh trong clipboard không có dữ liệu truy cập được. Hãy sao chép riêng ảnh hoặc dùng nút Tải ảnh từ máy.`);
            }
          } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Không lưu được ảnh vào thư viện');
          } finally {
            setUploading(false);
          }
        })();
        return true;
      },
    },
  });

  const selectedImageLayout = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const selection = currentEditor?.state.selection;
      return selection instanceof NodeSelection && selection.node.type.name === 'image'
        ? (selection.node.attrs.layout as ImageLayout) || 'full'
        : null;
    },
  });

  useEffect(() => {
    tokenRef.current = token;
    editorRef.current = editor;
  }, [token, editor]);

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Nhập URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const uploadImage = async (file?: File) => {
    if (!file || !editor) return;
    setUploading(true);
    setUploadError('');
    try {
      const { url } = await uploadAdminImage({ file, token });
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Không tải được ảnh lên');
    } finally {
      setUploading(false);
      if (imageInput.current) imageInput.current.value = '';
    }
  };

  const moveSelectedImage = (direction: -1 | 1) => {
    if (!editor) return;
    const { selection, doc } = editor.state;
    if (!(selection instanceof NodeSelection) || selection.node.type.name !== 'image') return;

    const blocks: Array<{ node: typeof selection.node; position: number }> = [];
    doc.forEach((node, position) => blocks.push({ node, position }));
    const index = blocks.findIndex((block) => block.position === selection.from);
    const neighbor = blocks[index + direction];
    if (index < 0 || !neighbor) return;

    const start = direction === -1 ? neighbor.position : selection.from;
    const end = direction === -1 ? selection.to : neighbor.position + neighbor.node.nodeSize;
    const replacement = direction === -1
      ? [selection.node, neighbor.node]
      : [neighbor.node, selection.node];
    const transaction = editor.state.tr.replaceWith(start, end, Fragment.fromArray(replacement));
    transaction.setSelection(NodeSelection.create(transaction.doc, direction === -1 ? start : start + neighbor.node.nodeSize));
    editor.view.dispatch(transaction);
    editor.commands.focus();
  };

  if (!editor) {
    return <div className="min-h-[300px] bg-slate-50 flex items-center justify-center text-slate-400">Loading editor...</div>;
  }

  return (
    <div className="border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-primary transition-all">
      <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-2 border-b border-slate-200" role="toolbar" aria-label="Định dạng bài viết">
        <select
          aria-label="Kiểu đoạn văn"
          title="Kiểu đoạn văn"
          className="h-8 rounded border border-slate-200 bg-white px-2 text-xs"
          value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
          onChange={(event) => {
            const format = event.target.value;
            if (format === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: format === 'h1' ? 1 : format === 'h2' ? 2 : 3 }).run();
          }}
        >
          <option value="p">Đoạn văn</option>
          <option value="h1">Tiêu đề 1</option>
          <option value="h2">Tiêu đề 2</option>
          <option value="h3">Tiêu đề 3</option>
        </select>
        <select aria-label="Phông chữ" title="Phông chữ" className="h-8 w-28 rounded border border-slate-200 bg-white px-1 text-xs"
          value={editor.getAttributes('textStyle').fontFamily || ''}
          onChange={(event) => event.target.value ? editor.chain().focus().setFontFamily(event.target.value).run() : editor.chain().focus().unsetFontFamily().run()}>
          <option value="">Phông chữ</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <select aria-label="Cỡ chữ" title="Cỡ chữ" className="h-8 w-20 rounded border border-slate-200 bg-white px-1 text-xs"
          value={editor.getAttributes('textStyle').fontSize || ''}
          onChange={(event) => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()}>
          <option value="">Cỡ chữ</option>
          {[12, 14, 16, 18, 20, 24, 28, 32, 40].map((size) => <option key={size} value={`${size}px`}>{size}</option>)}
        </select>
        <select aria-label="Giãn dòng" title="Giãn dòng" className="h-8 w-20 rounded border border-slate-200 bg-white px-1 text-xs"
          value={editor.getAttributes('paragraph').lineHeight || ''}
          onChange={(event) => event.target.value ? editor.chain().focus().setLineHeight(event.target.value).run() : editor.chain().focus().unsetLineHeight().run()}>
          <option value="">Dòng</option>
          <option value="1">1</option><option value="1.3">1.3</option><option value="1.5">1.5</option><option value="2">2</option>
        </select>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="In đậm"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="In nghiêng"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Gạch chân"><Underline size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Gạch ngang"><Strikethrough size={15} /></ToolbarButton>
        <label className="flex h-8 items-center gap-1 rounded px-1 text-xs text-slate-700" title="Màu chữ">A
          <input type="color" aria-label="Màu chữ" defaultValue="#1e293b" className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} />
        </label>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: '#fff0a8' }).run()} isActive={editor.isActive('highlight')} title="Tô sáng"><Highlighter size={15} /></ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Tiêu đề 1"><Heading1 size={15} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Tiêu đề 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Tiêu đề 3"
        >
          <Heading3 size={15} />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Căn trái"><AlignLeft size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Căn giữa"><AlignCenter size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Căn phải"><AlignRight size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Căn đều"><AlignJustify size={15} /></ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Danh sách dấu chấm"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Danh sách đánh số"
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Trích dẫn"
        >
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Đoạn mã"
        >
          <Code size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang"><Minus size={15} /></ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Chèn liên kết">
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Chèn hình ảnh">
          <ImageIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => imageInput.current?.click()} disabled={uploading} title={uploading ? 'Đang tải ảnh' : 'Tải ảnh từ máy'}><Upload size={15} /></ToolbarButton>
        <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={(event) => void uploadImage(event.target.files?.[0])} />
        <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Chèn bảng"><Table2 size={15} /></ToolbarButton>
        {editor.isActive('table') && <>
          <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Thêm hàng">+H</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Thêm cột">+C</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} title="Xóa hàng">−H</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} title="Xóa cột">−C</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="Xóa bảng">×</ToolbarButton>
        </>}
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Xóa định dạng"><RemoveFormatting size={15} /></ToolbarButton>
        <div className="flex-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Hoàn tác"
        >
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Làm lại"
        >
          <Redo size={15} />
        </ToolbarButton>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 text-xs">
        <span className="font-bold text-slate-700">Bố cục ảnh</span>
        {coverImageUrl?.trim() && (
          <button type="button" onClick={() => editor.chain().focus().insertContent({ type: 'image', attrs: { src: coverImageUrl.trim(), alt: 'Ảnh bìa', layout: 'center' } }).run()}
            className="rounded border border-orange-200 bg-orange-50 px-2.5 py-1.5 font-semibold text-orange-700 hover:bg-orange-100">
            Chèn ảnh bìa tại con trỏ
          </button>
        )}
        <select aria-label="Vị trí ảnh đang chọn" value={selectedImageLayout || 'full'} disabled={!selectedImageLayout}
          onChange={(event) => editor.chain().focus().updateAttributes('image', { layout: event.target.value as ImageLayout }).run()}
          className="rounded border border-slate-200 bg-white px-2 py-1.5 disabled:opacity-50">
          <option value="full">Ảnh riêng toàn chiều rộng</option>
          <option value="center">Ảnh riêng ở giữa</option>
          <option value="left">Ảnh trái, chữ bên phải</option>
          <option value="right">Ảnh phải, chữ bên trái</option>
        </select>
        <button type="button" disabled={!selectedImageLayout} onClick={() => moveSelectedImage(-1)} className="rounded border border-slate-200 px-2.5 py-1.5 disabled:opacity-50">Đưa ảnh lên</button>
        <button type="button" disabled={!selectedImageLayout} onClick={() => moveSelectedImage(1)} className="rounded border border-slate-200 px-2.5 py-1.5 disabled:opacity-50">Đưa ảnh xuống</button>
        {!selectedImageLayout && <span className="text-slate-500">Đặt con trỏ ở đoạn muốn chèn ảnh; nhấp vào ảnh để đổi bố cục.</span>}
      </div>

      {uploadError && <p role="alert" className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{uploadError}</p>}
      <EditorContent editor={editor} />
      <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">{uploading ? 'Đang lưu ảnh vào thư viện...' : 'Dán ảnh bằng Ctrl+V; ảnh sẽ được lưu vào thư viện và chèn vào bài viết.'}</p>
    </div>
  );
}
