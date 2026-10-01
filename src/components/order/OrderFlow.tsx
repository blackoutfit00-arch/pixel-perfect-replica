import { useMemo, useState } from "react";
import {
  BatteryCharging,
  Check,
  Copy,
  MapPin,
  MessageCircle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { CarSearch } from "@/components/order/CarSearch";
import { batteriesForSize, type Battery } from "@/data/batteries";
import type { Car } from "@/data/cars";
import { CURRENCY, PRICING, SHOP } from "@/data/config";
import {
  calcCost,
  etaFor,
  initialOrderState,
  makeOrderNumber,
  money,
  oldSizeLabel,
  orderMessage,
  waLink,
  type OldBatterySize,
  type OrderState,
} from "@/lib/order";

const field =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none transition-shadow focus:ring-2 focus:ring-ring";

export function OrderFlow() {
  const [car, setCar] = useState<Car | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [battery, setBattery] = useState<Battery | null>(null);
  const [order, setOrder] = useState<OrderState>(initialOrderState);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; location?: string }>({});
  const [confirmed, setConfirmed] = useState<{ number: string; total: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const matches = useMemo(() => (car ? batteriesForSize(car.batterySize) : []), [car]);
  const cost = useMemo(() => (battery ? calcCost(battery, order) : null), [battery, order]);

  function reset() {
    setCar(null);
    setYear(null);
    setBattery(null);
    setOrder(initialOrderState);
    setErrors({});
    setConfirmed(null);
  }

  function set<K extends keyof OrderState>(key: K, value: OrderState[K]) {
    setOrder((prev) => ({ ...prev, [key]: value }));
  }

  /** التحقق من الحقول المطلوبة */
  function validate() {
    const e: { name?: string; phone?: string; location?: string } = {};
    if (order.name.trim().length < 2) e.name = "اكتب اسمك";
    if (!/^[0-9+\s-]{8,}$/.test(order.phone.trim())) e.phone = "اكتب رقم جوال صحيح";
    if (order.service === "onsite" && order.location.trim().length < 5)
      e.location = "اكتب موقعك أو ألصق رابط الموقع";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function confirm() {
    if (!battery || !cost || !validate()) return;
    setConfirmed({ number: makeOrderNumber(), total: cost.total });
  }

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(SHOP.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  /* ===== صفحة تأكيد الطلب ===== */
  if (confirmed && car && battery) {
    const message = orderMessage({
      orderNumber: confirmed.number,
      car,
      year,
      battery,
      order,
      total: confirmed.total,
    });

    return (
      <div className="fade-up card-elevated overflow-hidden">
        <div className="surface-ink p-6 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-white/10">
            <Check className="size-6" />
          </div>
          <h2 className="mt-3 font-display text-xl font-extrabold">تم إنشاء طلبك</h2>
          <p className="mt-1 text-sm opacity-70">رقم الطلب</p>
          <p className="font-display text-2xl font-extrabold tracking-wider" dir="ltr">
            {confirmed.number}
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Row label="السيارة" value={`${car.brand} ${car.model}${year ? ` ${year}` : ""}`} />
            <Row label="البطارية" value={`${battery.name} — ${battery.size}`} />
            <Row
              label="نوع الخدمة"
              value={order.service === "onsite" ? "تركيب في موقعك" : "الحضور إلى المحل"}
            />
            <Row
              label="الموقع"
              value={order.service === "onsite" ? order.location : SHOP.address}
            />
            <Row
              label="حالة طارئة"
              value={order.service === "onsite" && order.emergency ? "نعم" : "لا"}
            />
            <Row
              label="البطارية القديمة"
              value={
                order.keepOldBattery
                  ? "العميل يحتفظ بها"
                  : `مستلمة (${oldSizeLabel(order.oldBatterySize)})`
              }
            />
            <Row label="المدة التقديرية" value={etaFor(order)} />
            <Row label="الإجمالي" value={money(confirmed.total)} strong />
          </dl>

          {/* طريقة الدفع */}
          <div className="rounded-xl border border-border bg-muted p-4">
            <h3 className="font-display text-base font-extrabold">طريقة الدفع — تحويل بنكي</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {SHOP.bankName} — باسم {SHOP.accountName}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code
                dir="ltr"
                className="flex-1 overflow-x-auto rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-bold"
              >
                {SHOP.iban}
              </code>
              <button
                type="button"
                onClick={copyIban}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "تم النسخ" : "نسخ"}
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold">
              حوّل المبلغ الإجمالي ({money(confirmed.total)}) ثم أرسل صورة الحوالة على الواتساب
              لتأكيد طلبك.
            </p>
          </div>

          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-5" />
            إرسال صورة التحويل عبر واتساب
          </a>

          <p className="text-center text-xs text-muted-foreground">
            ملاحظة: الطلب يُعتبر مؤكدًا بعد استلام صورة التحويل.
          </p>

          <button
            type="button"
            onClick={reset}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold"
          >
            <RotateCcw className="size-4" />
            طلب جديد
          </button>
        </div>
      </div>
    );
  }

  /* ===== الخطوة 1: البحث ===== */
  if (!car) {
    return (
      <CarSearch
        onSelect={(c, y) => {
          setCar(c);
          setYear(y);
          setBattery(null);
        }}
      />
    );
  }

  /* ===== الخطوة 2 و 3 ===== */
  return (
    <div className="space-y-4">
      <div className="card-elevated flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-xs text-muted-foreground">سيارتك</p>
          <p className="font-display text-base font-extrabold">
            {car.brand} {car.model} {year ?? ""}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            مقاس البطارية المناسب: <span className="font-bold text-foreground">{car.batterySize}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold"
        >
          <RotateCcw className="size-4" />
          تغيير السيارة
        </button>
      </div>

      {/* اختيار البطارية */}
      <div className="card-elevated p-4 sm:p-6">
        <h2 className="font-display text-lg font-extrabold">البطاريات المطابقة</h2>
        {matches.length === 0 ? (
          <div className="mt-3 rounded-xl border border-border bg-muted p-4 text-sm">
            ما عندنا حاليًا بطارية بمقاس {car.batterySize}.
            <a
              href={waLink(`أبغى بطارية مقاس ${car.batterySize} لسيارة ${car.brand} ${car.model}`)}
              target="_blank"
              rel="noreferrer"
              className="ms-1 font-bold underline"
            >
              راسلنا على واتساب
            </a>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {matches.map((b) => {
              const selected = battery?.id === b.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    disabled={!b.inStock}
                    onClick={() => setBattery(b)}
                    className={`flex w-full gap-3 rounded-xl border p-3 text-start transition-all ${
                      selected
                        ? "border-foreground bg-accent shadow-[var(--shadow-soft)]"
                        : "border-border hover:border-foreground/40"
                    } ${b.inStock ? "" : "opacity-45"}`}
                  >
                    <img
                      src={b.image}
                      alt={b.name}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="size-20 shrink-0 rounded-lg bg-muted object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-extrabold">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.brand}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {b.size} · {b.ah}A · ضمان {b.warrantyMonths} شهر
                      </p>
                      <p className="mt-1 font-display text-base font-extrabold">
                        {b.price} {CURRENCY}
                      </p>
                      {!b.inStock && <p className="text-xs font-bold">غير متوفرة حاليًا</p>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {battery && cost && (
        <>
          {/* خدمة التركيب */}
          <div className="fade-up card-elevated space-y-4 p-4 sm:p-6">
            <h2 className="font-display text-lg font-extrabold">خدمة التركيب</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <ServiceCard
                active={order.service === "onsite"}
                onClick={() => set("service", "onsite")}
                icon={<MapPin className="size-5" />}
                title="التركيب في مكانك"
                subtitle={`رسوم ${PRICING.onSiteFee} ${CURRENCY} — نجيك وين ما كنت`}
              />
              <ServiceCard
                active={order.service === "shop"}
                onClick={() => set("service", "shop")}
                icon={<BatteryCharging className="size-5" />}
                title="المجيء إلى المحل"
                subtitle={`رسوم ${PRICING.atShopFee} ${CURRENCY} — ${SHOP.hours}`}
              />
            </div>

            {order.service === "onsite" ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold">
                    موقعك أو رابط الموقع <span className="text-muted-foreground">(مطلوب)</span>
                  </label>
                  <input
                    value={order.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="مثال: المنامة، شارع ... أو ألصق رابط قوقل ماب"
                    className={field}
                  />
                  {errors.location && <FieldError text={errors.location} />}
                </div>

                {/* حالة طارئة */}
                <button
                  type="button"
                  onClick={() => set("emergency", !order.emergency)}
                  className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-start"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="size-5" />
                    <span>
                      <span className="block text-sm font-bold">حالة طارئة (أقرب وقت)</span>
                      <span className="block text-xs text-muted-foreground">
                        + {PRICING.emergencyFee} {CURRENCY} — وصول خلال 30–45 دقيقة
                      </span>
                    </span>
                  </span>
                  <span
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      order.emergency ? "bg-primary" : "bg-input"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-background transition-all ${
                        order.emergency ? "start-0.5" : "start-5.5"
                      }`}
                    />
                  </span>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted p-4 text-sm">
                <p className="font-bold">عنوان المحل</p>
                <a href={SHOP.mapUrl} target="_blank" rel="noreferrer" className="underline">
                  {SHOP.address}
                </a>
                <p className="mt-1 text-muted-foreground">ساعات العمل: {SHOP.hours}</p>
              </div>
            )}

            {/* البطارية القديمة */}
            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-bold">هل تريد الاحتفاظ بالبطارية القديمة؟</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Choice
                  active={order.keepOldBattery}
                  onClick={() => set("keepOldBattery", true)}
                  label="نعم، أحتفظ بها"
                />
                <Choice
                  active={!order.keepOldBattery}
                  onClick={() => set("keepOldBattery", false)}
                  label="لا أريدها (خصم)"
                />
              </div>
              {!order.keepOldBattery && (
                <div className="fade-up mt-3">
                  <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                    حجم البطارية القديمة
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["small", "medium", "large"] as OldBatterySize[]).map((s) => (
                      <Choice
                        key={s}
                        active={order.oldBatterySize === s}
                        onClick={() => set("oldBatterySize", s)}
                        label={`${oldSizeLabel(s)} −${PRICING.oldBatteryDiscount[s]}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* بيانات العميل */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold">الاسم</label>
                <input
                  value={order.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="اسمك الكريم"
                  className={field}
                />
                {errors.name && <FieldError text={errors.name} />}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold">رقم الجوال</label>
                <input
                  value={order.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  inputMode="tel"
                  dir="ltr"
                  placeholder="3xxxxxxx"
                  className={field}
                />
                {errors.phone && <FieldError text={errors.phone} />}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold">
                ملاحظات <span className="text-muted-foreground">(اختياري)</span>
              </label>
              <textarea
                value={order.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-input bg-background p-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* ملخص التكلفة */}
          <div className="fade-up card-elevated p-4 sm:p-6">
            <h2 className="font-display text-lg font-extrabold">ملخص التكلفة</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {cost.lines.map((line) => (
                <div key={line.label} className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{line.label}</dt>
                  <dd className="font-bold" dir="ltr">
                    {money(line.amount)}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-display text-base font-extrabold">الإجمالي النهائي</span>
              <span className="font-display text-2xl font-extrabold" dir="ltr">
                {money(cost.total)}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              المدة التقديرية: {etaFor(order)}
            </p>
            <button
              type="button"
              onClick={confirm}
              className="mt-4 h-13 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
            >
              تأكيد الطلب
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-muted px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={strong ? "font-display text-base font-extrabold" : "font-bold"}>{value}</dd>
    </div>
  );
}

function FieldError({ text }: { text: string }) {
  return <p className="mt-1.5 text-xs font-bold text-destructive">{text}</p>;
}

function Choice({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-xl border px-2 text-xs font-bold transition-colors ${
        active ? "border-foreground bg-primary text-primary-foreground" : "border-border"
      }`}
    >
      {label}
    </button>
  );
}

function ServiceCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-4 text-start transition-all ${
        active ? "border-foreground bg-accent" : "border-border hover:border-foreground/40"
      }`}
    >
      {icon}
      <span>
        <span className="block font-display text-sm font-extrabold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}
