"use client";

import * as React from "react";
import Editor, { OnMount, OnChange, BeforeMount } from "@monaco-editor/react";
import type { editor, languages, IDisposable } from "monaco-editor";
import { cn } from "../../lib/utils";
import { Play, Copy, Check, Maximize2, Minimize2, RotateCcw } from "lucide-react";

// SQL Keywords for autocomplete
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN",
  "IS", "NULL", "AS", "JOIN", "INNER", "LEFT", "RIGHT", "OUTER", "FULL",
  "CROSS", "ON", "GROUP", "BY", "HAVING", "ORDER", "ASC", "DESC", "LIMIT",
  "OFFSET", "UNION", "ALL", "INTERSECT", "EXCEPT", "INSERT", "INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DATABASE", "INDEX", "VIEW",
  "DROP", "ALTER", "ADD", "COLUMN", "PRIMARY", "KEY", "FOREIGN", "REFERENCES",
  "CONSTRAINT", "UNIQUE", "CHECK", "DEFAULT", "AUTO_INCREMENT", "IF", "EXISTS",
  "CASE", "WHEN", "THEN", "ELSE", "END", "CAST", "CONVERT", "COALESCE",
  "NULLIF", "DISTINCT", "TOP", "FETCH", "FIRST", "NEXT", "ROWS", "ONLY",
  "WITH", "RECURSIVE", "OVER", "PARTITION", "ROW_NUMBER", "RANK", "DENSE_RANK",
  "NTILE", "LAG", "LEAD", "FIRST_VALUE", "LAST_VALUE", "COUNT", "SUM", "AVG",
  "MIN", "MAX", "TRUNCATE", "EXPLAIN", "ANALYZE", "TEMPORARY", "TEMP"
];

// SQL Functions for autocomplete
const SQL_FUNCTIONS = [
  "COUNT", "SUM", "AVG", "MIN", "MAX", "ROUND", "FLOOR", "CEIL", "ABS",
  "CONCAT", "SUBSTRING", "LENGTH", "UPPER", "LOWER", "TRIM", "LTRIM", "RTRIM",
  "REPLACE", "REVERSE", "LEFT", "RIGHT", "LPAD", "RPAD", "SPLIT_PART",
  "NOW", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "DATE", "TIME",
  "YEAR", "MONTH", "DAY", "HOUR", "MINUTE", "SECOND", "EXTRACT", "DATE_ADD",
  "DATE_SUB", "DATEDIFF", "DATE_TRUNC", "TO_DATE", "TO_CHAR", "TO_NUMBER",
  "COALESCE", "NULLIF", "NVL", "IFNULL", "IIF", "CASE", "CAST", "CONVERT",
  "ROW_NUMBER", "RANK", "DENSE_RANK", "NTILE", "LAG", "LEAD", "FIRST_VALUE",
  "LAST_VALUE", "LISTAGG", "STRING_AGG", "ARRAY_AGG", "JSON_EXTRACT",
  "JSON_OBJECT", "JSON_ARRAY", "REGEXP_LIKE", "REGEXP_REPLACE", "REGEXP_SUBSTR"
];

// SQL Data Types
const SQL_TYPES = [
  "INT", "INTEGER", "BIGINT", "SMALLINT", "TINYINT", "DECIMAL", "NUMERIC",
  "FLOAT", "REAL", "DOUBLE", "BOOLEAN", "BOOL", "CHAR", "VARCHAR", "TEXT",
  "NCHAR", "NVARCHAR", "NTEXT", "DATE", "TIME", "DATETIME", "TIMESTAMP",
  "TIMESTAMPTZ", "INTERVAL", "BINARY", "VARBINARY", "BLOB", "CLOB", "JSON",
  "JSONB", "XML", "UUID", "ARRAY", "MAP", "STRUCT", "ROW"
];

export interface SQLEditorTheme {
  base: "vs" | "vs-dark" | "hc-black";
  colors?: Record<string, string>;
  rules?: editor.ITokenThemeRule[];
}

export interface TableSchema {
  name: string;
  columns: {
    name: string;
    type: string;
    description?: string;
  }[];
}

