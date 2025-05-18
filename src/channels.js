import { productChanges } from "./products/index.js";
import { requestChanges } from "./requests/index.js";
export const channels = {
  product_change: productChanges,
  request_change: requestChanges,
};
