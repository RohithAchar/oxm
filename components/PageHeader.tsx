"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card rounded-xl p-6 shadow-sm border",
        className
      )}
    >
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-1 font-light">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2 flex-wrap">{actions}</div> : null}
    </div>
  );
}

export function PrimaryActionButton(
  props: React.ComponentProps<typeof Button>
) {
  return <Button {...props} />;
}

export function SecondaryActionButton(
  props: React.ComponentProps<typeof Button>
) {
  return <Button variant="outline" {...props} />;
}
