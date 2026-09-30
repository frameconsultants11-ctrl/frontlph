"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Home,
  Tag,
  Circle,
  Trophy,
  LayoutGrid,
  BarChart3,
  Settings,
  MessageSquare,
  Plus,
  X,
  ChevronRight,
  LogOut,
  Wallet2Icon,
  ShoppingBag,
  MonitorPlay,
} from "lucide-react";

/* =========================================================
   NAVIGATION
========================================================= */

const MAIN_NAV = [
  {
    label: "Dashboard",
    href: "/profile/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Sessions",
    href: "/profile/sessions",
    icon: MonitorPlay,
  },
  {
    label: "Circles",
    href: "/profile/circles",
    icon: Circle,
  },
  {
    label: "Trophies",
    href: "/profile/trophies",
    icon: Trophy,
  },
  {
    label: "Orders",
    href: "/profile/orders",
    icon: ShoppingBag,
  },
  {
    label: "Wallet & Refferals",
    href: "/profile/wallet",
    icon: Wallet2Icon,
  },
];

const SECONDARY_NAV = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function isActivePath(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

/* =========================================================
   LOGO
========================================================= */

function Logo({ expanded }) {
  return (
    <Link
      href="/dashboard"
      className="flex h-[58px] items-center px-3"
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#111827]
          text-white
          shadow-sm
        "
      >
        <div className="relative h-4 w-4">
          <span
            className="
              absolute
              left-0
              top-0
              h-2.5
              w-2.5
              rounded-[3px]
              bg-white
            "
          />

          <span
            className="
              absolute
              bottom-0
              right-0
              h-2.5
              w-2.5
              rounded-[3px]
              bg-green-400
            "
          />
        </div>
      </div>

      <div
        className={`
          ml-3
          overflow-hidden
          transition-all
          duration-300
          ${
            expanded
              ? "w-[120px] opacity-100"
              : "w-0 opacity-0"
          }
        `}
      >
        <p className="whitespace-nowrap text-[15px] font-bold tracking-[-0.3px] text-gray-900">
          Learn Per Hour
        </p>

        <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-gray-400">
          Learning platform
        </p>
      </div>
    </Link>
  );
}

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function DesktopNavItem({
  item,
  active,
  expanded,
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`
        group
        relative
        z-10
        flex
        h-11
        w-full
        items-center
        rounded-xl
        px-3
        text-left
        transition-colors
        duration-200
        ${
          active
            ? "text-green-600"
            : "text-gray-500 hover:text-gray-900"
        }
      `}
    >
      <span
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          transition-all
          duration-200
          ${
            active
              ? "text-green-600"
              : "text-gray-500 group-hover:text-gray-900"
          }
        `}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2.3 : 2}
        />
      </span>

      <span
        className={`
          ml-3
          overflow-hidden
          whitespace-nowrap
          text-[13px]
          font-medium
          transition-all
          duration-300
          ${
            expanded
              ? "w-[140px] translate-x-0 opacity-100"
              : "w-0 -translate-x-2 opacity-0"
          }
        `}
      >
        {item.label}
      </span>
    </Link>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function Profile({ session, expanded }) {
  const name =
    session?.user?.name || "Learner";

  const image =
    session?.user?.image ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0";

  return (
    <Link
      href="/dashboard/profile"
      className="
        mx-2
        mb-2
        block
        rounded-xl
        border
        border-gray-100
        bg-gray-50/70
        p-2
        transition
        hover:border-gray-200
        hover:bg-gray-50
      "
    >
      <div className="flex items-center">
        <img
          src={image}
          alt={name}
          className="
            h-9
            w-9
            shrink-0
            rounded-lg
            border
            border-white
            bg-gray-100
            object-cover
          "
        />

        <div
          className={`
            ml-2.5
            min-w-0
            overflow-hidden
            transition-all
            duration-300
            ${
              expanded
                ? "w-[130px] opacity-100"
                : "w-0 opacity-0"
            }
          `}
        >
          <p className="truncate text-[12px] font-semibold text-gray-900">
            {name}
          </p>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="whitespace-nowrap text-[10px] font-medium text-gray-400">
              Learner
            </span>
          </div>
        </div>

        {expanded && (
          <ChevronRight
            size={14}
            className="ml-auto text-gray-300"
          />
        )}
      </div>
    </Link>
  );
}

/* =========================================================
   LOGOUT BUTTON
========================================================= */

function LogoutButton({ expanded }) {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      className="
        mx-2
        mb-2
        flex
        h-10
        w-[calc(100%-16px)]
        items-center
        rounded-xl
        px-3
        text-gray-500
        transition-all
        duration-200
        hover:bg-red-50
        hover:text-red-600
        group
      "
    >
      <span
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          transition-colors
          group-hover:bg-red-100
        "
      >
        <LogOut size={18} />
      </span>

      <span
        className={`
          ml-3
          overflow-hidden
          whitespace-nowrap
          text-[13px]
          font-medium
          transition-all
          duration-300
          ${
            expanded
              ? "w-[140px] opacity-100"
              : "w-0 opacity-0"
          }
        `}
      >
        Log out
      </span>
    </button>
  );
}

/* =========================================================
   MOBILE MENU ITEM
========================================================= */

function MobileMenuItem({
  item,
  active,
  onClick,
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-left
        transition
        ${
          active
            ? "bg-green-50 text-green-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
    >
      <span
        className={`
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          ${
            active
              ? "bg-green-100"
              : "bg-gray-50"
          }
        `}
      >
        <Icon size={17} />
      </span>

      <span className="text-[12px] font-medium">
        {item.label}
      </span>
    </Link>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar({
  expanded,
  setExpanded,
  session,
}) {
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const mobileMenuRef = useRef(null);

  /* =======================================================
     CLOSE MOBILE MENU ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(
          event.target
        )
      ) {
        setMobileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  /* =======================================================
     ACTIVE ITEMS
  ======================================================= */

  const activeMainIndex =
    MAIN_NAV.findIndex((item) =>
      isActivePath(pathname, item.href)
    );

  const activeSecondaryIndex =
    SECONDARY_NAV.findIndex((item) =>
      isActivePath(pathname, item.href)
    );

  /* =======================================================
     MOBILE NAVIGATION

     5 ITEMS VISIBLE:
     Home
     Tags
     Circles
     Trophies
     Dashboard

     REMAINING:
     Analytics
     Settings
     Messages
  ======================================================= */

  const MOBILE_VISIBLE_ITEMS =
    MAIN_NAV.slice(0, 5);

  const MOBILE_MORE_ITEMS = [
    ...MAIN_NAV.slice(5),
    ...SECONDARY_NAV,
  ];

  const mobileActiveIndex =
    MOBILE_VISIBLE_ITEMS.findIndex((item) =>
      isActivePath(pathname, item.href)
    );

  return (
    <>
<div
  onMouseEnter={() => setExpanded(true)}
  onMouseLeave={() => setExpanded(false)}
  className="fixed left-4 top-4 bottom-4 z-50 hidden lg:flex flex-col"
>
  {/* MAIN CARD */}
  <aside
    className={`
      flex min-h-0 flex-1 flex-col
      overflow-hidden
      rounded-[22px]
      border border-gray-200/80
      bg-white
      shadow-[0_8px_30px_rgba(15,23,42,0.06)]
      transition-[width]
      duration-300
      ease-[cubic-bezier(0.4,0,0.2,1)]
      ${expanded ? "w-[250px]" : "w-[76px]"}
    `}
  >
    <Logo expanded={expanded} />

    <div className="mx-4 h-px shrink-0 bg-gray-100" />

    {/* ONLY THIS PART SCROLLS */}
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pt-4">

      <nav className="relative space-y-1">
        {activeMainIndex >= 0 && (
          <span
            className="
              pointer-events-none absolute
              left-0 right-0 top-0 h-11
              rounded-xl bg-green-50
              transition-transform duration-300
            "
            style={{
              transform: `translateY(${activeMainIndex * 48}px)`,
            }}
          />
        )}

        {MAIN_NAV.map((item) => (
          <DesktopNavItem
            key={item.label}
            item={item}
            active={isActivePath(pathname, item.href)}
            expanded={expanded}
          />
        ))}
      </nav>
    </div>
  </aside>

  {/* GAP */}
  <div className="h-3 shrink-0" />

  {/* BOTTOM CARD */}
  <aside
    className={`
      shrink-0
      overflow-hidden
      rounded-[22px]
      border border-gray-200/80
      bg-white
      shadow-[0_8px_30px_rgba(15,23,42,0.06)]
      transition-[width]
      duration-300
      ${expanded ? "w-[250px]" : "w-[76px]"}
    `}
  >
    <div className="px-2 py-2">
      <nav className="relative space-y-1">
        {activeSecondaryIndex >= 0 && (
          <span
            className="
              pointer-events-none absolute
              left-0 right-0 top-0 h-11
              rounded-xl bg-green-50
            "
            style={{
              transform: `translateY(${activeSecondaryIndex * 48}px)`,
            }}
          />
        )}

        {SECONDARY_NAV.map((item) => (
          <DesktopNavItem
            key={item.label}
            item={item}
            active={isActivePath(pathname, item.href)}
            expanded={expanded}
          />
        ))}
      </nav>
    </div>

    <Profile
      expanded={expanded}
      session={session}
    />

    <LogoutButton expanded={expanded} />
  </aside>
</div>

      <div
        ref={mobileMenuRef}
        className="
          fixed
          bottom-4
          left-1/2
          z-[100]
          -translate-x-1/2
          lg:hidden
        "
      >
        {/* =================================================
            MOBILE MORE POPOVER
        ================================================= */}

        <div
          className={`
            absolute
            bottom-[72px]
            left-1/2
            w-[350px]
            -translate-x-1/2
            origin-bottom
            overflow-hidden
            rounded-2xl
            border
            border-gray-200/80
            bg-white/95
            p-1.5
            shadow-[0_20px_60px_rgba(15,23,42,0.16)]
            backdrop-blur-2xl
            transition-all
            duration-200
            ${
              mobileMenu
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible translate-y-2 scale-95 opacity-0"
            }
          `}
        >
          <div className="px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              More
            </p>
          </div>

          {/* MORE NAV ITEMS */}

          {MOBILE_MORE_ITEMS.map((item) => (
            <MobileMenuItem
              key={item.label}
              item={item}
              active={isActivePath(
                pathname,
                item.href
              )}
              onClick={() =>
                setMobileMenu(false)
              }
            />
          ))}

          {/* MOBILE LOGOUT */}

          <div className="my-1.5 h-px bg-gray-100" />

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-red-500
              transition
              hover:bg-red-50
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-red-50
              "
            >
              <LogOut size={17} />
            </span>

            <span className="text-[12px] font-medium">
              Log out
            </span>
          </button>
        </div>

        {/* =================================================
            MOBILE DOCK
            5 VISIBLE ITEMS
        ================================================= */}

        <div
          className="
            flex
            h-[62px]
            w-[350px]
            items-center
            rounded-[22px]
            border
            border-white/80
            bg-white/90
            px-2
            shadow-[0_12px_40px_rgba(15,23,42,0.16)]
            backdrop-blur-2xl
          "
        >
          {/* =================================================
              FIVE VISIBLE NAV ITEMS
          ================================================= */}

          <div
            className="
              relative
              flex
              h-11
              flex-1
              items-center
            "
          >
            {/* ANIMATED ACTIVE BACKGROUND */}

            {mobileActiveIndex >= 0 && (
              <span
                className="
                  pointer-events-none
                  absolute
                  left-0
                  top-0
                  h-11
                  w-1/5
                  rounded-[15px]
                  bg-green-600
                  shadow-sm
                  shadow-green-200
                  transition-transform
                  duration-300
                  ease-[cubic-bezier(0.4,0,0.2,1)]
                "
                style={{
                  transform: `translateX(${
                    mobileActiveIndex * 100
                  }%)`,
                }}
              />
            )}

            {MOBILE_VISIBLE_ITEMS.map(
              (item) => {
                const Icon = item.icon;

                const active =
                  isActivePath(
                    pathname,
                    item.href
                  );

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className={`
                      relative
                      z-10
                      flex
                      h-11
                      flex-1
                      items-center
                      justify-center
                      rounded-[15px]
                      transition-all
                      duration-200
                      ${
                        active
                          ? "text-white"
                          : "text-gray-500 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={
                        active ? 2.3 : 2
                      }
                    />
                  </Link>
                );
              }
            )}
          </div>

          {/* DIVIDER */}

          <div className="mx-1.5 h-7 w-px bg-gray-200" />

          {/* =================================================
              PLUS BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label="More navigation"
            onClick={() =>
              setMobileMenu(
                (prev) => !prev
              )
            }
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[15px]
              transition-all
              duration-200
              active:scale-90
              ${
                mobileMenu
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {mobileMenu ? (
              <X size={18} />
            ) : (
              <Plus size={18} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}