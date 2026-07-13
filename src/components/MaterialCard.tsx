"use client";

import { CalendarDays, Clock3, FileText, PlayCircle } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/materials";
import type { Material } from "@/types/material";

type MaterialCardProps = {
  material: Material;
  onOpen: (material: Material) => void;
};

export function MaterialCard({ material, onOpen }: MaterialCardProps) {
  const Icon = material.type === "video" ? PlayCircle : FileText;

  return (
    <button
      type="button"
      onClick={() => onOpen(material)}
      className="group overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-sky-50 via-white to-blue-100">
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
          {material.format}
        </div>
        <div className="flex h-full items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition group-hover:scale-105">
            <Icon size={30} />
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-950">
            {material.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {material.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {material.category.map((category) => (
            <span
              key={category}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={material.author.avatar}
              alt={material.author.name}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {material.author.name}
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays size={13} />
                {formatDate(material.createdAt)}
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Clock3 size={13} />
            {material.duration} мин
          </span>
        </div>
      </div>
    </button>
  );
}
