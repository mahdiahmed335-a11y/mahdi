"use client";

import { MapPin, GraduationCap, ChevronLeft } from "lucide-react";
import { catById, timeAgo } from "@/lib/utils";

export default function JobCard({ job, onClick }) {
  const cat = catById(job.category);
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      className="text-right rounded-2xl p-4 flex flex-col gap-2 bg-white border w-full"
      style={{ borderColor: "#DED4BE", borderInlineStart: `4px solid ${cat.color}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: cat.color + "22" }}>
            <Icon size={16} style={{ color: cat.color }} />
          </span>
          <span className="font-bold text-[15px] leading-snug">{job.title}</span>
        </div>
        <ChevronLeft size={18} className="text-muted shrink-0" />
      </div>
      <p className="text-sm line-clamp-2 text-muted">{job.description}</p>
      <div className="flex items-center gap-3 text-xs mt-1 flex-wrap text-muted">
        <span className="flex items-center gap-1"><MapPin size={12} />{job.city}</span>
        {job.salary && <span className="font-bold text-nile-deep">{job.salary}</span>}
        {job.certRequired ? (
          <span className="flex items-center gap-1"><GraduationCap size={12} />تتطلب شهادة</span>
        ) : (
          <span>بدون شهادة</span>
        )}
        <span className="mr-auto">{timeAgo(job.createdAt)}</span>
      </div>
    </button>
  );
}
