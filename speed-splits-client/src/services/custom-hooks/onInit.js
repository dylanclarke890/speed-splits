import { useState } from "react";

export function useOnInit(initCallback) {
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    initCallback();
    setInitialized(true);
  }
}
