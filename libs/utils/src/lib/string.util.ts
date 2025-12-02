import { v4 } from 'uuid';
export const getProcessid = (prefix?: string) => {
  return prefix ? `${prefix}-${v4()}` : v4();
};
