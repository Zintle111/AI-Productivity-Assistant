import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  icon,
  iconClassName = "bg-primary/10 text-primary",
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon ? (
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}>
          {icon}
        </div>
      ) : null}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
