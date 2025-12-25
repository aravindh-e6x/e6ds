import * as React from "react";
import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export type CalloutVariant = "info" | "warning" | "error" | "success";

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CalloutVariant, { container: string; icon: string }> = {
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
    icon: "text-blue-500 dark:text-blue-400",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
    icon: "text-yellow-500 dark:text-yellow-400",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
    icon: "text-red-500 dark:text-red-400",
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    icon: "text-green-500 dark:text-green-400",
  },
};

const variantIcons: Record<CalloutVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
};

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = "info", title, children, className, ...props }, ref) => {
    const styles = variantStyles[variant];
    const Icon = variantIcons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 p-4 border rounded-none",
          styles.container,
          className
        )}
        role="alert"
        {...props}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", styles.icon)} />
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    );
  }
);
Callout.displayName = "Callout";

export { Callout };
