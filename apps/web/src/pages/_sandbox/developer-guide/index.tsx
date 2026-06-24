import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Text } from "@/components/ui/Text";

const components = [
  { name: "AsyncCombobox", path: "/developer-guide/asyncCombobox" },
  { name: "Badge", path: "/developer-guide/badge" },
  { name: "Button", path: "/developer-guide/button" },
  { name: "Checkbox", path: "/developer-guide/checkbox" },
  { name: "CheckboxInline", path: "/developer-guide/checkboxInline" },
  { name: "Combobox", path: "/developer-guide/combobox" },
  { name: "ConfirmDialog", path: "/developer-guide/confirm-dialog" },
  { name: "CustomDialog", path: "/developer-guide/custom-dialog" },
  { name: "DatePicker", path: "/developer-guide/date-picker" },
  { name: "PhoneNumberInput", path: "/developer-guide/phone-number-input" },
  { name: "TextInput", path: "/developer-guide/text-input" },
  { name: "Toast", path: "/developer-guide/toast" },
  { name: "Loading", path: "/developer-guide/loading" },
  { name: "Pagination", path: "/developer-guide/pagination" },
  { name: "Icon", path: "/developer-guide/icon" },
];

const apiGuides = [
  { name: "useMutation Hook", path: "/developer-guide/use-mutation" },
  { name: "Query API Reference", path: "/developer-guide/query-api-reference" },
];

const uiPatterns = [
  { name: "ClassicLayout", path: "/developer-guide/classic-layout" },
  { name: "ErrorDisplay", path: "/developer-guide/error-display" },
  { name: "TableSkeleton", path: "/developer-guide/table-skeleton" },
];

function DeveloperGuideIndex() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div>
        <Text className="text-5xl font-bold text-slate-900">
          Developer Guide
        </Text>
        <p className="text-slate-600 mt-2">
          A collection of reusable components, API patterns and UI presets for
          faster development.
        </p>
      </div>

      <Separator />

      <div>
        <Text className="text-3xl font-bold text-slate-900">
          Component Guide
        </Text>
        <p className="text-slate-600 mt-2">
          Browse through the available UI components and check out their usage
          examples.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {components.map((comp) => (
          <Link key={comp.path} to={comp.path}>
            <Card className="hover:shadow-md transition rounded-xl border border-slate-200 bg-sky-100">
              <CardContent className="p-6 text-center">
                <span className="text-lg font-semibold text-slate-800">
                  {comp.name}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Separator />

      <div>
        <Text className="text-3xl font-bold text-slate-900">UI Patterns</Text>
        <p className="text-slate-600 mt-2">
          Preset UI layouts and helpers that you can quickly reuse in your
          projects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {uiPatterns.map((pattern) => (
          <Link key={pattern.path} to={pattern.path}>
            <Card className="hover:shadow-md transition rounded-xl border border-slate-200 bg-purple-100">
              <CardContent className="p-6 text-center">
                <span className="text-lg font-semibold text-slate-800">
                  {pattern.name}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Separator />

      <div>
        <Text className="text-3xl font-bold text-slate-900">API Guide</Text>
        <p className="text-slate-600 mt-2">
          Browse through the available API hooks and query/mutation patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {apiGuides.map((guide) => (
          <Link key={guide.path} to={guide.path}>
            <Card className="hover:shadow-md transition rounded-xl border border-slate-200 bg-green-100">
              <CardContent className="p-6 text-center">
                <span className="text-lg font-semibold text-slate-800">
                  {guide.name}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/")({
  component: DeveloperGuideIndex,
});
