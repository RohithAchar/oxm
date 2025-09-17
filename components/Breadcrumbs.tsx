import { clsx } from "clsx";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block py-3">
      <ol className={"flex text-sm"}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Link
              href={breadcrumb.href}
              className={breadcrumb.active ? "font-semibold" : "font-light"}
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
