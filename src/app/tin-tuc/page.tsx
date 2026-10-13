"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { normalizeMarketingConfig, type HomeNewsItem, type PressItem } from "@/lib/marketing-config";

const PRESS_FILTER = "__press__";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  author?: { name: string } | null;
  category?: { name: string; slug: string } | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MediaItem {
  id: string;
  title: string;
  description: string;
  source: string;
  imageUrl: string;
  href: string;
  sourceUrl: string;
  date: string;
}

function mediaHref(value: string) {
  const href = value.trim();
  if (href === "/tin-tuc" || href === "/tin-tuc/") return "";
  return /^https?:\/\//i.test(href) || (href.startsWith("/") && !href.startsWith("//")) ? href : "";
}

function buildMediaItems(homeNewsItems: HomeNewsItem[], pressItems: PressItem[]) {
  const configured = homeNewsItems
    .filter((item) => item.enabled && (item.title || item.linkUrl || item.imageUrl))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item): MediaItem => ({
      id: `home-${item.id}`,
      title: item.title || item.label || "Bài báo về Ăn Cùng Bà Tuyết",
      description: item.description,
      source: item.label || "Báo chí",
      imageUrl: item.imageUrl,
      href: mediaHref(item.linkUrl),
      sourceUrl: mediaHref(item.linkUrl),
      date: "",
    }));
  const press = pressItems
    .filter((item) => item.title || item.sourceName)
    .map((item): MediaItem => ({
      id: `press-${item.id}`,
      title: item.title || `Bài viết từ ${item.sourceName}`,
      description: item.description || (item.sourceName ? `Bài viết được đăng trên ${item.sourceName}.` : ""),
      source: item.sourceName || "Báo chí",
      imageUrl: item.imageUrl || "",
      href: item.link ? `/tin-tuc/bao-chi/${encodeURIComponent(item.id)}` : "",
      sourceUrl: mediaHref(item.link),
      date: item.publishDate,
    }));

  const seen = new Set<string>();
  return [...configured, ...press].filter((item) => {
    const key = item.sourceUrl ? `url:${item.sourceUrl.replace(/\/$/, "")}` : `title:${item.title.toLocaleLowerCase("vi-VN")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ArticleImage({ post, className = "" }: { post: Post; className?: string }) {
  return post.coverImageUrl ? (
    <img src={post.coverImageUrl} alt={post.title} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full min-h-[220px] w-full flex-col justify-between bg-[linear-gradient(145deg,#f79435_0%,#e95b1a_60%,#ad3015_100%)] p-8 text-white ${className}`}>
      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/85">Ăn Cùng Bà Tuyết</span>
      <span className="max-w-lg text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">{post.title}</span>
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">Tin tức</span>
    </div>
  );
}

