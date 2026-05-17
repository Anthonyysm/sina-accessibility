"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { MdClose } from "react-icons/md";

interface TagInputProps {
  label: string;
  icon: React.ElementType;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

export default function TagInput({ label, icon: Icon, tags, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag() {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-[#3a5070] flex items-center gap-1.5">
        <Icon className="text-sm" />{label}
      </Label>
      <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-[#dde5f0] min-h-[42px] bg-white focus-within:ring-2 focus-within:ring-[#5db5d8] transition-shadow">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#f0f4f9] text-[#3a5070] rounded-full px-2.5 py-1">
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="text-[#9aadca] hover:text-red-400 transition-colors"
              aria-label={`Remover ${t}`}
            >
              <MdClose className="text-xs" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] text-xs text-[#1e3a5f] outline-none bg-transparent placeholder:text-[#c8d8e8] pl-1"
        />
      </div>
      <p className="text-[10px] text-[#c8d8e8]">Enter ou vírgula para adicionar</p>
    </div>
  );
}
