"use client";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "green" | "amber" | "blue" | "red";
}

export function StatCard({ icon, value, label, color }: StatCardProps) {
  const colors = {
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      textLight: "text-green-600/70",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      textLight: "text-amber-600/70",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      textLight: "text-blue-600/70",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700",
      textLight: "text-red-600/70",
    },
  };

  const c = colors[color];

  return (
    <div className={`bg-white rounded-xl p-3 border ${c.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className={`text-lg font-bold ${c.text}`}>{value}</p>
      <p className={`text-[10px] ${c.textLight} font-medium`}>{label}</p>
    </div>
  );
}
