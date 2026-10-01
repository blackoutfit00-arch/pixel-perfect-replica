import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { BATTERIES, type Battery } from "@/data/batteries";
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

/** الاسم الإنجليزي للماركة — يظهر بجانب الاسم العربي */
const BRAND_EN: Record<string, string> = {
  "أمارون": "AMARON",
  "إيه سي ديلكو": "AC Delco",
  "سولايت": "Solite",
  "فارتا": "Varta",
  "بوش": "Bosch",
};

/** تجميع البطاريات حسب الماركة، ومقاساتها مرتبة من الأصغر للأكبر */
function groupByBrand(items: Battery[]) {
  const map = new Map<string, Battery[]>();
  for (const b of items) {
    const list = map.get(b.brand) ?? [];
    list.push(b);
    map.set(b.brand, list);
  }
  return Array.from(map, ([brand, list]) => ({
    brand,
    items: [...list].sort((a, b) => a.ah - b.ah),
  }));
}

function BatteriesPage() {
  const groups = groupByBrand(BATTERIES);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">البطاريات المتوفرة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          لمعرفة البطارية المناسبة لسيارتك،{" "}
          <Link to="/" className="font-bold text-primary underline underline-offset-4">
            ابحث عن سيارتك من الصفحة الرئيسية
          </Link>
          .
        </p>

        {/* تنقّل سريع بين الماركات */}
        <nav aria-label="الماركات" className="mt-6 flex flex-wrap gap-2">
          {groups.map((g, i) => (
            <a
              key={g.brand}
              href={`#brand-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:bg-secondary"
            >
              {g.brand}
              <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-5 text-primary-foreground">
                {g.items.length}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-8">
          {groups.map((g, i) => (
            <BrandSection key={g.brand} id={`brand-${i}`} brand={g.brand} items={g.items} />
          ))}
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function BrandSection({ id, brand, items }: { id: string; brand: string; items: Battery[] }) {
  const prices = items.map((b) => b.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const en = BRAND_EN[brand];

  return (
    <section id={id} className="card-elevated scroll-mt-24 overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary font-display text-xl font-extrabold text-primary-foreground">
            {brand.charAt(0)}
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold leading-tight">{brand}</h2>
            {en && (
              <p dir="ltr" className="text-start text-xs font-semibold tracking-wide text-muted-foreground">
                {en}
              </p>
            )}
          </div>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">
          {items.length} {items.length === 1 ? "مقاس" : "مقاسات"} ·{" "}
          {min === max ? `${min} ${CURRENCY}` : `من ${min} إلى ${max} ${CURRENCY}`}
        </p>
      </header>

      <ul className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <BatteryCard key={b.id} b={b} />
        ))}
      </ul>
    </section>
  );
}

function BatteryCard({ b }: { b: Battery }) {
  return (
    <li
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-[var(--shadow-soft)] ${
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
          className="h-32 w-full object-contain p-2"
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
          <span className="rounded-md bg-secondary px-2 py-1">ضمان {b.warrantyMonths} شهر</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="font-display text-xl font-extrabold leading-none">
            {b.price} <span className="text-xs font-bold text-muted-foreground">{CURRENCY}</span>
          </p>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${
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
