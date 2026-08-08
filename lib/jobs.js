"use client";

import { db } from "./firebase";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  orderBy, query, where, serverTimestamp,
} from "firebase/firestore";

const jobsCol = collection(db, "jobs");
const messagesCol = collection(db, "messages");

export function listenJobs(callback, onError) {
  const q = query(jobsCol, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(jobs);
    },
    (err) => onError && onError(err)
  );
}

export async function addJob(job) {
  return addDoc(jobsCol, { ...job, createdAt: serverTimestamp() });
}

export async function deleteJob(id) {
  return deleteDoc(doc(db, "jobs", id));
}

export function listenMessages(jobId, callback, onError) {
  const q = query(messagesCol, where("jobId", "==", jobId));
  return onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(messages);
    },
    (err) => onError && onError(err)
  );
}

export async function sendMessage(jobId, message) {
  return addDoc(messagesCol, { ...message, jobId, createdAt: serverTimestamp() });
}