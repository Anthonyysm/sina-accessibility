import { Activity } from "@/types/activity";

// Substitua isso por uma chamada real à API/Firestore no futuro:
// const activities = await getDocs(collection(db, "activities"))

export const initialActivities: Activity[] = [
  {
    id: 1,
    title: "Cap. 4 A Revolução Industrial no Brasil",
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
