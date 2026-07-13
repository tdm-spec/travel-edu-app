"use client";

import { ExternalLink, X } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { Material } from "@/types/material";

type ContentModalProps = {
  material: Material | null;
  onClose: () => void;
};

export function ContentModal({ material, onClose }: ContentModalProps) {
  if (!material) {
    return null;
  }

  const previewUrl =
    material.type === "video"
      ? getYouTubeEmbedUrl(material.url)
      : `https://docs.google.com/viewer?url=${encodeURIComponent(
          material.url
        )}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div className="min-w-0">
            <p className="mb-1 text-sm font-medium text-blue-600">
              {material.format}
            </p>
            <h2 className="text-xl font-semibold leading-tight text-slate-950">
              {material.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {material.description}
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

        <div className="bg-slate-100 p-3 sm:p-5">
          <div className="aspect-video overflow-hidden rounded-xl bg-white shadow-sm">
            <iframe
              src={previewUrl}
              title={material.title}
              className="h-full w-full"
              allow={
                material.type === "video"
                  ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  : undefined
              }
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
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
          <a
            href={material.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <ExternalLink size={16} />
            Открыть источник
          </a>
        </div>
      </div>
    </div>
  );
}
