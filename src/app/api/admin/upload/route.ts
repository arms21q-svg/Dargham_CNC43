import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { saveUploadedImage } from "@/lib/upload";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    if (process.env.VERCEL === "1" && !process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "رفع الصور على Vercel يتطلب تفعيل Vercel Blob. استخدم رابط صورة مؤقتاً أو فعّل Blob من لوحة Vercel.",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "فشل رفع الصورة" },
      { status: 400 }
    );
  }
}
