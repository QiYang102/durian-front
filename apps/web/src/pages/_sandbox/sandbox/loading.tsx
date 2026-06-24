import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "@/components/ui/Loading";

function LoadingDemo() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Loading Component Demo</h1>

      {/* Basic Loading */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Usage</h2>
        <div className="border rounded-lg p-6 bg-card">
          <Loading />
        </div>
      </section>

      {/* Different Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Different Sizes</h2>
        <div className="border rounded-lg p-6 bg-card space-y-6">
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium">Extra Small:</span>
            <Loading size="xs" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium">Small:</span>
            <Loading size="sm" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium">Default:</span>
            <Loading size="default" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium">Large:</span>
            <Loading size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium">Extra Large:</span>
            <Loading size="xl" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium">2X Large:</span>
            <Loading size="2xl" />
          </div>
        </div>
      </section>

      {/* Different Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Different Colors</h2>
        <div className="border rounded-lg p-6 bg-card space-y-6">
          <div className="flex items-center gap-6">
            <span className="w-24 text-sm font-medium">Default:</span>
            <Loading color="default" size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-24 text-sm font-medium">Primary:</span>
            <Loading color="primary" size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-24 text-sm font-medium">Secondary:</span>
            <Loading color="secondary" size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-24 text-sm font-medium">Accent:</span>
            <Loading color="accent" size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <span className="w-24 text-sm font-medium">Muted:</span>
            <Loading color="muted" size="lg" />
          </div>
        </div>
      </section>

      {/* With Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">With Loading Text</h2>
        <div className="border rounded-lg p-6 bg-card space-y-6">
          <Loading showText />
          <Loading showText text="Loading data..." size="lg" color="primary" />
          <Loading
            showText
            text="Processing request..."
            size="xl"
            color="accent"
          />
        </div>
      </section>

      {/* Different Spacing */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Text Spacing Variants</h2>
        <div className="border rounded-lg p-6 bg-card space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">No spacing:</p>
            <Loading showText text="Loading..." spacing="none" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small spacing:</p>
            <Loading showText text="Loading..." spacing="sm" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Default spacing:
            </p>
            <Loading showText text="Loading..." spacing="default" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large spacing:</p>
            <Loading showText text="Loading..." spacing="lg" />
          </div>
        </div>
      </section>

      {/* Centered in Container */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Centered in Container</h2>
        <div className="border rounded-lg h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <Loading
            showText
            text="Loading content..."
            size="lg"
            color="primary"
            className="h-full"
          />
        </div>
      </section>

      {/* Real World Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Real World Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Loading */}
          <div className="border rounded-lg bg-card">
            <div className="p-4 border-b">
              <h3 className="font-medium">Card Loading State</h3>
            </div>
            <div className="p-6 min-h-[120px]">
              <Loading
                showText
                text="Loading card content..."
                className="h-full"
              />
            </div>
          </div>

          {/* Inline Loading */}
          <div className="border rounded-lg bg-card p-6">
            <h3 className="font-medium mb-4">Inline Loading</h3>
            <p className="flex items-center gap-2 text-sm">
              Saving your changes
              <Loading size="sm" />
            </p>
            <p className="flex items-center gap-2 text-sm mt-2">
              <Loading size="sm" color="primary" />
              Processing data
            </p>
          </div>
        </div>
      </section>

      {/* Button States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Loading States</h2>
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex flex-wrap gap-4">
            <button
              disabled
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Loading size="sm" className="mr-2" />
              Loading...
            </button>

            <button
              disabled
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <Loading size="sm" color="primary" className="mr-2" />
              Processing...
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/loading")({
  component: LoadingDemo,
});
