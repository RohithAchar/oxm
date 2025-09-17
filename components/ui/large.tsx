export function Large({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
}
