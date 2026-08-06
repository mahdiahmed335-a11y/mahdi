import { Car, HardHat, Cog, Stethoscope, Briefcase } from "lucide-react";

export const CATEGORIES = [
  { id: "taxi", label: "تاكسي وسائقين", icon: Car, color: "#1F6F8B" },
  { id: "labor", label: "عمال", icon: HardHat, color: "#C1652F" },
  { id: "engineer", label: "مهندسين", icon: Cog, color: "#5B7B4F" },
  { id: "doctor", label: "دكاترة", icon: Stethoscope, color: "#6B4C8A" },
  { id: "other", label: "أخرى", icon: Briefcase, color: "#7A6A55" },
];

export function catById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[4];
}

export function cleanPhone(raw) {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "249" + d.slice(1);
  if (!d.startsWith("249") && d.length === 9) d = "249" + d;
  return d;
}

export function timeAgo(ts) {
  if (!ts) return "الآن";
  const millis = typeof ts === "object" && ts.toMillis ? ts.toMillis() : ts;
  const s = Math.floor((Date.now() - millis) / 1000);
  if (s < 60) return "الآن";
  const m = Math.floor(s / 60);
  if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} س`;
  const d = Math.floor(h / 24);
  return `منذ ${d} يوم`;
}

const PROFILE_KEY = "multaqa_profile";

export function loadProfile() {
  if (typeof window === "undefined") return { name: "", phone: "" };
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : { name: "", phone: "" };
  } catch {
    return { name: "", phone: "" };
  }
}

export function saveProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}
