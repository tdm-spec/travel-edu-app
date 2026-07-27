"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { CircleHelp, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import AnimatedTravelHero from "@/components/AnimatedTravelHero";
import { loginToFirebaseEmail } from "@/lib/access";
import { auth } from "@/lib/firebase";

export function UserLogin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) {
      setMessage("Сервис входа временно недоступен.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const email = await loginToFirebaseEmail(login);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setMessage("Не удалось войти. Проверьте логин и код доступа.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-white [font-family:'Lato',Arial,sans-serif] md:grid-cols-[minmax(0,1.15fr)_minmax(27rem,0.85fr)]">
      <section className="relative hidden h-screen min-h-screen overflow-hidden md:block">
        <AnimatedTravelHero />
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-[25rem]">
          <Image
            src="/psn-logo.svg"
            alt="Поехали с нами"
            width={2108}
            height={871}
            priority
            className="mx-auto mb-6 h-16 w-auto object-contain sm:h-[4.5rem]"
          />

          <div className="text-center">
            <h1 className="text-xl font-bold text-[#0b182f]">PSN HUB</h1>
            <p className="mt-1 text-[11px] font-light uppercase leading-5 tracking-[0.2em] text-[#6B7280]">
              Центр экспертных знаний и профессионального развития
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            <label className="relative block border-b-2 border-[#E5E7EB] transition-all duration-300 focus-within:border-[#F26522] focus-within:shadow-[0_7px_10px_-9px_rgba(242,101,34,0.9)]">
              <span className="sr-only">Логин CRM или почта администратора</span>
              <input
                type="text"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                placeholder="Логин CRM"
                autoComplete="username"
                required
                aria-describedby="login-help"
                className="w-full bg-transparent py-3 pl-0 pr-11 text-base text-[#0b182f] caret-[#F26522] outline-none placeholder:text-gray-400"
              />

              <span
                tabIndex={0}
                aria-label="Подсказка для поля логина"
                className="group absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-help items-center justify-center text-slate-400 outline-none transition hover:text-[#F26522] focus-visible:text-[#F26522]"
              >
                <CircleHelp size={18} aria-hidden="true" />
                <span
                  id="login-help"
                  role="tooltip"
                  className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] right-0 z-20 w-72 rounded-md bg-[#0b182f] px-3 py-2 text-left text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100"
                >
                  Пользователь вводит CRM-логин или ФИО, если логин в CRM пустой.
                  Администратор вводит почту администратора.
                </span>
              </span>
            </label>

            <label className="relative block border-b-2 border-[#E5E7EB] transition-all duration-300 focus-within:border-[#F26522] focus-within:shadow-[0_7px_10px_-9px_rgba(242,101,34,0.9)]">
              <span className="sr-only">Код доступа или пароль администратора</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Код"
                autoComplete="current-password"
                required
                className="w-full bg-transparent py-3 pl-0 pr-12 text-base text-[#0b182f] caret-[#F26522] outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Скрыть код" : "Показать код"}
                className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-[#0b182f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            {message ? (
              <p
                role="alert"
                className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#F26522] px-6 py-4 text-base font-bold text-white transition-colors duration-200 hover:bg-[#dc5518] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
