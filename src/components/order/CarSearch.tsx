import { useMemo, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import {
  BRANDS,
  CARS,
  extractYear,
  modelsOfBrand,
  searchCars,
  yearsOfCar,
  type Car,
} from "@/data/cars";
import { waLink } from "@/lib/order";

type Props = {
  onSelect: (car: Car, year: number | null) => void;
};

const field =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none transition-shadow focus:ring-2 focus:ring-ring";

export function CarSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [brand, setBrand] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState("");
  const [noResult, setNoResult] = useState(false);

  const suggestions = useMemo(() => searchCars(query).slice(0, 6), [query]);
  const models = useMemo(() => (brand ? modelsOfBrand(brand) : []), [brand]);
  const selectedModel = useMemo(() => CARS.find((c) => c.id === modelId), [modelId]);
  const years = useMemo(() => (selectedModel ? yearsOfCar(selectedModel) : []), [selectedModel]);

  function pick(car: Car, y: number | null) {
    setNoResult(false);
    onSelect(car, y);
  }

  function submitFree() {
    const found = searchCars(query);
    if (found.length > 0 && found[0]) {
      pick(found[0], extractYear(query));
    } else {
      setNoResult(true);
    }
  }

  function submitSelects() {
    if (selectedModel) pick(selectedModel, year ? Number(year) : null);
  }

  return (
    <div className="card-elevated p-4 sm:p-6">
      <h2 className="font-display text-lg font-extrabold">ابحث عن سيارتك</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        اكتب اسم سيارتك مباشرة مثل «كامري 2018» أو اختر من القوائم.
      </p>

      {/* بحث حر مع اقتراحات */}
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setNoResult(false);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && submitFree()}
          placeholder="مثال: كامري 2018"
          className={`${field} pe-11`}
        />
        {focused && query.trim() !== "" && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-lift)]">
            {suggestions.map((car) => (
              <li key={car.id}>
                <button
                  type="button"
                  onMouseDown={() => pick(car, extractYear(query))}
                  className="flex w-full items-center justify-between px-4 py-3 text-start text-sm font-semibold hover:bg-accent"
                >
                  <span>
                    {car.brand} {car.model}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {car.yearFrom}–{car.yearTo}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* القوائم: الماركة / الموديل / السنة */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setModelId("");
            setYear("");
          }}
          className={field}
        >
          <option value="">الماركة</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={modelId}
          onChange={(e) => {
            setModelId(e.target.value);
            setYear("");
          }}
          disabled={!brand}
          className={`${field} disabled:opacity-50`}
        >
          <option value="">الموديل</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.model}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={!modelId}
          className={`${field} disabled:opacity-50`}
        >
          <option value="">سنة الصنع</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => (selectedModel ? submitSelects() : submitFree())}
        className="mt-4 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
      >
        اعرض البطاريات المناسبة
      </button>

      {noResult && (
        <div className="fade-up mt-4 rounded-xl border border-border bg-muted p-4">
          <p className="text-sm font-semibold">ما لقينا سيارتك في القائمة 😅</p>
          <p className="mt-1 text-sm text-muted-foreground">
            راسلنا على الواتساب ونحدد لك مقاس البطارية المناسب فورًا.
          </p>
          <a
            href={waLink(`السلام عليكم، سيارتي: ${query} — وش البطارية المناسبة لها؟`)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <MessageCircle className="size-4" />
            اسألنا على واتساب
          </a>
        </div>
      )}
    </div>
  );
}
