import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const inputPath = process.argv[2];
const archiveMissing = process.argv.includes("--archive-missing");
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const weeklyAccessCode = process.env.TRAVEL_EDU_WEEKLY_CODE ?? "";

if (!inputPath || !serviceAccountPath || weeklyAccessCode.length < 12) {
  console.error(
    "Set GOOGLE_APPLICATION_CREDENTIALS and TRAVEL_EDU_WEEKLY_CODE (12+ characters), then run the sync script."
  );
  process.exit(1);
}

const normalizeLogin = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const loginToEmail = (login) => {
  const hash = createHash("sha256").update(normalizeLogin(login)).digest("hex");
  return `login-${hash}@users.travel-edu.invalid`;
};

function parseDelimited(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = [";", "\t", ","].sort(
    (a, b) => firstLine.split(b).length - firstLine.split(a).length
  )[0];
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return normalizeLogin(value).replace(/[ _-]+/g, "");
}

function getValue(record, aliases) {
  for (const alias of aliases) {
    const value = record[normalizeHeader(alias)];
    if (value !== undefined && String(value).trim()) return String(value).trim();
  }
  return "";
}

function parseActive(value) {
  const normalized = normalizeLogin(value);
  return !["0", "нет", "false", "архив", "уволен", "заблокирован"].includes(
    normalized
  );
}

const serviceAccount = JSON.parse(await readFile(serviceAccountPath, "utf8"));
initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const db = getFirestore();
const text = await readFile(inputPath, "utf8");
const rows = parseDelimited(text.replace(/^\uFEFF/, ""));
const headers = (rows.shift() ?? []).map(normalizeHeader);
const records = rows.map((values) =>
  Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
);
const importedIds = new Set();
let created = 0;
let updated = 0;
let skipped = 0;
let batch = db.batch();
let pendingWrites = 0;

async function flushBatch() {
  if (!pendingWrites) return;
  await batch.commit();
  batch = db.batch();
  pendingWrites = 0;
}

for (const [index, record] of records.entries()) {
  const crmId = getValue(record, ["id", "crm id", "user id", "ид", "код"]);
  const login = getValue(record, ["login", "username", "логин"]);
  const displayName = getValue(record, ["display name", "name", "фио", "имя"]);
  const email = getValue(record, ["email", "e-mail", "почта"]);
  const phone = getValue(record, ["phone", "телефон"]);
  const active = parseActive(getValue(record, ["active", "status", "активен", "статус"]));

  if (!crmId || crmId.length > 128 || !login) {
    skipped += 1;
    console.warn(`Строка ${index + 2} пропущена: проверьте ID и логин.`);
    continue;
  }

  const authEmail = loginToEmail(login);
  const userPayload = {
    email: authEmail,
    password: weeklyAccessCode,
    displayName: displayName || login,
    disabled: !active
  };
  let isNewUser = false;

  try {
    await auth.getUser(crmId);
    await auth.updateUser(crmId, userPayload);
    updated += 1;
  } catch (error) {
    if (error?.code !== "auth/user-not-found") throw error;
    await auth.createUser({ uid: crmId, ...userPayload });
    created += 1;
    isNewUser = true;
  }

  importedIds.add(crmId);
  const userRef = db.collection("accessUsers").doc(crmId);
  batch.set(
    userRef,
    {
      login,
      normalizedLogin: normalizeLogin(login),
      displayName: displayName || login,
      email,
      phone,
      active,
      archived: !active,
      passwordResetRequested: false,
      updatedAt: FieldValue.serverTimestamp(),
      ...(isNewUser
        ? { role: "user", createdAt: FieldValue.serverTimestamp() }
        : {})
    },
    { merge: true }
  );
  pendingWrites += 1;

  if (pendingWrites >= 400) await flushBatch();
}

await flushBatch();

if (archiveMissing) {
  const snapshot = await db.collection("accessUsers").get();
  let archiveBatch = db.batch();
  let archiveWrites = 0;

  for (const userDoc of snapshot.docs) {
    if (importedIds.has(userDoc.id)) continue;
    archiveBatch.update(userDoc.ref, {
      active: false,
      archived: true,
      updatedAt: FieldValue.serverTimestamp()
    });
    archiveWrites += 1;

    if (archiveWrites >= 400) {
      await archiveBatch.commit();
      archiveBatch = db.batch();
      archiveWrites = 0;
    }
  }

  if (archiveWrites) await archiveBatch.commit();
}

console.log(
  `Синхронизация завершена. Создано: ${created}, обновлено: ${updated}, пропущено: ${skipped}.`
);
