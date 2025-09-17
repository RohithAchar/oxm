"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import { P } from "@/components/ui/p";

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
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border",
        className
      )}
    >
      <div>
        <H1 className="text-left text-2xl sm:text-3xl md:text-4xl font-semibold md:font-medium tracking-tight text-foreground">
          {title}
        </H1>
        {description ? (
          <P className="text-left text-muted-foreground mt-1 font-normal md:font-normal max-w-prose">
            {description}
          </P>
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
