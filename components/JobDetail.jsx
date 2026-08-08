"use client";

import { useState, useEffect } from "react";
import {
  X, MapPin, GraduationCap, User, MessageCircle, Phone,
  Send, Loader2, Trash2,
} from "lucide-react";
import { catById, cleanPhone, timeAgo } from "@/lib/utils";
import { listenMessages, sendMessage, deleteJob } from "@/lib/jobs";

export default function JobDetail({ job, profile, onSaveProfile, onClose, flash }) {
  const cat = catById(job.category);
  const Icon = cat.icon;
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [text, setText] = useState("");
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [sending, setSending] = useState(false);
  const isOwner = profile.phone && cleanPhone(profile.phone) === cleanPhone(job.posterPhone);

  useEffect(() => {
    const unsub = listenMessages(
      job.id,
      (msgs) => {
        const sorted = [...msgs].sort((a, b) => {
          const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
          const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
          return ta - tb;
        });
        setMessages(sorted);
        setLoadingMsgs(false);
      },
      () => setLoadingMsgs(false)
    );
    return () => unsub && unsub();
  }, [job.id]);

  const send = async () => {
    if (!text.trim()) return;
    if (!phone.trim()) { flash("عبي رقمك عشان يقدر يرد عليك"); return; }
    setSending(true);
    try {
      onSaveProfile({ name: name.trim(), phone: phone.trim() });
      await sendMessage(job.id, { sender: name.trim() || "مستخدم", phone: phone.trim(), text: text.trim() });
      setText("");
    } catch {
      flash("تعذر إرسال الرسالة");
    }
    setSending(false);
  };

  const remove = async () => {
    try {
      await deleteJob(job.id);
      flash("تم حذف الوظيفة");
      onClose();
    } catch {
      flash("تعذر الحذف");
    }
  };

  const waLink = `https://wa.me/${cleanPhone(job.posterPhone)}?text=${encodeURIComponent("السلام عليكم، شفت إعلان (" + job.title + ") على ملتقى")}`;
  const telLink = `tel:${cleanPhone(job.posterPhone)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(14,59,77,0.45)" }}>
      <div className="w-full max-w-md rounded-t-3xl max-h-[94vh] overflow-y-auto bg-nile-paper">
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between">
            <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cat.color + "22" }}>
              <Icon size={18} style={{ color: cat.color }} />
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
              <X size={16} />
            </button>
          </div>
          <p className="font-brand text-lg font-extrabold mt-3">{job.title}</p>
          <div className="flex items-center gap-3 text-xs mt-1 flex-wrap text-muted">
            <span className="flex items-center gap-1"><MapPin size={12} />{job.city}</span>
            {job.salary && <span className="font-bold text-nile-deep">{job.salary}</span>}
            <span className="flex items-center gap-1"><GraduationCap size={12} />{job.certRequired ? "تتطلب شهادة" : "بدون شهادة"}</span>
          </div>
          <p className="text-sm mt-3 leading-relaxed">{job.description}</p>
          <p className="text-xs mt-3 flex items-center gap-1 text-muted">
            <User size={12} /> نشرها {job.posterName} · {timeAgo(job.createdAt)}
          </p>

          <div className="flex gap-2 mt-4">
            <a href={waLink} target="_blank" rel="noreferrer" className="flex-1 rounded-2xl py-2.5 flex items-center justify-center gap-1.5 text-sm font-bold text-white" style={{ background: "#3F7A52" }}>
              <MessageCircle size={15} /> واتساب
            </a>
            <a href={telLink} className="flex-1 rounded-2xl py-2.5 flex items-center justify-center gap-1.5 text-sm font-bold bg-white border" style={{ borderColor: "#DED4BE" }}>
              <Phone size={15} /> اتصال
            </a>
          </div>

          {isOwner && (
            <button onClick={remove} className="w-full mt-2 rounded-2xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 text-clay">
              <Trash2 size={13} /> حذف الإعلان
            </button>
          )}
        </div>

        <div className="h-px bg-line" />

        <div className="p-5">
          <p className="text-sm font-bold mb-3">رسائل داخل المنصة</p>
          {loadingMsgs ? (
            <div className="flex justify-center py-6 text-muted"><Loader2 className="animate-spin" size={18} /></div>
          ) : messages.length === 0 ? (
            <p className="text-xs py-3 text-muted">ما في رسائل بعد. اكتب أول رسالة.</p>
          ) : (
            <div className="flex flex-col gap-2 mb-3">
              {messages.map((m) => (
                <div key={m.id} className="rounded-2xl px-3 py-2 bg-white border" style={{ borderColor: "#DED4BE" }}>
                  <div className="flex items-center justify-between text-xs mb-1 text-muted">
                    <span className="font-bold text-ink">{m.sender}</span>
                    <span>{timeAgo(m.createdAt)}</span>
                  </div>
                  <p className="text-sm">{m.text}</p>
                </div>
              ))}
            </div>
          )}

          {!profile.phone && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" className="input" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقمك" className="input" />
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="input flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            />
            <button onClick={send} disabled={sending} className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 bg-nile-deep disabled:opacity-70">
              {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
بعد ما تحفظ الملفين، ارفعهم:
git add .
git commit -m "fix messages query missing composite index"
git push origin main