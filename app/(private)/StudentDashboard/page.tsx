"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { Activity, Filter } from "@/types/activity";
import Topbar from "@/components/StudentDashboard/Topbar/Topbar";
import ProgressBar from "@/components/StudentDashboard/ProgressBar/ProgressBar";
import Feed from "@/components/StudentDashboard/Feed/Feed";
import StudentStats from "@/components/StudentDashboard/StudentStats/StudentStats";
import { getInitials, getAvatarColor } from "@/lib/profile-constants";

export default function StudentDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todos");
  const { logout } = useAuth();

  function getPreview(text: string, maxLen = 120) {
    if (!text) return "Leia o material e conclua a atividade.";
    const cleaned = text.replace(/\s+/g, " ").trim();
    return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + "..." : cleaned;
  }

  function getUrgencyStatus(dataEntrega: string | null, done: boolean) {
    if (!dataEntrega || done) return { isOverdue: false, isUrgent: false };
    const now = new Date();
    const due = new Date(dataEntrega);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      isOverdue: diffDays < 0,
      isUrgent: diffDays >= 0 && diffDays <= 3,
    };
  }

  useEffect(() => {
    fetch("/api/atividades?estudante=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a: any, b: any) => {
            if (a.data_entrega && b.data_entrega) return new Date(a.data_entrega).getTime() - new Date(b.data_entrega).getTime();
            if (a.data_entrega) return -1;
            if (b.data_entrega) return 1;
            return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime();
          });

          const mappedActivities: Activity[] = sorted.map((item: any) => {
            const isDone = item.status === "feito" || item.status === "done";
            const professorName = item.usuario?.nome || "Professor Desconhecido";
            const dateObj = new Date(item.criado_em);
            const postedAt = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

            let dueDate = "Sem prazo";
            if (item.data_entrega) {
              dueDate = new Date(item.data_entrega).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            }

            const { isOverdue, isUrgent } = getUrgencyStatus(item.data_entrega, isDone);

            return {
              id: item.id_atividade,
              title: item.titulo,
              description: getPreview(item.texto_adaptado || item.texto_original),
              subject: item.turma?.nome || "Material Adaptado",
              subjectColor: item.turma
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-blue-50 text-blue-800 border-blue-200",
              teacher: professorName,
              teacherInitials: getInitials(professorName),
              teacherColor: getAvatarColor(professorName),
              dueDate,
              postedAt,
              hasFile: !!item.arquivo_url,
              fileUrl: item.arquivo_url || undefined,
              fileName: item.arquivo_nome || undefined,
              done: isDone,
              comments: Array.isArray(item.comentarios) ? item.comentarios.map((c: any) => ({
                id: c.id_comentario,
                author: "Estudante",
                initials: "ES",
                color: "#1a6b5a",
                text: c.comentario,
                time: new Date(c.criado_em).toLocaleDateString("pt-BR")
              })) : [],
              textoOriginal: item.texto_original || undefined,
              turma: item.turma?.nome,
              dataEntregaReal: item.data_entrega || undefined,
              isOverdue,
              isUrgent,
            };
          });
          setActivities(mappedActivities);
        }
      })
      .catch((err) => console.error("Erro ao carregar atividades do aluno:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activities.filter((a) => {
    if (filter === "pendentes") return !a.done;
    if (filter === "concluídas") return a.done;
    return true;
  });

  const doneCount = activities.filter((a) => a.done).length;
  const pendingCount = activities.filter((a) => !a.done).length;
  const upcomingCount = activities.filter((a) => {
    if (a.done || !a.dataEntregaReal) return false;
    const due = new Date(a.dataEntregaReal);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;
  const overdueCount = activities.filter((a) => a.isOverdue).length;

  function toggleDone(id: number) {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  function addComment(id: number, text: string) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              comments: [
                ...a.comments,
                {
                  id: Date.now(),
                  author: "Você",
                  initials: "EU",
                  color: "#3b5fa0",
                  text,
                  time: "agora",
                },
              ],
            }
          : a
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] montserrat">
      <Topbar
        filter={filter}
        onFilterChange={setFilter}
        onLogout={logout}
      />

      <div className="max-w-[640px] mx-auto">
        <StudentStats
          total={activities.length}
          done={doneCount}
          pending={pendingCount}
          upcoming={upcomingCount}
          overdue={overdueCount}
        />
        <ProgressBar done={doneCount} total={activities.length} />
        {loading ? (
          <div className="text-center py-10 text-slate-500 italic">
            Carregando suas atividades...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-slate-500 italic">
            Você ainda não possui nenhuma atividade.
          </div>
        ) : (
          <Feed
            activities={filtered}
            onToggleDone={toggleDone}
            onComment={addComment}
          />
        )}
      </div>
    </div>
  );
}
