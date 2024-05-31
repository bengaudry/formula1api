import { InputHTMLAttributes } from "react";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { type, className, ...otherProps } = props;
  return (
    <input
      type="text"
      className={`bg-black border border-neutral-600 rounded-md px-4 py-2 w-full max-w-96 ${className}`}
      {...otherProps}
    />
  );
}
