import { createContext, useContext, useState } from "react";

export const CustomerManagementContext = createContext<{
  search: string;
  setSearch: (search: string) => void;
  customerType: string | undefined;
  setCustomerType: (customerType: string | undefined) => void;
  bumiputraStatus: string | undefined;
  setBumiputraStatus: (bumiputraStatus: string | undefined) => void;
  tags: string;
  setTags: (tags: string) => void;
} | null>(null);

export const useCustomerManagement = () => {
  const value = useContext(CustomerManagementContext);
  // Always throw error if context is not available, even in production
  if (!value) {
    throw new Error(
      "useCustomerManagement must be wrapped in a <CustomerManagementProvider />",
    );
  }

  return value;
};

export function CustomerManagementProvider(props: React.PropsWithChildren<{}>) {
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState<string | undefined>(undefined);
  const [bumiputraStatus, setBumiputraStatus] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState("");
  
  return (
    <CustomerManagementContext.Provider
      value={{
        search,
        setSearch,
        customerType,
        setCustomerType,
        bumiputraStatus,
        setBumiputraStatus,
        tags,
        setTags,
      }}
    >
      {props.children}
    </CustomerManagementContext.Provider>
  );
}

export default CustomerManagementProvider;