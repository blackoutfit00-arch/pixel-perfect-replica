import { MessageCircle } from "lucide-react";
import { SHOP } from "@/data/config";
import { waLink } from "@/lib/order";

/** زر واتساب عائم ثابت */
export function WhatsAppFab() {
  return (
    <a
      href={waLink(`السلام عليكم، أبغى أستفسر عن بطارية سيارتي — ${SHOP.name}`)}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا على واتساب"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">واتساب</span>
    </a>
  );
}
