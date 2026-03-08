import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

type GlassPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassPanel({ className, children }: GlassPanelProps) {
  return <div className={clsx('glass-panel', className)}>{children}</div>;
}
