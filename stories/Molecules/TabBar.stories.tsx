import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Home, Settings, Users, Bell } from "lucide-react";
import { TabBar } from "../../src";

const meta: Meta<typeof TabBar> = {
  title: "Molecules/TabBar",
  component: TabBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("summary");
    return (
      <TabBar
        tabs={[
          { id: "summary", label: "Summary" },
          { id: "details", label: "Details" },
          { id: "history", label: "History" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />
    );
  },
};

export const Pills: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("all");
    return (
      <TabBar
        tabs={[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "archived", label: "Archived" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
      />
    );
  },
};

export const Enclosed: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab1");
    return (
      <TabBar
        tabs={[
          { id: "tab1", label: "Tab 1" },
          { id: "tab2", label: "Tab 2" },
          { id: "tab3", label: "Tab 3" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="enclosed"
      />
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");
    return (
      <TabBar
        tabs={[
          { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
          { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
          { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />
    );
  },
};

export const WithBadges: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("inbox");
    return (
      <TabBar
        tabs={[
          { id: "inbox", label: "Inbox", badge: 12 },
          { id: "sent", label: "Sent" },
          { id: "notifications", label: "Notifications", badge: 3, icon: <Bell className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />
    );
  },
};

export const WithDisabled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab1");
    return (
      <TabBar
        tabs={[
          { id: "tab1", label: "Active Tab" },
          { id: "tab2", label: "Disabled Tab", disabled: true },
          { id: "tab3", label: "Another Tab" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />
    );
  },
};

export const Small: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab1");
    return (
      <TabBar
        tabs={[
          { id: "tab1", label: "Tab 1" },
          { id: "tab2", label: "Tab 2" },
          { id: "tab3", label: "Tab 3" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        size="sm"
      />
    );
  },
};
