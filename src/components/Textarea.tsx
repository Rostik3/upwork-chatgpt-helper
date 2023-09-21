import { ChangeEventHandler } from "react";

interface TextAreaProps {
  rows?: number;
  placeholder?: string;
  defaultValue?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

const TextArea = ({
  onChange,
  rows = 4,
  defaultValue,
  placeholder = "text goes here...",
}: TextAreaProps) => {
  return (
    <div>
      <textarea
        rows={rows}
        value={defaultValue}
        name="comment"
        placeholder={placeholder}
        className="block border-[0.5px] border-white-300 p-3 w-full bg-[#40414F] text-white rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        onChange={onChange}
      />
    </div>
  );
};

export default TextArea;
