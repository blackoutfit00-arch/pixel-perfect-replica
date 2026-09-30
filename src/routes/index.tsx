import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Timer, Wrench } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { OrderFlow } from "@/components/order/OrderFlow";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { SHOP, STEPS } from "@/data/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SHOP.name} — بطاريات سيارات مع تركيب في موقعك` },
      {
        name: "description",
        content:
          "بيع وتركيب بطاريات السيارات في البحرين. ابحث عن سيارتك واحصل على البطارية المناسبة مع تركيب في موقعك أو في المحل.",
      },
      { property: "og:title", content: `${SHOP.name} — بطاريات سيارات مع تركيب` },
      {
        property: "og:description",
        content: "بطاريتك خلصت؟ نركّبها لك وين ما كنت. اختر سيارتك واعرف السعر فورًا.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* قسم البطل */}
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="تركيب بطارية سيارة"
          width={1600}
          height={1104}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/90" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-xl text-white">
            <span className="inline-block rounded-full border border-white/25 px-3 py-1 text-xs font-bold">
              خدمة متنقلة · {SHOP.hours}
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
              بطاريتك خلصت؟ نركّبها لك وين ما كنت
            </h1>
            <p className="mt-4 text-sm opacity-85 sm:text-base">
              اختر سيارتك، نحدد لك مقاس البطارية المناسب، ونوصل لك بالتركيب — أو تعال المحل.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <OrderFlow />
          </div>
        </div>
      </section>

      {/* كيف تعمل الخدمة */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">كيف تعمل الخدمة</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card-elevated p-5">
              <span className="font-display text-3xl font-extrabold text-muted-foreground">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-display text-base font-extrabold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Feature icon={<Timer className="size-5" />} title="وصول سريع" text="خدمة طوارئ خلال 30–45 دقيقة." />
          <Feature icon={<Wrench className="size-5" />} title="تركيب احترافي" text="فنيون متخصصون وأدوات أصلية." />
          <Feature icon={<ShieldCheck className="size-5" />} title="ضمان حقيقي" text="ضمان يصل إلى 30 شهرًا." />
        </div>
      </section>

      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border p-4">
      {icon}
      <div>
        <p className="font-display text-sm font-extrabold">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
