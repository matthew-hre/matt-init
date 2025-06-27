"use client";

import { Menu, X } from "lucide-react";

type MobileNavToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileNavToggle({ isOpen, onToggle }: MobileNavToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        bg-background border-muted rounded-tl-0 fixed top-0 left-0 z-50 flex
        h-10 w-10 items-center justify-center border border-t-0 border-l-0
        transition-all duration-200 ease-in-out
        hover:bg-muted
        ${isOpen ? "rounded-br-none" : "rounded-br-lg"}
        focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none
        lg:hidden
      `}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
    >
      <div className="relative h-5 w-5">
        <Menu
          className={`
            absolute inset-0 h-5 w-5 transition-all duration-200
            ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}
          `}
        />
        <X
          className={`
            absolute inset-0 h-5 w-5 transition-all duration-200
            ${isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}
          `}
        />
      </div>
    </button>
  );
}
