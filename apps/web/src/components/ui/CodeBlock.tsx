import { Check, Copy } from "lucide-react";

export function CodeBlock({
  children,
  id,
  copiedCode,
  setCopiedCode,
}: {
  children: React.ReactNode;
  id: string;
  copiedCode: string;
  setCopiedCode: (id: string) => void;
}) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children?.toString() || "");
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="relative mb-6">
      <div className="bg-slate-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          {copiedCode === id ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-gray-300" />
          )}
        </button>
        <pre className="pr-20">{children}</pre>
      </div>
    </div>
  );
}
