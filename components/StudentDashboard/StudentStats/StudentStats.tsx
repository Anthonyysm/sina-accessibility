"use client";

import { MdCheckCircle, MdPending, MdCalendarToday, MdError } from "react-icons/md";

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
        {/* Concluídas */}
        <div className="bg-white rounded-xl p-3 border border-green-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
              <MdCheckCircle className="text-green-600 text-sm" />
            </div>
          </div>
          <p className="text-lg font-bold text-green-700">{done}</p>
          <p className="text-[10px] text-green-600/70 font-medium">Concluídas</p>
        </div>

        {/* Pendentes */}
        <div className="bg-white rounded-xl p-3 border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <MdPending className="text-amber-600 text-sm" />
            </div>
          </div>
          <p className="text-lg font-bold text-amber-700">{pending}</p>
          <p className="text-[10px] text-amber-600/70 font-medium">Pendentes</p>
        </div>

        {/* Próximas entregas */}
        <div className="bg-white rounded-xl p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <MdCalendarToday className="text-blue-600 text-sm" />
            </div>
          </div>
          <p className="text-lg font-bold text-blue-700">{upcoming}</p>
          <p className="text-[10px] text-blue-600/70 font-medium">Esta semana</p>
        </div>

        {/* Atrasadas */}
        <div className="bg-white rounded-xl p-3 border border-red-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <MdError className="text-red-600 text-sm" />
            </div>
          </div>
          <p className="text-lg font-bold text-red-700">{overdue}</p>
          <p className="text-[10px] text-red-600/70 font-medium">Atrasadas</p>
        </div>
      </div>
    </div>
  );
}
