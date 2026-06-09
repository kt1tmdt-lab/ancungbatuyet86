import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự").max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự").regex(/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Nội dung bài viết quá ngắn").optional().or(z.literal("")),
  coverImageUrl: z.string().url("URL ảnh bìa không hợp lệ").optional().or(z.literal("")),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  seoTitle: z.string().max(100, "SEO Title nên dưới 100 ký tự").optional(),
  seoDescription: z.string().max(255, "SEO Description nên dưới 255 ký tự").optional(),
  seoKeywords: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
