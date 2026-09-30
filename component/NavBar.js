'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  UserCheck,
  LayoutTemplate,
} from 'lucide-react';
import Link from 'next/link';
import { MentorshipTrainers } from './MentorshipTrainers';

const NAV_LINKS = [
  'Learnings',
  'Certification Prep.',
  'Interview Prep.',
  'Career Counseling',
  'Projects',
];


const LEARNING_TABS = [
  {
    id: 'trainers',
    label: '1 on 1 Mentorship',
    icon: UserCheck,

  },

  {
    id: 'courses',
    label: 'Courses',
    icon: BookOpen,

  },

  {
    id: 'topic',
    label: 'Topic Learning',
    icon: LayoutTemplate,

    courses: [
      {
        id: 'topic-1',
        title: 'Docker & Kubernetes',
        price: '₹999',
        image:
          'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=85',
      },
      {
        id: 'topic-2',
        title: 'LangGraph',
        price: '₹1,499',
        image:
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=85',
      },
      {
        id: 'topic-3',
        title: 'Next.js Advanced',
        price: '₹1,299',
        image:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=85',
      },
    ],
  },
];


const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
      }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative h-[125px] overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Small floating badge */}

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/30 backdrop-blur-sm text-[10px] font-semibold text-slate-700">
            Learn
          </span>
        </div>
      </div>

      {/* ======================================================
          CARD CONTENT
      ====================================================== */}

      <div className="p-3.5">
        <h3 className="text-[14px] font-semibold text-slate-900 leading-tight truncate">
          {course.title}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-3">
          <span className="text-sm font-bold text-green-700 whitespace-nowrap">
            {course.price}
          </span>

          <button
            type="button"
            className="group/button flex items-center justify-center gap-1.5
             bg-slate-900 hover:bg-green-700 text-white
             px-3 py-2 rounded-full text-[11px] font-semibold
             transition-all duration-200
             shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]"
          >
            Book Now

            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="transition-transform duration-200
                       group-hover/button:-translate-y-0.5
                       group-hover/button:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const DesktopMegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const [activeTabId, setActiveTabId] = useState(LEARNING_TABS[0].id);

  const activeTab =
    LEARNING_TABS.find((tab) => tab.id === activeTabId) || LEARNING_TABS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 8,
            scale: 0.98,
          }}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed left-1/2 -translate-x-1/2 top-[58px] w-[min(850px,calc(100vw-40px))] bg-white/95 backdrop-blur-2xl border border-white/70 rounded-[26px] shadow-[0_25px_70px_rgba(0,0,0,0.14)] overflow-hidden text-slate-800"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* ==================================================
              HOVER BRIDGE
          ================================================== */}

          <div className="absolute -top-8 left-0 right-0 h-8 bg-transparent" />

          {/* ==================================================
              DECORATIVE BACKGROUND
          ================================================== */}

          <div className="pointer-events-none absolute -top-32 -right-32 w-[350px] h-[350px] bg-green-100/50 rounded-full blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 w-[350px] h-[350px] bg-green-50 rounded-full blur-3xl" />

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div className="relative p-5 md:p-6">
            {/* ==================================================
                TABS
            ================================================== */}

            <div className="flex  mb-5 pb-2 border-gray-200">
              <div className="inline-flex items-center gap-1.5  p-1.5">
                {LEARNING_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTabId === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                    >
                      {/* ==================================================
                          ANIMATED ACTIVE BACKGROUND
                      ================================================== */}
                      {isActive && (
                        <motion.div
                          layoutId="learning-active-tab"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2
                                       w-full h-12
                                       bg-gradient-to-t
                                       from-green-700/35
                                       to-transparent
                                       blur-[1px]
                                       pointer-events-none"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 30,
                            mass: 0.8,
                          }}
                        />
                      )}

                      {/* ==================================================
                          TAB CONTENT
                      ================================================== */}

                      <span className="relative z-10 flex items-center gap-2">
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className={
                            isActive ? 'text-green-700' : 'text-slate-400'
                          }
                        />

                        <span
                          className={
                            isActive ? 'text-green-700' : 'text-slate-600'
                          }
                        >
                          {tab.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
                ACTIVE TAB
            ================================================== */}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.22,
                  ease: 'easeOut',
                }}
              >
                {/* ==================================================
                    SECTION HEADER
                ================================================== */}

                <div className="flex items-end justify-between mb-4 px-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      Explore Learning
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-medium text-slate-500 hover:text-green-700 transition-colors"
                  >
                    View All
                  </button>
                </div>

                {/* ==================================================
                    THREE COURSE CARDS
                ================================================== */}

                {/* ==================================================
    THREE COURSE CARDS
================================================== */}

<div className="">
  <MentorshipTrainers
    tabId={activeTab.id}
    tabName={activeTab.label}
  />
