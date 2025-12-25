import * as React from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export type FeatureValue = boolean | "partial" | string;

export interface ComparisonFeature {
  name: string;
  values: Record<string, FeatureValue>;
}

export interface ComparisonTableProps extends React.HTMLAttributes<HTMLTableElement> {
  products: string[];
  features: ComparisonFeature[];
  recommendedProduct?: string;
}

const FeatureCell: React.FC<{ value: FeatureValue }> = ({ value }) => {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-red-500 mx-auto" />;
  }
  if (value === "partial") {
    return <Minus className="w-5 h-5 text-yellow-500 mx-auto" />;
  }
  return <span className="text-sm">{value}</span>;
};

const ComparisonTable = React.forwardRef<HTMLTableElement, ComparisonTableProps>(
  ({ products, features, recommendedProduct, className, ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={cn("w-full border-collapse", className)}
          {...props}
        >
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-muted-foreground">
                Feature
              </th>
              {products.map((product) => (
                <th
                  key={product}
                  className={cn(
                    "p-4 text-center font-semibold",
                    recommendedProduct === product && "bg-brand-primary/10"
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    {recommendedProduct === product && (
                      <span className="text-xs font-normal text-brand-primary">
                        Recommended
                      </span>
                    )}
                    {product}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={feature.name}
                className={cn(
                  "border-b border-border",
                  index % 2 === 0 && "bg-muted/30"
                )}
              >
                <td className="p-4 font-medium">{feature.name}</td>
                {products.map((product) => (
                  <td
                    key={`${feature.name}-${product}`}
                    className={cn(
                      "p-4 text-center",
                      recommendedProduct === product && "bg-brand-primary/5"
                    )}
                  >
                    <FeatureCell value={feature.values[product]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
ComparisonTable.displayName = "ComparisonTable";

export { ComparisonTable };
