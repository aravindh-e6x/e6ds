import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Wizard, WizardStep, Button, Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../src";
import type { WizardStepStatus } from "../../src";

const meta = {
  title: "Organisms/Wizard",
  component: WizardStep,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WizardStep>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wizard that demonstrates step navigation
const InteractiveWizard = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    projectName: "",
    description: "",
    environment: "",
    apiKey: "",
  });

  const getStatus = (step: number): WizardStepStatus => {
    if (step < currentStep) return "done";
    if (step === currentStep) return "active";
    return "locked";
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl">
      <Wizard>
        <WizardStep
          stepNumber={1}
          title="Project Details"
          description="Name and describe your project"
          status={getStatus(1)}
          onEdit={() => goToStep(1)}
        >
          <div className="space-y-4">
            <div>
              <Label>Project Name</Label>
              <Input
                placeholder="My Awesome Project"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                placeholder="A brief description of your project"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={nextStep}>Continue</Button>
            </div>
          </div>
        </WizardStep>

        <WizardStep
          stepNumber={2}
          title="Environment Setup"
          description="Configure your environment"
          status={getStatus(2)}
          onEdit={() => goToStep(2)}
        >
          <div className="space-y-4">
            <div>
              <Label>Environment</Label>
              <Select
                value={formData.environment}
                onValueChange={(value) => setFormData({ ...formData, environment: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Continue</Button>
            </div>
          </div>
        </WizardStep>

        <WizardStep
          stepNumber={3}
          title="API Configuration"
          description="Set up your API credentials"
          status={getStatus(3)}
          onEdit={() => goToStep(3)}
        >
          <div className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter your API key"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Continue</Button>
            </div>
          </div>
        </WizardStep>

        <WizardStep
          stepNumber={4}
          title="Review & Submit"
          description="Review your configuration"
          status={getStatus(4)}
          onEdit={() => goToStep(4)}
        >
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project Name:</span>
                <span className="font-medium">{formData.projectName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="font-medium">{formData.description || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span className="font-medium">{formData.environment || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Key:</span>
                <span className="font-medium">{formData.apiKey ? "••••••••" : "-"}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={() => alert("Wizard completed!")}>Submit</Button>
            </div>
          </div>
        </WizardStep>
      </Wizard>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveWizard />,
};

export const Static: Story = {
  render: () => (
    <Wizard>
      <WizardStep
        stepNumber={1}
        title="Basic Information"
        description="Enter your project details"
        status="done"
        onEdit={() => console.log("Edit step 1")}
      >
        <div className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input placeholder="My Project" />
          </div>
        </div>
      </WizardStep>
      <WizardStep
        stepNumber={2}
        title="Configuration"
        description="Configure your settings"
        status="active"
      >
        <div className="space-y-4">
          <div>
            <Label>API Key</Label>
            <Input placeholder="Enter API key" />
          </div>
          <Button>Continue</Button>
        </div>
      </WizardStep>
      <WizardStep
        stepNumber={3}
        title="Review"
        description="Review and submit"
        status="locked"
      >
        <p>Review your configuration before submitting.</p>
      </WizardStep>
    </Wizard>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <WizardStep stepNumber={1} title="Done Step" status="done" onEdit={() => {}}>
        <p>This step is completed.</p>
      </WizardStep>
      <WizardStep stepNumber={2} title="Active Step" status="active">
        <p>This step is currently active.</p>
      </WizardStep>
      <WizardStep stepNumber={3} title="Locked Step" status="locked">
        <p>This step is locked.</p>
      </WizardStep>
    </div>
  ),
};
