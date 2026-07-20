"use client";

import { FolderOpen, ListOrdered } from "lucide-react";
import Image from "next/image";
import type { LearningTrack } from "@/types/material";

type TrackCardProps = {
  track: LearningTrack;
  count: number;
  onOpen: (track: LearningTrack) => void;
};

export function TrackCard({ track, count, onOpen }: TrackCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(track)}
      className="ticket-card group flex h-[35rem] flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ea6a00]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-slate-100">
        {track.coverUrl ? (
          <Image
            src={track.coverUrl}
            alt={track.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
              <FolderOpen size={30} />
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-orange-700 shadow-sm">
          Обучающий трек
        </div>
        <div className="absolute right-4 top-4 rounded bg-white/90 px-2 py-1.5 shadow-sm">
          <div className="ticket-barcode h-5 w-14 opacity-80" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t-2 border-dashed border-slate-200 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 min-h-12 text-lg font-semibold leading-snug text-slate-950">
            {track.title}
          </h3>
          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
            {track.description}
          </p>
        </div>
        <div className="flex min-h-14 content-start flex-wrap gap-2">
          {(track.tags ?? []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex min-h-[4.25rem] items-center gap-2 border-t border-slate-100 pt-4 text-sm font-medium text-[#ea6a00]">
          <ListOrdered size={16} />
          {count} материалов
        </div>
      </div>
    </button>
  );
}
