import { useEffect, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { listFeatureTree } from "@ttm/api";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";

interface FeatureNode {
  id: number;
  value: string;
  label: string;
  children: FeatureNode[];
}

export function FeatureTree({
  roleFeatures,
  onSelectedFeaturesChange,
}: {
  roleFeatures: Array<{
    id: number;
    feature: { id: number; code: string };
  }>;
  onSelectedFeaturesChange?: (selectedFeatureIds: number[]) => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data } = listFeatureTree(["feature-tree"]);
  const featureTreeData: FeatureNode[] = data?.data ?? [];

  const featureToRoleFeatureId: Record<number, number> = {};
  roleFeatures.forEach((rf) => {
    featureToRoleFeatureId[rf.feature.id] = rf.id;
  });

  useEffect(() => {
    const checkedCodes = new Set(roleFeatures.map((rf) => rf.feature.code));
    setChecked(checkedCodes);
  }, [roleFeatures]);

  // Helper function to get feature IDs from checked codes
  const getFeatureIdsFromCheckedCodes = (
    checkedCodes: Set<string>,
  ): number[] => {
    const featureIds: number[] = [];
    const findFeatureIds = (nodes: FeatureNode[]) => {
      nodes.forEach((node) => {
        if (checkedCodes.has(node.value)) {
          featureIds.push(node.id);
        }
        if (node.children && node.children.length > 0) {
          findFeatureIds(node.children);
        }
      });
    };
    findFeatureIds(featureTreeData);
    return featureIds;
  };

  // Notify parent when selected features change
  useEffect(() => {
    if (onSelectedFeaturesChange && featureTreeData.length > 0) {
      const selectedFeatureIds = getFeatureIdsFromCheckedCodes(checked);
      onSelectedFeaturesChange(selectedFeatureIds);
    }
  }, [checked, featureTreeData, onSelectedFeaturesChange]);

  // 🔨 Mutations

  const findFeatureByCode = (
    nodes: FeatureNode[],
    code: string,
  ): FeatureNode | null => {
    for (const node of nodes) {
      if (node.value === code) return node;
      if (Array.isArray(node.children)) {
        const result = findFeatureByCode(node.children, code);
        if (result) return result;
      }
    }
    return null;
  };

  const getAllDescendants = (node: FeatureNode): FeatureNode[] => {
    let descendants: FeatureNode[] = [];
    if (node.children) {
      for (const child of node.children) {
        descendants.push(child);
        descendants = descendants.concat(getAllDescendants(child));
      }
    }
    return descendants;
  };

  const getParentNode = (
    nodeValue: string,
    nodes: FeatureNode[],
  ): FeatureNode | null => {
    for (const node of nodes) {
      if (node.children?.some((child) => child.value === nodeValue)) {
        return node;
      }
      const parentInChildren = getParentNode(nodeValue, node.children || []);
      if (parentInChildren) return parentInChildren;
    }
    return null;
  };

  const updateParentStates = (
    newChecked: Set<string>,
    nodes: FeatureNode[],
  ) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const hasCheckedChildren = node.children.some((child) =>
          newChecked.has(child.value),
        );

        if (hasCheckedChildren) {
          newChecked.add(node.value);
        } else {
          // Only uncheck parent if no children are checked
          const hasAnyDescendantChecked = getAllDescendants(node).some((desc) =>
            newChecked.has(desc.value),
          );
          if (!hasAnyDescendantChecked) {
            newChecked.delete(node.value);
          }
        }

        // Recursively update parent states for nested children
        updateParentStates(newChecked, node.children);
      }
    }
  };

  const handleFeatureToggle = (node: FeatureNode, isChecked: boolean) => {
    const newChecked = new Set(checked);

    if (isChecked) {
      // Check the current node
      newChecked.add(node.value);

      // If this node has children, optionally check them too (uncomment if desired)
      // const descendants = getAllDescendants(node);
      // descendants.forEach(desc => newChecked.add(desc.value));
    } else {
      // Uncheck the current node
      newChecked.delete(node.value);

      // If this node has children, uncheck all descendants
      const descendants = getAllDescendants(node);
      descendants.forEach((desc) => newChecked.delete(desc.value));
    }

    // Update parent states based on children
    updateParentStates(newChecked, featureTreeData);

    setChecked(newChecked);
  };

  const toggleExpanded = (nodeValue: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(nodeValue)) {
      newExpanded.delete(nodeValue);
    } else {
      newExpanded.add(nodeValue);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: FeatureNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.value);
    const isChecked = checked.has(node.value);

    return (
      <div key={node.id} className={cn("", level > 0 && "ml-6")}>
        <Card
          className={cn(
            "mb-2 transition-all duration-200 hover:shadow-md",
            level === 0
              ? "border-l-4 border-l-blue-500"
              : "border-l-2 border-l-gray-300",
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(node.value)}
                  className="rounded-sm p-1 transition-colors hover:bg-gray-100"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}

              <Checkbox
                id={`feature-${node.id}`}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleFeatureToggle(node, !!checked)
                }
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />

              <label
                htmlFor={`feature-${node.id}`}
                className={cn(
                  "flex-1 cursor-pointer font-medium transition-colors",
                  level === 0
                    ? "text-lg text-gray-900"
                    : "text-sm text-gray-700",
                  isChecked && "text-blue-700",
                )}
              >
                {node.label}
              </label>

              {hasChildren && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                  {node.children.length}{" "}
                  {node.children.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <h3 className="mb-1 font-semibold text-blue-900">
          Feature Permissions
        </h3>
        <p className="text-sm text-blue-700">
          Select the features this role should have access to. Parent features
          will automatically expand to show sub-features.
        </p>
      </div>
      {featureTreeData.map((node) => renderNode(node))}
    </div>
  );
}
