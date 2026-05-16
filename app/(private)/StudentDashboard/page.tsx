"use client";

import { useState } from "react";
import {
  MdAccessibility,
  MdMoreHoriz,
  MdChatBubbleOutline,
  MdCheckCircleOutline,
  MdCheckCircle,
  MdAttachFile,
  MdSend,
  MdCalendarToday,
  MdLogout,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────
type Filter = "todos" | "pendentes" | "concluídas";

interface Comment {
  id: number;
  author: string;
  initials: string;
  color: string;
  text: string;
  time: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  subject: string;
  subjectColor: string;
  teacher: string;
  teacherInitials: string;
  teacherColor: string;
  dueDate: string;
  postedAt: string;
  hasFile: boolean;
  done: boolean;
  comments: Comment[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const initialActivities: Activity[] = [
  {
    id: 1,
    title: "Cap. 4 — A Revolução Industrial no Brasil",
    description:
      "Leia o capítulo adaptado e responda as questões ao final. O material já foi simplificado para facilitar a compreensão.",
    subject: "História",
    subjectColor: "bg-amber-50 text-amber-800 border-amber-200",
    teacher: "Marina Rocha",
    teacherInitials: "MR",
    teacherColor: "#3b5fa0",
    dueDate: "20 mai 2026",
    postedAt: "14 mai",
    hasFile: true,
    done: false,
    comments: [
      { id: 1, author: "Lucas S.", initials: "LS", color: "#1a6b5a", text: "Já li o material, ficou ótimo!", time: "2h" },
      { id: 2, author: "Ana P.", initials: "AP", color: "#5a3fa0", text: "Qual página começa o capítulo?", time: "1h" },
    ],
  },
  {
    id: 2,
    title: "Funções de 2º Grau — Apostila Unidade III",
    description:
      "Exercícios de fixação sobre funções quadráticas. Resolva os exercícios 1 ao 10 da apostila. Dúvidas podem ser comentadas aqui.",
    subject: "Matemática",
    subjectColor: "bg-blue-50 text-blue-800 border-blue-200",
    teacher: "Daniel Aoki",
    teacherInitials: "DA",
    teacherColor: "#1a6b5a",
    dueDate: "18 mai 2026",
    postedAt: "12 mai",
    hasFile: true,
    done: true,
    comments: [
      { id: 3, author: "Pedro V.", initials: "PV", color: "#a0503b", text: "O exercício 8 tá difícil!", time: "3h" },
    ],
  },
  {
    id: 3,
    title: "Romantismo na Literatura Brasileira",
    description:
      "Introdução ao período romântico com foco em autores brasileiros. Leia o resumo adaptado com os principais autores e obras.",
    subject: "Português",
    subjectColor: "bg-green-50 text-green-800 border-green-200",
    teacher: "Letícia Brum",
    teacherInitials: "LB",
    teacherColor: "#5a3fa0",
    dueDate: "22 mai 2026",
    postedAt: "11 mai",
    hasFile: false,
    done: false,
    comments: [],
  },
  {
    id: 4,
    title: "Sistema Circulatório — Resumo Pedagógico",
    description:
      "Material de revisão sobre o sistema circulatório humano. Estude o resumo antes da avaliação.",
    subject: "Biologia",
    subjectColor: "bg-red-50 text-red-800 border-red-200",
    teacher: "Pedro Vargas",
    teacherInitials: "PV",
    teacherColor: "#a0503b",
    dueDate: "16 mai 2026",
    postedAt: "09 mai",
    hasFile: true,
    done: true,
    comments: [
      { id: 4, author: "Marina L.", initials: "ML", color: "#3b5fa0", text: "Gostei muito do resumo!", time: "5h" },
    ],
  },
];

// ─── Activity Card ─────────────────────────────────────────────────────────────
function ActivityCard({
  activity,
  onToggleDone,
  onComment,
}: {
  activity: Activity;
  onToggleDone: (id: number) => void;
  onComment: (id: number, text: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  function handleComment() {
    if (!commentText.trim()) return;
    onComment(activity.id, commentText.trim());
    setCommentText("");
  }

  return (
    <article className="bg-white border-b border-[#f0f4f9] px-5 py-5 hover:bg-[#fafbfd] transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Teacher avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
          style={{ backgroundColor: activity.teacherColor }}
        >
          {activity.teacherInitials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-semibold text-[#1e3a5f] text-sm leading-none">
              {activity.teacher}
            </span>
            <span className="text-[#c8d8e8] text-xs">·</span>
            <span className="text-[#9aadca] text-xs">{activity.postedAt}</span>
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold rounded-full px-2 py-0 h-4 border ${activity.subjectColor}`}
            >
              {activity.subject}
            </Badge>
            {activity.done && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold rounded-full px-2 py-0 h-4 bg-green-50 text-green-700 border-green-200"
              >
                Concluída
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="font-bold text-[#1e3a5f] text-[15px] leading-snug mb-1.5">
            {activity.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-[#4a6a8a] leading-relaxed mb-3">
            {activity.description}
          </p>

          {/* File attachment */}
          {activity.hasFile && (
            <button className="flex items-center gap-2 text-xs font-medium text-[#2563a8] bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 hover:bg-blue-100 transition-colors mb-3 w-fit">
              <MdAttachFile className="text-sm shrink-0" />
              Baixar material em PDF
            </button>
          )}

          {/* Due date */}
          <div className="flex items-center gap-1.5 mb-4">
            <MdCalendarToday className="text-sm text-[#c8d8e8]" />
            <span className="text-xs text-[#9aadca]">
              Entrega: {activity.dueDate}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Comment toggle */}
            <button
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-[#6b7fa3] hover:text-[#2563a8] hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors"
            >
              <MdChatBubbleOutline className="text-base" />
              <span>{activity.comments.length}</span>
            </button>

            {/* Mark done */}
            <button
              onClick={() => onToggleDone(activity.id)}
              className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-colors ml-auto font-medium ${activity.done
                ? "text-green-600 bg-green-50 hover:bg-green-100"
                : "text-[#6b7fa3] hover:text-green-600 hover:bg-green-50"
                }`}
            >
              {activity.done ? (
                <MdCheckCircle className="text-base" />
              ) : (
                <MdCheckCircleOutline className="text-base" />
              )}
              {activity.done ? "Concluída" : "Marcar como feita"}
            </button>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-[#f0f4f9]">
              {activity.comments.length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                  {activity.comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.initials}
                      </div>
                      <div className="flex-1 bg-[#f8fafd] rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#1e3a5f]">
                            {c.author}
                          </span>
                          <span className="text-[10px] text-[#9aadca]">{c.time}</span>
                        </div>
                        <p className="text-xs text-[#4a6a8a] leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment input */}
              <div className="flex gap-2.5 items-end">
                <div className="w-7 h-7 rounded-full bg-[#3b5fa0] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  EU
                </div>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva um comentário..."
                  rows={1}
                  className="flex-1 resize-none text-xs rounded-xl border-[#dde5f0] focus-visible:ring-[#5db5d8] min-h-0 py-2.5 leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="h-9 w-9 p-0 rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] shrink-0"
                >
                  <MdSend className="text-sm" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-[#c8d8e8] hover:text-[#1e3a5f] p-1 rounded-full hover:bg-[#f0f4f9] transition-colors shrink-0">
              <MdMoreHoriz className="text-lg" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl text-sm">
            <DropdownMenuItem>Copiar link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [filter, setFilter] = useState<Filter>("todos");
  const { logout } = useAuth();

  const filtered = activities.filter((a) => {
    if (filter === "pendentes") return !a.done;
    if (filter === "concluídas") return a.done;
    return true;
  });

  const pendingCount = activities.filter((a) => !a.done).length;
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
    <div className="min-h-screen bg-[#f0f4f9]">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#f0f4f9]">
        <div className="max-w-[640px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
              <MdAccessibility className="text-white text-sm" />
            </div>
            <span className="font-bold text-sm text-[#1e3a5f] tracking-tight">SINA</span>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-0.5 bg-[#f0f4f9] rounded-xl p-1 flex-1 max-w-[260px]">
            {(["todos", "pendentes", "concluídas"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg capitalize transition-all ${filter === f
                  ? "bg-white text-[#1e3a5f] shadow-sm"
                  : "text-[#6b7fa3] hover:text-[#3a5070]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="text-[#9aadca] hover:text-[#1e3a5f] p-2 rounded-full hover:bg-[#f0f4f9] transition-colors shrink-0"
            title="Sair"
          >
            <MdLogout className="text-lg" />
          </button>
        </div>
      </header>

      {/* ── Feed ── */}
      <div className="max-w-[640px] mx-auto">

        {/* Progress strip */}
        <div className="bg-white border-b border-[#f0f4f9] px-5 py-3 flex items-center gap-4">
          <div className="flex-1 h-1.5 rounded-full bg-[#f0f4f9] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5db5d8] transition-all duration-500"
              style={{
                width: `${activities.length > 0 ? (doneCount / activities.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-xs text-[#9aadca] shrink-0 font-medium">
            {doneCount} de {activities.length} concluídas
          </span>
        </div>

        {/* Cards */}
        <div className="bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <MdCheckCircle className="text-5xl text-green-300 mb-3" />
              <p className="font-semibold text-[#1e3a5f] text-sm">Tudo em dia!</p>
              <p className="text-xs text-[#9aadca] mt-1">
                Nenhuma atividade nessa categoria.
              </p>
            </div>
          ) : (
            filtered.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onToggleDone={toggleDone}
                onComment={addComment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
