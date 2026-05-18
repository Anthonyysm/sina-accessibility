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
  fileUrl?: string;
  fileName?: string;
  done: boolean;
  comments: Comment[];
  textoOriginal?: string;
  turma?: string;
  dataEntregaReal?: string;
  isOverdue?: boolean;
  isUrgent?: boolean;
}

export type Filter = "todos" | "pendentes" | "concluídas";
