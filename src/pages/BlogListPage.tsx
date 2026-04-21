import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicBlogs, type BlogPostResult } from "../lib/api";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const CATEGORIES = ["All", "iPhone", "Samsung", "iPad", "General", "Tips", "Guides"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function readTime(content?: string) {
  if (!content) return 3;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPostResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    document.title = "Blogs - Repair Tips & News | Repair My Phone Screen";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Read the latest phone repair tips, news and guides from Repair My Phone Screen. Expert advice on iPhone, Samsung, iPad repairs and more.");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: "12" };
    if (category !== "All") params.category = category.toLowerCase();

    getPublicBlogs(params)
      .then(({ data, meta }) => {
        setPosts((prev) => (page === 1 ? data : [...prev, ...data]));
        setHasMore(meta?.page < meta?.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, page]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setPosts([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="bg-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 text-center">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Blogs
          </p>
          <h1
            className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[52px]"
            style={NAV_FONT}
          >
            Repair Tips &amp; News
          </h1>
          <p
            className="mt-5 mx-auto max-w-lg text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            Stay up to date with the latest phone repair tips, industry news and
            helpful guides from our expert technicians.
          </p>
        </section>

        {/* Category pills */}
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
                  category === cat
                    ? "bg-red-600 text-white"
                    : "border border-[#e8eaed] bg-white text-[#5f6368] hover:border-red-300 hover:text-red-600"
                }`}
                style={NAV_FONT}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Post grid */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            </div>
          ) : posts.length === 0 ? (
            <p
              className="text-center py-20 text-[16px] text-[#5f6368]"
              style={NAV_FONT}
            >
              No posts found. Check back soon!
            </p>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blogs/${post.slug}`}
                    className="group rounded-[28px] border border-[#f3f4f6] bg-white overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <span
                        className="inline-block rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600"
                        style={NAV_FONT}
                      >
                        {post.category}
                      </span>
                      <h2
                        className="mt-3 text-[20px] font-bold leading-snug text-[#202124] group-hover:text-red-600 transition-colors line-clamp-2"
                        style={NAV_FONT}
                      >
                        {post.title}
                      </h2>
                      <p
                        className="mt-2 text-[14px] leading-7 text-[#5f6368] line-clamp-3"
                        style={NAV_FONT}
                      >
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className="text-[12px] text-[#9aa0a6]"
                          style={NAV_FONT}
                        >
                          {formatDate(post.publishedAt)} &middot; {readTime(post.content)} min read
                        </span>
                        <span
                          className="text-[13px] font-semibold text-red-600 group-hover:underline"
                          style={NAV_FONT}
                        >
                          Read more &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loading}
                    className="rounded-full border border-[#e8eaed] bg-white px-8 py-3 text-[14px] font-semibold text-[#202124] hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                    style={NAV_FONT}
                  >
                    {loading ? "Loading..." : "Load more posts"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
