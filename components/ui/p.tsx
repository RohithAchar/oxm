export function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm sm:text-base leading-6 sm:leading-7 [&:not(:first-child)]:mt-4 sm:[&:not(:first-child)]:mt-6 ${className}`}
    >
      {children}
    </p>
  );
}