</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const MobileMenu = ({ isOpen, onClose }) => {
  const [expandedNav, setExpandedNav] = useState(null);
  const [expandedTab, setExpandedTab] = useState(null);

  const handleNavClick = (link) => {
    if (link === 'Learnings') {
      setExpandedNav(expandedNav === 'Learnings' ? null : 'Learnings');
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-40 bg-[#4F9E80] overflow-y-auto pt-24 pb-12 px-6 lg:hidden font-sans"
        >
          <div className="flex flex-col gap-6 max-w-lg mx-auto text-white">
            {/* ==================================================
                NAV ITEMS
            ================================================== */}

            {NAV_LINKS.map((link) => (
              <div key={link} className="border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => handleNavClick(link)}
                  className="w-full flex items-center justify-between text-md font-semibold tracking-tight"
                >
                  {link}

                  {link === 'Learnings' && (
                    <ChevronDown
                      size={24}
                      className={`transition-transform duration-300 ${
                        expandedNav === 'Learnings' ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* ==================================================
                    MOBILE LEARNING SUBMENU
                ================================================== */}

                <AnimatePresence>
                  {link === 'Learnings' && expandedNav === 'Learnings' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 flex flex-col gap-2">
                        {LEARNING_TABS.map((tab) => {
                          const Icon = tab.icon;
                          const isExpanded = expandedTab === tab.id;

                          return (
                            <div
                              key={tab.id}
                              className="l overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedTab(
                                    isExpanded ? null : tab.id
                                  )
                                }
                                className={`w-full p-4 flex items-center justify-between text-left transition-colors`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon
                                    size={18}
                                    className="text-green-100"
                                  />
                                  <span className="font-medium">
                                    {tab.label}
                                  </span>
                                </div>
                                <ChevronDown
                                  size={18}
                                  className={`transition-transform duration-300 ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              {/* MOBILE COURSES */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-3 pt-0 grid gap-3">
                                      {tab.courses.map((course, index) => (
                                        <motion.div
                                          key={course.id}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            delay: index * 0.06,
                                          }}
                                          className="bg-white rounded-xl overflow-hidden text-slate-900"
                                        >
                                          <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-32 object-cover"
                                          />
                                          <div className="p-3">
                                            <h3 className="font-semibold text-sm">
                                              {course.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-3">
                                              <span className="text-green-700 font-bold text-sm">
                                                {course.price}
                                              </span>
                                              <button
                                                type="button"
                                                className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-medium"
                                              >
                                                Book Now
                                                <ArrowUpRight size={13} />
                                              </button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <div className="bg-white h-24 rounded-lg overflow-hidden">
              <img
                src="/off.png"
                alt="Refer Someone and Earn 500 Credits"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* ==================================================
                MOBILE AUTH BUTTONS
            ================================================== */}

            <div className="mt-2 flex flex-col gap-4">
              <button
                type="button"
                className="w-full py-2.5 text-white font-medium text-sm border border-white/20 rounded-full hover:bg-white/10 transition-colors"
              >
                Login
              </button>

              <button
                type="button"
                className="w-full py-2.5 bg-white text-green-900 font-medium text-sm rounded-full flex items-center justify-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]"
              >
                Register Now
                <span className="bg-green-900 text-white rounded-full p-1">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default function Navbar({session}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (menu === 'Learnings') {
      setActiveDropdown(menu);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);


  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 px-4 md:px-8 py-6 font-sans transition-colors duration-300 ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-white lg:bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
      
          <div className="flex-shrink-0 z-50">
            <a
              href="#"
              className="text-green-800 text-xl md:text-2xl font-bold tracking-tight flex items-center gap-1"
            >
              <span className="font-extrabold">LHP.</span>
              <span className="font-light opacity-90">Learn Per Hour</span>
            </a>
          </div>

      

          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <div 
              className={`flex items-center gap-2 backdrop-blur-md rounded-full px-2 py-1.5 shadow-sm transition-colors duration-300 ${
                isScrolled ? 'bg-slate-100/60 border border-slate-200' : 'bg-white/10 border border-white'
              }`}
            >
              {NAV_LINKS.map((link) => (
                <div
                  key={link}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link)}
                  onMouseLeave={handleMouseLeave}
                >
                

                  <a
                    href="#"
                    className={`px-5 py-2 rounded-full text-black/90 text-sm font-medium transition-all duration-300 block ${
                      activeDropdown === link
                        ? 'bg-white text-green-800'
                        : 'hover:text-green-800 hover:bg-white'
                    }`}
                  >
                    {link}
                  </a>

               

                  {link === 'Learnings' && (
                    <DesktopMegaMenu
                      isOpen={activeDropdown === 'Learnings'}
                      onMouseEnter={() => handleMouseEnter('Learnings')}
                      onMouseLeave={handleMouseLeave}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>


          <div className="hidden lg:flex items-center gap-6 z-50">
           {!session && <a
              href="#"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-green-800 hover:text-green-600' : 'text-green-800 hover:text-green-700'
              }`}
            >
              Login
            </a>}

          {!session &&  <button
              type="button"
              className="flex items-center bg-green-800 gap-3 pl-5 pr-2 py-2 rounded-full border border-green-800/30 text-green-50 text-sm font-medium transition-all group backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]"
            >
              Register Now

              <span className="bg-white text-green-800 rounded-full p-1.5 group-hover:scale-105 transition-transform">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </button> }
          {session &&  <Link
              href={'/dashboard'}
              className="flex items-center bg-green-800 gap-3 pl-5 pr-2 py-2 rounded-full border border-green-800/30 text-green-50 text-sm font-medium transition-all group backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]"
            >
              {session.user.name}

              <span className="bg-white text-green-800 rounded-full p-1.5 group-hover:scale-105 transition-transform">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </Link>}
          </div>

       

          <button
            type="button"
            className="lg:hidden text-green-800 z-50 p-2 bg-white/10 backdrop-blur-sm rounded-full border border-green-800/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}