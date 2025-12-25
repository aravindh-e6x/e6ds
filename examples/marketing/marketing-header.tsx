"use client";

import * as React from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";

export interface NavLink {
  /** Link label */
  label: string;
  /** Link URL (optional if has children) */
  href?: string;
  /** Dropdown items */
  children?: {
    label: string;
    href: string;
    description?: string;
  }[];
}

export interface MarketingHeaderProps {
  /** Logo element */
  logo?: React.ReactNode;
  /** Product/company name */
  name?: string;
  /** Navigation links */
  navLinks?: NavLink[];
  /** Primary CTA button text */
  primaryCta?: string;
  /** Primary CTA click handler */
  onPrimaryCta?: () => void;
  /** Secondary CTA button text */
  secondaryCta?: string;
  /** Secondary CTA click handler */
  onSecondaryCta?: () => void;
  /** Whether header is sticky */
  sticky?: boolean;
  /** Whether to show background blur */
  blur?: boolean;
  /** Additional className */
  className?: string;
}

const MarketingHeader = React.forwardRef<HTMLElement, MarketingHeaderProps>(
  (
    {
      logo,
      name,
      navLinks = [],
      primaryCta,
      onPrimaryCta,
      secondaryCta,
      onSecondaryCta,
      sticky = true,
      blur = true,
      className,
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

    return (
      <header
        ref={ref}
        className={cn(
          "z-50 w-full border-b",
          sticky && "sticky top-0",
          blur && "bg-background/80 backdrop-blur-md",
          !blur && "bg-background",
          className
        )}
      >
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {logo}
              {name && <span className="font-semibold text-lg">{name}</span>}
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <div key={index} className="relative">
                  {link.children ? (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.label ? null : link.label
                        )
                      }
                      onBlur={() =>
                        setTimeout(() => setOpenDropdown(null), 150)
                      }
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openDropdown === link.label && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}

                  {/* Dropdown menu */}
                  {link.children && openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-popover border rounded-lg shadow-lg p-2 z-50">
                      {link.children.map((child, childIndex) => (
                        <a
                          key={childIndex}
                          href={child.href}
                          className="block px-3 py-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="text-sm font-medium">
                            {child.label}
                          </div>
                          {child.description && (
                            <div className="text-xs text-muted-foreground">
                              {child.description}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              {secondaryCta && (
                <Button variant="ghost" size="sm" onClick={onSecondaryCta}>
                  {secondaryCta}
                </Button>
              )}
              {primaryCta && (
                <Button size="sm" onClick={onPrimaryCta}>
                  {primaryCta}
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <div key={index}>
                    {link.children ? (
                      <>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === link.label ? null : link.label
                            )
                          }
                          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium"
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              openDropdown === link.label && "rotate-180"
                            )}
                          />
                        </button>
                        {openDropdown === link.label && (
                          <div className="pl-4 space-y-1">
                            {link.children.map((child, childIndex) => (
                              <a
                                key={childIndex}
                                href={child.href}
                                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <a
                        href={link.href}
                        className="block px-3 py-2 text-sm font-medium"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                {secondaryCta && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSecondaryCta}
                  >
                    {secondaryCta}
                  </Button>
                )}
                {primaryCta && (
                  <Button className="w-full" onClick={onPrimaryCta}>
                    {primaryCta}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
);
MarketingHeader.displayName = "MarketingHeader";

export { MarketingHeader };
