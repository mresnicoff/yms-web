export default function Button({
  children,
  type = "button",
  onClick,
  disabled,
  className = ""
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg bg-brand text-white font-semibold shadow-sm transition hover:bg-brand-dark active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
