export default function Card({
  children
}) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        border
        shadow-sm
        p-4
      "
    >
      {children}
    </div>
  );
}