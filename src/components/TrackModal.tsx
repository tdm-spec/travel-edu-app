"use client";

import { ExternalLink, X } from "lucide-react";
import type { LearningTrack, Material } from "@/types/material";

type TrackModalProps = {
  track: LearningTrack | null;
  materials: Material[];
  onClose: () => void;
  onOpenMaterial: (material: Material) => void;
};

export function TrackModal({
  track,
  materials,
  onClose,
  onOpenMaterial
}: TrackModalProps) {
  if (!track) {
    return null;
  }

  const orderedMaterials = track.materialIds
    .map((id) => materials.find((material) => material.id === id))
    .filter((material): material is Material => Boolean(material));

  const shareUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}${window.location.pathname}?track=${track.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div className="min-w-0">
            <p className="mb-1 text-sm font-medium text-orange-600">
              Обучающий трек
            </p>
            <h2 className="text-xl font-semibold leading-tight text-slate-950">
              {track.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {track.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {orderedMaterials.map((material, index) => (
              <button
                key={material.id}
                type="button"
                onClick={() => onOpenMaterial(material)}
                className="flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#ea6a00]/30 hover:bg-orange-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ea6a00] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-950">
                    {material.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-6 text-slate-500">
                    {material.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="truncate text-xs text-slate-400">{shareUrl}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ea6a00] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d85f00]"
          >
            <ExternalLink size={16} />
            Скопировать ссылку
          </button>
        </div>
      </div>
    </div>
  );
}
