import { createFileRoute } from "@tanstack/react-router";
import { Clock, Copy, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { SHOP } from "@/data/config";
import { waLink } from "@/lib/order";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `تواصل معنا — ${SHOP.name}` },
      {
        name: "description",
        content:
          "موقع المحل، ساعات العمل، رقم الواتساب وبيانات التحويل البنكي لمحل أريام لزينة السيارات.",
      },
      { property: "og:title", content: `تواصل معنا — ${SHOP.name}` },
      {
        property: "og:description",
        content: "راسلنا على الواتساب أو زرنا في المحل — يوميًا من 4 العصر إلى 10 الليل.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [copied, setCopied] = useState(false);

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(SHOP.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">تواصل معنا</h1>

        <div className="mt-8 grid gap-4">
          <a
            href={waLink(`السلام عليكم، أبغى أستفسر — ${SHOP.name}`)}
            target="_blank"
            rel="noreferrer"
            className="card-elevated flex items-center gap-3 p-5"
          >
            <MessageCircle className="size-5" />
            <div>
              <p className="font-display text-base font-extrabold">واتساب</p>
              <p className="text-sm text-muted-foreground" dir="ltr">
                +{SHOP.whatsapp}
              </p>
            </div>
          </a>

          <a
            href={SHOP.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="card-elevated flex items-center gap-3 p-5"
          >
            <MapPin className="size-5" />
            <div>
              <p className="font-display text-base font-extrabold">موقع المحل</p>
              <p className="text-sm text-muted-foreground">{SHOP.address}</p>
            </div>
          </a>

          <div className="card-elevated flex items-center gap-3 p-5">
            <Clock className="size-5" />
            <div>
              <p className="font-display text-base font-extrabold">ساعات العمل</p>
              <p className="text-sm text-muted-foreground">{SHOP.hours}</p>
            </div>
          </div>

          <div className="card-elevated p-5">
            <p className="font-display text-base font-extrabold">التحويل البنكي</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {SHOP.bankName} — باسم {SHOP.accountName}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code
                dir="ltr"
                className="flex-1 overflow-x-auto rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-bold"
              >
                {SHOP.iban}
              </code>
              <button
                type="button"
                onClick={copyIban}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground"
              >
                <Copy className="size-4" />
                {copied ? "تم" : "نسخ"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
