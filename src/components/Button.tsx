import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

// Generic type but only allow components.
interface ButtonProps<T extends React.ElementType> {
  as?: T;
}

export default function Button<T extends React.ElementType = "button">({
  as,
  ...props
}: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  // If any props within ButtonProps are also in the component props, it will prioritize ButtonProps.
  // Essentially removing any duplicate prop keys.

  const Component = as || "button";

  return (
    // Tailwind Merge package to allow prop classes to override default styling.
    <Component
      {...props}
      className={twMerge(
        "flex items-center justify-center gap-2 rounded bg-indigo-500 text-white p-[0.875rem] active:bg-indigo-600 disabled:bg-gray-200",
        props.className
      )}
    ></Component>
  );
}
