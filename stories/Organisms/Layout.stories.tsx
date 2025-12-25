import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Home,
  Database,
  Table,
  FolderOpen,
  FileCode,
  BarChart3,
  PieChart,
  LineChart,
  Workflow,
  GitBranch,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarItem,
  SidebarSeparator,
  SidebarSection,
  SidebarNestedItem,
  SidebarSubItem,
  TopBar,
  TopBarButton,
  MainContent,
  PageHeader,
  PageContent,
  Button,
} from "../../src";

const meta: Meta = {
  title: "Organisms/Layout",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const SidebarExample: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [active, setActive] = React.useState("dashboard");

    return (
      <div className="h-[500px] relative bg-background">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<span className="font-semibold">My App</span>}
        >
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            active={active === "dashboard"}
            collapsed={collapsed}
            onClick={() => setActive("dashboard")}
            href="#"
          >
            Dashboard
          </SidebarItem>
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            active={active === "users"}
            collapsed={collapsed}
            onClick={() => setActive("users")}
            href="#"
          >
            Users
          </SidebarItem>
          <SidebarItem
            icon={<FileText className="h-5 w-5" />}
            active={active === "documents"}
            collapsed={collapsed}
            onClick={() => setActive("documents")}
            href="#"
          >
            Documents
          </SidebarItem>
          <SidebarSeparator />
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            active={active === "settings"}
            collapsed={collapsed}
            onClick={() => setActive("settings")}
            href="#"
          >
            Settings
          </SidebarItem>
        </Sidebar>
        <MainContent sidebarCollapsed={collapsed}>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Content Area</h1>
            <p className="text-muted-foreground mt-2">
              Toggle the sidebar using the chevron button.
            </p>
          </div>
        </MainContent>
      </div>
    );
  },
};

export const TopBarExample: Story = {
  render: () => (
    <TopBar
      left={<span className="font-semibold">Application Name</span>}
      right={
        <>
          <TopBarButton icon={<Home className="w-5 h-5" />} title="Home" />
          <TopBarButton icon={<Settings className="w-5 h-5" />} title="Settings" />
          <TopBarButton icon={<Users className="w-5 h-5" />} title="Profile" />
        </>
      }
    />
  ),
};

export const PageHeaderExample: Story = {
  render: () => (
    <div className="border">
      <PageHeader
        title="Dashboard"
        description="Welcome to your dashboard overview."
        actions={
          <>
            <Button variant="outline">Export</Button>
            <Button>Create New</Button>
          </>
        }
      />
      <PageContent>
        <p>Page content goes here...</p>
      </PageContent>
    </div>
  ),
};

export const FullLayout: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
      <div className="h-[600px] relative bg-background">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<span className="font-semibold">E6Data</span>}
        >
          <SidebarSection title="Main" collapsed={collapsed}>
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              active
              collapsed={collapsed}
              href="#"
            >
              Dashboard
            </SidebarItem>
            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              collapsed={collapsed}
              href="#"
            >
              Users
            </SidebarItem>
          </SidebarSection>
          <SidebarSeparator />
          <SidebarSection title="Settings" collapsed={collapsed}>
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              collapsed={collapsed}
              href="#"
            >
              Settings
            </SidebarItem>
          </SidebarSection>
        </Sidebar>
        <MainContent sidebarCollapsed={collapsed}>
          <TopBar
            right={
              <>
                <TopBarButton icon={<Settings className="w-5 h-5" />} />
                <TopBarButton icon={<Users className="w-5 h-5" />} />
              </>
            }
          />
          <PageHeader
            title="Dashboard"
            description="Overview of your application"
            actions={<Button>Create New</Button>}
          />
          <PageContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border bg-card p-6 shadow-sm"
                >
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Metric {i}
                  </h3>
                  <p className="text-2xl font-bold mt-2">{i * 1234}</p>
                </div>
              ))}
            </div>
          </PageContent>
        </MainContent>
      </div>
    );
  },
};

