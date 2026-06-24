import { forwardRef, useEffect, useState, useMemo, useRef, useImperativeHandle, useCallback } from "react";

interface Feature {
  id?: number;
  name?: string;
  code?: string;
  parent?: number | null;
  sort_order?: number;
}

interface RoleFeature {
  id?: number;
  feature?: Feature;
}

interface FeatureTreeProps {
  featureData: any;
  roleFeatureData: any;
  roleId: number;
  onFeatureChanges?: (hasChanges: boolean) => void;
  onFeatureSelection?: (features: number[]) => void;
}

interface TreeFeature extends Feature {
  children: TreeFeature[];
  level: number;
}

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const FeatureTree = forwardRef<any, FeatureTreeProps>(({ 
  featureData,
  roleFeatureData,
  roleId,
  onFeatureSelection,
  onFeatureChanges,
}, ref) => {

  const allFeatures = useMemo<Feature[]>(() => {
    return (
      (featureData?.features as Feature[])?.map((f) => ({
        id: parseInt(f.id?.toString() ?? "0"),
        name: f.name,
        code: f.code,
        parent: f.parent ? parseInt(f.parent.toString()) : null,
        sort_order: f.sort_order !== undefined ? f.sort_order : 999,
      })) || []
    );
  }, [featureData]);

  const roleFeatures = useMemo<RoleFeature[]>(() => {
    return (
      (roleFeatureData?.roleFeatures as RoleFeature[])
        ?.map((rf): RoleFeature | null => {
          if (!rf.feature) {
            return null;
          }

          return {
            id: rf.id ? parseInt(rf.id.toString()) : undefined,
            feature: {
              id: parseInt(rf.feature.toString() ?? "0"),
            },
          };
        })
        ?.filter((rf): rf is RoleFeature => rf !== null) || []
    );
  }, [roleFeatureData]);

  const treeFeatures = useMemo<TreeFeature[]>(() => {
    const buildTree = (features: Feature[], parentId: number | null = null, level: number = 0): TreeFeature[] => {
      return features
        .filter(feature => feature.parent === parentId)
        .sort((a, b) => {
          const sortOrderA = a.sort_order !== undefined ? a.sort_order : 999;
          const sortOrderB = b.sort_order !== undefined ? b.sort_order : 999;
          
          if (sortOrderA !== sortOrderB) {
            return sortOrderA - sortOrderB;
          }
          
          return (a.name || '').localeCompare(b.name || '');
        })
        .map(feature => ({
          ...feature,
          children: buildTree(features, feature.id, level + 1),
          level,
        }));
    };

    return buildTree(allFeatures);
  }, [allFeatures]);

  const [featureStates, setFeatureStates] = useState<Record<number, boolean>>({});
  const [checkboxStates, setCheckboxStates] = useState<Record<number, CheckboxState>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialFeatureStates, setInitialFeatureStates] = useState<Record<number, boolean>>({});
  const [expandedFeatures, setExpandedFeatures] = useState<Record<number, boolean>>({});

  const calculateCheckboxState = useCallback((feature: TreeFeature, states: Record<number, boolean>): CheckboxState => {
    if (feature.children.length === 0) {
      return {
        checked: states[feature.id!] || false,
        indeterminate: false,
      };
    }

    const childStates = feature.children.map(child => calculateCheckboxState(child, states));
    const checkedChildren = childStates.filter(state => state.checked).length;
    const indeterminateChildren = childStates.filter(state => state.indeterminate).length;
    const totalChildren = feature.children.length;

    if (checkedChildren === totalChildren) {
      return {
        checked: true,
        indeterminate: false,
      };
    }

    if (checkedChildren > 0 || indeterminateChildren > 0) {
      return {
        checked: false,
        indeterminate: true,
      };
    }

    return {
      checked: false,
      indeterminate: false,
    };
  }, []);

  const getDescendantIds = useCallback((feature: TreeFeature): number[] => {
    const descendants: number[] = [];
    
    const traverse = (f: TreeFeature) => {
      f.children.forEach(child => {
        if (child.id) {
          descendants.push(child.id);
          traverse(child);
        }
      });
    };
    
    traverse(feature);
    return descendants;
  }, []);

  const findTreeFeature = useCallback((features: TreeFeature[], id: number): TreeFeature | null => {
    for (const feature of features) {
      if (feature.id === id) {
        return feature;
      }
      const found = findTreeFeature(feature.children, id);
      if (found) {
        return found;
      }
    }
    return null;
  }, []);

  const toggleFeature = useCallback((featureId: number) => {
    const feature = allFeatures.find(f => f.id === featureId);
    if (!feature) return;

    const treeFeature = findTreeFeature(treeFeatures, featureId);
    if (!treeFeature) return;

    const checkboxState = checkboxStates[featureId] || { checked: false, indeterminate: false };
    
    let newState: boolean;
    if (treeFeature.children.length > 0) {
      newState = !(checkboxState.checked || checkboxState.indeterminate);
    } else {
      newState = !featureStates[featureId];
    }

    const descendantIds = getDescendantIds(treeFeature);
    const affectedIds = [featureId, ...descendantIds];

    const updatedStates = { ...featureStates };
    affectedIds.forEach(id => {
      updatedStates[id] = newState;
    });
    
    setFeatureStates(updatedStates);
    
    const hasChanges = Object.keys(updatedStates).some(
      id => updatedStates[parseInt(id)] !== initialFeatureStates[parseInt(id)]
    );
    setHasUnsavedChanges(hasChanges);

    if (onFeatureChanges) {
    onFeatureChanges(hasChanges);
  }
  
  }, [allFeatures, treeFeatures, checkboxStates, featureStates, initialFeatureStates, getDescendantIds, findTreeFeature, onFeatureChanges]);
  
  const toggleExpanded = useCallback((featureId: number) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  }, []);

  useEffect(() => {
    if (allFeatures.length > 0 && roleFeatures.length >= 0) {
      const newFeatureStates = allFeatures.reduce<Record<number, boolean>>(
        (acc, feature) => {
          const isEnabled = roleFeatures.some(
            (rf) => rf.feature?.id === feature.id,
          );
          acc[feature.id!] = isEnabled;
          return acc;
        },
        {},
      );

      const statesChanged = Object.keys(newFeatureStates).some(
        key => newFeatureStates[parseInt(key)] !== featureStates[parseInt(key)]
      ) || Object.keys(featureStates).length !== Object.keys(newFeatureStates).length;
      
      if (statesChanged) {
        setFeatureStates(newFeatureStates);
        setInitialFeatureStates(newFeatureStates);
        setHasUnsavedChanges(false)
      }
    }
  }, [allFeatures, roleFeatures]);

  const onFeatureSelectionRef = useRef(onFeatureSelection);
  onFeatureSelectionRef.current = onFeatureSelection;

  useEffect(() => {
    const selectedFeatureIds = Object.keys(featureStates)
      .filter(id => featureStates[parseInt(id)])
      .map(id => parseInt(id));
    
    onFeatureSelectionRef.current?.(selectedFeatureIds);
  }, [featureStates]);

  useEffect(() => {
    if (treeFeatures.length === 0) return;

    const newCheckboxStates: Record<number, CheckboxState> = {};
    
    const updateStates = (features: TreeFeature[]) => {
      features.forEach(feature => {
        if (feature.id) {
          newCheckboxStates[feature.id] = calculateCheckboxState(feature, featureStates);
        }
        updateStates(feature.children);
      });
    };
    
    updateStates(treeFeatures);

    const statesChanged = Object.keys(newCheckboxStates).some(
      key => {
        const oldState = checkboxStates[parseInt(key)];
        const newState = newCheckboxStates[parseInt(key)];
        return !oldState || 
               oldState.checked !== newState.checked || 
               oldState.indeterminate !== newState.indeterminate;
      }
    ) || Object.keys(checkboxStates).length !== Object.keys(newCheckboxStates).length;
    
    if (statesChanged) {
      setCheckboxStates(newCheckboxStates);
    }
  }, [featureStates, treeFeatures, calculateCheckboxState]);

  const treeInitializedRef = useRef(false);
  useEffect(() => {
    if (treeFeatures.length > 0 && !treeInitializedRef.current) {
      const initialExpanded: Record<number, boolean> = {};
      treeFeatures.forEach(feature => {
        if (feature.children.length > 0) {
          initialExpanded[feature.id!] = true;
        }
      });
      setExpandedFeatures(initialExpanded);
      treeInitializedRef.current = true;
    }
  }, [treeFeatures]);

  useEffect(() => {
    treeInitializedRef.current = false;
  }, [roleId]);

  useImperativeHandle(ref, () => ({
    hasUnsavedChanges: () => hasUnsavedChanges,
    getSelectedFeatureIds: () => {
      return Object.keys(featureStates)
        .filter(id => featureStates[parseInt(id)])
        .map(id => parseInt(id));
    },
    resetChanges: () => {
      setInitialFeatureStates({ ...featureStates });
      setHasUnsavedChanges(false);
      onFeatureChanges?.(false);
    }
  }));

  const IndeterminateCheckbox = ({ checked, indeterminate, onChange, children, className = "" }: IndeterminateCheckboxProps) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    
    return (
      <label className={`flex items-center cursor-pointer ${className}`}>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="ml-3 text-sm font-medium text-gray-900">{children}</span>
      </label>
    );
  };

  const renderTreeFeature = (feature: TreeFeature): JSX.Element => {
    const checkboxState = checkboxStates[feature.id!] || { checked: false, indeterminate: false };
    const hasChildren = feature.children.length > 0;
    const isExpanded = expandedFeatures[feature.id!] || false;

    return (
      <div key={feature.id} className={`mb-2 pl-${feature.level * 4}`}>
        <div className="flex items-center">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpanded(feature.id!)}
              className="mr-2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ) : (
            <div className="w-6 mr-2" />
          )}
          
          <IndeterminateCheckbox
            checked={checkboxState.checked}
            indeterminate={checkboxState.indeterminate}
            onChange={() => toggleFeature(feature.id!)}
            className="flex-1 py-2"
          >
            {feature.name}
          </IndeterminateCheckbox>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-6 mt-2 space-y-2">
            {feature.children.map(child => renderTreeFeature(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-3">
        <div className="space-y-3">
          {treeFeatures.map(feature => renderTreeFeature(feature))}
        </div>
      </div>
    </div>
  );
});

FeatureTree.displayName = 'FeatureTree';