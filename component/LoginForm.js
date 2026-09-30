
"use client";

import { COUNTRIES } from "@/lib/data/countries";
import AuthButton from "./AuthButton";
import Input from "./Input";
import PhoneInput from "./PhoneInput";
import { validateMobile } from "@/lib/flag";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  // ==========================================
  // STATE
  // ==========================================

  const [country, setCountry] = useState("IN");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [mobileTouched, setMobileTouched] =
    useState(false);

  const [passwordTouched, setPasswordTouched] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ==========================================
  // SELECTED COUNTRY
  // ==========================================

  const selectedCountry =
    COUNTRIES.find(
      (item) => item.code === country
    ) ||
    COUNTRIES.find(
      (item) => item.code === "IN"
    );

  // ==========================================
  // MOBILE VALIDATION
  // ==========================================

  const mobileError =
    mobileTouched
      ? validateMobile(mobile)
      : "";

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMobileTouched(true);
    setPasswordTouched(true);
    setLoginError("");

    // ------------------------------------------
    // Validate mobile
    // ------------------------------------------

    const mobileValidationError =
      validateMobile(mobile);

    if (mobileValidationError) {
      return;
    }

    // ------------------------------------------
    // Validate password
    // ------------------------------------------

    if (!password) {
      return;
    }

    // ------------------------------------------
    // Validate country
    // ------------------------------------------

    if (!selectedCountry) {
      setLoginError(
        "Please select your country."
      );

      return;
    }

    // ------------------------------------------
    // Get dial code
    // ------------------------------------------
    //
    // Your COUNTRIES structure is:
    //
    // {
    //   name: "India",
    //   code: "IN",
    //   dial: "+91"
    // }
    //

    const dialCode =
      selectedCountry.dial;

    if (!dialCode) {
      setLoginError(
        "Unable to determine country code."
      );

      return;
    }

    // ------------------------------------------
    // Start loading
    // ------------------------------------------

    setLoading(true);

    try {
      // ----------------------------------------
      // Clean mobile
      // ----------------------------------------

      const cleanMobile =
        mobile.replace(/\D/g, "");

      // ----------------------------------------
      // Create international mobile
      // ----------------------------------------
      //
      // Example:
      //
      // dialCode = +91
      // mobile   = 8005908750
      //
      // result   = +918005908750
      //

      const normalizedMobile =
        `${dialCode}${cleanMobile}`;

      console.log(
        "LOGIN COUNTRY:",
        selectedCountry.name
      );

      console.log(
        "LOGIN DIAL CODE:",
        dialCode
      );

      console.log(
        "LOGIN MOBILE:",
        normalizedMobile
      );

      // ----------------------------------------
      // Auth.js Credentials Login
      // ----------------------------------------

      const result = await signIn(
        "credentials",
        {
          mobile: normalizedMobile,
          password,
          redirect: false,
        }
      );

      console.log(
        "LOGIN RESULT:",
        result
      );

      // ----------------------------------------
      // ERROR
      // ----------------------------------------

      if (result?.error) {

        // --------------------------------------
        // Maximum sessions
        // --------------------------------------

        if (
          result.error.includes(
            "MAX_SESSIONS"
          ) ||
          result.url?.includes(
            "MAX_SESSIONS"
          )
        ) {
          setLoginError(
            "Already logged in on 2 devices. Please terminate one of your existing sessions before logging in here."
          );

          return;
        }

        // --------------------------------------
        // Invalid credentials
        // --------------------------------------

        setLoginError(
          "Invalid mobile number or password."
        );

        return;
      }

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();

        return;
      }

      // ----------------------------------------
      // Unknown result
      // ----------------------------------------

      setLoginError(
        "Unable to sign in. Please try again."
      );

    } catch (error) {

      console.error(
        "MOBILE LOGIN ERROR:",
        error
      );

      setLoginError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* =====================================
          MOBILE
      ====================================== */}

      <PhoneInput
        country={country}
        setCountry={setCountry}
        mobile={mobile}
        setMobile={setMobile}
        error={mobileError}
        onBlur={() =>
          setMobileTouched(true)
        }
        selectedCountry={
          selectedCountry
        }
      />

      {/* =====================================
          PASSWORD
      ====================================== */}

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(
            e.target.value
          );

          // Clear login error
          // when user starts typing
          if (loginError) {
            setLoginError("");
          }
        }}
        error={
          passwordTouched &&
          !password
            ? "Password is required"
            : ""
        }
      />

      {/* =====================================
          FORGOT PASSWORD
      ====================================== */}

      <div className="-mt-1 text-right">

        <button
          type="button"
          onClick={() =>
            router.push(
              "/forgot-password"
            )
          }
          className="text-[11px] font-medium text-[#173f32] hover:underline"
        >
          Forgot password?
        </button>

      </div>

      {/* =====================================
          LOGIN ERROR
      ====================================== */}

      {loginError && (
        <div className="rounded-[8px] border border-red-100 bg-red-50 px-3 py-2.5 text-[12px] leading-5 text-red-600">
          {loginError}
        </div>
      )}

      {/* =====================================
          LOGIN BUTTON
      ====================================== */}

      <AuthButton
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Signing in..."
          : "Log in"}
      </AuthButton>

    </form>
  );
}
