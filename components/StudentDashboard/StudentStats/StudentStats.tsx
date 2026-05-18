"use client";

import { MdCheckCircle, MdPending, MdCalendarToday, MdError } from "react-icons/md";
import { StatCard } from "@/components/StudentDashboard/StatCard/StatCard";

interface StudentStatsProps {
  total: number;
  done: number;
  pending: number;
  upcoming: number;
  overdue: number;
}

export default function StudentStats({ total, done, pending, upcoming, overdue }: StudentStatsProps) {
  if (total === 0) return null;

  return (
    <div className="px-4 sm:px-5 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StatCard icon={<MdCheckCircle className="text-green-600 text-sm" />} value={done} label="Concluídas" color="green" />
        <StatCard icon={<MdPending className="text-amber-600 text-sm" />} value={pending} label="Pendentes" color="amber" />
        <StatCard icon={<MdCalendarToday className="text-blue-600 text-sm" />} value={upcoming} label="Esta semana" color="blue" />
        <StatCard icon={<MdError className="text-red-600 text-sm" />} value={overdue} label="Atrasadas" color="red" />
      </div>
    </div>
  );
}
