"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

    async function signIn(event: React.FormEvent) {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert(error.message);
        return;
    }
    }

  async function signUp(event: React.FormEvent) {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        // options: {
        // emailRedirectTo: window.location.origin,
        // },
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Account created. You can now sign in.");
    setIsSignup(false);
}

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <form
        onSubmit={isSignup ? signUp : signIn}
        className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
        <h1 className="text-2xl font-black text-slate-950">
        {isSignup ? "Create your scrapbook account" : "Sign in to your scrapbook"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
        {isSignup
            ? "Create an account with email and password."
            : "Enter your email and password."}
        </p>

          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
            />

          <button
            type="submit"
            className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white"
          >
            {isSignup ? "Create account" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => setIsSignup((value) => !value)}
            className="mt-4 w-full text-sm font-bold text-slate-600"
            >
            {isSignup
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
          </button>

        </form>
      </main>
    );
  }

  return (
    <div>
      <div className="fixed right-3 top-3 z-50">
        <button
          onClick={signOut}
          className="rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur"
        >
          Sign out
        </button>
      </div>

      {children}
    </div>
  );
}