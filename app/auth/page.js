"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import AuthButton from "@/component/AuthButton";
import SignupForm from "@/component/SignUp";
import LoginForm from "@/component/LoginForm";
import GoogleIcon from "@/component/GoogleIcon";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode =
    searchParams.get("mode") === "signup"
      ? "signup"
      : "login";

  const isLogin = mode === "login";

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
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
      <div className="mx-auto grid min-h-[calc(100vh-24px)] overflow-hidden rounded-[24px] bg-white lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative hidden min-h-[700px] overflow-hidden rounded-[22px] bg-[#e2f9d7] lg:block">

          <div className="absolute -left-[140px] -top-[180px] h-[500px] w-[700px] rounded-full bg-white" />

          <div className="absolute right-[-80px] top-[155px] h-[250px] w-[250px] rounded-full bg-green-500/80 blur-[2px]" />

          <div className="absolute right-[60px] top-[70px] h-[220px] w-[300px] rotate-[25deg] rounded-[45%] bg-white/70" />

          <div className="absolute -left-[100px] bottom-[50px] h-[190px] w-[190px] rounded-full bg-green-400/70 blur-[2px]" />

          <div className="absolute bottom-[-180px] right-[-120px] h-[430px] w-[430px] rounded-full bg-white/80" />

          <div className="absolute bottom-[-30px] right-[80px] h-[240px] w-[280px] rotate-[-25deg] rounded-[50%] bg-green-100/80" />

          {/* Brand */}
          <div className="absolute left-8 top-7 z-10 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#173f32]">
              <div className="h-3 w-3 rounded-full bg-[#b9d63b]" />
            </div>

            <span className="text-[15px] font-semibold tracking-tight text-[#17251f]">
              Learn Per Hour
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-7 left-7 right-7 z-10">
            <h1 className="max-w-[620px] text-[28px] font-semibold leading-[1.15] tracking-[-0.8px] text-[#17251f] xl:text-[32px]">
              Learn something new,
              <br />
              one hour at a time.
            </h1>

            <p className="mt-3 max-w-[560px] text-[14px] leading-6 text-[#52615b]">
              Build your skills with focused learning,
              expert mentors and practical sessions.
            </p>

            <div className="mt-7 flex items-center gap-4 rounded-2xl border border-white/80 bg-white/45 px-4 py-3 backdrop-blur-md">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#d9b29d] text-xs">
                  P
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#9db7c8] text-xs">
                  A
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#c5a9b8] text-xs">
                  R
                </div>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#25342e]">
                  5,000+ learners
                </p>

                <p className="text-[12px] text-[#617069]">
                  Learn, grow and build your career every day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-[calc(100vh-24px)] items-center justify-center px-5 py-10 sm:px-10 lg:min-h-[700px]">

          <div className="w-full max-w-[390px]">

            {/* Mobile logo */}
            <div className="mb-12 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173f32]">
                <div className="h-3.5 w-3.5 rounded-full bg-[#b9d63b]" />
              </div>

              <span className="font-semibold text-[#17251f]">
                Learn Per Hour
              </span>
            </div>

            {/* Heading */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#173f32]">
                <div className="h-4 w-4 rounded-full bg-[#b9d63b]" />
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
            {isLogin ? (
              <LoginForm />
            ) : (
              <SignupForm />
            )}

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