import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Clock3, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BATTERIES, type Battery } from "@/data/batteries";
import { BRANDS, type Brand } from "@/data/brands";
import { CURRENCY, SHOP } from "@/data/config";

export const Route = createFileRoute("/batteries")({
  head: () => ({
    meta: [
      { title: `البطاريات المتوفرة — ${SHOP.name}` },
      {
        name: "description",
        content:
          "قائمة بطاريات السيارات المتوفرة عندنا: المقاس، الأمبير، الضمان والسعر. أمارون، فارتا، بوش، سولايت وغيرها.",
      },
      { property: "og:title", content: `البطاريات المتوفرة — ${SHOP.name}` },
      {
        property: "og:description",
        content: "بطاريات أصلية بمقاسات مختلفة مع ضمان يصل إلى 30 شهرًا.",
      },
    ],
  }),
  component: BatteriesPage,
});

/** نص مدة الضمان: رقم واحد أو نطاق (مثل 18 – 24 شهر) */
function warrantyText(items: Battery[]) {
  const w = items.map((b) => b.warrantyMonths);
  const min = Math.min(...w);
  const max = Math.max(...w);
  return min === max ? `${min} شهر` : `${min} – ${max} شهر`;
}

function BatteriesPage() {
  const groups = BRANDS.map((brand) => ({
    brand,
    items: BATTERIES.filter((b) => b.brand === brand.name).sort((a, b) => a.ah - b.ah),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">البطاريات المتوفرة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          اختر الشركة لتشوف المقاسات المتوفرة. ولمعرفة البطارية المناسبة لسيارتك،{" "}
          <Link to="/" className="font-bold text-primary underline underline-offset-4">
            ابحث عن سيارتك من الصفحة الرئيسية
          </Link>
          .
        </p>

        <Accordion type="single" collapsible className="mt-8 space-y-4">
          {groups.map((g) => (
            <BrandItem key={g.brand.name} brand={g.brand} items={g.items} />
          ))}
        </Accordion>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  if (brand.logo) {
    return (
      <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-white p-1.5 sm:size-20">
        <img src={brand.logo} alt={brand.en} className="size-full object-contain" />
      </span>
    );
  }
  // شعار نصي مؤقت إلى أن تضيف صورة الشركة
  return (
    <span
      dir="ltr"
      className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary px-1 text-center font-display text-[11px] font-extrabold leading-tight tracking-wide text-primary-foreground sm:size-20 sm:text-sm"
    >
      {brand.en}
    </span>
  );
}

function BrandItem({ brand, items }: { brand: Brand; items: Battery[] }) {
  return (
    <AccordionItem
      value={brand.name}
      className="card-elevated overflow-hidden border data-[state=open]:border-primary/40"
    >
      <AccordionTrigger className="gap-3 px-4 py-4 text-start hover:no-underline sm:px-5">
        <span className="flex flex-1 items-center gap-4">
          <BrandLogo brand={brand} />
          <span className="flex min-w-0 flex-1 flex-col gap-2 text-start">
            <span className="font-display text-lg font-extrabold leading-tight sm:text-xl">
              {brand.name}
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                صنع في {brand.madeIn}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-primary" />
                ضمان {warrantyText(items)}
              </span>
            </span>
            <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-foreground">
              {items.length} {items.length === 1 ? "مقاس متوفر" : "مقاسات متوفرة"}
            </span>
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className="border-t border-border bg-secondary/40 p-4 sm:p-5">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {items.map((b) => (
            <BatteryCard key={b.id} b={b} />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

function BatteryCard({ b }: { b: Battery }) {
  return (
    <li
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card ${
        b.inStock ? "" : "opacity-60"
      }`}
    >
      <div className="relative bg-muted">
        <img
          src={b.image}
          alt={b.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-contain p-3"
        />
        <span
          dir="ltr"
          className="absolute start-2 top-2 rounded-md bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground"
        >
          {b.size}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 dir="ltr" className="text-start font-display text-sm font-extrabold">
          {b.name}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className="rounded-md bg-secondary px-2 py-1">{b.ah} أمبير</span>
          <span className="rounded-md bg-secondary px-2 py-1">{b.warrantyMonths} شهر</span>
        </div>

        <div className="mt-auto pt-3">
          <p className="font-display text-lg font-extrabold leading-none">
            {b.price} <span className="text-xs font-bold text-muted-foreground">{CURRENCY}</span>
          </p>
          <span
            className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold ${
              b.inStock ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className={`size-2 rounded-full ${b.inStock ? "bg-primary" : "bg-muted-foreground"}`} />
            {b.inStock ? "متوفرة" : "غير متوفرة"}
          </span>
        </div>
      </div>
    </li>
  );
}
