import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Button(props: ComponentPropsWithoutRef<"button">) {
  return (
    // Tailwind Merge package to allow prop classes to override default styling.
    <button
      {...props}
      className={twMerge(
        "flex items-center justify-center gap-2 rounded bg-blue-500 text-white p-[0.875rem] active:bg-blue-600 disabled:bg-gray-200",
        props.className
      )}
    ></button>
  );
}
