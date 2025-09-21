"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  async function loginGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <section className="max-w-md mx-auto">
      <div className="card p-6 space-y-6">
        <header className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl p-2 grid place-items-center bg-[#fff5ec]">
            <Image
              src="/nav.png"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
          <h1 className="text-3xl font-semibold">Welcome</h1>
          <p className="text-gray-600">
            Sign in to sync progress, or continue as guest.
          </p>
        </header>

        <button
          onClick={loginGoogle}
          className="btn btn-primary w-full ring-focus"
        >
          Continue with Google
        </button>

        <div className="text-center text-sm text-gray-600">or</div>

        <Link href="/" className="btn btn-ghost ring-1 ring-slate-300  w-full">
          Continue as guest
        </Link>

        <p className="text-xs text-gray-500 text-center">
          By continuing you agree to our terms and acknowledge our privacy
          policy.
        </p>
      </div>
    </section>
  );
}
