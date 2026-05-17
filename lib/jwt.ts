const SECRET = process.env.SESSION_SECRET || "chave_super_secreta_fallback_dev_123!";

let _cachedKey: CryptoKey | null = null;

async function getHmacKey(): Promise<CryptoKey> {
  if (!_cachedKey) {
    _cachedKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }
  return _cachedKey;
}

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export interface SessionPayload {
  userId?: string;
  role: string;
  idToken?: string;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const key = await getHmacKey();
  const expected = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));

  if (toBase64Url(new Uint8Array(expected)) !== signature) return null;

  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}
