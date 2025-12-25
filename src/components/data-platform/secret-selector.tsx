"use client";

import * as React from "react";
import {
  Key,
  Lock,
  Search,
  ChevronDown,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export interface Secret {
  id: string;
  name: string;
  scope: string;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
  description?: string;
  version?: number;
}

export interface SecretScope {
  id: string;
  name: string;
  description?: string;
  secrets: Secret[];
}

export interface SecretSelectorProps {
  /** Available secret scopes */
  scopes: SecretScope[];
  /** Selected secret reference */
  selectedSecret?: { scope: string; name: string };
  /** Callback when secret is selected */
  onSelectSecret?: (scope: string, name: string) => void;
  /** Callback when new secret is requested */
  onCreateSecret?: (scope: string) => void;
  /** Callback when secret is previewed */
  onPreviewSecret?: (scope: string, name: string) => string | undefined;
  /** Whether selector is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Display mode */
  mode?: "dropdown" | "inline";
  /** Additional className */
  className?: string;
}

const SecretSelector = React.forwardRef<HTMLDivElement, SecretSelectorProps>(
  (
    {
      scopes,
      selectedSecret,
      onSelectSecret,
      onCreateSecret,
      onPreviewSecret,
      disabled = false,
      placeholder = "Select a secret...",
      mode = "dropdown",
      className,
    },
    ref
  ) => {
    const [search, setSearch] = React.useState("");
    const [expandedScopes, setExpandedScopes] = React.useState<string[]>([]);
    const [previewingSecret, setPreviewingSecret] = React.useState<{
      scope: string;
      name: string;
    } | null>(null);
    const [previewValue, setPreviewValue] = React.useState<string | undefined>();
    const [copied, setCopied] = React.useState(false);

    const toggleScope = (scopeId: string) => {
      setExpandedScopes((prev) =>
        prev.includes(scopeId)
          ? prev.filter((id) => id !== scopeId)
          : [...prev, scopeId]
      );
    };

    const handlePreview = (scope: string, name: string) => {
      if (previewingSecret?.scope === scope && previewingSecret?.name === name) {
        setPreviewingSecret(null);
        setPreviewValue(undefined);
      } else {
        setPreviewingSecret({ scope, name });
        const value = onPreviewSecret?.(scope, name);
        setPreviewValue(value);
      }
    };

    const handleCopy = (value: string) => {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const filteredScopes = scopes
      .map((scope) => ({
        ...scope,
        secrets: scope.secrets.filter(
          (secret) =>
            secret.name.toLowerCase().includes(search.toLowerCase()) ||
            secret.description?.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((scope) => scope.secrets.length > 0 || search === "");

    const selectedSecretData = selectedSecret
      ? scopes
          .find((s) => s.id === selectedSecret.scope)
          ?.secrets.find((sec) => sec.name === selectedSecret.name)
      : null;

    if (mode === "inline") {
      return (
        <div ref={ref} className={cn("space-y-3", className)}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search secrets..."
              disabled={disabled}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Scopes and secrets */}
          <div className="border rounded-md divide-y max-h-64 overflow-auto">
            {filteredScopes.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No secrets found
              </div>
            ) : (
              filteredScopes.map((scope) => (
                <div key={scope.id}>
                  {/* Scope header */}
                  <button
                    onClick={() => toggleScope(scope.id)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/50 text-sm font-medium"
                    disabled={disabled}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      {scope.name}
                      <span className="text-xs text-muted-foreground">
                        ({scope.secrets.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedScopes.includes(scope.id) && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Secrets list */}
                  {expandedScopes.includes(scope.id) && (
                    <div className="bg-muted/30">
                      {scope.secrets.map((secret) => {
                        const isSelected =
                          selectedSecret?.scope === scope.id &&
                          selectedSecret?.name === secret.name;
                        const isExpired =
                          secret.expiresAt && secret.expiresAt < new Date();
                        const isExpiringSoon =
                          secret.expiresAt &&
                          secret.expiresAt <
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                        return (
                          <div
                            key={secret.id}
                            className={cn(
                              "px-3 py-2 ml-4 flex items-center gap-2 border-l-2 hover:bg-muted/50 cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-transparent"
                            )}
                            onClick={() =>
                              !disabled &&
                              onSelectSecret?.(scope.id, secret.name)
                            }
                          >
                            <Key className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm truncate">
                                  {secret.name}
                                </span>
                                {isExpired && (
                                  <span className="text-xs text-destructive flex items-center gap-0.5">
                                    <AlertTriangle className="h-3 w-3" />
                                    Expired
                                  </span>
                                )}
                                {!isExpired && isExpiringSoon && (
                                  <span className="text-xs text-yellow-600 flex items-center gap-0.5">
                                    <Clock className="h-3 w-3" />
                                    Expires soon
                                  </span>
                                )}
                              </div>
                              {secret.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {secret.description}
                                </div>
                              )}
                            </div>
                            {onPreviewSecret && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreview(scope.id, secret.name);
                                }}
                              >
                                {previewingSecret?.scope === scope.id &&
                                previewingSecret?.name === secret.name ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            )}
                          </div>
                        );
                      })}

                      {/* Add secret button */}
                      {onCreateSecret && (
                        <button
                          onClick={() => onCreateSecret(scope.id)}
                          className="w-full px-3 py-2 ml-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent"
                          disabled={disabled}
                        >
                          <Plus className="h-4 w-4" />
                          Add secret to {scope.name}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Preview */}
          {previewingSecret && previewValue && (
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                  {previewingSecret.scope}/{previewingSecret.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => handleCopy(previewValue)}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <div className="font-mono text-sm bg-background px-2 py-1 rounded border">
                {previewValue}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Dropdown mode
    return (
      <div ref={ref} className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={disabled}
            >
              {selectedSecretData ? (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>{selectedSecretData.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({selectedSecret?.scope})
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            {/* Search */}
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search secrets..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <DropdownMenuSeparator />

            {/* Scopes and secrets */}
            <div className="max-h-64 overflow-auto">
              {filteredScopes.map((scope) => (
                <div key={scope.id}>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {scope.name}
                  </div>
                  {scope.secrets.map((secret) => (
                    <DropdownMenuItem
                      key={secret.id}
                      onClick={() => onSelectSecret?.(scope.id, secret.name)}
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      <div className="flex-1">
                        <div>{secret.name}</div>
                        {secret.description && (
                          <div className="text-xs text-muted-foreground">
                            {secret.description}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </div>

            {/* Create new */}
            {onCreateSecret && scopes.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCreateSecret(scopes[0].id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create new secret
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);
SecretSelector.displayName = "SecretSelector";

export { SecretSelector };