export interface SQLEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  onExecute?: (query: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  wordWrap?: "on" | "off" | "wordWrapColumn" | "bounded";
  fontSize?: number;
  tabSize?: number;
  theme?: "light" | "dark" | "e6data-dark" | "e6data-light";
  schemas?: TableSchema[];
  className?: string;
  showToolbar?: boolean;
  showRunButton?: boolean;
  showCopyButton?: boolean;
  showFullscreenButton?: boolean;
  showResetButton?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

// Custom e6data themes
const e6dataThemes: Record<string, SQLEditorTheme> = {
  "e6data-dark": {
    base: "vs-dark",
    colors: {
      "editor.background": "#0a0a0a",
      "editor.foreground": "#d4d4d4",
      "editor.lineHighlightBackground": "#1a1a1a",
      "editor.selectionBackground": "#264f78",
      "editorCursor.foreground": "#ffffff",
      "editorLineNumber.foreground": "#6b7280",
      "editorLineNumber.activeForeground": "#d4d4d4",
      "editor.selectionHighlightBackground": "#264f7850",
      "editorBracketMatch.background": "#0d6efd30",
      "editorBracketMatch.border": "#0d6efd",
    },
    rules: [
      { token: "keyword", foreground: "#569cd6", fontStyle: "bold" },
      { token: "keyword.sql", foreground: "#569cd6", fontStyle: "bold" },
      { token: "operator.sql", foreground: "#d4d4d4" },
      { token: "string", foreground: "#ce9178" },
      { token: "string.sql", foreground: "#ce9178" },
      { token: "number", foreground: "#b5cea8" },
      { token: "number.sql", foreground: "#b5cea8" },
      { token: "comment", foreground: "#6a9955", fontStyle: "italic" },
      { token: "comment.sql", foreground: "#6a9955", fontStyle: "italic" },
      { token: "predefined.sql", foreground: "#dcdcaa" },
      { token: "identifier", foreground: "#9cdcfe" },
      { token: "type", foreground: "#4ec9b0" },
    ],
  },
  "e6data-light": {
    base: "vs",
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#1f2937",
      "editor.lineHighlightBackground": "#f3f4f6",
      "editor.selectionBackground": "#add6ff",
      "editorCursor.foreground": "#000000",
      "editorLineNumber.foreground": "#9ca3af",
      "editorLineNumber.activeForeground": "#1f2937",
      "editor.selectionHighlightBackground": "#add6ff50",
      "editorBracketMatch.background": "#0d6efd30",
      "editorBracketMatch.border": "#0d6efd",
    },
    rules: [
      { token: "keyword", foreground: "#0000ff", fontStyle: "bold" },
      { token: "keyword.sql", foreground: "#0000ff", fontStyle: "bold" },
      { token: "operator.sql", foreground: "#1f2937" },
      { token: "string", foreground: "#a31515" },
      { token: "string.sql", foreground: "#a31515" },
      { token: "number", foreground: "#098658" },
      { token: "number.sql", foreground: "#098658" },
      { token: "comment", foreground: "#008000", fontStyle: "italic" },
      { token: "comment.sql", foreground: "#008000", fontStyle: "italic" },
      { token: "predefined.sql", foreground: "#795e26" },
      { token: "identifier", foreground: "#001080" },
      { token: "type", foreground: "#267f99" },
    ],
  },
};

