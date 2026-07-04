import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function validateFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP أو GIF");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
  }
}

async function saveToLocal(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = EXT_MAP[file.type] || ".jpg";
  const filename = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

async function saveToBlob(file: File): Promise<string> {
  const { put } = await import("@vercel/blob");
  const ext = EXT_MAP[file.type] || ".jpg";
  const filename = `projects/${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

export async function saveUploadedImage(file: File): Promise<string> {
  validateFile(file);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return saveToBlob(file);
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "رفع الصور على Vercel يتطلب تفعيل Vercel Blob. من لوحة Vercel: Storage → Create Blob Store → اربطه بالمشروع."
    );
  }

  return saveToLocal(file);
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return url.startsWith("/uploads/");
  }
}
