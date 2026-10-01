/**
 * ======================================================
 *  الشركات (الماركات) — عدّل من هنا
 *  - الترتيب هنا هو ترتيب ظهورها في صفحة البطاريات
 *  - `name` لازم يطابق حقل brand في ملف batteries.ts
 *  - لإضافة شعار حقيقي: حط الصورة في src/assets/brands/
 *    وأضف في أول الملف: import amaron from "@/assets/brands/amaron.png"
 *    ثم اكتب logo: amaron
 *  - لإخفاء شركة: احذف سطرها من القائمة
 * ======================================================
 */

export type Brand = {
  /** الاسم بالعربي — يطابق brand في batteries.ts */
  name: string;
  /** الاسم بالإنجليزي (يظهر كشعار نصي إذا ما فيه صورة) */
  en: string;
  /** بلد الصنع */
  madeIn: string;
  /** شعار الشركة (اختياري) */
  logo?: string;
};

export const BRANDS: Brand[] = [
  { name: "أمارون", en: "AMARON", madeIn: "الهند" },
  { name: "فارتا", en: "VARTA", madeIn: "ألمانيا" },
  { name: "بوش", en: "BOSCH", madeIn: "ألمانيا" },
  { name: "سولايت", en: "SOLITE", madeIn: "كوريا الجنوبية" },
  { name: "إيه سي ديلكو", en: "ACDelco", madeIn: "أمريكا" },
];
