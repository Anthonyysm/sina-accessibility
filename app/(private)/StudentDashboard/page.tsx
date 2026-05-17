"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { Activity, Filter } from "@/types/activity";
import Topbar from "@/components/StudentDashboard/Topbar/Topbar";
import ProgressBar from "@/components/StudentDashboard/ProgressBar/ProgressBar";
import Feed from "@/components/StudentDashboard/Feed/Feed";

export default function StudentDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todos");
  const { logout } = useAuth();

  // Helpers para geração de avatar do professor
  const cores = ["#3b5fa0", "#1a6b5a", "#5a3fa0", "#a0503b", "#b26f20"];
  function getAvatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return cores[Math.abs(hash) % cores.length];
  }

  function getInitials(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || "?").toUpperCase();
  }

  useEffect(() => {
    fetch("/api/atividades")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mappedActivities: Activity[] = data.map((item: any) => {
            const isDone = item.status === "feito" || item.status === "done";
            const professorName = item.usuario?.nome || "Professor Desconhecido";
            const dateObj = new Date(item.criado_em);
            const postedAt = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
            const dueDate = new Date(dateObj.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); // Exemplo +7 dias

            return {
              id: item.id_atividade,
              title: item.titulo,
              description: "Leia o material e conclua a atividade. (Adaptado da IA)",
              subject: "Material Adaptado",
              subjectColor: "bg-blue-50 text-blue-800 border-blue-200",
              teacher: professorName,
              teacherInitials: getInitials(professorName),
              teacherColor: getAvatarColor(professorName),
              dueDate: dueDate,
              postedAt: postedAt,
              hasFile: false, // Pode ser alterado depois se o banco suportar arquivos
              done: isDone,
              comments: Array.isArray(item.comentarios) ? item.comentarios.map((c: any) => ({
                id: c.id_comentario,
                author: "Estudante",
                initials: "ES",
                color: "#1a6b5a",
                text: c.comentario,
                time: new Date(c.criado_em).toLocaleDateString("pt-BR")
              })) : []
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
