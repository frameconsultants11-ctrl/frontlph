"use client";

import { useEffect, useState } from "react";

import {
  ShieldCheck,
  LockKeyhole,
  Monitor,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

import PasswordRequirement from "@/component/PasswordRequirement";

import {
  validatePassword,
  getPasswordRequirements,
} from "@/lib/flag";
import BackButton from "@/component/BackButton";
import PasswordInput from "@/component/PasswordInput";
import SessionItem from "@/component/profile/SessionItem";
import HeaderComp from "@/component/profile/Header";





function PasswordRequirements({
  password,
}) {
  const requirements =
    getPasswordRequirements(password);

  return (
    <div
      className="
        mt-3
        grid
        grid-cols-1
        gap-x-5
        gap-y-2
        rounded-xl
        border
        border-gray-100
        bg-gray-50/70
        p-3
        sm:grid-cols-2
      "
    >
      {requirements.map(
        (requirement) => (
          <PasswordRequirement
            key={requirement.label}
            valid={requirement.valid}
            label={requirement.label}
          />
        )
      )}
    </div>
  );
}

export default function SecurityPage() {
  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");


  const [sessions, setSessions] =
    useState([]);

  const [sessionsLoading, setSessionsLoading] =
    useState(true);

  const [sessionError, setSessionError] =
    useState("");

  const [
    terminatingSession,
    setTerminatingSession,
  ] = useState(null);

  const [
    terminatingAll,
    setTerminatingAll,
  ] = useState(false);


  const loadSessions =
    async () => {
      try {
        setSessionsLoading(true);
        setSessionError("");

        const response =
          await fetch(
            "/api/auth/sessions",
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load active sessions."
          );
        }

        setSessions(
          data?.sessions || []
        );
      } catch (error) {
        console.error(
          "LOAD_SESSIONS_ERROR:",
          error
        );

        setSessionError(
          error?.message ||
            "Unable to load active sessions."
        );
      } finally {
        setSessionsLoading(false);
      }
    };


  useEffect(() => {
    loadSessions();
  }, []);


  const validateForm = () => {
    const newErrors = {};

    const passwordError =
      validatePassword(
        newPassword
      );

    if (passwordError) {
      newErrors.newPassword =
        passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      newPassword !==
      confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };
  const handlePasswordReset =
    async (event) => {
      event.preventDefault();

      setSuccess("");

      setErrors({});

      if (!validateForm()) {
        return;
      }

      try {
        setSaving(true);

        const response =
          await fetch(
            "/api/auth/reset-password",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials: "include",

              body: JSON.stringify({
                password:
                  newPassword,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to update password"
          );
        }

        setNewPassword("");

        setConfirmPassword("");

        setSuccess(
          data?.message ||
            "Your password has been updated successfully."
        );
      } catch (error) {
        setErrors({
          form:
            error?.message ||
            "Something went wrong. Please try again.",
        });
      } finally {
        setSaving(false);
      }
    };


  const handleTerminateSession =
    async (sessionId) => {
      if (!sessionId) {
        return;
      }

      try {
        setTerminatingSession(
          sessionId
        );

        setSessionError("");

        const response =
          await fetch(
            `/api/auth/sessions/${encodeURIComponent(
              sessionId
            )}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to terminate session."
          );
        }

        /*
         * Remove from UI only after
         * successful API response.
         */

        setSessions(
          (previous) =>
            previous.filter(
              (session) =>
                session.id !==
                sessionId
            )
        );
      } catch (error) {
        console.error(
          "TERMINATE_SESSION_ERROR:",
          error
        );

        setSessionError(
          error?.message ||
            "Unable to terminate session."
        );
      } finally {
        setTerminatingSession(
          null
        );
      }
    };


  const handleTerminateAll =
    async () => {
      const otherSessions =
        sessions.filter(
          (session) =>
            !session.current
        );

      if (
        otherSessions.length === 0
      ) {
        return;
      }

      try {
        setTerminatingAll(true);

        setSessionError("");

     

        for (const session of otherSessions) {
          const response =
            await fetch(
              `/api/auth/sessions/${encodeURIComponent(
                session.id
              )}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Unable to terminate session."
            );
          }
        }


        setSessions(
          (previous) =>
            previous.filter(
              (session) =>
                session.current
            )
        );
      } catch (error) {
        console.error(
          "TERMINATE_ALL_ERROR:",
          error
        );

        setSessionError(
          error?.message ||
            "Unable to terminate all sessions."
        );


        await loadSessions();
      } finally {
        setTerminatingAll(false);
      }
    };


  const handleRefreshSessions =
    async () => {
      await loadSessions();
    };

  return (
    <div className="mx-auto w-full">
      <HeaderComp heading='Settings' desc='Manage your password and active sessions' Icon={ShieldCheck} /> 

      <section
        className="
          overflow-hidden
          rounded-[20px]
          border
          border-gray-200/80
          bg-white
          shadow-[0_5px_25px_rgba(15,23,42,0.04)]
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-gray-100
            px-5
            py-4
            sm:px-6
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-gray-50
              text-gray-600
            "
          >
            <KeyRound
              size={17}
            />
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-[#1d2923]">
              Reset password
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Choose a strong password to keep your account secure.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handlePasswordReset
          }
          className="p-5 sm:p-6"
        >
          <div className="max-w-[650px] space-y-5">
            {/* NEW PASSWORD */}

            <div>
              <PasswordInput
                label="New password"
                value={
                  newPassword
                }
                onChange={(
                  event
                ) => {
                  setNewPassword(
                    event.target
                      .value
                  );

                  if (
                    errors.newPassword
                  ) {
                    setErrors(
                      (
                        previous
                      ) => ({
                        ...previous,
                        newPassword:
                          "",
                      })
                    );
                  }
                }}
                error={
                  errors.newPassword
                }
                placeholder="Enter your new password"
              />

              <PasswordRequirements
                password={
                  newPassword
                }
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <PasswordInput
              label="Confirm new password"
              value={
                confirmPassword
              }
              onChange={(
                event
              ) => {
                setConfirmPassword(
                  event.target
                    .value
                );

                if (
                  errors.confirmPassword
                ) {
                  setErrors(
                    (
                      previous
                    ) => ({
                      ...previous,
                      confirmPassword:
                        "",
                    })
                  );
                }
              }}
              error={
                errors.confirmPassword
              }
              placeholder="Re-enter your new password"
            />

            {/* FORM ERROR */}

            {errors.form && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-red-100
                  bg-red-50
                  px-3
                  py-2.5
                  text-[11px]
                  text-red-600
                "
              >
                <AlertCircle
                  size={14}
                />

                <span>
                  {errors.form}
                </span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-green-100
                  bg-green-50
                  px-3
                  py-2.5
                  text-[11px]
                  text-green-600
                "
              >
                <CheckCircle2
                  size={14}
                />

                <span>
                  {success}
                </span>
              </div>
            )}

            {/* BUTTON */}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  h-[43px]
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#173f32]
                  px-5
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#123329]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving ? (
                  <>
                    <span
                      className="
                        h-3.5
                        w-3.5
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Updating...
                  </>
                ) : (
                  <>
                    <LockKeyhole
                      size={14}
                    />

                    Update password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* =================================================
          SESSION MANAGEMENT
      ================================================= */}

      <section
        className="
          mt-5
          overflow-hidden
          rounded-[20px]
          border
          border-gray-200/80
          bg-white
          shadow-[0_5px_25px_rgba(15,23,42,0.04)]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-gray-100
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-gray-50
                text-gray-600
              "
            >
              <Monitor
                size={17}
              />
            </div>

            <div>
              <h2 className="text-[14px] font-semibold text-[#1d2923]">
                Session management
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Review where your account is currently signed in.
              </p>
            </div>
          </div>

          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* REFRESH */}

            <button
              type="button"
              onClick={
                handleRefreshSessions
              }
              disabled={
                sessionsLoading ||
                terminatingAll
              }
              className="
                flex
                h-8
                items-center
                justify-center
                gap-1.5
                rounded-lg
                px-3
                text-[10px]
                font-semibold
                text-gray-500
                transition
                hover:bg-gray-50
                hover:text-[#173f32]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  sessionsLoading
                    ? "animate-spin"
                    : ""
                }
              >
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
              </svg>

              Refresh
            </button>

            {/* TERMINATE ALL */}

            {sessions.some(
              (session) =>
                !session.current
            ) && (
              <button
                type="button"
                onClick={
                  handleTerminateAll
                }
                disabled={
                  terminatingAll
                }
                className="
                  flex
                  h-8
                  items-center
                  justify-center
                  gap-1.5
                  self-start
                  rounded-lg
                  px-3
                  text-[10px]
                  font-semibold
                  text-red-500
                  transition
                  hover:bg-red-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:self-auto
                "
              >
                {terminatingAll ? (
                  <>
                    <span
                      className="
                        h-3
                        w-3
                        animate-spin
                        rounded-full
                        border-2
                        border-red-200
                        border-t-red-500
                      "
                    />

                    Terminating...
                  </>
                ) : (
                  <>
                    <LogOut
                      size={13}
                    />

                    Terminate all other sessions
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* SESSION ERROR */}

        {sessionError && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-[11px] text-red-600 sm:mx-5">
            <AlertCircle
              size={14}
            />

            <span>
              {sessionError}
            </span>
          </div>
        )}

        {/* SESSIONS */}

        <div className="space-y-2.5 p-4 sm:p-5">
          {sessionsLoading ? (
            <>
              <div
                className="
                  h-[91px]
                  animate-pulse
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50/70
                "
              />

              <div
                className="
                  h-[91px]
                  animate-pulse
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50/70
                "
              />
            </>
          ) : sessions.length === 0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-12
                text-center
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gray-50
                  text-gray-400
                "
              >
                <Monitor
                  size={18}
                />
              </div>

              <p className="text-[12px] font-medium text-gray-600">
                No active sessions
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Your active devices will appear here.
              </p>
            </div>
          ) : (
            sessions.map(
              (session) => (
                <SessionItem
                  key={
                    session.id
                  }
                  session={
                    session
                  }
                  onTerminate={
                    handleTerminateSession
                  }
                  terminating={
                    terminatingSession ===
                    session.id
                  }
                />
              )
            )
          )}
        </div>

        {/* SECURITY NOTE */}

        <div
          className="
            mx-4
            mb-4
            flex
            items-start
            gap-2.5
            rounded-xl
            bg-gray-50
            p-3
            sm:mx-5
            sm:mb-5
          "
        >
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0 text-gray-400"
          />

          <p className="text-[10px] leading-5 text-gray-400">
            If you don't recognize a
            session, terminate it
            immediately and consider
            changing your password.
          </p>
        </div>
      </section>
    </div>
  );
}