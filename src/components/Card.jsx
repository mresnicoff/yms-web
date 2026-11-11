export default function Card({
  children,
  className = ""
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-line shadow-[0_1px_2px_rgba(15,27,39,.05),0_6px_20px_-12px_rgba(15,27,39,.18)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}
