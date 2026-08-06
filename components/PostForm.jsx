"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

export default function PostForm({ profile, onSaveProfile, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "labor", city: "",
    salary: "", certRequired: false,
  });
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const valid = form.title.trim() && form.description.trim() && form.city.trim() && phone.trim();

  const submit = async () => {
    if (!valid) { setError("عبي العنوان والوصف والمدينة ورقم التواصل"); return; }
    setError("");
    setSaving(true);
    try {
      onSaveProfile({ name: name.trim(), phone: phone.trim() });
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        city: form.city.trim(),
        salary: form.salary.trim(),
        posterName: name.trim() || "صاحب العمل",
        posterPhone: phone.trim(),
      });
    } catch (e) {
      setError("تعذر نشر الوظيفة، تأكد من الاتصال بالإنترنت وحاول مرة أخرى");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(14,59,77,0.45)" }}>
      <div className="w-full max-w-md rounded-t-3xl p-5 max-h-[92vh] overflow-y-auto bg-nile-paper">
        <div className="flex items-center justify-between mb-4">
          <p className="font-brand text-lg font-extrabold">نشر وظيفة جديدة</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="عنوان الوظيفة">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="مثال: سائق تاكسي بخبرة" className="input" />
          </Field>

          <Field label="الفئة">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border"
                  style={{
                    background: form.category === c.id ? c.color : "#fff",
                    color: form.category === c.id ? "#fff" : "#1C1B18",
                    borderColor: form.category === c.id ? c.color : "#DED4BE",
                  }}
                >
                  <c.icon size={13} />{c.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="الوصف">
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="اشرح طبيعة الشغل والشروط" className="input resize-none" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="المدينة">
              <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="الخرطوم" className="input" />
            </Field>
            <Field label="الراتب (اختياري)">
              <input value={form.salary} onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))} placeholder="مثال: 150 ألف" className="input" />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm py-1">
            <input type="checkbox" checked={form.certRequired} onChange={(e) => setForm((f) => ({ ...f, certRequired: e.target.checked }))} />
            الوظيفة تتطلب شهادة
          </label>

          <div className="h-px my-1 bg-line" />
          <p className="text-xs font-bold text-muted">بيانات التواصل (تظهر للباحثين عن عمل)</p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="اسمك">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" className="input" />
            </Field>
            <Field label="رقم الهاتف/واتساب">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" className="input" />
            </Field>
          </div>

          {error && <p className="text-sm font-bold text-clay">{error}</p>}

          <button
            onClick={submit}
            disabled={saving}
            className="mt-2 rounded-2xl py-3 font-bold text-white flex items-center justify-center gap-2 bg-nile-deep disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : null}
            نشر الوظيفة
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-muted">{label}</span>
      {children}
    </div>
  );
}
