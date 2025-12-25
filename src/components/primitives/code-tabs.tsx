import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export interface CodeTab {
  label: string;
  language?: string;
  code: string;
}

export interface CodeTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: CodeTab[];
  defaultTab?: string;
}

const CodeTabs = React.forwardRef<HTMLDivElement, CodeTabsProps>(
  ({ tabs, defaultTab, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.label || "");

    const activeCode = tabs.find((tab) => tab.label === activeTab)?.code || "";

    const handleCopy = async () => {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div ref={ref} className={cn("border border-border rounded-none overflow-hidden", className)} {...props}>
        <TabsPrimitive.Root
          value={activeTab}
          onValueChange={setActiveTab}
        >
        <div className="flex items-center justify-between bg-muted border-b border-border">
          <TabsPrimitive.List className="flex">
            {tabs.map((tab) => (
              <TabsPrimitive.Trigger
                key={tab.label}
                value={tab.label}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-r border-border",
                  "data-[state=active]:bg-background data-[state=inactive]:text-muted-foreground",
                  "hover:text-foreground transition-colors"
                )}
              >
                {tab.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 mr-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
        {tabs.map((tab) => (
          <TabsPrimitive.Content
            key={tab.label}
            value={tab.label}
            className="p-4 bg-background"
          >
            <pre className="text-sm font-mono overflow-x-auto">
              <code>{tab.code}</code>
            </pre>
          </TabsPrimitive.Content>
        ))}
        </TabsPrimitive.Root>
      </div>
    );
  }
);
CodeTabs.displayName = "CodeTabs";

export { CodeTabs };
