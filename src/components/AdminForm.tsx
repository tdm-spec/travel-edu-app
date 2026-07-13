"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { Lock, LogIn, LogOut, PlusCircle } from "lucide-react";
import {
  ADMIN_EMAIL,
  auth,
  db,
  googleProvider,
  isFirebaseConfigured
} from "@/lib/firebase";
import type { MaterialType } from "@/types/material";

type AdminFormProps = {
  user: User | null;
};

const initialForm = {
  title: "",
  description: "",
  type: "video" as MaterialType,
  url: "",
  category: "",
  format: "Вебинар",
  authorName: "",
  authorAvatar: "",
  duration: 30
};

export function AdminForm({ user }: AdminFormProps) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const isAdmin = user?.email === ADMIN_EMAIL;

  async function handleLogin() {
    if (!auth) {
      setMessage("Добавьте Firebase переменные окружения для входа.");
      return;
    }

    setMessage("");
    await signInWithPopup(auth, googleProvider);
  }

  async function handleLogout() {
    if (!auth) {
      return;
    }

    setMessage("");
    await signOut(auth);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin || !db) {
      setMessage("Доступ разрешен только администратору.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await addDoc(collection(db, "materials"), {
        title: form.title,
        description: form.description,
        type: form.type,
        url: form.url,
        category: form.category
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        format: form.format,
        author: {
          name: form.authorName,
          avatar: form.authorAvatar
        },
        duration: Number(form.duration),
        createdAt: serverTimestamp()
      });

      setForm(initialForm);
      setMessage("Материал добавлен в Firestore.");
    } catch {
      setMessage("Не удалось сохранить материал. Проверьте Firebase config.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <Lock size={14} />
            Админ-панель
          </div>
          <h2 className="text-xl font-semibold text-slate-950">
            Добавить материал
          </h2>
        </div>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut size={16} />
            Выйти
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <LogIn size={16} />
            Войти через Google
          </button>
        )}
      </div>

      {!user ? (
        <p className="text-sm leading-6 text-slate-500">
          {isFirebaseConfigured
            ? "Форма откроется после входа в аккаунт администратора."
            : "Для входа и сохранения материалов добавьте Firebase переменные окружения."}
        </p>
      ) : !isAdmin ? (
        <p className="text-sm leading-6 text-slate-500">
          Аккаунт {user.email} не совпадает с ADMIN_EMAIL.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Title"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
            required
          />
          <TextField
            label="URL"
            value={form.url}
            onChange={(value) => setForm({ ...form, url: value })}
            required
          />
          <label className="text-sm font-medium text-slate-700">
            Type
            <select
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value as MaterialType })
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="video">video</option>
              <option value="file">file</option>
            </select>
          </label>
          <TextField
            label="Format"
            value={form.format}
            onChange={(value) => setForm({ ...form, format: value })}
            required
          />
          <TextField
            label="Category"
            value={form.category}
            placeholder="Маркетинг, Продажи"
            onChange={(value) => setForm({ ...form, category: value })}
            required
          />
          <TextField
            label="Duration"
            type="number"
            value={String(form.duration)}
            onChange={(value) => setForm({ ...form, duration: Number(value) })}
            required
          />
          <TextField
            label="Author name"
            value={form.authorName}
            onChange={(value) => setForm({ ...form, authorName: value })}
            required
          />
          <TextField
            label="Author avatar"
            value={form.authorAvatar}
            onChange={(value) => setForm({ ...form, authorAvatar: value })}
            required
          />
          <label className="md:col-span-2 text-sm font-medium text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              required
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusCircle size={16} />
              {isSubmitting ? "Сохранение..." : "Добавить"}
            </button>
            {message ? (
              <p className="text-sm font-medium text-slate-500">{message}</p>
            ) : null}
          </div>
        </form>
      )}
    </section>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required
}: TextFieldProps) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
