import { createFileRoute } from "@tanstack/react-router";

import { ClassicLayout } from "@/components/ui/ClassicLayout";
// import withFeatureGuard from "@/components/guard/guard";
import { DeploymentTemplateForm } from "@/components/deployment/DeploymentTemplateForm";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/Card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Files, Rocket } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { toast } from "sonner";

const schema = z.object({
  project_name: z.string().optional(),
  branch_name: z.string().optional(),
  environment: z.string().optional(),
  migration: z.string().optional(),
  front_back: z.string().optional(),
  repo: z.string().optional(),
  command: z.string().optional(),
  remark: z.string().optional(),
});

type DeploymentTemplateFormSchema = z.infer<typeof schema>;

export default function DeploymentTemplate() {
  const [output, setOutput] = useState("");

  const form = useForm<DeploymentTemplateFormSchema>({
    defaultValues: {
      project_name: "",
      branch_name: "",
      environment: "STAG",
      migration: "No",
      front_back: "Front",
      repo: "",
      command: "",
      remark: "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const formatWithBackticks = (value: string | undefined) =>
    value ? `\`${value}\`` : "";

  const onSubmit = (values: DeploymentTemplateFormSchema) => {
    const migrationOutput =
      values.migration === "Yes" ? "Please run migration before deploy" : "";

    const formattedOutput = `
# [${values.environment}] ${values.project_name}
Front/Back: ${values.front_back}
Repo: ${formatWithBackticks(values.repo)}
Branch: ${formatWithBackticks(values.branch_name)}

${migrationOutput ? `:warning: Migration: ${migrationOutput}\n\`\`\`python manage.py migrate\`\`\`` : ""}

${values.command ? `:warning: Run following command before deploy:\n\`\`\`${values.command}\`\`\`` : ""}

### :bangbang: Remark: 
${values.remark || ""}
  `.trim();

    setOutput(formattedOutput);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied to clipboard!");
  };

  return (
    <ClassicLayout
      title="Deployment Template"
      content={
        <FormProvider {...form}>
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-6">
                <form
                  id="deployment-template-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <DeploymentTemplateForm />
                  <div className="pt-4 flex gap-3 justify-end">
                    <Button type="submit" form="deployment-template-form">
                      <Rocket className="w-4 h-4 mr-2" />
                      Generate Output
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardContent>
                  <pre className="whitespace-pre-wrap">{output}</pre>
                  <div className="pt-4 flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={copyToClipboard}
                      className="bg-green-500 text-white border-green-500 hover:bg-green-600"
                    >
                      <Files className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </FormProvider>
      }
    />
  );
}

// const ProtectedDeploymentManagement = withFeatureGuard(Deployment, "deployment");

export const Route = createFileRoute("/_app/deployment/template")({
  component: DeploymentTemplate,
  // component: ProtectedDeploymentManagement,
});
