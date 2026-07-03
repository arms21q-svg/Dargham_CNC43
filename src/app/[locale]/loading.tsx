export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-14 h-14 border-4 border-navy-500 border-t-gold rounded-full animate-spin" />
      <p className="text-gold font-medium animate-pulse">جاري التحميل...</p>
    </div>
  );
}
