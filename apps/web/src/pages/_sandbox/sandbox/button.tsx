import { createFileRoute } from "@tanstack/react-router";
import { axiosClient } from "@ttm/api/axios";

import React, { useCallback, useState } from "react";
import _ from "lodash";
import axios from "axios";

const validateCodeAPI = async (code: string) => {
  const response = await axiosClient.get(`discounts/is_code_exist`, {
    params: { code },
  });
  return response.data.code_exists;
};

const DiscountCodeValidation = () => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  const validateCode = useCallback(
    _.debounce(async (currentCode: string) => {
      if (!currentCode) return;
      setIsValidating(true);
      setIsCodeValid(null);

      try {
        const exists = await validateCodeAPI(currentCode);
        setIsCodeValid(!exists);
      } catch (error) {
        console.error("Validation error:", error);
      } finally {
        setIsValidating(false);
      }
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    validateCode(newCode);
  };

  return (
    <div>
      <input
        type="text"
        value={code}
        placeholder="Enter discount code"
        onChange={handleChange}
        className="p-2 border"
      />
      {isValidating && <span>Validating...</span>}
      {!isValidating && isCodeValid === true && (
        <span>Code is available</span>
      )}
      {!isValidating && isCodeValid === false && (
        <span>Code is already in use</span>
      )}
    </div>
  );
};


export const Route = createFileRoute("/_sandbox/sandbox/button")({
  component: DiscountCodeValidation,
});
