import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface ICoverLetter {
  id?: number;
  text: string;
}

export interface IQuestion {
  id?: number;
  question: string;
  answer: string;
}

export interface IUser {
  id?: number;
  name: string;
  jobTitle: string;
  yearsOfExperience: string;
  skills: string;
}

interface MyDB extends DBSchema {
  coverLetter: {
    key: number;
    value: ICoverLetter;
  };
  questions: {
    key: number;
    value: IQuestion;
  };
  users: {
    key: number;
    value: IUser;
  };
}

const DB_NAME = "upworkHelperDB";
const USER_STORE_NAME = "users";
const CL_STORE_NAME = "coverLetter";
const QUESTIONS_STORE_NAME = "questions";

export async function initDB() {
  const db = await openDB<MyDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CL_STORE_NAME)) {
        db.createObjectStore(CL_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains(QUESTIONS_STORE_NAME)) {
        db.createObjectStore(QUESTIONS_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
      }
    },
  });
  return db;
}

export async function addCoverLetter(
  coverLetter: ICoverLetter,
  db: IDBPDatabase<MyDB>
) {
  const tx = db.transaction(CL_STORE_NAME, "readwrite");
  const store = tx.objectStore(CL_STORE_NAME);
  await store.add(coverLetter);
  await tx.done;
}

export async function getCoverLetter(db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(CL_STORE_NAME, "readonly");
  const store = tx.objectStore(CL_STORE_NAME);
  return store.getAll();
}

export async function updateCoverLetter(
  coverLetter: ICoverLetter,
  db: IDBPDatabase<MyDB>
) {
  const tx = db.transaction(CL_STORE_NAME, "readwrite");
  const store = tx.objectStore(CL_STORE_NAME);
  await store.put(coverLetter);
  await tx.done;
}

export async function deleteCoverLetter(id: number, db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(CL_STORE_NAME, "readwrite");
  const store = tx.objectStore(CL_STORE_NAME);
  await store.delete(id);
  await tx.done;
}

export async function addQuestion(question: IQuestion, db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(QUESTIONS_STORE_NAME, "readwrite");
  const store = tx.objectStore(QUESTIONS_STORE_NAME);
  await store.add(question);
  await tx.done;
}

export async function getQuestions(db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(QUESTIONS_STORE_NAME, "readonly");
  const store = tx.objectStore(QUESTIONS_STORE_NAME);
  return store.getAll();
}

export async function updateQuestion(
  question: IQuestion,
  db: IDBPDatabase<MyDB>
) {
  const tx = db.transaction(QUESTIONS_STORE_NAME, "readwrite");
  const store = tx.objectStore(QUESTIONS_STORE_NAME);
  await store.put(question);
  await tx.done;
}

export async function deleteQuestion(id: number, db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(QUESTIONS_STORE_NAME, "readwrite");
  const store = tx.objectStore(QUESTIONS_STORE_NAME);
  await store.delete(id);
  await tx.done;
}

export async function addUser(user: IUser, db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(USER_STORE_NAME, "readwrite");
  const store = tx.objectStore(USER_STORE_NAME);
  const id = await store.add(user);
  await tx.done;
  return id;
}

export async function getUser(db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(USER_STORE_NAME, "readonly");
  const store = tx.objectStore(USER_STORE_NAME);
  return store.getAll();
}

export async function updateUser(user: IUser, db: IDBPDatabase<MyDB>) {
  const tx = db.transaction(USER_STORE_NAME, "readwrite");
  const store = tx.objectStore(USER_STORE_NAME);
  await store.put(user);
  await tx.done;
}
