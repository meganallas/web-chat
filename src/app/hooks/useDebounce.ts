import { useEffect, useState } from "react";

/**
 * Used to reduce the amount of queries when a user is typing into an input.
 * e.g. Search functionality queries everytime a new character is inputted.
 *      Use this debounce to delay that query.
 * @param value
 * @param delay
 */
export default function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
