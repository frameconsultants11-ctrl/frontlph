import { CheckCircle, Clock3, Globe, LogOut, MapPin } from "lucide-react";
import SessionDeviceIcon from "./SessionDeviceIcon";
function formatSessionDate(date) {
  if (!date) {
    return "Unknown";
  }

  try {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Unknown";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  } catch {
    return "Unknown";
  }
}
export default function SessionItem({
  session,
  onTerminate,
  terminating,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-4
        transition
        hover:border-gray-200
        hover:shadow-[0_6px_20px_rgba(15,23,42,0.04)]
        sm:flex-row
        sm:items-center
      "
    >
      {/* DEVICE */}

      <div className="flex min-w-0 flex-1 items-start gap-3">
        <SessionDeviceIcon
          type={session.type}
        />

        <div className="min-w-0 flex-1">
          {/* DEVICE NAME */}

          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[13px] font-semibold text-[#1d2923]">
              {session.device ||
                "Unknown device"}
            </p>

            {session.current && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-green-50
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold
                  text-green-600
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                Current session
              </span>
            )}
          </div>

          {/* SESSION DETAILS */}

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {/* LOCATION */}

            <div className="flex items-center gap-1.5">
              <MapPin
                size={12}
                className="text-gray-400"
              />

              <span className="text-[10px] text-gray-500">
                {session.location ||
                  "Unknown location"}
              </span>
            </div>

            {/* IP */}

            <div className="flex items-center gap-1.5">
              <Globe
                size={12}
                className="text-gray-400"
              />

              <span className="text-[10px] text-gray-500">
                {session.ip ||
                  "Unknown IP"}
              </span>
            </div>

            {/* LOGIN TIME */}

            <div className="flex items-center gap-1.5">
              <Clock3
                size={12}
                className="text-gray-400"
              />

              <span className="text-[10px] text-gray-500">
                {formatSessionDate(
                  session.loginTime
                )}
              </span>
            </div>
          </div>

          {/* LAST ACTIVE */}

          {session.lastActiveAt && (
            <p className="mt-1.5 text-[9px] text-gray-400">
              Last active{" "}
              {formatSessionDate(
                session.lastActiveAt
              )}
            </p>
          )}
        </div>
      </div>

      {/* ACTION */}

      {!session.current ? (
        <button
          type="button"
          disabled={terminating}
          onClick={() =>
            onTerminate(session.id)
          }
          className="
            flex
            h-9
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-gray-200
            px-3
            text-[11px]
            font-medium
            text-gray-500
            transition
            hover:border-red-200
            hover:bg-red-50
            hover:text-red-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {terminating ? (
            <>
              <span
                className="
                  h-3
                  w-3
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-300
                  border-t-red-500
                "
              />

              Terminating...
            </>
          ) : (
            <>
              <LogOut size={13} />

              Terminate
            </>
          )}
        </button>
      ) : (
        <div
          className="
            flex
            h-9
            shrink-0
            items-center
            gap-1.5
            rounded-lg
            bg-gray-50
            px-3
            text-[10px]
            font-medium
            text-gray-400
          "
        >
          <CheckCircle size={13} />

          Active
        </div>
      )}
    </div>
  );
}