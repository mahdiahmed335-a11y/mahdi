"use client";

export default function Chip({ active, label, onClick, color, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap border"
      style={{
        background: active ? (color || "#0E3B4D") : "#fff",
        color: active ? "#fff" : "#1C1B18",
        borderColor: active ? (color || "#0E3B4D") : "#DED4BE",
      }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}
