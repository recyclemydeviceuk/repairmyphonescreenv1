import { Mail } from "lucide-react";
import { useState } from "react";
import { subscribeNewsletter } from "../lib/api";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await subscribeNewsletter(email, "footer");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f8f9fa] py-16 md:py-20">
      <div className="max-w-xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Icon */}
        <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center mb-5">
          <Mail size={20} strokeWidth={2} className="text-white" />
        </div>

        {/* Headline */}
        <p
          className="text-[20px] md:text-[22px] text-[#202124] leading-snug mb-6"
          style={NAV_FONT}
        >
          Get repair tips straight to your inbox.
        </p>

        {/* Form */}
        {!submitted ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 w-full px-4 py-2.5 rounded-full border border-[#dadce0] text-[14px] text-[#202124] outline-none focus:border-red-600 transition-colors"
                style={NAV_FONT}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex-shrink-0 px-6 py-2.5 rounded-full border border-[#202124] text-[14px] text-[#202124] font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 disabled:opacity-50"
                style={NAV_FONT}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </form>
            {error && <p className="mt-2 text-[13px] text-red-600" style={NAV_FONT}>{error}</p>}
          </>
        ) : (
          <p
            className="text-[14px] text-red-600 font-medium"
            style={NAV_FONT}
          >
            Thanks for signing up! We'll be in touch.
          </p>
        )}

      </div>
    </section>
  );
}
