import { prisma } from "@/lib/prisma";

export const authDbService = {
  async registrarUsuario(email: string, name: string, role: string) {
    const tipoUsuario = role === "interprete" ? "INTERPRETE" : "ESTUDANTE";

    return prisma.usuario.upsert({
      where: { email },
      update: {
        nome: name,
        tipo_usuario: tipoUsuario,
      },
      create: {
        email,
        nome: name,
        senha: "", // Gerenciado pelo Firebase
        tipo_usuario: tipoUsuario,
      },
    });
  },

  async registrarOuLogarGoogle(email: string, name: string, role?: string) {
    const trimmedName =
      typeof name === "string" && name.trim().length > 0
        ? name.trim().slice(0, 100)
        : email.split("@")[0].slice(0, 100);

    const tipoUsuario = role === "interprete" ? "INTERPRETE" : "ESTUDANTE";

    return prisma.usuario.upsert({
      where: { email },
      update: {
        nome: trimmedName,
      },
      create: {
        email,
        nome: trimmedName,
        senha: "",
        tipo_usuario: tipoUsuario,
      },
    });
  },

  async obterCargoPorEmail(email?: string): Promise<string> {
    if (email) {
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });
      if (usuario) {
        return usuario.tipo_usuario;
      }
    }
    return "ESTUDANTE"; // Padrão
  },

  async obterUsuarioPorEmail(email?: string) {
    if (!email) return null;
    return prisma.usuario.findUnique({
      where: { email },
    });
  },
};
