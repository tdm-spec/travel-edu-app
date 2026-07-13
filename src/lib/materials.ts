import type { Material } from "@/types/material";

export const demoMaterials: Material[] = [
  {
    id: "1",
    title: "Как продавать туры через экспертный контент",
    description:
      "Практический вебинар о прогреве аудитории, доверии и упаковке туристического предложения.",
    type: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: ["Маркетинг", "Продажи"],
    format: "Вебинар",
    author: {
      name: "Анна Литвинова",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    duration: 42,
    createdAt: new Date("2026-06-12"),
    tab: "webinars"
  },
  {
    id: "2",
    title: "Чек-лист запуска группового тура",
    description:
      "Документ для проверки маршрута, партнеров, стоимости и коммуникации с туристами.",
    type: "file",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    category: ["Продукт", "Операции"],
    format: "PDF",
    author: {
      name: "Игорь Соколов",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    duration: 15,
    createdAt: new Date("2026-06-20"),
    tab: "knowledge"
  },
  {
    id: "3",
    title: "Скрипты переписки с клиентами",
    description:
      "Готовые формулировки для первичного контакта, возражений и повторных продаж.",
    type: "file",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    category: ["Продажи", "Сервис"],
    format: "Документ",
    author: {
      name: "Мария Орлова",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9"
    },
    duration: 8,
    createdAt: new Date("2026-05-28"),
    tab: "knowledge"
  },
  {
    id: "4",
    title: "Юнит-экономика авторского тура",
    description:
      "Разбор маржинальности, комиссий, сезонности и точки безубыточности.",
    type: "video",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    category: ["Финансы", "Продукт"],
    format: "Вебинар",
    author: {
      name: "Денис Кравцов",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
    },
    duration: 56,
    createdAt: new Date("2026-04-18"),
    tab: "webinars"
  }
];

export const filterOptions = {
  topics: ["Маркетинг", "Продажи", "Продукт", "Операции", "Сервис", "Финансы"],
  formats: ["Вебинар", "PDF", "Документ"],
  durations: ["До 15 минут", "15-45 минут", "45+ минут"]
};

export function getDurationBucket(duration: number) {
  if (duration < 15) {
    return "До 15 минут";
  }

  if (duration <= 45) {
    return "15-45 минут";
  }

  return "45+ минут";
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}
