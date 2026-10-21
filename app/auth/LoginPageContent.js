"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import AuthButton from "@/component/AuthButton";
import SignupForm from "@/component/SignUp";
import LoginForm from "@/component/LoginForm";
import GoogleIcon from "@/component/GoogleIcon";
import Image from "next/image";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode =
    searchParams.get("mode") === "signup"
      ? "signup"
      : "login";

  const isLogin = mode === "login";
const callbackUrl = searchParams.get("callbackUrl");

  const handleGoogleLogin = async () => {
    await signIn("google", {
     callbackUrl: callbackUrl || "/dashboard",
    });
  };

  const switchMode = () => {
    router.push(
      isLogin
        ? "/auth?mode=signup"
        : "/auth?mode=login"
    );
  };

  return (
    <main className="h-screen bg-white p-3 font-sans sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] overflow-hidden rounded-[24px] bg-white lg:grid-cols-[20%_80%]">

        {/* LEFT SIDE */}
        <section className="relative hidden min-h-[700px] overflow-hidden rounded-[22px] bg-[#0039bd] lg:block">

          {/* Brand */}
          <div className="absolute left-8 top-7 z-10 flex items-center gap-2">
         <Image src="/1.png" alt="logo" height={40} width={150} />
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-7 left-7 right-7 z-10">
            <Image src="/ds.jpg" alt="logo" height={80} width={350} className="rounded-2xl mb-8 shadow" />
            <h1 className="max-w-[620px] text-[28px] font-semibold leading-[1.15] tracking-[-0.8px] text-[#fff] xl:text-[28px]">
              Learn something new,
              <br />
              one hour at a time.
            </h1>

            <p className="mt-3 max-w-[560px] text-[14px] leading-6 text-gray-100">
              Build your skills with focused learning,
              expert mentors and practical sessions.
            </p>

            <div className="mt-7 flex items-center gap-4 rounded-2xl border border-blue-500/80 bg-white/20 px-4 py-3 backdrop-blur-md">
              <div className="flex -space-x-2 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#d46022] text-xs">
                  P
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#217dba] text-xs">
                  A
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#b01d6b] text-xs">
                  R
                </div>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#f8fcfa]">
                  5,000+ learners
                </p>

                <p className="text-[12px] text-[#e4e9e7]">
                  Learn, grow and build your career every day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-[calc(100vh-24px)] items-center justify-center px-5 py-10 sm:px-10 lg:min-h-[700px]">

          <div className="w-full max-w-[390px]">

            {/* Heading */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
              <Image src="/2.png" alt="logo" height={40} width={150} />
              </div>

              <h2 className="text-[25px] font-semibold tracking-[-0.6px] text-[#17251f]">
                {isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="mt-2 text-[13px] text-gray-500">
                {isLogin
                  ? "Sign in to continue learning"
                  : "Start your learning journey today"}
              </p>
            </div>

            {/* Google */}
            <AuthButton
              variant="secondary"
              className="mt-7"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />

              {isLogin
                ? "Continue with Google"
                : "Sign up with Google"}
            </AuthButton>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-[12px] text-gray-400">
                Or
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Form */}
            {/* {isLogin ? (
              <LoginForm />
            ) : (
              <SignupForm />
            )} */}

            {/* Toggle */}
            <div className="mt-7 text-center">
              <p className="text-[13px] text-gray-500">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 font-semibold text-[#173f32] hover:underline"
                >
                  {isLogin
                    ? "Sign up"
                    : "Log in"}
                </button>
              </p>
            </div>

            {/* Terms */}
            <p className="mx-auto mt-7 max-w-[330px] text-center text-[11px] leading-5 text-gray-400">
              By continuing, you agree to our{" "}
              <span className="font-medium text-gray-600">
                Terms
              </span>{" "}
              and{" "}
              <span className="font-medium text-gray-600">
                Privacy Policy
              </span>
              .
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}