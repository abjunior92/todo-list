interface CheckboxProps {
  checked?: boolean;
  className?: string;
}

export function Checkbox({ checked = false, className = "" }: CheckboxProps) {
  return (
    <div
      className={`w-5 h-5 border-2 border-black rounded flex items-center justify-center ${className}`}
    >
      {checked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6L5 9L10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
