import { useState } from "react";

export const useOnInit = (initCallback) => {
  const [initialized, setInitialized] = useState(false);

  if (!initialized) {
    initCallback();
    setInitialized(true);
  }
};
