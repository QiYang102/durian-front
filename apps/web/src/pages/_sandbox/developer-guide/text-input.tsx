import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { useState } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { useForm, FormProvider } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";

export default function Example() {
  const form = useForm({ defaultValues: { username: "" } });

  return (
    <FormProvider {...form}>
      <form>
        <TextInput
          name="username"
          title="Username"
          control={form.control}
          placeholder="Enter your username"
          required
        />
      </form>
    </FormProvider>
  );
}`;

const withIconAndPrefixCode = `import { useForm, FormProvider } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";

export default function Example() {
  const form = useForm({ 
    defaultValues: { 
      email: "",
      price: "",
    } 
  });

  return (
    <FormProvider {...form}>
      <form className="space-y-4">
        <TextInput
          name="email"
          title="Email Address"
          control={form.control}
          iconName="mail"
          placeholder="Enter your email"
          type="email"
        />
        <TextInput
          name="price"
          title="Price"
          control={form.control}
          prefix="$"
          unit="USD"
          placeholder="0.00"
          type="number"
        />
      </form>
    </FormProvider>
  );
}`;

const passwordInputCode = `import { useForm, FormProvider } from "react-hook-form";
import { TextInput } from "@/components/ui/TextInput";
import { useState } from "react";

export default function Example() {
  const form = useForm({ 
    defaultValues: { 
      password: "",
    } 
  });
  
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormProvider {...form}>
      <form className="space-y-4">
        <TextInput
          name="password"
          title="Password"
          control={form.control}
          type="password"
          placeholder="Enter your password"
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          required
        />
      </form>
    </FormProvider>
  );
}`;

const props = [
  {
    name: "defaultValue",
    type: "string",
    description: "Initial value for the input field",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the field is required",
  },
  {
    name: "iconName",
    type: "string",
    description: "Icon name to display at the start of the input",
  },
  {
    name: "prefix",
    type: "string",
    description: "Text prefix displayed before the input value",
  },
  {
    name: "unit",
    type: "string",
    description: "Unit text displayed after the input value",
  },
  {
    name: "type",
    type: "string",
    defaultValue: '"text"',
    description: "HTML input type",
  },
  {
    name: "maxLength",
    type: "number",
    description: "Maximum character limit with counter display",
  },
  {
    name: "showPassword",
    type: "boolean",
    description: "For password fields, whether to show password text",
  },
  {
    name: "toggleShowPassword",
    type: "function",
    description: "Function to toggle password visibility",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disable user interaction with the input",
  },
  {
    name: "readOnly",
    type: "boolean",
    defaultValue: "false",
    description: "Make the input read-only",
  },
  {
    name: "disableScroll",
    type: "boolean",
    defaultValue: "true",
    description: "Prevent scroll wheel from changing number input values",
  },
];

function TextInputGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  
  const basicForm = useForm({
    defaultValues: {
      username: "",
    },
  });

  const iconForm = useForm({
    defaultValues: {
      email: "",
      price: "",
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">TextInput</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            TextInput
          </code>{" "}
          component is a versatile input field for building robust forms.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Simple text input with label and validation. The component
            integrates seamlessly with React Hook Form for state management
            and validation.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...basicForm}>
          <form className="space-y-4">
            <TextInput
              name="username"
              title="Username"
              control={basicForm.control}
              placeholder="Enter your username"
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <ExampleSection
        title="With Icons and Prefixes"
        description={
          <>
            Enhance inputs with icons, prefixes, and units. Use{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              iconName
            </code>{" "}
            for visual context,{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              prefix
            </code>{" "}
            for currency or protocol indicators, and{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              unit
            </code>{" "}
            for measurement units.
          </>
        }
        codeId="icons-prefixes"
        code={withIconAndPrefixCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...iconForm}>
          <form className="space-y-4">
            <TextInput
              name="email"
              title="Email Address"
              control={iconForm.control}
              iconName="mail"
              placeholder="Enter your email"
              type="email"
            />
            <TextInput
              name="price"
              title="Price"
              control={iconForm.control}
              prefix="$"
              unit="USD"
              placeholder="0.00"
              type="number"
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <ExampleSection
        title="Password Input"
        description={
          <>
            Password inputs with toggle visibility functionality. Use{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              showPassword
            </code>{" "}
            and{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              toggleShowPassword
            </code>{" "}
            props to implement show/hide password feature.
          </>
        }
        codeId="password"
        code={passwordInputCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...passwordForm}>
          <form className="space-y-4">
            <TextInput
              name="password"
              title="Password"
              control={passwordForm.control}
              type="password"
              placeholder="Enter your password"
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              required
            />
          </form>
        </FormProvider>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/text-input")({
  component: TextInputGuidePage,
});