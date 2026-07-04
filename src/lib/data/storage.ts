import fs from "fs/promises";
import path from "path";
import { DATA_DIR } from "./paths";

const BLOB_DATA_PREFIX = "data";

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function localPath(key: string) {
  return path.join(DATA_DIR, key);
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (useBlob()) {
    try {
      const { get } = await import("@vercel/blob");
      const pathname = `${BLOB_DATA_PREFIX}/${key}`;
      const result = await get(pathname, { access: "public" });
      if (result?.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as T;
      }
    } catch {
      // fall through to local read
    }
  }

  try {
    const raw = await fs.readFile(localPath(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, data: T): Promise<void> {
  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    await put(`${BLOB_DATA_PREFIX}/${key}`, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "التخزين على Vercel يتطلب تفعيل Vercel Blob. من لوحة Vercel: Storage → Create Blob Store → اربطه بالمشروع."
    );
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(localPath(key), JSON.stringify(data, null, 2), "utf-8");
}

export async function ensureLocalSeed(key: string, seed: unknown): Promise<void> {
  if (useBlob() || process.env.VERCEL === "1") return;
  try {
    await fs.access(localPath(key));
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(localPath(key), JSON.stringify(seed, null, 2), "utf-8");
  }
}
