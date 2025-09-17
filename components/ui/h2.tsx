export function H2({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`scroll-m-20 pb-1 sm:pb-2 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight first:mt-0 leading-snug ${className}`}
    >
      {children}
    </h2>
  );
}
