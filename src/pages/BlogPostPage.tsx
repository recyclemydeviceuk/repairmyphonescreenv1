import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicBlogBySlug, getPublicBlogs, type BlogPostResult } from "../lib/api";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostResult | null>(null);
  const [related, setRelated] = useState<BlogPostResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPublicBlogBySlug(slug)
      .then((data) => {
        if (!data) {
          setNotFound(true);
        } else {
          setPost(data);
          // Set SEO
          document.title = `${data.title} | Repair My Phone Screen`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute("content", data.excerpt);

          // Set canonical
          let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
          if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
          }
          canonical.href = `${window.location.origin}/blogs/${data.slug}`;

          // JSON-LD
          let jsonLd = document.getElementById("blog-jsonld");
          if (!jsonLd) {
            jsonLd = document.createElement("script");
            jsonLd.id = "blog-jsonld";
            jsonLd.setAttribute("type", "application/ld+json");
            document.head.appendChild(jsonLd);
          }
          jsonLd.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: data.title,
            description: data.excerpt,
            image: data.imageUrl || undefined,
            author: { "@type": "Organization", name: "Repair My Phone Screen" },
            datePublished: data.publishedAt,
            publisher: { "@type": "Organization", name: "Repair My Phone Screen" },
          });

          // Fetch related posts
          getPublicBlogs({ category: data.category, limit: "4" })
            .then(({ data: posts }) => {
              setRelated(posts.filter((p) => p._id !== data._id).slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    return () => {
      // Cleanup JSON-LD on unmount
      const jsonLd = document.getElementById("blog-jsonld");
      if (jsonLd) jsonLd.remove();
      const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (canonical) canonical.remove();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1
            className="text-[38px] font-bold text-[#202124]"
            style={NAV_FONT}
          >
            Post not found
          </h1>
          <p
            className="mt-4 text-[16px] text-[#5f6368]"
            style={NAV_FONT}
          >
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="mt-6 rounded-full bg-red-600 px-6 py-3 text-[14px] font-semibold text-white hover:bg-red-700 transition-colors"
            style={NAV_FONT}
          >
            Back to all posts
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
        {/* Article */}
        <article className="mx-auto max-w-3xl px-6 pt-16 pb-16 md:pt-24">
          {/* Back link */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5f6368] hover:text-red-600 transition-colors mb-8"
            style={NAV_FONT}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Blogs
          </Link>

          {/* Category badge */}
          <span
            className="inline-block rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600"
            style={NAV_FONT}
          >
            {post.category}
          </span>

          {/* Title */}
          <h1
            className="mt-4 text-[32px] font-bold leading-tight text-[#202124] md:text-[42px]"
            style={NAV_FONT}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <p
            className="mt-4 text-[13px] text-[#9aa0a6]"
            style={NAV_FONT}
          >
            {post.author} &middot; {formatDate(post.publishedAt)} &middot; {readTime(post.content)} min read &middot; {post.views.toLocaleString()} views
          </p>

          {/* Featured image */}
          {post.imageUrl && (
            <div className="mt-8 overflow-hidden rounded-[20px]">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="blog-content mt-10"
            style={NAV_FONT}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Inline styles for blog content */}
          <style>{`
            .blog-content h2 { font-size: 24px; font-weight: 700; margin-top: 32px; margin-bottom: 12px; color: #202124; }
            .blog-content h3 { font-size: 20px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; color: #202124; }
            .blog-content p { margin-bottom: 16px; line-height: 1.8; color: #5f6368; }
            .blog-content ul { list-style: disc; padding-left: 24px; margin-bottom: 16px; }
            .blog-content ol { list-style: decimal; padding-left: 24px; margin-bottom: 16px; }
            .blog-content li { margin-bottom: 8px; color: #5f6368; line-height: 1.7; }
            .blog-content strong { color: #202124; }
            .blog-content a { color: #dc2626; text-decoration: underline; }
            .blog-content a:hover { color: #b91c1c; }
            .blog-content img { border-radius: 12px; margin: 16px 0; max-width: 100%; }
            .blog-content blockquote { border-left: 4px solid #dc2626; padding-left: 16px; margin: 24px 0; color: #5f6368; font-style: italic; }
          `}</style>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#e8eaed] bg-white px-4 py-1.5 text-[12px] text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <h2
              className="text-[24px] font-bold text-[#202124] mb-8"
              style={NAV_FONT}
            >
              Related Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((rp) => (
                <Link
                  key={rp._id}
                  to={`/blogs/${rp.slug}`}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    {rp.imageUrl ? (
                      <img
                        src={rp.imageUrl}
                        alt={rp.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-red-500 to-red-700" />
                    )}
                  </div>
                  <div className="p-5">
                    <span
                      className="inline-block rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600"
                      style={NAV_FONT}
                    >
                      {rp.category}
                    </span>
                    <h3
                      className="mt-2 text-[16px] font-bold leading-snug text-[#202124] group-hover:text-red-600 transition-colors line-clamp-2"
                      style={NAV_FONT}
                    >
                      {rp.title}
                    </h3>
                    <p
                      className="mt-1 text-[12px] text-[#9aa0a6]"
                      style={NAV_FONT}
                    >
                      {formatDate(rp.publishedAt)} &middot; {readTime(rp.content)} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-[28px] bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center md:px-16">
            <h2
              className="text-[28px] font-bold text-white md:text-[34px]"
              style={NAV_FONT}
            >
              Need a repair? Get your quote today.
            </h2>
            <p
              className="mt-3 text-[15px] text-red-100 max-w-md mx-auto leading-7"
              style={NAV_FONT}
            >
              Fast, affordable phone screen repairs with a 12-month warranty.
              Get your device fixed today.
            </p>
            <Link
              to="/book-repair"
              className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
              style={NAV_FONT}
            >
              Get Your Repair Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
