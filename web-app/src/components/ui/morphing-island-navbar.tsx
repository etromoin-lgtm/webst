"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  badge?: string;
  hasDropdown: boolean;
  content?: {
    heading: string;
    subheading?: string;
    items: {
      title: string;
      desc: string;
      icon: React.ElementType;
      tag?: string;
    }[];
    footer?: {
      title: string;
      label: string;
      icon: React.ElementType;
    };
  };
}

const navItems: MenuItem[] = [
  {
    id: "platform",
    label: "Platform",
    hasDropdown: true,
    content: {
      heading: "Infrastructure",
      subheading: "High-throughput cloud architecture",
      items: [
        {
          title: "Edge Runtime",
          desc: "Sub-millisecond global execution layer.",
          icon: Zap,
          tag: "New",
        },
        {
          title: "Neural Engine",
          desc: "Distributed context & vector memory orchestration.",
          icon: Cpu,
        },
        {
          title: "Encrypted Vault",
          desc: "Zero-knowledge cryptographic key storage.",
          icon: ShieldCheck,
        },
      ],
      footer: {
        title: "All services operational",
        label: "System Status",
        icon: Terminal,
      },
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    hasDropdown: true,
    content: {
      heading: "Workflows & Pipelines",
      subheading: "Battle-tested architectural foundations",
      items: [
        {
          title: "Full-Stack Velocity",
          desc: "Zero-config edge deployment for Next.js apps.",
          icon: Layers,
        },
        {
          title: "Design Tokens",
          desc: "Synchronized cross-platform dynamic design systems.",
          icon: Sparkles,
        },
      ],
      footer: {
        title: "Production blueprints",
        label: "Architecture Hub",
        icon: BookOpen,
      },
    },
  },
  {
    id: "developers",
    label: "Developers",
    badge: "API",
    hasDropdown: true,
    content: {
      heading: "SDKs & Reference",
      subheading: "Everything needed to integrate and ship",
      items: [
        {
          title: "Documentation",
          desc: "Interactive reference guides and typed schemas.",
          icon: Code2,
        },
      ],
    },
  },
  { id: "pricing", label: "Pricing", hasDropdown: false },
  { id: "changelog", label: "Changelog", hasDropdown: false },
];

export function Component() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    if (isLocked) return;
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
      setHoveredTab(null);
    }, 220); // 220ms grace window for smooth mouse movement
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        cancelClose();
        setActiveTab(null);
        setHoveredTab(null);
        setIsLocked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      cancelClose();
    };
  }, []);

  const activeItem = navItems.find((item) => item.id === activeTab);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-8 select-none"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      {/* Floating Island Header Bar */}
      <nav className="relative z-20 flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/80 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-all dark:border-neutral-800/80 dark:bg-neutral-950/80 dark:shadow-[0_8px_32px_rgb(0,0,0,0.4)]">
        {navItems.map((item) => {
          const isOpen = activeTab === item.id;
          const isHovered = hoveredTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => {
                cancelClose();
                setHoveredTab(item.id);
                if (item.hasDropdown) {
                  setActiveTab(item.id);
                } else if (!isLocked) {
                  setActiveTab(null);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                cancelClose();
                if (item.hasDropdown) {
                  if (activeTab === item.id && isLocked) {
                    setIsLocked(false);
                    setActiveTab(null);
                    setHoveredTab(null);
                  } else {
                    setActiveTab(item.id);
                    setHoveredTab(item.id);
                    setIsLocked(true);
                  }
                } else {
                  setIsLocked(false);
                  setActiveTab(null);
                }
              }}
              className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium tracking-tight transition-colors duration-200 cursor-pointer ${
                isOpen || isHovered
                  ? "text-neutral-950 dark:text-neutral-50"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {/* Dynamic Sliding Background Pill */}
              {isHovered && (
                <motion.div
                  layoutId="hover-pill"
                  className="absolute inset-0 z-[-1] rounded-full bg-neutral-200/50 dark:bg-neutral-800/60"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}

              <span>{item.label}</span>

              {item.badge && (
                <span className="rounded-md border border-neutral-300/60 bg-neutral-100 px-1 py-0.5 text-[9px] font-mono font-medium text-neutral-600 dark:border-neutral-700/60 dark:bg-neutral-900 dark:text-neutral-400">
                  {item.badge}
                </span>
              )}

              {item.hasDropdown && (
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isOpen
                      ? "rotate-180 text-neutral-950 dark:text-neutral-100"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Morphing Dropdown Panel with Hover Bridge */}
      <AnimatePresence>
        {activeItem?.hasDropdown && activeItem.content && (
          <div
            className="absolute top-[68px] z-50 pt-2 pointer-events-auto"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* Invisible hover bridge spanning between navbar and dropdown */}
            <div className="absolute -top-3 left-0 right-0 h-5 bg-transparent" />

            <motion.div
              layoutId="dropdown-surface"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                mass: 0.6,
              }}
              className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/95 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.08)] backdrop-blur-2xl ring-1 ring-black/[0.04] dark:border-neutral-800/80 dark:bg-neutral-950/95 dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] dark:ring-white/[0.04]"
            >
              {/* Morphing Inner Frame */}
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                }}
                className="w-[370px]"
              >
                {/* Header */}
                <div className="p-4 pb-2">
                  <div className="mb-2 px-2.5">
                    <p className="text-[11px] font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-500 font-mono">
                      {activeItem.content.heading}
                    </p>
                    {activeItem.content.subheading && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {activeItem.content.subheading}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="space-y-1 mt-2">
                    {activeItem.content.items.map((subItem) => {
                      const Icon = subItem.icon;
                      return (
                        <a
                          key={subItem.title}
                          href="#"
                          className="group flex items-start gap-3.5 rounded-2xl p-2.5 transition-all duration-150 hover:bg-neutral-100/80 dark:hover:bg-neutral-900/80"
                        >
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50 text-neutral-600 transition-colors group-hover:border-neutral-300 group-hover:bg-white group-hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:border-neutral-700 dark:group-hover:bg-neutral-800 dark:group-hover:text-white">
                            <Icon className="h-4.5 w-4.5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                {subItem.title}
                              </span>
                              {subItem.tag && (
                                <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-medium text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
                                  {subItem.tag}
                                </span>
                              )}
                              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all text-neutral-400 group-hover:translate-x-0 group-hover:opacity-100 dark:text-neutral-500" />
                            </div>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                              {subItem.desc}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                {activeItem.content.footer && (
                  <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/60 px-4 py-2.5 text-[11px] dark:border-neutral-900 dark:bg-neutral-900/40">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {activeItem.content.footer.title}
                    </span>
                    <a
                      href="#"
                      className="flex items-center gap-1 font-medium text-neutral-900 hover:underline dark:text-neutral-200"
                    >
                      <span>{activeItem.content.footer.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
