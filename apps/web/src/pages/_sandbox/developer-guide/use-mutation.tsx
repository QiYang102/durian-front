import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/Separator";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "@/components/ui/UseToast";
import { useEditUser, getSingleUser } from "@ttm/api/modules/customer";

const basicUsageCode = `import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { User } from "../types/models/customer";

export const useEditUser = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(\`/users/\${data.id}\`, data)
      .then((response) => response.data);

  return mutate<{ user: User }, any>(
    ["update-user"],           // Mutation key - unique identifier for this mutation
    [["list-of-users"]],       // Invalidation keys - queries to refresh after success
    postData,                  // The actual API call function
    {
      ...opts,                 // Spread custom options (onSuccess, onError, etc.)
    }
  );
};`;

const usageExampleCode = `import { useEditUser } from "@ttm/api/modules/customer";
import { toast } from "@/components/ui/UseToast";

function CustomerEditForm({ customerId, customer, onRefetch }) {
  const form = useForm({
    defaultValues: {
      fullname: customer.fullname,
      email: customer.email,
      mobile: customer.mobile,
    }
  });

  const editCustomer = useEditUser({
    onSuccess: (data) => {
      toast({
        title: "Customer updated successfully",
        description: "The customer information has been updated.",
      });
      form.reset(data.user); // Reset form with updated data
      onRefetch(); // Refresh parent component data
    },
    onError: (error) => {
      console.error("Failed to update customer:", error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    editCustomer.mutate({
      id: customerId,
      ...data,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <TextInput name="fullname" control={form.control} title="Full Name" />
      <TextInput name="email" control={form.control} title="Email" />
      <TextInput name="mobile" control={form.control} title="Contact" />
      
      <Button 
        type="submit" 
        disabled={editCustomer.isPending}
      >
        {editCustomer.isPending ? "Updating..." : "Update Customer"}
      </Button>
    </form>
  );
}`;

const patternExplanation = [
  {
    name: "Mutation Key",
    type: "string[]",
    example: '["update-user"]',
    description:
      "A unique name for this API call. Uses this to keep track of whether the call is loading, successful or failed.",
  },
  {
    name: "Invalidation Keys",
    type: "string[][] | string[]",
    example: '[["list-of-users"]]',
    description:
      "Tell which data to refresh after this API call succeeds. This keeps the data up-to-date automatically.",
  },
  {
    name: "TypeScript Generics",
    type: "Generic Types",
    example: "<{ user: User }, any>",
    description:
      "Help TypeScript understand what data expect back from the API. The first part is success data, the second part is error data.",
  },
  {
    name: "Options Parameter",
    type: "UseMutationOptions",
    example: "{ onSuccess, onError }",
    description:
      'Functions that run when the API call finishes. "onSuccess" runs when it works, "onError" runs when something goes wrong.',
  },
];

function UseMutationGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");
  const [selectedUserId] = useState("1"); // Adjust this ID based on your available data

  const { data: userResponse, isLoading } = getSingleUser(
    ["customer"],
    +selectedUserId,
    {},
  );

  const currentUser = userResponse?.user || {};

  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      form.reset({
        fullname: currentUser.fullname || "",
        email: currentUser.email || "",
        mobile: currentUser.mobile || "",
      });
    }
  }, [currentUser, form.reset]);

  const editUser = useEditUser({
    onSuccess: () => {
      toast({
        title: "User updated successfully",
        description: "The user information has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    editUser.mutate({
      id: selectedUserId,
      ...data,
    });
  };

  if (isLoading) return <div>Loading user data...</div>;
  if (!currentUser.id)
    return <div>User not found. Please check the user ID.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          useMutation Hook Pattern
        </h1>
        <p className="text-lg text-slate-600">
          Learn how to create and use mutation hooks for API operations like
          creating, updating, and deleting data. This guide uses{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            useEditUser
          </code>{" "}
          as an example.
        </p>
      </div>

      <ExampleSection
        title="Creating a Mutation Hook"
        description="Follow this pattern to create mutation hooks for any API endpoint. The structure remains consistent across all resources."
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
        containerColor="bg-blue-50"
      >
        <div className="space-y-4">
          <Text className="font-semibold text-blue-800 mb-2">
            Key Components:
          </Text>
          <ul className="space-y-1 text-blue-700">
            <li>
              <strong>Mutation Key:</strong> Unique identifier for caching and
              state management
            </li>
            <li>
              <strong>Invalidation Keys:</strong> Queries to refresh after
              successful mutation
            </li>
            <li>
              <strong>API Function:</strong> The actual HTTP request logic
            </li>
            <li>
              <strong>Options:</strong> Custom success/error handlers and
              configuration
            </li>
          </ul>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Using the Mutation Hook"
        description="How to integrate the mutation hook in your components with proper error handling and user feedback."
        codeId="usage"
        code={usageExampleCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
        containerColor="bg-green-50"
      >
        <div className="space-y-4">
          <Text className="font-semibold text-green-800 mb-2">
            Best Practices:
          </Text>
          <ul className="space-y-1 text-green-700">
            <li>
              Always provide <strong>onSuccess</strong> and{" "}
              <strong>onError</strong> handlers
            </li>
            <li>
              Show user feedback with <strong>toast </strong> notifications
            </li>
            <li>
              Use <strong> isPending </strong> state to disable buttons during
              requests
            </li>
            <li>
              {" "}
              <strong>Reset</strong> form state after successful updates
            </li>
          </ul>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Live Interactive Example"
        description="Try editing the user information below. The form will update the API and refresh the displayed data."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <TextInput
                  name="fullname"
                  control={form.control}
                  title="Full Name"
                  placeholder="Enter full name"
                  required
                />
                <TextInput
                  name="email"
                  control={form.control}
                  title="Email"
                  placeholder="Enter email"
                  type="email"
                  required
                />
                <TextInput
                  name="mobile"
                  control={form.control}
                  title="Contact"
                  placeholder="Enter contact number"
                  required
                />
                <Button
                  type="submit"
                  disabled={editUser.isPending}
                  className="w-full"
                >
                  {editUser.isPending ? "Updating..." : "Update User"}
                </Button>
              </form>
            </FormProvider>
          </div>

          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-1 mb-4">
                  <Text variant="h3">Current User Info</Text>
                  <Separator />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Text className="font-medium">ID:</Text>
                    <Text>{currentUser.id}</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="font-medium">Full Name:</Text>
                    <Text>{currentUser.fullname}</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="font-medium">Email:</Text>
                    <Text>{currentUser.email}</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="font-medium">Contact:</Text>
                    <Text>{currentUser.mobile}</Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ExampleSection>

      <PropsTable title="Pattern Explanation" props={patternExplanation} />
    </div>
  );
}

export default UseMutationGuidePage;

export const Route = createFileRoute("/_sandbox/developer-guide/use-mutation")({
  component: UseMutationGuidePage,
});
