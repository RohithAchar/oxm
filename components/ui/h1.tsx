export function H1({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`scroll-m-20 text-left text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-balance leading-tight ${className}`}
    >
      {children}
    </h1>
  );
}
