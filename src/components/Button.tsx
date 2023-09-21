import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  text?: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({
  onClick,
  disabled,
  children,
  className,
  text = "Get Answer",
}: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm enabled:hover:bg-emerald-50 enabled:hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 mt-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children || text}
    </button>
  );
};

export default Button;
