import { createContext, useContext, useState } from "react";

export const LeadManagementContext = createContext<{
  search: string;
  setSearch: (search: string) => void;
  role: string | undefined;  // ✅ Changed to string to match actual state
  setRole: (role: string | undefined) => void;  // ✅ Changed to string
} | null>(null);

export const useLeadManagement = () => {
  const value = useContext(LeadManagementContext);
  // Always throw error if context is not available, even in production
  if (!value) {
    throw new Error(
      "useLeadManagement must be wrapped in a <LeadManagementProvider />",
    );
  }

  return value;
};

export function LeadManagementProvider(props: React.PropsWithChildren<{}>) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);  // ✅ This was already correct
  
  return (
    <LeadManagementContext.Provider
      value={{
        search,
        setSearch,
        role,
        setRole,
      }}
    >
      {props.children}
    </LeadManagementContext.Provider>
  );
}

export default LeadManagementProvider;