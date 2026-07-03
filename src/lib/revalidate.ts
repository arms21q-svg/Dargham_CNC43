import { revalidatePath } from "next/cache";

export function revalidateSiteContent() {
  revalidatePath("/", "layout");
  revalidatePath("/ar");
  revalidatePath("/en");
  revalidatePath("/ar/portfolio");
  revalidatePath("/en/portfolio");
  revalidatePath("/ar/projects", "layout");
  revalidatePath("/en/projects", "layout");
}
