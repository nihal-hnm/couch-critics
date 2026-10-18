/**
 * =============================================================================
 * Netflix-Style Login & Registration Page
 * =============================================================================
 * Styled with Couch Critics Midnight Cinema palette:
 *  - Main background: #0B0B0F
 *  - Cards & panels: #15151C
 *  - Subtle borders: #292932
 *  - Primary accent: #E50914 (hover #FF3B3B)
 *  - Text: #F5F5F5 / #A1A1AA
 */

"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  HelpCircle,
  Globe,
  Sparkles,
  AlertCircle,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SHOWCASE_MEDIA_ITEMS } from "@/lib/showcase-media";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signUp, signOut } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecaptchaInfo, setShowRecaptchaInfo] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  useEffect(() => {
    if (user && !isSubmitting) {
      // Optional: keep on page or give 1-click go to dashboard
    }
  }, [user, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter both an email and password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please verify.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const res = await signIn(cleanEmail, password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess("Welcome back! Loading your cinema journal...");
          setTimeout(() => {
            router.push("/");
          }, 600);
        }
      } else {
        const res = await signUp(cleanEmail, password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess("Account registered successfully! Check your inbox or sign in now.");
          setMode("signin");
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestAccess = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#0B0B0F] text-[#F5F5F5] font-sans select-none">
      {/* ── CINEMATIC POSTER MOSAIC BACKDROP ──────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Poster Collage Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 p-4 opacity-25 transform scale-105 filter blur-[1px]">
          {SHOWCASE_MEDIA_ITEMS.concat(SHOWCASE_MEDIA_ITEMS).map((item, i) => (
            <div
              key={`bg-${item.id}-${i}`}
              className="aspect-[2/3] rounded-lg overflow-hidden bg-[#15151C] shadow-lg border border-[#292932]/40"
            >
              <img
                src={item.posterUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Cinematic Multi-Layer Gradient Scrims & Ambient Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/90 to-[#0B0B0F]/80"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(21, 21, 28, 0.7) 0%, rgba(11, 11, 15, 0.94) 55%, rgba(11, 11, 15, 0.99) 100%)",
          }}
        />

        {/* Restrained Atmospheric Cinema Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E50914]/[0.04] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-[#15151C]/60 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* ── TOP HEADER / BRAND NAVIGATION ─────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform active:scale-95"
          aria-label="Couch Critics Home"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#E50914]/25 border border-white/10 shrink-0 bg-[#07070A] flex items-center justify-center group-hover:border-[#E50914]/40 group-hover:scale-105 transition-all">
            <img src="/icon.png" alt="Couch Critics" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-widest font-mono uppercase bg-gradient-to-r from-[#F5F5F5] via-white to-[#A1A1AA] bg-clip-text text-transparent drop-shadow-sm">
              COUCH CRITICS
            </span>
            <span className="text-[10px] text-[#A1A1AA] font-medium tracking-[0.25em] uppercase -mt-1 hidden sm:block">
              Cinema &amp; Series Journal
            </span>
          </div>
        </Link>

        {/* Return / Guest Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#15151C] hover:bg-[#1f1f2a] text-[#A1A1AA] hover:text-[#F5F5F5] border border-[#292932] hover:border-[#E50914]/40 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#E50914] transition-colors" />
            <span>Return to Journal</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CINEMATIC AUTH CARD ─────────────────────────────────────── */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[460px] bg-black/85 sm:bg-[#15151C] backdrop-blur-2xl rounded-2xl p-8 sm:p-14 border border-[#292932] shadow-2xl shadow-black/80 transition-all">
          {/* If already signed in */}
          {user ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#0B0B0F] border border-[#292932] flex items-center justify-center mx-auto text-[#E50914]">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#F5F5F5]">You&apos;re Signed In</h2>
                <p className="text-sm text-[#A1A1AA] mt-1 truncate">{user.email}</p>
              </div>
              <div className="space-y-3 pt-2">
                <Link
                  href="/"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] text-white font-bold text-sm shadow-lg shadow-[#E50914]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Open Your Journal
                </Link>
                <button
                  onClick={async () => {
                    await signOut();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#0B0B0F] hover:bg-[#1c1c26] text-[#A1A1AA] hover:text-[#F5F5F5] border border-[#292932] text-xs font-semibold transition-all cursor-pointer"
                >
                  Sign Out of This Account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Card Header */}
              <div className="mb-7">
                <h1 className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
                  {mode === "signin" ? "Sign In" : "Sign Up"}
                </h1>
                <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                  {mode === "signin"
                    ? "Welcome back to your personalized cinema & TV archive."
                    : "Create an account to sync your watchlist, ratings & episode progress."}
                </p>
              </div>

              {/* Alert Feedback Messages */}
              {error && (
                <div
                  className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{error}</div>
                </div>
              )}

              {success && (
                <div
                  className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
                  role="status"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{success}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input Field */}
                <div className="relative group">
                  <div className="relative flex items-center bg-[#0B0B0F] border border-[#292932] rounded-xl focus-within:border-[#E50914] focus-within:ring-2 focus-within:ring-[#E50914]/20 transition-all">
                    <Mail className="w-4 h-4 text-[#A1A1AA] ml-3.5 shrink-0" />
                    <input
                      id={emailId}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or username"
                      required
                      autoComplete="email"
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-[#F5F5F5] placeholder-[#A1A1AA]/60 outline-none"
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div className="relative group">
                  <div className="relative flex items-center bg-[#0B0B0F] border border-[#292932] rounded-xl focus-within:border-[#E50914] focus-within:ring-2 focus-within:ring-[#E50914]/20 transition-all">
                    <Lock className="w-4 h-4 text-[#A1A1AA] ml-3.5 shrink-0" />
                    <input
                      id={passwordId}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-[#F5F5F5] placeholder-[#A1A1AA]/60 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-3 text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up Mode) */}
                {mode === "signup" && (
                  <div className="relative group animate-in slide-in-from-top-2 duration-200">
                    <div className="relative flex items-center bg-[#0B0B0F] border border-[#292932] rounded-xl focus-within:border-[#E50914] focus-within:ring-2 focus-within:ring-[#E50914]/20 transition-all">
                      <Lock className="w-4 h-4 text-[#A1A1AA] ml-3.5 shrink-0" />
                      <input
                        id={confirmPasswordId}
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                        autoComplete="new-password"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-[#F5F5F5] placeholder-[#A1A1AA]/60 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Primary Action Button (Midnight Cinema Red) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 px-4 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#E50914]/25 hover:shadow-[#E50914]/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : mode === "signin" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#292932]" />
                </div>
                <span className="relative px-3 bg-[#15151C] text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider">
                  OR
                </span>
              </div>

              {/* Instant Guest / Demo Mode Button */}
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-3 px-4 rounded-xl bg-[#0B0B0F] hover:bg-[#191924] border border-[#292932] hover:border-[#E50914]/40 text-[#A1A1AA] hover:text-[#F5F5F5] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E50914] group-hover:scale-110 transition-transform" />
                <span>Explore as Guest (Instant Access)</span>
              </button>

              {/* Options Row: Remember Me & Need Help? */}
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                      rememberMe
                        ? "bg-[#E50914] border-[#E50914] text-white"
                        : "border-[#292932] bg-[#0B0B0F]"
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="hover:text-[#F5F5F5] transition-colors cursor-pointer"
                >
                  Need help?
                </button>
              </div>

              {/* Footer Switcher */}
              <div className="mt-8 pt-6 border-t border-[#292932] text-[#A1A1AA] text-sm">
                {mode === "signin" ? (
                  <p>
                    New to Couch Critics?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-[#F5F5F5] hover:text-[#FF3B3B] font-semibold transition-colors cursor-pointer hover:underline"
                    >
                      Sign up now.
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-[#F5F5F5] hover:text-[#FF3B3B] font-semibold transition-colors cursor-pointer hover:underline"
                    >
                      Sign in.
                    </button>
                  </p>
                )}

                {/* Recaptcha Disclaimer */}
                <div className="mt-4 text-[11px] text-[#A1A1AA]/80 leading-relaxed">
                  <span>
                    This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRecaptchaInfo(!showRecaptchaInfo)}
                    className="text-[#E50914] hover:text-[#FF3B3B] hover:underline cursor-pointer"
                  >
                    Learn more.
                  </button>
                  {showRecaptchaInfo && (
                    <p className="mt-2 text-[#A1A1AA] text-[10px] leading-relaxed animate-in fade-in duration-200">
                      The information collected by Google reCAPTCHA is subject to the Google Privacy
                      Policy and Terms of Service, and is used for providing, maintaining, and
                      improving the reCAPTCHA service and for general security purposes.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── CINEMATIC PAGE FOOTER ─────────────────────────────────────── */}
      <footer className="relative z-20 w-full bg-[#0B0B0F]/90 backdrop-blur-md border-t border-[#292932] py-8 px-6 sm:px-12 text-[#A1A1AA] text-xs">
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="text-[#A1A1AA]">
            Questions? Contact{" "}
            <a
              href="mailto:support@couchcritics.com"
              className="text-[#F5F5F5] hover:text-[#FF3B3B] underline transition-colors"
            >
              support@couchcritics.com
            </a>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px]">
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              FAQ &amp; Help Center
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Terms of Use
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Privacy Statement
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Cookie Preferences
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Watchlist Guide
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Media Attribution (TMDB)
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Account Security
            </Link>
            <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
              Journal Syncing
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#292932]">
            {/* Language Selector */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#15151C] border border-[#292932] text-[#A1A1AA] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#E50914]" />
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-[#A1A1AA] ml-1" />
            </div>

            <p className="text-[11px] text-[#A1A1AA]/60">
              &copy; {new Date().getFullYear()} Couch Critics &bull; All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Help Modal ────────────────────────────────────────────────────── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#15151C] border border-[#292932] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#E50914]">
              <HelpCircle className="w-5 h-5 text-[#E50914]" />
              <h3 className="font-bold text-[#F5F5F5] text-base">Need Help?</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              If your database credentials are not set up, you can click{" "}
              <strong className="text-[#F5F5F5]">&ldquo;Explore as Guest&rdquo;</strong> to store
              and manage all your movies and series locally in your browser!
            </p>
            <p className="text-xs text-[#A1A1AA]/80 leading-relaxed">
              To connect cross-device cloud sync, add Supabase API keys in your environment variables.
            </p>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
