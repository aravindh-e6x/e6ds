import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  FileText,
  Database,
  Search,
  Home,
  LayoutDashboard,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandPalette,
  useCommandPalette,
  Button,
} from "../../src";

const meta: Meta<typeof CommandPalette> = {
  title: "Organisms/CommandPalette",
  component: CommandPalette,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette open={open} onOpenChange={setOpen}>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandPalette>
      </>
    );
  },
};

export const WithKeyboardShortcut: Story = {
  render: () => {
    const { open, setOpen } = useCommandPalette();

    return (
      <>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 text-xs border bg-muted">⌘K</kbd> to
            open the command palette
          </p>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Or click here
          </Button>
        </div>
        <CommandPalette open={open} onOpenChange={setOpen}>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Documents</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Search</span>
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandPalette>
      </>
    );
  },
};

export const DataPlatformExample: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    const tables = [
      { name: "users", schema: "public" },
      { name: "orders", schema: "public" },
      { name: "products", schema: "public" },
      { name: "analytics_events", schema: "analytics" },
      { name: "user_sessions", schema: "analytics" },
    ];

    const queries = [
      { name: "Daily Active Users", id: "q1" },
      { name: "Revenue by Region", id: "q2" },
      { name: "Top Products", id: "q3" },
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Search className="mr-2 h-4 w-4" />
          Search...
          <span className="ml-8 text-xs text-muted-foreground">⌘K</span>
        </Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          placeholder="Search tables, queries, or type a command..."
        >
          <CommandGroup heading="Tables">
            {tables.map((table) => (
              <CommandItem key={table.name}>
                <Database className="mr-2 h-4 w-4" />
                <span>
                  {table.schema}.{table.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Saved Queries">
            {queries.map((query) => (
              <CommandItem key={query.id}>
                <FileText className="mr-2 h-4 w-4" />
                <span>{query.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem>
              <span className="mr-2">+</span>
              <span>New Query</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team Settings</span>
            </CommandItem>
            <CommandItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Documentation</span>
            </CommandItem>
          </CommandGroup>
        </CommandPalette>
      </>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [action, setAction] = React.useState<string | null>(null);

    const handleSelect = (actionName: string) => {
      setAction(actionName);
      setOpen(false);
    };

    return (
      <>
        <div className="space-y-4 text-center">
          <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
          {action && (
            <p className="text-sm text-muted-foreground">
              Last action: <strong>{action}</strong>
            </p>
          )}
        </div>
        <CommandPalette open={open} onOpenChange={setOpen}>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleSelect("Create new document")}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Create new document</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Open settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Open settings</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("View profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>View profile</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem onSelect={() => handleSelect("Sign out")}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </CommandItem>
          </CommandGroup>
        </CommandPalette>
      </>
    );
  },
};

export const StandaloneCommand: Story = {
  render: () => (
    <Command className="border shadow-md w-[400px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
