# Loading Component

A reusable loading component that displays a spinning loader icon with customizable appearance and optional text.

## Features

- 🎨 Multiple size variants (xs, sm, default, lg, xl, 2xl)
- 🌈 Multiple color variants (default, primary, secondary, accent, white, muted)
- 📝 Optional loading text with customizable spacing
- ♿ Accessible with proper display names
- 🎯 Follows project's design system patterns using cva
- 💪 Fully typed with TypeScript

## Usage

### Basic Usage

```tsx
import { Loading } from "@/components/ui/Loading";

// Simple spinner
<Loading />

// With text
<Loading showText />

// Custom text
<Loading showText text="Loading data..." />
```

### Size Variants

```tsx
<Loading size="xs" />     // 12x12px
<Loading size="sm" />     // 16x16px
<Loading size="default" />// 24x24px (default)
<Loading size="lg" />     // 32x32px
<Loading size="xl" />     // 40x40px
<Loading size="2xl" />    // 48x48px
```

### Color Variants

```tsx
<Loading color="default" />   // Muted foreground (default)
<Loading color="primary" />   // Primary theme color
<Loading color="secondary" /> // Secondary theme color
<Loading color="accent" />    // Accent theme color
<Loading color="white" />     // White (for dark backgrounds)
<Loading color="muted" />     // Muted foreground
```

### Text and Spacing

```tsx
<Loading showText />                          // "Loading..." with default spacing
<Loading showText text="Custom message" />   // Custom text
<Loading showText spacing="sm" />             // Small gap between icon and text
<Loading showText spacing="lg" />             // Large gap between icon and text
<Loading showText spacing="none" />           // No gap between icon and text
```

### Common Patterns

#### Full Screen Loading

```tsx
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
  <Loading
    showText
    text="Loading application..."
    size="lg"
    className="h-full"
  />
</div>
```

#### Card Loading State

```tsx
<Card>
  <CardContent className="min-h-[200px]">
    <Loading showText text="Loading content..." className="h-full" />
  </CardContent>
</Card>
```

#### Button Loading State

```tsx
<Button disabled>
  <Loading size="sm" className="mr-2" />
  Processing...
</Button>
```

#### Inline Loading

```tsx
<p className="flex items-center gap-2">
  Saving changes
  <Loading size="sm" />
</p>
```

## Props

| Prop        | Type                                                                      | Default        | Description                     |
| ----------- | ------------------------------------------------------------------------- | -------------- | ------------------------------- |
| `size`      | `"xs" \| "sm" \| "default" \| "lg" \| "xl" \| "2xl"`                      | `"default"`    | Size of the loading spinner     |
| `color`     | `"default" \| "primary" \| "secondary" \| "accent" \| "white" \| "muted"` | `"default"`    | Color variant of the spinner    |
| `spacing`   | `"none" \| "sm" \| "default" \| "lg"`                                     | `"default"`    | Gap between spinner and text    |
| `text`      | `string`                                                                  | `"Loading..."` | Custom loading text             |
| `showText`  | `boolean`                                                                 | `false`        | Whether to display loading text |
| `className` | `string`                                                                  | -              | Additional CSS classes          |

All standard HTML div attributes are also supported (except `color` which is overridden by our variant).

## Accessibility

The component uses semantic HTML and follows accessibility best practices:

- Uses `div` with proper ARIA attributes
- Text content is screen reader accessible
- Color variants maintain sufficient contrast ratios

## Examples

See `LoadingExamples.tsx` for comprehensive usage examples of all variants and patterns.
