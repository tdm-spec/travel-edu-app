"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { BookOpen, GraduationCap, Menu, Search } from "lucide-react";
import { AdminForm } from "@/components/AdminForm";
import { ContentModal } from "@/components/ContentModal";
import {
  FilterSidebar,
  filterMaterials
} from "@/components/FilterSidebar";
import { MaterialCard } from "@/components/MaterialCard";
import { auth, db } from "@/lib/firebase";
import { demoMaterials, filterOptions } from "@/lib/materials";
import type { ContentTab, FilterState, Material } from "@/types/material";

export const runtime = "edge";

const emptyFilters: FilterState = {
  topics: [],
  formats: [],
  durations: []
};

const tabs: Array<{ id: ContentTab; label: string; icon: typeof GraduationCap }> =
  [
    {
      id: "webinars",
      label: "Библиотека вебинаров",
      icon: GraduationCap
    },
    {
      id: "knowledge",
      label: "База знаний",
      icon: BookOpen
    }
  ];

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>(demoMaterials);
  const [activeTab, setActiveTab] = useState<ContentTab>("webinars");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!db) {
      return;
    }

    const materialsQuery = query(
      collection(db, "materials"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(materialsQuery, (snapshot) => {
      const firestoreMaterials = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt =
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date();

        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          url: data.url,
          category: data.category ?? [],
          format: data.format,
          author: data.author,
          duration: data.duration,
          createdAt,
          tab: data.type === "video" ? "webinars" : "knowledge"
        } as Material;
      });

      setMaterials(
        firestoreMaterials.length > 0 ? firestoreMaterials : demoMaterials
      );
    });
  }, []);

  const visibleMaterials = useMemo(() => {
    const tabMaterials = materials.filter((material) => material.tab === activeTab);
    const filteredMaterials = filterMaterials(tabMaterials, filters);
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return filteredMaterials;
    }

    return filteredMaterials.filter((material) => {
      const searchable = [
        material.title,
        material.description,
        material.author.name,
        material.format,
        ...material.category
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [activeTab, filters, materials, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 rounded-xl bg-white px-5 py-6 shadow-sm ring-1 ring-slate-200/70 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                Поехали с нами
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Travel-EDU
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                Вебинары, чек-листы и документы для развития туристического
                продукта, продаж и клиентского сервиса.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск материалов"
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200/70">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/70 lg:hidden"
          >
            <Menu size={17} />
            Фильтры
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <FilterSidebar
            filters={filters}
            options={filterOptions}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onChange={setFilters}
            onReset={() => setFilters(emptyFilters)}
          />

          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Найдено: {visibleMaterials.length}
              </p>
            </div>

            {visibleMaterials.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleMaterials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    onOpen={setSelectedMaterial}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/70">
                <h2 className="text-lg font-semibold text-slate-950">
                  Материалы не найдены
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Попробуйте изменить фильтры или поисковый запрос.
                </p>
              </div>
            )}

            <AdminForm user={user} />
          </section>
        </div>
      </div>

      <ContentModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
    </main>
  );
}
