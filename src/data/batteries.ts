/**
 * ======================================================
 *  البطاريات المتوفرة عندنا
 *  عدّل الأسعار / الضمان / التوفر من هنا
 * ======================================================
 */

import batteryDark from "@/assets/battery-dark.jpg";
import batteryLight from "@/assets/battery-light.jpg";

export type Battery = {
  id: string;
  /** اسم البطارية */
  name: string;
  /** الماركة */
  brand: string;
  /** المقاس — لازم يطابق batterySize في ملف cars.ts */
  size: string;
  /** الأمبير */
  ah: number;
  /** الضمان بالأشهر */
  warrantyMonths: number;
  /** السعر */
  price: number;
  /** الصورة */
  image: string;
  /** حالة التوفر */
  inStock: boolean;
};

export const BATTERIES: Battery[] = [
  { id: "b1", name: "AMARON Pro", brand: "أمارون", size: "NS70", ah: 65, warrantyMonths: 24, price: 32, image: batteryDark, inStock: true },
  { id: "b2", name: "AC Delco Gold", brand: "إيه سي ديلكو", size: "NS70", ah: 70, warrantyMonths: 18, price: 28, image: batteryLight, inStock: true },
  { id: "b3", name: "AMARON Hi-Life", brand: "أمارون", size: "NS60", ah: 45, warrantyMonths: 18, price: 22, image: batteryDark, inStock: true },
  { id: "b4", name: "Solite Silver", brand: "سولايت", size: "NS60", ah: 50, warrantyMonths: 12, price: 19, image: batteryLight, inStock: true },
  { id: "b5", name: "Varta Blue N70", brand: "فارتا", size: "N70", ah: 70, warrantyMonths: 24, price: 38, image: batteryDark, inStock: true },
  { id: "b6", name: "Bosch S4 N70", brand: "بوش", size: "N70", ah: 75, warrantyMonths: 24, price: 42, image: batteryLight, inStock: false },
  { id: "b7", name: "Varta DIN74 AGM", brand: "فارتا", size: "DIN74", ah: 74, warrantyMonths: 30, price: 55, image: batteryDark, inStock: true },
  { id: "b8", name: "Solite DIN55", brand: "سولايت", size: "DIN55", ah: 55, warrantyMonths: 18, price: 24, image: batteryLight, inStock: true },
  { id: "b9", name: "AC Delco N50Z", brand: "إيه سي ديلكو", size: "N50Z", ah: 60, warrantyMonths: 18, price: 26, image: batteryDark, inStock: true },
  { id: "b10", name: "Solite 65B24L", brand: "سولايت", size: "65B24L", ah: 45, warrantyMonths: 12, price: 17, image: batteryLight, inStock: true },
];

/** البطاريات المطابقة لمقاس معين */
export function batteriesForSize(size: string): Battery[] {
  return BATTERIES.filter((b) => b.size === size);
}
