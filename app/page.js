"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Plus, Loader2 } from "lucide-react";
import { CATEGORIES, loadProfile, saveProfile as persistProfile } from "@/lib/utils";
import { listenJobs, addJob } from "@/lib/jobs";
import Chip from "@/components/Chip";
import JobCard from "@/components/JobCard";
import PostForm from "@/components/PostForm";
import JobDetail from "@/components/JobDetail";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [filters, setFilters] = useState({ category: "all", city: "", cert: "all", q: "" });
  const [showPost, setShowPost] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setProfile(loadProfile());
    const unsub = listenJobs(
      (list) => { setJobs(list); setLoadingJobs(false); },
      () => { setLoadError(true); setLoadingJobs(false); }
    );
    return () => unsub && unsub();
  }, []);

  const flash = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const saveProfile = (p) => {
    setProfile(p);
    persistProfile(p);
  };

  const handleAddJob = async (job) => {
    await addJob(job);
    flash("تم نشر الوظيفة");
    setShowPost(false);
  };

  const filtered = jobs.filter((j) => {
    if (filters.category !== "all" && j.category !== filters.category) return false;
    if (filters.city.trim() && !j.city.includes(filters.city.trim())) return false;
    if (filters.cert === "yes" && !j.certRequired) return false;
    if (filters.cert === "no" && j.certRequired) return false;
    if (filters.q.trim()) {
      const q = filters.q.trim();
      if (!j.title.includes(q) && !j.description.includes(q)) return false;
    }
    return true;
  });

  const selectedJob = jobs.find((j) => j.id === selectedId) || null;

  return (
    <main className="min-h-screen w-full">
      {/* HERO */}
      <div className="relative overflow-hidden bg-nile-deep">
        <div className="blob1 absolute -top-16 -right-10 w-72 h-72 rounded-full opacity-70" style={{ background: "radial-gradient(circle, #1F6F8B 0%, transparent 70%)", filter: "blur(10px)" }} />
        <div className="blob2 absolute -bottom-20 -left-10 w-72 h-72 rounded-full opacity-60" style={{ background: "radial-gradient(circle, #EDE6D6 0%, transparent 70%)", filter: "blur(14px)" }} />
        <div className="relative px-5 pt-8 pb-6">
          <p className="font-brand text-2xl font-extrabold text-nile-paper">ملتقى</p>
          <p className="text-sm mt-1 text-nile-sand opacity-85">وين الشغل يلقى صاحبه — منصة وظائف السودان</p>

          <div className="mt-5 flex items-center gap-2 rounded-2xl px-3 py-2.5 bg-nile-paper">
            <Search size={18} className="text-muted" />
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="ابحث عن وظيفة..."
              className="w-full bg-transparent outline-none text-sm text-ink"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="px-5 pt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={filters.category === "all"} label="الكل" onClick={() => setFilters((f) => ({ ...f, category: "all" }))} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            active={filters.category === c.id}
            label={c.label}
            color={c.color}
            icon={c.icon}
            onClick={() => setFilters((f) => ({ ...f, category: c.id }))}
          />
        ))}
      </div>

      {/* SECONDARY FILTERS */}
      <div className="px-5 pt-3 flex gap-2">
        <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 flex-1 bg-white border" style={{ borderColor: "#DED4BE" }}>
          <MapPin size={15} className="text-muted" />
          <input
            value={filters.city}
            onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
            placeholder="المدينة"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        <select
          value={filters.cert}
          onChange={(e) => setFilters((f) => ({ ...f, cert: e.target.value }))}
          className="rounded-xl px-2 text-sm bg-white border"
          style={{ borderColor: "#DED4BE" }}
        >
          <option value="all">الشهادة: الكل</option>
          <option value="no">بدون شهادة</option>
          <option value="yes">تتطلب شهادة</option>
        </select>
      </div>

      {/* LIST */}
      <div className="px-5 pt-4 pb-28">
        {loadingJobs ? (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : loadError ? (
          <div className="text-center py-16 rounded-2xl border border-dashed" style={{ borderColor: "#DED4BE" }}>
            <p className="font-bold mb-1">تعذر تحميل الوظائف</p>
            <p className="text-sm text-muted">تأكد من الاتصال بالإنترنت وإعدادات Firebase في .env.local</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed" style={{ borderColor: "#DED4BE" }}>
            <p className="font-bold mb-1">ما في وظائف حالياً</p>
            <p className="text-sm text-muted">كن أول من ينشر فرصة عمل</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((j) => (
              <JobCard key={j.id} job={j} onClick={() => setSelectedId(j.id)} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowPost(true)}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full px-6 py-3.5 flex items-center gap-2 font-bold shadow-lg text-white bg-clay"
      >
        <Plus size={18} /> انشر وظيفة
      </button>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-sm text-white z-50 bg-nile-deep">
          {toast}
        </div>
      )}

      {showPost && (
        <PostForm
          profile={profile}
          onSaveProfile={saveProfile}
          onClose={() => setShowPost(false)}
          onSubmit={handleAddJob}
        />
      )}

      {selectedJob && (
        <JobDetail
          job={selectedJob}
          profile={profile}
          onSaveProfile={saveProfile}
          onClose={() => setSelectedId(null)}
          flash={flash}
        />
      )}
    </main>
  );
}
