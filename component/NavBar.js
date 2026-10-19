'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Menu, X, ChevronDown, BookOpen, Wrench, LayoutTemplate, ShieldCheck } from 'lucide-react';

/* ============================================================
   NAV LINKS  (menu: which mega menu opens on hover)
============================================================ */
const NAV_LINKS = [
  { label: 'Learnings', href: '/courses', menu: 'learn' },
  { label: 'Certification Prep.', href: '/certifications', menu: 'cert' },
  { label: 'Interview Prep.', href: '#' },
  { label: 'Career Counseling', href: '#' },
  { label: 'Projects', href: '#' },
];

const MENUS = {
  learn: {
    width: 'w-[min(1200px,100%)]',
    footer: 'Explore everything we teach',
    columns: [
      { type: 'courses', title: 'Courses', sub: 'courses', Icon: BookOpen },
      { type: 'tools', title: 'Tools', sub: 'tools', Icon: Wrench },
      { type: 'topics', title: 'Topics', sub: 'topics', Icon: LayoutTemplate },
    ],
  },
  cert: {
    width: 'w-[min(460px,100%)]',
    footer: 'Get certified',
    columns: [{ type: 'certifications', title: 'Certifications', sub: 'certifications', Icon: ShieldCheck }],
  },
};

/* ============================================================
   DATA  (fetched once, shared by desktop + mobile)
============================================================ */
let menuPromise = null;
const loadMenu = () => {
  if (!menuPromise) {
    menuPromise = fetch('/api/menu')
      .then((r) => r.json())
      .then((r) => {
        if (!r.success) throw new Error(r.message || 'Menu failed');
        return r.data;
      })
      .catch((err) => {
        menuPromise = null; // allow retry
        throw err;
      });
  }
  return menuPromise;
};

function useMenuData() {
  const [state, setState] = useState({ data: null, loading: true, error: false });
  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: false }));
    loadMenu()
      .then((data) => setState({ data, loading: false, error: false }))
      .catch(() => setState({ data: null, loading: false, error: true }));
  }, []);
  useEffect(() => { load(); }, [load]);
  return { ...state, retry: load };
}

/* ============================================================
   SMALL PIECES  (dark theme)
============================================================ */
const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5" aria-label="Learn Per Hour home">
    <Image src="/1.png" alt="logo" height={40} width={150} />
  </Link>
);

const itemMeta = (item) =>
  item.hours > 0 ? `${item.hours} Hours` : `₹${Number(item.actualPrice).toLocaleString('en-IN')}`;

/* item: image tile, bold title + level badge, two-line description */
const MenuItem = ({ item, onNavigate }) => (
  <Link
    href={item.href}
    onClick={onNavigate}
    className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.06]"
  >
    {item.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.image} alt="" className="h-9 w-9 shrink-0 rounded-lg bg-white/10 object-contain p-1.5" />
    ) : (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-sm font-bold text-[#ccfc3b]">
        {item.name?.[0]?.toUpperCase()}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="flex items-center gap-2">
        <span className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#ccfc3b]">
          {item.name}
        </span>
        {item.level && (
          <span className="shrink-0 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70">
            {item.level}
          </span>
        )}
      </span>
      <span className="mt-0.5 block text-xs truncate line-clamp-1 leading-relaxed text-white/50">
        {item.description || itemMeta(item)}
      </span>
    </span>
  </Link>
);

const Skeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-2.5">
        <div className="h-9 w-9 animate-pulse rounded-lg bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="h-2.5 w-full animate-pulse rounded bg-white/5" />
        </div>
      </div>
    ))}
  </div>
);

