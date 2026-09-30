import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { CURRENCY, ETA, PRICING, SHOP, STEPS } from "@/data/config";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: `كيف تعمل الخدمة — ${SHOP.name}` },
      {
        name: "description",
        content:
          "اعرف خطوات طلب بطارية سيارة: البحث عن السيارة، اختيار البطارية والخدمة، رسوم التركيب والطوارئ وخصم البطارية القديمة.",
      },
      { property: "og:title", content: `كيف تعمل الخدمة — ${SHOP.name}` },
      {
        property: "og:description",
        content: "ثلاث خطوات فقط: ابحث عن سيارتك، اختر البطارية والخدمة، أكّد الطلب وادفع.",
      },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">كيف تعمل الخدمة</h1>

        <ol className="mt-8 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card-elevated flex gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-base font-extrabold">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="card-elevated mt-10 p-5">
          <h2 className="font-display text-xl font-extrabold">الرسوم والخصومات</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Line label="التركيب في موقعك" value={`${PRICING.onSiteFee} ${CURRENCY}`} />
            <Line label="التركيب في المحل" value={`${PRICING.atShopFee} ${CURRENCY}`} />
            <Line label="رسوم الحالة الطارئة" value={`+ ${PRICING.emergencyFee} ${CURRENCY}`} />
            <Line
              label="خصم تسليم البطارية القديمة"
              value={`صغيرة −${PRICING.oldBatteryDiscount.small} · متوسطة −${PRICING.oldBatteryDiscount.medium} · كبيرة −${PRICING.oldBatteryDiscount.large} ${CURRENCY}`}
            />
          </dl>
        </section>

        <section className="card-elevated mt-4 p-5">
          <h2 className="font-display text-xl font-extrabold">المدة التقديرية</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Line label="حالة طارئة" value={ETA.emergency} />
            <Line label="طلب عادي في موقعك" value={ETA.normal} />
            <Line label="في المحل" value={ETA.atShop} />
          </dl>
        </section>

        <section className="card-elevated mt-4 p-5">
          <h2 className="font-display text-xl font-extrabold">الدفع</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            الدفع عن طريق تحويل بنكي على الآيبان {SHOP.iban} باسم {SHOP.accountName}، ثم إرسال صورة
            الحوالة على الواتساب. الطلب يُعتبر مؤكدًا بعد استلام صورة التحويل.
          </p>
        </section>

        <Link
          to="/"
          className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
        >
          ابدأ طلبك الآن
        </Link>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
