import { createContext, useContext } from 'react';
export const NieuwFormContext = createContext(null);
export function useNieuwForm() {
  return useContext(NieuwFormContext);
}