export const NestedSidebarExample: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState("dashboard");

    return (
      <div className="h-[600px] relative bg-background">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<span className="font-semibold">E6Data</span>}
        >
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            active={activeItem === "dashboard"}
            collapsed={collapsed}
            onClick={() => setActiveItem("dashboard")}
            href="#"
          >
            Dashboard
          </SidebarItem>

          <SidebarNestedItem
            label="Data Sources"
            icon={<Database className="h-5 w-5" />}
            collapsed={collapsed}
            defaultExpanded
          >
            <SidebarSubItem
              active={activeItem === "tables"}
              onClick={() => setActiveItem("tables")}
              icon={<Table className="h-4 w-4" />}
              href="#"
            >
              Tables
            </SidebarSubItem>
            <SidebarSubItem
              active={activeItem === "files"}
              onClick={() => setActiveItem("files")}
              icon={<FolderOpen className="h-4 w-4" />}
              href="#"
            >
              Files
            </SidebarSubItem>
            <SidebarSubItem
              active={activeItem === "queries"}
              onClick={() => setActiveItem("queries")}
              icon={<FileCode className="h-4 w-4" />}
              href="#"
            >
              Saved Queries
            </SidebarSubItem>
          </SidebarNestedItem>

          <SidebarNestedItem
            label="Analytics"
            icon={<BarChart3 className="h-5 w-5" />}
            collapsed={collapsed}
          >
            <SidebarSubItem
              active={activeItem === "charts"}
              onClick={() => setActiveItem("charts")}
              icon={<LineChart className="h-4 w-4" />}
              href="#"
            >
              Charts
            </SidebarSubItem>
            <SidebarSubItem
              active={activeItem === "reports"}
              onClick={() => setActiveItem("reports")}
              icon={<PieChart className="h-4 w-4" />}
              href="#"
            >
              Reports
            </SidebarSubItem>
          </SidebarNestedItem>

          <SidebarNestedItem
            label="Pipelines"
            icon={<Workflow className="h-5 w-5" />}
            collapsed={collapsed}
          >
            <SidebarSubItem
              active={activeItem === "jobs"}
              onClick={() => setActiveItem("jobs")}
              icon={<GitBranch className="h-4 w-4" />}
              href="#"
            >
              Jobs
            </SidebarSubItem>
            <SidebarSubItem
              active={activeItem === "schedules"}
              onClick={() => setActiveItem("schedules")}
              href="#"
            >
              Schedules
            </SidebarSubItem>
          </SidebarNestedItem>

          <SidebarSeparator />

          <SidebarItem
            icon={<Bell className="h-5 w-5" />}
            collapsed={collapsed}
            href="#"
          >
            Notifications
          </SidebarItem>

          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            active={activeItem === "settings"}
            collapsed={collapsed}
            onClick={() => setActiveItem("settings")}
            href="#"
          >
            Settings
          </SidebarItem>
        </Sidebar>
        <MainContent sidebarCollapsed={collapsed}>
          <PageHeader
            title={activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            description={`You are viewing the ${activeItem} page`}
          />
          <PageContent>
            <p className="text-muted-foreground">
              Click on sidebar items to navigate. Nested items can be expanded/collapsed.
            </p>
          </PageContent>
        </MainContent>
      </div>
    );
  },
};

export const DeeplyNestedSidebar: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
      <div className="h-[500px] relative bg-background">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<span className="font-semibold">Catalog</span>}
        >
          <SidebarNestedItem
            label="Production"
            icon={<Database className="h-5 w-5" />}
            collapsed={collapsed}
            defaultExpanded
          >
            <SidebarSubItem href="#">public.users</SidebarSubItem>
            <SidebarSubItem href="#" active>public.orders</SidebarSubItem>
            <SidebarSubItem href="#">public.products</SidebarSubItem>
            <SidebarSubItem href="#">analytics.events</SidebarSubItem>
            <SidebarSubItem href="#">analytics.sessions</SidebarSubItem>
          </SidebarNestedItem>

          <SidebarNestedItem
            label="Staging"
            icon={<Database className="h-5 w-5" />}
            collapsed={collapsed}
          >
            <SidebarSubItem href="#">staging.users</SidebarSubItem>
            <SidebarSubItem href="#">staging.orders</SidebarSubItem>
          </SidebarNestedItem>

          <SidebarNestedItem
            label="Development"
            icon={<Database className="h-5 w-5" />}
            collapsed={collapsed}
          >
            <SidebarSubItem href="#">dev.test_table</SidebarSubItem>
            <SidebarSubItem href="#">dev.experiments</SidebarSubItem>
          </SidebarNestedItem>
        </Sidebar>
      </div>
    );
  },
};
