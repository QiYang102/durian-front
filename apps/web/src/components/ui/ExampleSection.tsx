import { CodeBlock } from "./CodeBlock";
import { Text } from "@/components/ui/Text";

export function ExampleSection({
  title,
  description,
  children,
  code,
  codeId,
  copiedCode,
  setCopiedCode,
  containerColor = "bg-gray-50",
}: {
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
  code?: string;
  codeId?: string;
  copiedCode?: string;
  setCopiedCode?: (id: string) => void;
  containerColor?: string;
}) {
  return (
    <div className="mb-12">
      <div className="mb-4">
        <Text className="text-2xl font-bold text-slate-800">{title}</Text>
      </div>
      {description && (
        <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
      )}

      {children && (
        <div className="mb-6">
          <div
            className={`border border-gray-200 rounded-lg p-6 ${containerColor}`}
          >
            {children}
          </div>
        </div>
      )}

      {code && codeId && copiedCode !== undefined && setCopiedCode && (
        <CodeBlock
          id={codeId}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
        >
          {code}
        </CodeBlock>
      )}
    </div>
  );
}
