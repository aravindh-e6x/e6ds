import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface PageNavItem {
  title: string;
  href: string;
}

export interface PageNavigationProps extends React.HTMLAttributes<HTMLElement> {
  previous?: PageNavItem;
  next?: PageNavItem;
  onNavigate?: (href: string) => void;
}

const PageNavigation = React.forwardRef<HTMLElement, PageNavigationProps>(
  ({ previous, next, onNavigate, className, ...props }, ref) => {
    const handleClick = (href: string, e: React.MouseEvent) => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(href);
      }
    };

    if (!previous && !next) {
      return null;
    }

    return (
      <nav
        ref={ref}
        className={cn("flex items-center justify-between py-6 border-t border-border", className)}
        aria-label="Page navigation"
        {...props}
      >
        {previous ? (
          <a
            href={previous.href}
            onClick={(e) => handleClick(previous.href, e)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="font-medium text-foreground">{previous.title}</span>
            </div>
          </a>
        ) : (
          <div />
        )}
        {next ? (
          <a
            href={next.href}
            onClick={(e) => handleClick(next.href, e)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group text-right"
          >
            <div>
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-medium text-foreground">{next.title}</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        ) : (
          <div />
        )}
      </nav>
    );
  }
);
PageNavigation.displayName = "PageNavigation";

export { PageNavigation };