const SQLEditor = React.forwardRef<HTMLDivElement, SQLEditorProps>(
  (
    {
      value,
      defaultValue = "",
      onChange,
      onExecute,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      placeholder: _placeholder = "-- Write your SQL query here\nSELECT * FROM table_name",
      readOnly = false,
      height = 300,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      minHeight: _minHeight,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maxHeight: _maxHeight,
      showLineNumbers = true,
      showMinimap = false,
      wordWrap = "on",
      fontSize = 14,
      tabSize = 2,
      theme = "e6data-dark",
      schemas = [],
      className,
      showToolbar = true,
      showRunButton = true,
      showCopyButton = true,
      showFullscreenButton = true,
      showResetButton = false,
      loading = false,
      disabled = false,
    },
    ref
  ) => {
    const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = React.useRef<typeof import("monaco-editor") | null>(null);
    const completionProviderRef = React.useRef<IDisposable | null>(null);

    const [copied, setCopied] = React.useState(false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const currentValue = value !== undefined ? value : internalValue;

    const handleBeforeMount: BeforeMount = (monaco) => {
      monacoRef.current = monaco;

      // Register custom themes
      Object.entries(e6dataThemes).forEach(([name, themeData]) => {
        monaco.editor.defineTheme(name, {
          base: themeData.base,
          inherit: true,
          rules: themeData.rules || [],
          colors: themeData.colors || {},
        });
      });
    };

    const handleEditorMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Configure SQL language features
      configureSQLLanguage(monaco);

      // Register completion provider with schema awareness
      registerCompletionProvider(monaco, schemas);

      // Add keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        if (onExecute && !disabled && !loading) {
          const selection = editor.getSelection();
          const selectedText = selection ? editor.getModel()?.getValueInRange(selection) : "";
          onExecute(selectedText || editor.getValue());
        }
      });

      // Format on Shift+Alt+F
      editor.addCommand(
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
        () => {
          editor.getAction("editor.action.formatDocument")?.run();
        }
      );

      // Focus the editor
      if (!readOnly && !disabled) {
        editor.focus();
      }
    };

    const configureSQLLanguage = (monaco: typeof import("monaco-editor")) => {
      // SQL language configuration for better bracket matching
      monaco.languages.setLanguageConfiguration("sql", {
        comments: {
          lineComment: "--",
          blockComment: ["/*", "*/"],
        },
        brackets: [
          ["(", ")"],
          ["[", "]"],
        ],
        autoClosingPairs: [
          { open: "(", close: ")" },
          { open: "[", close: "]" },
          { open: "'", close: "'", notIn: ["string"] },
          { open: '"', close: '"', notIn: ["string"] },
        ],
        surroundingPairs: [
          { open: "(", close: ")" },
          { open: "[", close: "]" },
          { open: "'", close: "'" },
          { open: '"', close: '"' },
        ],
      });
    };

    const registerCompletionProvider = (
      monaco: typeof import("monaco-editor"),
      tableSchemas: TableSchema[]
    ) => {
      // Dispose previous provider if exists
      if (completionProviderRef.current) {
        completionProviderRef.current.dispose();
      }

      completionProviderRef.current = monaco.languages.registerCompletionItemProvider("sql", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions: languages.CompletionItem[] = [];

          // Add SQL keywords
          SQL_KEYWORDS.forEach((keyword) => {
            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              range,
              detail: "SQL Keyword",
            });
          });

          // Add SQL functions
          SQL_FUNCTIONS.forEach((func) => {
            suggestions.push({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `${func}($0)`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
              detail: "SQL Function",
            });
          });

          // Add SQL types
          SQL_TYPES.forEach((type) => {
            suggestions.push({
              label: type,
              kind: monaco.languages.CompletionItemKind.TypeParameter,
              insertText: type,
              range,
              detail: "Data Type",
            });
          });

          // Add table names from schema
          tableSchemas.forEach((table) => {
            suggestions.push({
              label: table.name,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: table.name,
              range,
              detail: "Table",
              documentation: `Columns: ${table.columns.map((c) => c.name).join(", ")}`,
            });

            // Add column names
            table.columns.forEach((column) => {
              suggestions.push({
                label: `${table.name}.${column.name}`,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: `${table.name}.${column.name}`,
                range,
                detail: `${column.type} - ${table.name}`,
                documentation: column.description,
              });

              // Also add just the column name
              suggestions.push({
                label: column.name,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: column.name,
                range,
                detail: `${column.type} (${table.name})`,
                documentation: column.description,
              });
            });
          });

          // Add common snippets
          const snippets = [
            {
              label: "SELECT * FROM",
              insertText: "SELECT * FROM ${1:table_name}",
              detail: "Select all columns",
            },
            {
              label: "SELECT columns FROM",
              insertText: "SELECT ${1:columns}\nFROM ${2:table_name}\nWHERE ${3:condition}",
              detail: "Select with WHERE",
            },
            {
              label: "JOIN",
              insertText: "${1:LEFT} JOIN ${2:table_name} ON ${3:condition}",
              detail: "Join clause",
            },
            {
              label: "GROUP BY",
              insertText: "GROUP BY ${1:columns}\nHAVING ${2:condition}",
              detail: "Group by with having",
            },
            {
              label: "ORDER BY",
              insertText: "ORDER BY ${1:column} ${2|ASC,DESC|}",
              detail: "Order by clause",
            },
            {
              label: "CTE",
              insertText: "WITH ${1:cte_name} AS (\n  ${2:SELECT * FROM table_name}\n)\nSELECT * FROM ${1:cte_name}",
              detail: "Common Table Expression",
            },
            {
              label: "WINDOW",
              insertText: "${1|ROW_NUMBER,RANK,DENSE_RANK,NTILE|}() OVER (PARTITION BY ${2:column} ORDER BY ${3:column})",
              detail: "Window function",
            },
          ];

          snippets.forEach((snippet) => {
            suggestions.push({
              label: snippet.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: snippet.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
              detail: snippet.detail,
            });
          });

          return { suggestions };
        },
      });
    };

    // Update completion provider when schemas change
    React.useEffect(() => {
      if (monacoRef.current && schemas.length > 0) {
        registerCompletionProvider(monacoRef.current, schemas);
      }
    }, [schemas]);

    // Cleanup
    React.useEffect(() => {
      return () => {
        if (completionProviderRef.current) {
          completionProviderRef.current.dispose();
        }
      };
    }, []);

    const handleChange: OnChange = (newValue) => {
      if (value === undefined) {
        setInternalValue(newValue || "");
      }
      onChange?.(newValue);
    };

    const handleCopy = async () => {
      await navigator.clipboard.writeText(currentValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleRun = () => {
      if (onExecute && !disabled && !loading) {
        const editor = editorRef.current;
        if (editor) {
          const selection = editor.getSelection();
          const selectedText = selection ? editor.getModel()?.getValueInRange(selection) : "";
          onExecute(selectedText || currentValue);
        } else {
          onExecute(currentValue);
        }
      }
    };

    const handleReset = () => {
      if (value === undefined) {
        setInternalValue(defaultValue);
      }
      onChange?.(defaultValue);
    };

    const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
    };

    const getMonacoTheme = () => {
      switch (theme) {
        case "light":
          return "vs";
        case "dark":
          return "vs-dark";
        case "e6data-dark":
        case "e6data-light":
          return theme;
        default:
          return "e6data-dark";
      }
    };

    const editorOptions: editor.IStandaloneEditorConstructionOptions = {
      readOnly: readOnly || disabled,
      minimap: { enabled: showMinimap },
      lineNumbers: showLineNumbers ? "on" : "off",
      wordWrap,
      fontSize,
      tabSize,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 12, bottom: 12 },
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      snippetSuggestions: "top",
      wordBasedSuggestions: "currentDocument",
      parameterHints: { enabled: true },
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
      folding: true,
      foldingStrategy: "indentation",
      showFoldingControls: "mouseover",
      matchBrackets: "always",
      renderLineHighlight: "line",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      contextmenu: true,
      copyWithSyntaxHighlighting: true,
    };

    const containerClasses = cn(
      "border border-border rounded-none overflow-hidden bg-background",
      isFullscreen && "fixed inset-0 z-50",
      disabled && "opacity-50 cursor-not-allowed",
      className
    );

    const editorHeight = isFullscreen
      ? "calc(100vh - 48px)"
      : typeof height === "number"
        ? `${height}px`
        : height;

    return (
      <div ref={ref} className={containerClasses}>
        {showToolbar && (
          <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                SQL Editor
              </span>
              {loading && (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Running...
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {showResetButton && (
                <button
                  onClick={handleReset}
                  disabled={disabled || loading}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors disabled:opacity-50"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              {showCopyButton && (
                <button
                  onClick={handleCopy}
                  disabled={disabled}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors disabled:opacity-50"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
              {showFullscreenButton && (
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              )}
              {showRunButton && onExecute && (
                <button
                  onClick={handleRun}
                  disabled={disabled || loading || !currentValue.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded transition-colors",
                    "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title="Run Query (Ctrl+Enter)"
                >
                  <Play className="w-3.5 h-3.5" />
                  Run
                </button>
              )}
            </div>
          </div>
        )}
        <Editor
          height={editorHeight}
          defaultLanguage="sql"
          value={currentValue}
          onChange={handleChange}
          beforeMount={handleBeforeMount}
          onMount={handleEditorMount}
          theme={getMonacoTheme()}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full bg-background">
              <span className="text-sm text-muted-foreground">Loading editor...</span>
            </div>
          }
        />
      </div>
    );
  }
);
SQLEditor.displayName = "SQLEditor";

export { SQLEditor };
