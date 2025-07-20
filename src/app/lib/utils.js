import { clsx } from "clsx";

/**
 * Combines class names conditionally.
 * Usage: cn("base-class", condition && "conditional-class")
 */
export function cn(...inputs) {
  return clsx(inputs);
}
