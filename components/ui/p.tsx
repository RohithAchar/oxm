export function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground/90 ${className}`}
    >
      {children}
    </p>
  );
}
