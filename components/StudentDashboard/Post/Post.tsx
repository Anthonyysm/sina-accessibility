"use client";

import {
  MdMoreHoriz,
  MdChatBubbleOutline,
  MdCheckCircleOutline,
  MdCheckCircle,
  MdAttachFile,
  MdSend,
  MdCalendarToday,
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
import { useState } from "react";

// ─── Types — fora do componente ───────────────────────────────────────────────
export interface Comment {
  id: number;
  author: string;
  initials: string;
  color: string;
  text: string;
  time: string;
}

export interface Activity {
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

// ─── Props ────────────────────────────────────────────────────────────────────
interface PostProps {
  activity: Activity;
  onToggleDone: (id: number) => void;
  onComment: (id: number, text: string) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function Post({ activity, onToggleDone, onComment }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  function handleComment() {
    if (!commentText.trim()) return;
    onComment(activity.id, commentText.trim());
    setCommentText("");
  }

  return (
    <article className="bg-white border-b border-[#f0f4f9] px-5 py-5 hover:bg-[#fafbfd] transition-colors my-5 rounded-sm">
      {/* Header */}
      <div className="flex items-start gap-3">

        {/* Avatar do professor */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
          style={{ backgroundColor: activity.teacherColor }}
        >
          {activity.teacherInitials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta */}
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

          {/* Título */}
          <h2 className="font-bold text-[#1e3a5f] text-[15px] leading-snug mb-1.5">
            {activity.title}
          </h2>

          {/* Descrição */}
          <p className="text-sm text-[#4a6a8a] leading-relaxed mb-3">
            {activity.description}
          </p>

          {/* Anexo PDF */}
          {activity.hasFile && (
            <button className="flex items-center gap-2 text-xs font-medium text-[#2563a8] bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 hover:bg-blue-100 transition-colors mb-3 w-fit">
              <MdAttachFile className="text-sm shrink-0" />
              Baixar material em PDF
            </button>
          )}

          {/* Data de entrega */}
          <div className="flex items-center gap-1.5 mb-4">
            <MdCalendarToday className="text-sm text-[#c8d8e8]" />
            <span className="text-xs text-[#9aadca]">
              Entrega: {activity.dueDate}
            </span>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-[#6b7fa3] hover:text-[#2563a8] hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors"
            >
              <MdChatBubbleOutline className="text-base" />
              <span>{activity.comments.length}</span>
            </button>

            <button
              onClick={() => onToggleDone(activity.id)}
              className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-colors ml-auto font-medium ${
                activity.done
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-[#6b7fa3] hover:text-green-600 hover:bg-green-50"
              }`}
            >
              {activity.done
                ? <MdCheckCircle className="text-base" />
                : <MdCheckCircleOutline className="text-base" />
              }
              {activity.done ? "Concluída" : "Marcar como feita"}
            </button>
          </div>

          {/* Comentários */}
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

              {/* Input de comentário */}
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

        {/* Opções */}
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
