import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { BATTERIES } from "@/data/batteries";
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

function BatteriesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">البطاريات المتوفرة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          لمعرفة البطارية المناسبة لسيارتك،{" "}
          <Link to="/" className="font-bold underline">
            ابحث عن سيارتك من الصفحة الرئيسية
          </Link>
          .
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BATTERIES.map((b) => (
            <li key={b.id} className={`card-elevated p-4 ${b.inStock ? "" : "opacity-50"}`}>
              <img
                src={b.image}
                alt={b.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-40 w-full rounded-lg bg-muted object-contain"
              />
              <h2 className="mt-3 font-display text-base font-extrabold">{b.name}</h2>
              <p className="text-xs text-muted-foreground">{b.brand}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <Spec label="المقاس" value={b.size} />
                <Spec label="الأمبير" value={`${b.ah}A`} />
                <Spec label="الضمان" value={`${b.warrantyMonths} شهر`} />
                <Spec label="التوفر" value={b.inStock ? "متوفرة" : "غير متوفرة"} />
              </dl>
              <p className="mt-3 font-display text-xl font-extrabold">
                {b.price} {CURRENCY}
              </p>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
