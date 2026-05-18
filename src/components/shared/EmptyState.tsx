"use client";

import { BookOpen } from "lucide-react";

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
        <BookOpen size={24} />
      </div>

      <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}