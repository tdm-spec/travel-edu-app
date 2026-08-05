"use client";

import { CheckCircle2, ExternalLink, LockKeyhole, X } from "lucide-react";
import type { LearningTrack, Material } from "@/types/material";

type TrackModalProps = {
  track: LearningTrack | null;
  materials: Material[];
  completedMaterialIds: Set<string>;
  onClose: () => void;
  onOpenMaterial: (material: Material) => void;
  onOpenTest?: (url: string) => void;
};

export function TrackModal({
  track,
  materials,
  completedMaterialIds,
  onClose,
  onOpenMaterial,
  onOpenTest
}: TrackModalProps) {
  if (!track) {
    return null;
  }

  const orderedMaterials = track.materialIds
    .map((id) => materials.find((material) => material.id === id))
    .filter((material): material is Material => Boolean(material));
  const completedCount = orderedMaterials.filter((material) =>
    completedMaterialIds.has(material.id)
  ).length;
  const isTrackCompleted =
    orderedMaterials.length > 0 && completedCount === orderedMaterials.length;

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
            {orderedMaterials.map((material, index) => {
              const isCompleted = completedMaterialIds.has(material.id);

              return (
                <button
                  key={material.id}
                  type="button"
                  onClick={() => onOpenMaterial(material)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition hover:border-[#ea6a00]/30 hover:bg-orange-50 ${
                    isCompleted
                      ? "border-emerald-100 bg-emerald-50/50 opacity-75 saturate-50"
                      : "border-slate-200 bg-white"
                  }`}
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
                  {isCompleted ? (
                    <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      <CheckCircle2 size={14} />
                      Изучено
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-400">{shareUrl}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Завершено материалов: {completedCount} из {orderedMaterials.length}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {track.testUrl ? (
              <button
                type="button"
                onClick={() => onOpenTest?.(track.testUrl ?? "")}
                disabled={!isTrackCompleted}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isTrackCompleted
                    ? "bg-[#ea6a00] text-white hover:bg-[#d85f00]"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                {isTrackCompleted ? (
                  <ExternalLink size={16} />
                ) : (
                  <LockKeyhole size={16} />
                )}
                Перейти к тестированию
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(shareUrl)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#ea6a00]/30 hover:bg-orange-50 hover:text-[#ea6a00]"
            >
              <ExternalLink size={16} />
              Скопировать ссылку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
