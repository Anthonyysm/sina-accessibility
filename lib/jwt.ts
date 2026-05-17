import crypto from "crypto";

// Chave secreta usada para assinar os cookies. Em produção, DEVE vir do .env
const SECRET = process.env.SESSION_SECRET || "chave_super_secreta_fallback_dev_123!";

/**
 * Assina um payload JSON retornando uma string no formato "base64url(payload).assinatura"
 */
export async function signSessionToken(payload: any): Promise<string> {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verifica a assinatura do token e retorna o payload se for válido
 */
export async function verifySessionToken(token: string): Promise<any> {
  if (!token) return null;
  
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  
  const [data, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  
  if (signature !== expectedSignature) {
    return null; // Assinatura inválida
  }
  
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
  } catch (err) {
    return null;
  }
}
