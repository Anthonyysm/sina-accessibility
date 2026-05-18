import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "atividades");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export interface StoredFile {
  url: string;
  name: string;
  type: string;
  size: number;
}

export async function saveUploadedFile(
  file: File,
  prefix = "pdf"
): Promise<StoredFile> {
  ensureUploadDir();

  const ext = path.extname(file.name).toLowerCase() || ".pdf";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const fileName = `${prefix}-${timestamp}-${random}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/atividades/${fileName}`,
    name: file.name,
    type: file.type || "application/pdf",
    size: buffer.length,
  };
}

export function deleteUploadedFile(url: string): void {
  const fileName = url.split("/").pop();
  if (!fileName) return;
  const filePath = path.join(UPLOAD_DIR, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
