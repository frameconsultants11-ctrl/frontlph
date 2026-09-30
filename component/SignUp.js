import { useState } from "react";
import AuthButton from "./AuthButton";
import Input from "./Input";
import PasswordRequirement from "./PasswordRequirement";
import PhoneInput from "./PhoneInput";
import { COUNTRIES } from "@/lib/data/countries";
import { getPasswordRequirements, validateMobile, validatePassword } from "@/lib/flag";

export default function SignupForm() {
  const [country, setCountry] = useState("IN");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [mobileTouched, setMobileTouched] =
    useState(false);

  const [passwordTouched, setPasswordTouched] =
    useState(false);

  const [nameTouched, setNameTouched] =
    useState(false);

  const [otpTouched, setOtpTouched] =
    useState(false);

  const selectedCountry =
    COUNTRIES.find(
      (item) => item.code === country
    ) || COUNTRIES.find(
      (item) => item.code === "IN"
    );

  const mobileError =
    mobileTouched
      ? validateMobile(mobile)
      : "";

  const passwordError =
    passwordTouched
      ? validatePassword(password)
      : "";

  const passwordRequirements =
    getPasswordRequirements(password);

  const nameError =
    nameTouched && !name.trim()
      ? "Name is required"
      : "";

  const otpError =
    otpTouched &&
    (!/^\d{6}$/.test(otp))
      ? "OTP must be 6 digits"
      : "";

  const isFormValid =
    name.trim() &&
    !validateMobile(mobile) &&
    /^\d{6}$/.test(otp) &&
    !validatePassword(password);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        setNameTouched(true);
        setMobileTouched(true);
        setPasswordTouched(true);
        setOtpTouched(true);

        if (!isFormValid) {
          return;
        }

        // Signup API will be connected later.
      }}
      className="space-y-4"
    >

      {/* NAME */}

      <Input
        label="Full name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        onBlur={() =>
          setNameTouched(true)
        }
        error={nameError}
      />

      {/* MOBILE */}

      <PhoneInput
        country={country}
        setCountry={setCountry}
        mobile={mobile}
        setMobile={setMobile}
        error={mobileError}
        onBlur={() =>
          setMobileTouched(true)
        }
        selectedCountry={selectedCountry}
      />

      {/* OTP */}

      <div>

        <label className="mb-1.5 block text-[12px] font-medium text-[#303a35]">
          OTP
        </label>

        <div className="flex gap-2">

          <Input
            className="flex-1"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              const value =
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

              setOtp(value);
            }}
            onBlur={() =>
              setOtpTouched(true)
            }
            error={otpError}
          />

          <button
            type="button"
            className="h-[45px] shrink-0 rounded-[8px] border border-gray-200 px-3 text-[12px] font-medium text-[#173f32] transition hover:bg-gray-50"
          >
            Send OTP
          </button>

        </div>

      </div>

      {/* PASSWORD */}

      <div>

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onBlur={() =>
            setPasswordTouched(true)
          }
          error={passwordError}
        />

        {/* PASSWORD REQUIREMENTS */}

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">

          {passwordRequirements.map(
            (item) => (
              <PasswordRequirement
                key={item.label}
                valid={item.valid}
                label={item.label}
              />
            )
          )}

        </div>

      </div>

      <AuthButton
        disabled={!isFormValid}
      >
        Create an account
      </AuthButton>

    </form>
  );
}