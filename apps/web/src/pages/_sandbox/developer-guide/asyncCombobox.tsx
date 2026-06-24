import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useRef, useState } from "react";
import { AsyncCombobox, AsyncComboboxRef } from "@/components/ui/AsyncCombobox";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";

const basicUsageCode = `import { useForm, FormProvider } from "react-hook-form";
import { AsyncCombobox } from "@/components/ui/AsyncCombobox";

export default function Example() {
  const form = useForm({ defaultValues: { role: "" } });

  return (
    <FormProvider {...form}>
      <AsyncCombobox
        name="role"
        control={form.control}
        formLabel="Role"
        labelField="name"
        valueField="id"
        endpoint="/roles"
        dataKey="roles"
        placeholder="Select Role"
        searchPlaceholder="Search roles..."
        required
      />
    </FormProvider>
  );
}`;

const combinedFieldsCode = `// Combine multiple fields into one label
<AsyncCombobox
  name="roleWithId"
  control={form.control}
  formLabel="Role with ID"
  labelField={["name", "id"]}
  valueField="id"
  endpoint="/roles"
  dataKey="roles"
  placeholder="Select Role"
  searchPlaceholder="Search roles..."
  onPostChange={(selected: any) => console.log("Selected role:", selected)}
/>`;

const objectModeCode = `<AsyncCombobox
  name="roleObject"
  control={form.control}
  formLabel="Role (object)"
  labelField="name"
  valueField="object"
  endpoint="/roles"
  dataKey="roles"
  placeholder="Select Role"
  searchPlaceholder="Search roles..."
  onPostChange={(role: any) => console.log("Full object:", role)}
/>`;

const dynamicFilterCode = `import { useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  AsyncCombobox,
  AsyncComboboxRef,
} from "@/components/ui/AsyncCombobox";

export default function DynamicExample() {
  const form = useForm();
  const userComboboxRef = useRef<AsyncComboboxRef>(null);

  const handleRoleChange = (roleId: string) => {
    userComboboxRef.current?.params({
      filter: { role: roleId },
    });
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-4">
        <AsyncCombobox
          name="role"
          control={form.control}
          formLabel="Role"
          labelField="name"
          valueField="id"
          endpoint="/roles"
          dataKey="roles"
          placeholder="Select Role"
          onPostChange={handleRoleChange}
        />
        <AsyncCombobox
          ref={userComboboxRef}
          name="user"
          control={form.control}
          formLabel="User"
          labelField="fullname"
          valueField="id"
          endpoint="/users"
          dataKey="users"
          placeholder="Select User"
        />
      </form>
    </FormProvider>
  );
}`;

const props = [
  {
    name: "name",
    type: "string",
    required: true,
    description: "Form field name for registration",
  },
  {
    name: "formLabel",
    type: "string",
    required: true,
    description: "Label displayed above the combobox",
  },
  {
    name: "control",
    type: "any",
    required: true,
    description: "React Hook Form control object",
  },
  {
    name: "endpoint",
    type: "string",
    required: true,
    description: "API endpoint to fetch data",
  },
  {
    name: "dataKey",
    type: "string",
    required: true,
    description: "Key to extract array from API response",
  },
  {
    name: "labelField",
    type: "string | string[]",
    defaultValue: "label",
    description: "Field(s) to display as label",
  },
  {
    name: "valueField",
    type: "string",
    defaultValue: "id",
    description: `"id" returns value only, "object" returns full object`,
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text when no option is selected",
  },
  {
    name: "searchPlaceholder",
    type: "string",
    description: "Placeholder text inside the search input field",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "false",
    description: "Mark field as required",
  },
  {
    name: "readonly",
    type: "boolean",
    defaultValue: "false",
    description: "Disable user interaction",
  },
  {
    name: "onPostChange",
    type: "(value) => void",
    description: "Callback when a value is selected",
  },
];

function AsyncComboboxGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const form = useForm({ defaultValues: { role: "" } });
  const userComboboxRef = useRef<AsyncComboboxRef>(null);

  const handleRoleChange = (roleId: string) => {
    userComboboxRef.current?.params({
      filter: { role: roleId },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          AsyncCombobox
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            AsyncCombobox
          </code>{" "}
          component fetches options dynamically from an API, with search,
          infinite scroll, and{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            react-hook-form
          </code>{" "}
          integration.
        </p>
      </div>
      <FormProvider {...form}>
        <ExampleSection
          title="Basic Usage"
          description="Fetch and select roles from /roles endpoint."
          codeId="basic"
          code={basicUsageCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <AsyncCombobox
            name="role"
            control={form.control}
            formLabel="Role"
            labelField="name"
            valueField="id"
            endpoint="/roles"
            dataKey="roles"
            placeholder="Select Role"
            searchPlaceholder="Search roles..."
            required
          />
        </ExampleSection>

        <ExampleSection
          title="Combined Fields"
          description="Combine multiple fields into the display label."
          codeId="combined"
          code={combinedFieldsCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <AsyncCombobox
            name="roleWithId"
            control={form.control}
            formLabel="Role with ID"
            labelField={["name", "id"]}
            valueField="id"
            endpoint="/roles"
            dataKey="roles"
            placeholder="Select Role"
            searchPlaceholder="Search roles..."
            onPostChange={(selected: any) =>
              console.log("Selected role:", selected)
            }
          />
        </ExampleSection>

        <ExampleSection
          title="Object Mode"
          description="Return the full object instead of just an ID."
          codeId="object"
          code={objectModeCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <AsyncCombobox
            name="roleObject"
            control={form.control}
            formLabel="Role (object)"
            labelField="name"
            valueField="object"
            endpoint="/roles"
            dataKey="roles"
            placeholder="Select Role"
            searchPlaceholder="Search roles..."
            onPostChange={(role: any) => console.log("Full object:", role)}
          />
        </ExampleSection>

        <ExampleSection
          title="Dynamic Filtering"
          description="Filter users based on selected role. Changing the role updates the available users."
          codeId="dynamic"
          code={dynamicFilterCode}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          <form className="space-y-4">
            <AsyncCombobox
              name="role"
              control={form.control}
              formLabel="Role"
              labelField="name"
              valueField="id"
              endpoint="/roles"
              dataKey="roles"
              placeholder="Select Role"
              onPostChange={handleRoleChange}
            />
            <AsyncCombobox
              ref={userComboboxRef}
              name="user"
              control={form.control}
              formLabel="User"
              labelField="fullname"
              valueField="id"
              endpoint="/users"
              dataKey="users"
              placeholder="Select User"
            />
          </form>
        </ExampleSection>
      </FormProvider>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/asyncCombobox")(
  {
    component: AsyncComboboxGuidePage,
  },
);