/* items + category chips for one section (desktop + mobile) */
const MenuList = ({ section, loading, error, onRetry, onNavigate }) => {
  if (loading) return <Skeleton />;
  if (error) {
    return (
      <p className="px-2 py-4 text-sm text-white/60">
        Couldn’t load this menu.{' '}
        <button type="button" onClick={onRetry} className="font-semibold text-[#ccfc3b] hover:underline">Retry</button>
      </p>
    );
  }
  if (!section?.items?.length) return <p className="px-2 py-4 text-sm text-white/40">Nothing here yet.</p>;

  return (
    <>
      <div className="space-y-0.5">
        {section.items.map((item) => <MenuItem key={item.id} item={item} onNavigate={onNavigate} />)}
      </div>

      {section.categories?.length > 0 && (
        <div className="mt-4 px-2.5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Browse by category</p>
          <div className="flex flex-wrap gap-1.5">
            {section.categories.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                onClick={onNavigate}
                className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/90 transition-colors hover:border-[#ccfc3b] hover:bg-[#ccfc3b] hover:text-black"
              >
                {c.name} <span className="ml-0.5 text-white/40">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

/* lime "view all" pill */
const ViewAllPill = ({ href, label, onNavigate }) => (
  <Link
    href={href}
    onClick={onNavigate}
    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ccfc3b] px-4 py-2 text-xs font-semibold text-[#060B1F] transition-colors hover:bg-white"
  >
    {label}
    <ArrowUpRight size={13} strokeWidth={2.5} />
  </Link>
);

/* ============================================================
   DESKTOP MEGA MENU  (dark blue)
============================================================ */
const DesktopMegaMenu = ({ menu, menuData, onMouseEnter, onMouseLeave, onNavigate }) => {
  const def = menu ? MENUS[menu] : null;
  const { data, loading, error, retry } = menuData;

  return (
    <AnimatePresence>
      {def && (
        <div className="pointer-events-none absolute inset-x-0 top-full hidden justify-center px-6 pt-2 lg:flex">
          <motion.div
            key={menu}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`pointer-events-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0039bd] via-[#2547c2] to-[#050B24] ${def.width}`}
          >
            <div
              className="grid gap-x-10 gap-y-6 px-7 pb-5 pt-6"
              style={{ gridTemplateColumns: `repeat(${def.columns.length}, minmax(0, 1fr))` }}
            >
              {def.columns.map((col) => {
                const section = data?.[col.type];
                return (
                  <section key={col.type} className="min-w-0">
                    {/* muted title + thin line + view all */}
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <h2 className="flex items-center gap-2.5 text-lg font-medium text-white/90">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0039bd] text-white">
                          <col.Icon size={15} />
                        </span>
                        {col.title}
                      </h2>
                      <Link
                        href={section?.viewAll || '/'}
                        onClick={onNavigate}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#ccfc3b] transition-colors hover:text-white"
                      >
                        View all <ArrowUpRight size={13} strokeWidth={2.5} />
                      </Link>
                    </div>

                    <div className="mt-3">
                      <MenuList section={section} loading={loading} error={error} onRetry={retry} onNavigate={onNavigate} />
                    </div>
                  </section>
                );
              })}
            </div>

            {/* footer strip with all "view all" options */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/25 px-7 py-3.5">
              <p className="text-sm text-white/80">{def.footer}</p>
              <div className="flex flex-wrap items-center gap-2">
                {def.columns.map((col) => {
                  const section = data?.[col.type];
                  return (
                    <ViewAllPill
                      key={col.type}
                      href={section?.viewAll || '/'}
                      label={`All ${col.title}${section?.total ? ` (${section.total})` : ''}`}
                      onNavigate={onNavigate}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================
   MOBILE MENU  (dark)
============================================================ */
const Accordion = ({ open, children }) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const MobileSection = ({ col, menuData, expanded, onToggle, onNavigate }) => {
  const { data, loading, error, retry } = menuData;
  const section = data?.[col.type];
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-sm font-semibold text-white ${
          expanded ? 'bg-white/10' : ''
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0039bd] text-white"><col.Icon size={16} /></span>
          {col.title}
        </span>
        <ChevronDown size={16} className={`mr-1 text-white/50 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <Accordion open={expanded}>
        <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <MenuList section={section} loading={loading} error={error} onRetry={retry} onNavigate={onNavigate} />
          <div className="mt-4 px-2.5">
            <ViewAllPill href={section?.viewAll || '/'} label={`View all ${col.title}`} onNavigate={onNavigate} />
          </div>
        </div>
      </Accordion>
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose, session, menuData }) => {
  const [openLink, setOpenLink] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-40 overflow-y-auto bg-gradient-to-b from-[#071A5E] to-[#050B24] px-5 pb-10 pt-[88px] lg:hidden"
        >
          <div className="mx-auto max-w-lg">
            {NAV_LINKS.map((link) => {
              const def = link.menu ? MENUS[link.menu] : null;
              const expanded = openLink === link.label;
              return (
                <div key={link.label} className="border-b border-white/10">
                  {def ? (
                    <button
                      type="button"
                      onClick={() => setOpenLink(expanded ? null : link.label)}
                      className="flex w-full items-center justify-between py-4 text-[15px] font-medium text-white"
                    >
                      {link.label}
                      <ChevronDown size={18} className={`text-white/50 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <a href={link.href} onClick={onClose} className="block py-4 text-[15px] font-medium text-white">
                      {link.label}
                    </a>
                  )}

                  {def && (
                    <Accordion open={expanded}>
                      <div className="flex flex-col gap-1 pb-4">
                        {def.columns.map((col) => (
                          <MobileSection
                            key={col.type}
                            col={col}
                            menuData={menuData}
                            expanded={openSection === col.type}
                            onToggle={() => setOpenSection(openSection === col.type ? null : col.type)}
                            onNavigate={onClose}
                          />
                        ))}
                      </div>
                    </Accordion>
                  )}
                </div>
              );
            })}

            <div className="mt-8 flex flex-col gap-3">
              {!session ? (
                <>
                  <Link href="/auth" onClick={onClose} className="rounded-full border border-white/20 py-3 text-center text-sm font-medium text-white">
                    Login
                  </Link>
                  <Link href="/auth" onClick={onClose} className="flex items-center justify-center gap-2 rounded-full bg-[#ccfc3b] py-3 text-sm font-semibold text-[#060B1F]">
                    Register now <ArrowUpRight size={16} />
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" onClick={onClose} className="flex items-center justify-center gap-2 rounded-full bg-[#ccfc3b] py-3 text-sm font-semibold text-[#060B1F]">
                  {session.user.name} <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================
   NAVBAR
============================================================ */
export default function Navbar({ session }) {
  const [activeMenu, setActiveMenu] = useState(null); // 'learn' | 'cert' | null
  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef(null);
  const menuData = useMenuData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActiveMenu(null);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const openMenu = (link) => {
    clearTimeout(timeoutRef.current);
    setHovered(link.label);
    setActiveMenu(link.menu || null);
  };

  const closeMenu = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHovered(null);
    }, 180);
  };

  const closeNow = () => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(null);
    setHovered(null);
  };

  const keepOpen = () => clearTimeout(timeoutRef.current);

  return (
    <MotionConfig reducedMotion="user">
      <nav
        className={`fixed top-0 z-50 w-full border-b bg-[#0039bd] font-sans transition-all duration-300 ${
          scrolled ? 'border-white/10 py-3' : 'border-transparent py-1.5'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-0 md:px-8">
          <div className="shrink-0"><Logo /></div>

          {/* desktop links */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block" onMouseLeave={closeMenu}>
            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = hovered === link.label;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeNow}
                    onMouseEnter={() => openMenu(link)}
                    onFocus={() => openMenu(link)}
                    className={`relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-white/70'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full border border-white/30 bg-white/10"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                    {link.menu && (
                      <ChevronDown
                        size={14}
                        className={`relative transition-transform duration-200 ${activeMenu === link.menu ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* desktop auth */}
          <div className="hidden items-center gap-5 lg:flex">
            {!session ? (
              <>
                <a href="/auth" className="text-sm font-medium text-white/80 transition-colors hover:text-white">Login</a>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-[#ccfc3b] px-5 py-2 text-sm font-semibold text-[#060B1F] transition-colors hover:bg-[#c4f035]"
                >
                  Register now <ArrowUpRight size={15} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full bg-[#ccfc3b] px-5 py-2 text-sm font-semibold text-[#060B1F] transition-colors hover:bg-[#c4f035]"
              >
                {session.user.name} <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            )}
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full border border-white/15 p-2 text-white lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <DesktopMegaMenu
          menu={activeMenu}
          menuData={menuData}
          onMouseEnter={keepOpen}
          onMouseLeave={closeMenu}
          onNavigate={closeNow}
        />
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} session={session} menuData={menuData} />
    </MotionConfig>
  );
}