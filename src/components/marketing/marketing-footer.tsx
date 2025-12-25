"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FooterLink {
  /** Link label */
  label: string;
  /** Link URL */
  href: string;
  /** Whether link opens in new tab */
  external?: boolean;
}

export interface FooterColumn {
  /** Column title */
  title: string;
  /** Links in the column */
  links: FooterLink[];
}

export interface MarketingFooterProps {
  /** Logo element or text */
  logo?: React.ReactNode;
  /** Company/product name */
  name?: string;
  /** Tagline or description */
  tagline?: string;
  /** Footer columns with links */
  columns?: FooterColumn[];
  /** Copyright text */
  copyright?: string;
  /** Social links */
  socialLinks?: {
    icon: React.ReactNode;
    href: string;
    label: string;
  }[];
  /** Bottom links (e.g., Privacy, Terms) */
  bottomLinks?: FooterLink[];
  /** Additional className */
  className?: string;
}

const MarketingFooter = React.forwardRef<HTMLElement, MarketingFooterProps>(
  (
    {
      logo,
      name,
      tagline,
      columns = [],
      copyright,
      socialLinks = [],
      bottomLinks = [],
      className,
    },
    ref
  ) => {
    const currentYear = new Date().getFullYear();
    const defaultCopyright = `© ${currentYear} ${name || "Company"}. All rights reserved.`;

    return (
      <footer
        ref={ref}
        className={cn("border-t bg-muted/30 py-12 px-4", className)}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                {logo}
                {name && <span className="font-semibold">{name}</span>}
              </div>
              {tagline && (
                <p className="text-sm text-muted-foreground mb-4">{tagline}</p>
              )}
              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link columns */}
            {columns.map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold text-sm mb-3">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {copyright || defaultCopyright}
            </p>
            {bottomLinks.length > 0 && (
              <div className="flex gap-6">
                {bottomLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }
);
MarketingFooter.displayName = "MarketingFooter";

export { MarketingFooter };