function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group border-b border-[#e9e1d6] pb-6">
      <Link href={`/tin-tuc/${post.slug}`} className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-orange-500">
        <div className="aspect-[16/10] overflow-hidden">
          <ArticleImage post={post} className="transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col pt-4">
          <div className="flex items-center gap-3 text-xs font-bold text-[#946f58]">
            <span className="font-black uppercase tracking-[0.12em] text-[#db571b]">{post.category?.name || "Tin tức"}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#d6bca7]" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <h3 className="mt-3 line-clamp-2 text-xl font-black leading-snug tracking-[-0.035em] text-[#172a21] transition group-hover:text-[#d94f17]">
            {post.title}
          </h3>
          {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#68716b]">{post.excerpt}</p>}
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-[#d94f17]">
            Đọc bài viết <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function MediaCard({ item, featured = false }: { item: MediaItem; featured?: boolean }) {
  const content = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#183a2a]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(145deg,#f79435_0%,#e95b1a_60%,#ad3015_100%)] p-6 text-white">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/85">Ăn Cùng Bà Tuyết</span>
            <span className="line-clamp-3 max-w-lg text-xl font-black leading-tight tracking-[-0.04em] sm:text-2xl">{item.title}</span>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">{item.source}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#d94f17]">
          <span>{item.source}</span>
          {item.date && <span className="font-semibold normal-case tracking-normal text-[#946f58]">· {formatDate(item.date)}</span>}
        </div>
        <h3 className={`mt-3 line-clamp-2 font-black leading-snug tracking-[-0.035em] text-[#172a21] group-hover:text-[#d94f17] ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}>{item.title}</h3>
        {item.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#68716b]">{item.description}</p>}
        {item.href && <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-[#d94f17]">Đọc bài báo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span>}
      </div>
    </>
  );
  const cardClass = "group flex h-full flex-col border-b border-[#e9e1d6] pb-6";

  return item.href ? (
    <Link href={item.href} target={/^https?:\/\//i.test(item.href) ? "_blank" : undefined} rel={/^https?:\/\//i.test(item.href) ? "noopener noreferrer" : undefined} className={cardClass}>
      {content}
    </Link>
  ) : (
    <article className={cardClass}>{content}</article>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [homeNewsItems, setHomeNewsItems] = useState<HomeNewsItem[]>([]);
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [marketingLoading, setMarketingLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [marketingError, setMarketingError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadMarketing() {
      setMarketingLoading(true);
      setMarketingError(false);
      try {
        const response = await fetch("/api/settings/marketing", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to fetch marketing settings: ${response.status}`);
        const result = await response.json();
        const config = normalizeMarketingConfig(result?.data);
        if (!controller.signal.aborted) {
          setHomeNewsItems(config.homeNewsItems);
          setPressItems(config.press);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch press articles", error);
        setHomeNewsItems([]);
        setPressItems([]);
        setMarketingError(true);
      } finally {
        if (!controller.signal.aborted) setMarketingLoading(false);
      }
    }
    void loadMarketing();
    return () => controller.abort();
  }, [retryCount]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error("Failed to fetch categories", error);
        }
      }
    }
    void loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      async function loadPosts() {
        if (selectedCategorySlug === PRESS_FILTER) {
          setPosts([]);
          setLoading(false);
          setLoadError(false);
          return;
        }
        setLoading(true);
        setLoadError(false);
        try {
          const params = new URLSearchParams({ status: "PUBLISHED" });
          if (selectedCategorySlug !== "all") params.set("categorySlug", selectedCategorySlug);
          if (searchQuery.trim()) params.set("search", searchQuery.trim());
          const response = await fetch(`/api/posts?${params}`, { signal: controller.signal });
          if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
          const data = await response.json();
          if (!controller.signal.aborted) setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
          if (controller.signal.aborted) return;
          console.error("Failed to fetch posts", error);
          setPosts([]);
          setLoadError(true);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      }
      void loadPosts();
    }, searchQuery.trim() ? 250 : 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCategorySlug, searchQuery, retryCount]);

  const mediaItems = buildMediaItems(homeNewsItems, pressItems);
  const query = searchQuery.trim().toLocaleLowerCase("vi-VN");
  const visibleMediaItems = (selectedCategorySlug === "all" || selectedCategorySlug === PRESS_FILTER)
    ? mediaItems.filter((item) => !query || [item.title, item.description, item.source].some((value) => value.toLocaleLowerCase("vi-VN").includes(query)))
    : [];
  const visiblePosts = selectedCategorySlug === PRESS_FILTER ? [] : posts;
  const hasFilter = selectedCategorySlug !== "all" || searchQuery.trim().length > 0;
  const showFeatured = !hasFilter && visiblePosts.length > 0;
  const featured = showFeatured ? visiblePosts[0] : null;
  const gridPosts = showFeatured ? visiblePosts.slice(1) : visiblePosts;

  function clearFilters() {
    setSelectedCategorySlug("all");
    setSearchQuery("");
  }

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#1d2b25]">
      <header className="border-b border-[#e9dfd2] bg-[#fffaf3]">
        <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-9 sm:px-8 sm:pb-10 sm:pt-11 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[clamp(2.8rem,6vw,5.2rem)] font-black leading-none tracking-[-0.065em]">Tin tức <span className="text-[#df581d]"></span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#657168] sm:text-base">Thông tin cập nhật từ Ăn Cùng Bà Tuyết.</p>
            </div>
            <span className="hidden shrink-0 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9b8c7b] sm:block"></span>
          </div>
        </div>
      </header>

      <section id="bai-viet" className="scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 border-b-2 border-[#1d2b25] py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-black uppercase tracking-[0.08em]"></h2>
            </div>
            <div className="relative w-full lg:w-[280px]">
              <label htmlFor="news-search" className="sr-only">Tìm kiếm bài viết</label>
              <Search size={17} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#9a8877]" />
              <input
                id="news-search"
                type="search"
                placeholder="Tìm bài viết..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-9 w-full border-b border-[#cfc3b4] bg-transparent pl-7 pr-7 text-sm font-medium text-[#172a21] outline-none transition placeholder:text-[#a69b8d] focus:border-[#e85d1a]"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} aria-label="Xóa tìm kiếm" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#8f8071] hover:bg-[#fff1e4] hover:text-[#d94f17]">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-5" aria-label="Lọc theo chuyên mục">
            <button type="button" onClick={() => setSelectedCategorySlug("all")} aria-pressed={selectedCategorySlug === "all"} className={`border-b-2 pb-1 text-sm font-extrabold transition ${selectedCategorySlug === "all" ? "border-[#df581d] text-[#d95319]" : "border-transparent text-[#536157] hover:text-[#d95319]"}`}>
              Tất cả
            </button>
            {mediaItems.length > 0 && (
              <button type="button" onClick={() => setSelectedCategorySlug(PRESS_FILTER)} aria-pressed={selectedCategorySlug === PRESS_FILTER} className={`border-b-2 pb-1 text-sm font-extrabold transition ${selectedCategorySlug === PRESS_FILTER ? "border-[#df581d] text-[#d95319]" : "border-transparent text-[#536157] hover:text-[#d95319]"}`}>
                Báo chí nói về chúng tôi
              </button>
            )}
            {categories.map((category) => (
              <button key={category.id} type="button" onClick={() => setSelectedCategorySlug(category.slug)} aria-pressed={selectedCategorySlug === category.slug} className={`border-b-2 pb-1 text-sm font-extrabold transition ${selectedCategorySlug === category.slug ? "border-[#df581d] text-[#d95319]" : "border-transparent text-[#536157] hover:text-[#d95319]"}`}>
                {category.name}
              </button>
            ))}
          </div>

          {(loadError || marketingError) && !loading && !marketingLoading && (
            <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-3 border-l-2 border-[#df581d] bg-[#fff4e8] px-4 py-3 text-sm text-[#704932]">
              <span>Một số bài viết chưa tải được. Hãy thử cập nhật lại danh sách.</span>
              <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="inline-flex items-center gap-2 font-extrabold text-[#c74a17] hover:underline"><RotateCcw size={14} /> Tải lại</button>
            </div>
          )}
          <div aria-live="polite">
            {loading || marketingLoading ? (
              <div className="grid gap-8 pt-2 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]" aria-label="Đang tải bài viết">
                <div><div className="aspect-[16/10] animate-pulse bg-[#f4eadc]" /><div className="mt-5 h-8 w-4/5 animate-pulse bg-[#f4eadc]" /><div className="mt-3 h-4 w-2/3 animate-pulse bg-[#f4eadc]" /></div>
                <div className="space-y-5"><div className="h-4 w-32 animate-pulse bg-[#f4eadc]" /><div className="h-28 animate-pulse bg-[#f4eadc]" /><div className="h-28 animate-pulse bg-[#f4eadc]" /></div>
              </div>
            ) : visiblePosts.length === 0 && visibleMediaItems.length === 0 ? (
              <div className="grid gap-8 py-9 md:grid-cols-[1fr_0.8fr] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d95319]">{hasFilter ? "Chưa có kết quả" : "Bản tin"}</p>
                  <h3 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">{hasFilter ? "Không tìm thấy bài viết phù hợp." : loadError || marketingError ? "Tin tức đang tạm thời gián đoạn." : "Các bài viết đang được cập nhật."}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-[#68716b]">{hasFilter ? "Thử từ khóa khác hoặc xem tất cả bài viết." : loadError || marketingError ? "Dữ liệu chưa kết nối được lúc này. Bạn có thể thử tải lại hoặc khám phá thêm về thương hiệu." : "Những câu chuyện mới sẽ xuất hiện tại đây khi được xuất bản."}</p>
                  {hasFilter && <button type="button" onClick={clearFilters} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c74a17]">Xem tất cả <ArrowRight size={15} /></button>}
                </div>
                <div className="border-l-2 border-[#df581d] bg-[#fff2e2] p-6 sm:p-8">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d95319]">Trong lúc chờ tin mới</span>
                  <p className="mt-3 text-2xl font-black leading-snug tracking-[-0.03em]">Khám phá Ăn Cùng Bà Tuyết</p>
                  <div className="mt-5 flex flex-col gap-3 text-sm font-bold">
                    <Link href="/gioi-thieu" className="flex items-center justify-between border-b border-[#e8ccb1] pb-3 hover:text-[#d95319]">Câu chuyện thương hiệu <ArrowRight size={16} /></Link>
                    <Link href="/san-pham" className="flex items-center justify-between hover:text-[#d95319]">Khám phá sản phẩm <ArrowRight size={16} /></Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 pt-2">
                {visibleMediaItems.length > 0 && (
                  <section aria-labelledby="press-heading">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#d8cbb9] pb-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d94f17]">Họ nói gì về chúng tôi?</p>
                        <h3 id="press-heading" className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">Trên báo chí</h3>
                      </div>
                      <span className="text-sm font-semibold text-[#68716b]">{visibleMediaItems.length} bài viết</span>
                    </div>
                    <div className="grid gap-7 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-10">
                      <MediaCard item={visibleMediaItems[0]} featured />
                      {visibleMediaItems.length > 1 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">{visibleMediaItems.slice(1, 3).map((item) => <MediaCard key={item.id} item={item} />)}</div>}
                    </div>
                    {visibleMediaItems.length > 3 && <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{visibleMediaItems.slice(3).map((item) => <MediaCard key={item.id} item={item} />)}</div>}
                  </section>
                )}
                {featured && (
                  <Link href={`/tin-tuc/${featured.slug}`} className="group grid border-t-2 border-[#1d2b25] pt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
                    <div className="min-h-[280px] overflow-hidden sm:min-h-[360px]"><ArticleImage post={featured} className="transition-transform duration-500 group-hover:scale-105" /></div>
                    <div className="flex flex-col justify-center py-5 lg:py-0">
                      <span className="w-fit text-xs font-black uppercase tracking-[0.16em] text-[#d94f17]">Bài nổi bật</span>
                      <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] text-[#172a21] transition group-hover:text-[#d94f17] sm:text-4xl">{featured.title}</h3>
                      {featured.excerpt && <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#68716b] sm:text-base">{featured.excerpt}</p>}
                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-[#8b796b]">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{formatDate(featured.createdAt)}</span>
                        {featured.author?.name && <span>{featured.author.name}</span>}
                      </div>
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#d94f17]">Đọc câu chuyện <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                )}

                {gridPosts.length > 0 && (
                  <div>
                    {featured && <h3 className="mb-6 border-t-2 border-[#1d2b25] pt-5 text-2xl font-black tracking-[-0.04em]">Các bài viết khác</h3>}
                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                      {gridPosts.map((post) => <ArticleCard key={post.id} post={post} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
