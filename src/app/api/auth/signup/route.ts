/**
 * =============================================================================
 * POST /api/auth/signup — Sign up & auto-confirm user
 * =============================================================================
 * Uses the Supabase Admin API (service_role key) to create a user with
 * email_confirm set to true, bypassing the email confirmation requirement.
 * After creation, signs the user in and returns the session.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["SUPABASE_URL"] || process.env["NEXT_PUBLIC_SUPABASE_URL"] || "";
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] || "";
const anonKey = process.env["SUPABASE_ANON_KEY"] || process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || "";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    // Admin client — bypasses RLS, can manage users
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Create user with email auto-confirmed
    const { data: createData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      // Handle common errors gracefully
      if (createError.message.includes("already been registered") || createError.message.includes("already exists")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    // Now sign in to get a session token for the client
    const supabaseAnon = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: signInData, error: signInError } =
      await supabaseAnon.auth.signInWithPassword({ email, password });

    if (signInError) {
      // User was created but sign-in failed — they can try logging in manually
      return NextResponse.json(
        { error: "Account created but auto-login failed. Please sign in manually." },
        { status: 201 }
      );
    }

    return NextResponse.json({
      user: signInData.user,
      session: signInData.session,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
