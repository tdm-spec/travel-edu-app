import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Не задан путь GOOGLE_APPLICATION_CREDENTIALS.");
  process.exit(1);
}

const app = initializeApp({ credential: applicationDefault() });
await getAuth(app).listUsers(1);

console.log("Соединение с Firebase Admin установлено.");
console.log("Доступ к Firebase Authentication подтвержден.");
