"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileNavToggle } from "./mobile-nav-toggle";
import { Sidebar } from "./sidebar";

type MobileSidebarWrapperProps = {
  structure: any[];
};

export function MobileSidebarWrapper({ structure }: MobileSidebarWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <MobileNavToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity
          duration-200
          lg:hidden
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-full transform transition-transform
          duration-200 ease-in-out
          lg:static lg:w-64 lg:translate-x-0 lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar structure={structure} />
      </div>
    </>
  );
}
