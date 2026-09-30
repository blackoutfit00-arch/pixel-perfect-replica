import { CURRENCY, ETA, PRICING, SHOP } from "@/data/config";
import type { Battery } from "@/data/batteries";
import type { Car } from "@/data/cars";

export type ServiceType = "onsite" | "shop";
export type OldBatterySize = "small" | "medium" | "large";

export type OrderState = {
  service: ServiceType;
  emergency: boolean;
  keepOldBattery: boolean;
  oldBatterySize: OldBatterySize;
  name: string;
  phone: string;
  location: string;
  notes: string;
};

export const initialOrderState: OrderState = {
  service: "onsite",
  emergency: false,
  keepOldBattery: true,
  oldBatterySize: "medium",
  name: "",
  phone: "",
  location: "",
  notes: "",
};

export type CostLine = { label: string; amount: number };

/** حساب ملخص التكلفة — يتحدث مع كل تغيير */
export function calcCost(battery: Battery, order: OrderState) {
  const lines: CostLine[] = [{ label: "سعر البطارية", amount: battery.price }];

  const installFee = order.service === "onsite" ? PRICING.onSiteFee : PRICING.atShopFee;
  lines.push({
    label: order.service === "onsite" ? "رسوم التركيب في موقعك" : "رسوم التركيب في المحل",
    amount: installFee,
  });

  if (order.service === "onsite" && order.emergency) {
    lines.push({ label: "رسوم الحالة الطارئة", amount: PRICING.emergencyFee });
  }

  if (!order.keepOldBattery) {
    lines.push({
      label: `خصم تسليم البطارية القديمة (${oldSizeLabel(order.oldBatterySize)})`,
      amount: -PRICING.oldBatteryDiscount[order.oldBatterySize],
    });
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { lines, total: Math.max(total, 0) };
}

export function oldSizeLabel(size: OldBatterySize) {
  return size === "small" ? "صغيرة" : size === "medium" ? "متوسطة" : "كبيرة";
}

export function money(amount: number) {
  const abs = Math.abs(amount).toFixed(2);
  return `${amount < 0 ? "−" : ""}${abs} ${CURRENCY}`;
}

export function etaFor(order: OrderState) {
  if (order.service === "shop") return ETA.atShop;
  return order.emergency ? ETA.emergency : ETA.normal;
}

/** رقم طلب قصير */
export function makeOrderNumber() {
  const n = Math.floor(Math.random() * 9000) + 1000;
  const d = new Date();
  const stamp = `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `AR-${stamp}-${n}`;
}

/** رابط واتساب جاهز */
export function waLink(message: string) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(args: {
  orderNumber: string;
  car: Car;
  year: number | null;
  battery: Battery;
  order: OrderState;
  total: number;
}) {
  const { orderNumber, car, year, battery, order, total } = args;
  return [
    `طلب جديد — ${SHOP.name}`,
    `رقم الطلب: ${orderNumber}`,
    `الاسم: ${order.name}`,
    `الجوال: ${order.phone}`,
    `السيارة: ${car.brand} ${car.model}${year ? ` ${year}` : ""}`,
    `البطارية: ${battery.name} (${battery.size} — ${battery.ah}A)`,
    `الخدمة: ${order.service === "onsite" ? "تركيب في موقعي" : "الحضور إلى المحل"}`,
    order.service === "onsite" ? `الموقع: ${order.location}` : `المحل: ${SHOP.address}`,
    order.service === "onsite" ? `حالة طارئة: ${order.emergency ? "نعم" : "لا"}` : "",
    `البطارية القديمة: ${order.keepOldBattery ? "أحتفظ بها" : `تسليمها لكم (${oldSizeLabel(order.oldBatterySize)})`}`,
    order.notes ? `ملاحظات: ${order.notes}` : "",
    `الإجمالي: ${total.toFixed(2)} ${CURRENCY}`,
    "",
    "مرفق صورة الحوالة البنكية 👇",
  ]
    .filter(Boolean)
    .join("\n");
}
