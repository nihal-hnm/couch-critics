/**
 * =============================================================================
 * AuthModal — Login / Sign-up Modal
 * =============================================================================
 * A cinematic-styled auth modal that supports email/password login and signup.
 * Uses the native <dialog> element for accessibility and the useAuth() hook
 * to call Supabase auth methods.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { LogIn, UserPlus, X, Mail, Lock, Eye, EyeOff, Film } from "lucide-react";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open/close the dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  // Reset form when mode changes
  const switchMode = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          onClose();
        }
      } else {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("Account created! Check your email to confirm, then log in.");
          switchMode("login");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="auth-modal-dialog"
    >
      <div className="auth-modal-content">
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-logo flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-[#E50914]/25 border border-white/10 shrink-0 bg-[#07070A] flex items-center justify-center">
              <img src="/icon.png" alt="Couch Critics" className="w-full h-full object-cover" />
            </div>
            <span>COUCH CRITICS</span>
          </div>
          <button
            onClick={onClose}
            className="auth-modal-close"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <h2 className="auth-modal-title">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="auth-modal-subtitle">
          {mode === "login"
            ? "Sign in to sync your journal across devices."
            : "Start tracking your movie journey today."}
        </p>

        {/* Messages */}
        {error && (
          <div className="auth-modal-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="auth-modal-success" role="status">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-modal-form">
          <div className="auth-input-group">
            <Mail size={18} className="auth-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="auth-input"
              id="auth-email"
            />
          </div>

          <div className="auth-input-group">
            <Lock size={18} className="auth-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              className="auth-input"
              id="auth-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-input-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === "signup" && (
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="auth-input"
                id="auth-confirm-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-submit-btn"
            id="auth-submit"
          >
            {isSubmitting ? (
              <span className="auth-spinner" />
            ) : mode === "login" ? (
              <>
                <LogIn size={18} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer toggle */}
        <p className="auth-modal-footer">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="auth-link"
                id="auth-switch-to-signup"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="auth-link"
                id="auth-switch-to-login"
              >
                Log in
              </button>
            </>
          )}
        </p>

        <div className="mt-3 pt-3 border-t border-[#292932] text-center">
          <Link
            href="/login"
            onClick={onClose}
            className="text-xs text-[#E50914] hover:text-[#FF3B3B] font-medium transition-colors"
          >
            Open Full Cinematic Sign-in Page &rarr;
          </Link>
        </div>
      </div>
    </dialog>
  );
}
