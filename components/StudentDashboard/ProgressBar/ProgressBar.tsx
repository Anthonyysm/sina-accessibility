interface ProgressBarProps {
  done: number;
  total: number;
}

export default function ProgressBar({ done, total }: ProgressBarProps) {
  const percent = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="bg-white border-b border-[#f0f4f9] px-5 py-3 flex items-center gap-4">
      <div className="flex-1 h-1.5 rounded-full bg-[#f0f4f9] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#5db5d8] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-[#9aadca] shrink-0 font-medium">
        {done} de {total} concluídas
      </span>
    </div>
  );
}
