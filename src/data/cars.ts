/**
 * ======================================================
 *  قاعدة بيانات السيارات ومقاس البطارية المناسب
 *  عدّل / أضف سيارات بحرية — المهم يكون batterySize
 *  مطابق لأحد المقاسات في ملف batteries.ts
 * ======================================================
 */

export type Car = {
  id: string;
  brand: string;
  model: string;
  /** أول سنة مدعومة */
  yearFrom: number;
  /** آخر سنة مدعومة */
  yearTo: number;
  /** مقاس البطارية المناسب */
  batterySize: string;
  /** كلمات بحث إضافية (إنجليزي / لهجة) */
  aliases: string[];
};

export const CARS: Car[] = [
  { id: "camry", brand: "تويوتا", model: "كامري", yearFrom: 2012, yearTo: 2026, batterySize: "NS70", aliases: ["camry", "toyota"] },
  { id: "corolla", brand: "تويوتا", model: "كورولا", yearFrom: 2010, yearTo: 2026, batterySize: "NS60", aliases: ["corolla", "toyota"] },
  { id: "landcruiser", brand: "تويوتا", model: "لاندكروزر", yearFrom: 2008, yearTo: 2026, batterySize: "N70", aliases: ["land cruiser", "gxr", "vxr"] },
  { id: "prado", brand: "تويوتا", model: "برادو", yearFrom: 2010, yearTo: 2026, batterySize: "N70", aliases: ["prado"] },
  { id: "hilux", brand: "تويوتا", model: "هايلكس", yearFrom: 2010, yearTo: 2026, batterySize: "N50Z", aliases: ["hilux"] },
  { id: "yaris", brand: "تويوتا", model: "يارس", yearFrom: 2010, yearTo: 2026, batterySize: "65B24L", aliases: ["yaris"] },
  { id: "accord", brand: "هوندا", model: "أكورد", yearFrom: 2010, yearTo: 2026, batterySize: "NS70", aliases: ["accord", "honda"] },
  { id: "civic", brand: "هوندا", model: "سيفيك", yearFrom: 2010, yearTo: 2026, batterySize: "NS60", aliases: ["civic", "honda"] },
  { id: "altima", brand: "نيسان", model: "التيما", yearFrom: 2010, yearTo: 2026, batterySize: "NS70", aliases: ["altima", "nissan"] },
  { id: "patrol", brand: "نيسان", model: "باترول", yearFrom: 2010, yearTo: 2026, batterySize: "N70", aliases: ["patrol"] },
  { id: "sunny", brand: "نيسان", model: "صني", yearFrom: 2012, yearTo: 2026, batterySize: "65B24L", aliases: ["sunny"] },
  { id: "sonata", brand: "هيونداي", model: "سوناتا", yearFrom: 2011, yearTo: 2026, batterySize: "DIN55", aliases: ["sonata", "hyundai"] },
  { id: "elantra", brand: "هيونداي", model: "النترا", yearFrom: 2011, yearTo: 2026, batterySize: "DIN55", aliases: ["elantra", "hyundai"] },
  { id: "tahoe", brand: "شيفروليه", model: "تاهو", yearFrom: 2010, yearTo: 2026, batterySize: "DIN74", aliases: ["tahoe", "chevrolet"] },
  { id: "bmw5", brand: "بي إم دبليو", model: "الفئة الخامسة", yearFrom: 2010, yearTo: 2026, batterySize: "DIN74", aliases: ["bmw", "5 series"] },
];

/** كل الماركات المتوفرة */
export const BRANDS = Array.from(new Set(CARS.map((c) => c.brand)));

/** موديلات ماركة معينة */
export function modelsOfBrand(brand: string): Car[] {
  return CARS.filter((c) => c.brand === brand);
}

/** سنوات مدعومة لسيارة */
export function yearsOfCar(car: Car): number[] {
  const years: number[] = [];
  for (let y = car.yearTo; y >= car.yearFrom; y--) years.push(y);
  return years;
}

/** بحث حر: "كامري 2018" أو "camry" */
export function searchCars(query: string): Car[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((w) => !/^\d{4}$/.test(w));
  const text = words.join(" ");
  if (!text) return [];
  return CARS.filter((c) => {
    const haystack = `${c.brand} ${c.model} ${c.aliases.join(" ")}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

/** استخراج سنة من نص حر */
export function extractYear(query: string): number | null {
  const m = query.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}
