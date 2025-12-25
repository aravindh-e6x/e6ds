import * as React from "react";
import { cn } from "../../lib/utils";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface TableOfContentsProps extends React.HTMLAttributes<HTMLElement> {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

const TableOfContents = React.forwardRef<HTMLElement, TableOfContentsProps>(
  ({ items, activeId, onItemClick, className, ...props }, ref) => {
    const [active, setActive] = React.useState(activeId || items[0]?.id);

    React.useEffect(() => {
      if (activeId) {
        setActive(activeId);
      }
    }, [activeId]);

    // Optional: Auto-detect active section based on scroll
    React.useEffect(() => {
      if (activeId !== undefined) return; // Skip if controlled

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        { rootMargin: "-100px 0px -80% 0px" }
      );

      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }, [items, activeId]);

    const handleClick = (id: string) => {
      setActive(id);
      onItemClick?.(id);
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <nav
        ref={ref}
        className={cn("space-y-1", className)}
        aria-label="Table of contents"
        {...props}
      >
        <p className="text-sm font-semibold mb-3 text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={cn(
                  "block w-full text-left text-sm py-1 transition-colors",
                  "hover:text-foreground",
                  item.level === 2 && "pl-0",
                  item.level === 3 && "pl-4",
                  item.level === 4 && "pl-8",
                  active === item.id
                    ? "text-brand-primary font-medium border-l-2 border-brand-primary pl-2"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
);
TableOfContents.displayName = "TableOfContents";

export { TableOfContents };
