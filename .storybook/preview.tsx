import * as React from "react";
import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "../src/styles/globals.css";

// Theme decorator that applies dark class based on background selection
const ThemeDecorator = (Story: React.ComponentType, context: { globals: { backgrounds?: { value?: string } } }) => {
  const backgroundValue = context.globals?.backgrounds?.value;
  const isDark = backgroundValue === "rgb(30 30 30)";

  useEffect(() => {
    // Apply dark class to the document root for proper dark mode
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "rgb(30 30 30)";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "rgb(255 253 250)";
    }
  }, [isDark]);

  return (
    <div className={`${isDark ? "dark" : ""} bg-background text-foreground min-h-screen p-4`}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    docs: {
      source: {
        type: "code",
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "rgb(255 253 250)",
        },
        {
          name: "dark",
          value: "rgb(30 30 30)",
        },
      ],
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundation",
          "Atoms",
          "Molecules",
          "Organisms",
          "Examples",
        ],
      },
    },
  },
  decorators: [ThemeDecorator],
};

export default preview;
