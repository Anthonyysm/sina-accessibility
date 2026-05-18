export type ProfileType = "interprete" | "professor" | "estudante" | "coordenador";

export const DB_TO_PROFILE: Record<string, ProfileType> = {
  INTERPRETE: "interprete",
  PROFESSOR: "professor",
  ESTUDANTE: "estudante",
  COORDENADOR: "coordenador",
};

export const PROFILE_TO_DB: Record<ProfileType, string> = {
  interprete: "INTERPRETE",
  professor: "PROFESSOR",
  estudante: "ESTUDANTE",
  coordenador: "COORDENADOR",
};

export const AVATAR_COLORS = ["#3b5fa0", "#5db5d8", "#6b8e6b", "#c47a4a", "#8b6baa"];

export function getInitials(n: string) {
  return n.trim().split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
