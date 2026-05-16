// lib/errors.ts
// Padrão centralizado de erros para todos os route handlers da aplicação.
// Uso: importe handleApiError no catch de qualquer route.ts

/**
 * Erro de negócio com status HTTP explícito.
 * Use para erros esperados (validação, não encontrado, etc.)
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Converte qualquer erro em uma Response JSON padronizada.
 * Deve ser usado no catch de todos os route handlers.
 *
 * @example
 * } catch (error) {
 *   return handleApiError(error);
 * }
 */
export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Erros inesperados: loga no servidor, não expõe detalhes ao cliente
  console.error("[SINA] Erro interno não tratado:", error);
  return Response.json(
    { error: "Erro interno do servidor." },
    { status: 500 }
  );
}
