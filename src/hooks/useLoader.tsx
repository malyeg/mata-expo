import React, { useState } from "react";
import { Loader } from "@/components/core";

// interface UserLoaderProps {
//   initValue?: boolean;
// }
const useLoader = (initValue = false) => {
  const [loading, setLoading] = useState(initValue);

  const loader = loading ? <Loader /> : null;

  return {
    loader,
    loading,
    showLoader: () => setLoading(true),
    hideLoader: () => setLoading(false),
  };
};

export default useLoader;
