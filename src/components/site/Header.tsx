import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import logo from "@/assets/logo-black.png";
import { SHOP } from "@/data/config";
import { waLink } from "@/lib/order";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/batteries", label: "البطاريات" },
  { to: "/how-it-works", label: "كيف تعمل الخدمة" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

/**
 * الهيدر: قائمة (☰) في جهة، الشعار في المنتصف، وحقيبة الطلب في الجهة الثانية.
 * بدون بحث وبدون أيقونة الحساب.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-[4.5rem] max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4">
        {/* جهة البداية: زر القائمة (جوال) أو الروابط (شاشة كبيرة) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={open}
            className="-ms-2 grid size-11 place-items-center rounded-lg transition-colors hover:bg-accent lg:hidden"
          >
            {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* المنتصف: الشعار */}
        <Link to="/" aria-label={SHOP.name} className="justify-self-center">
          <img
            src={logo}
            alt={SHOP.name}
            width={456}
            height={180}
            className="h-11 w-auto dark:invert"
          />
        </Link>

        {/* جهة النهاية: الطلب عبر واتساب */}
        <div className="flex justify-end">
          <a
            href={waLink(`السلام عليكم، أبغى أطلب بطارية — ${SHOP.name}`)}
            target="_blank"
            rel="noreferrer"
            aria-label="اطلب عبر واتساب"
            className="-me-2 grid size-11 place-items-center rounded-lg transition-colors hover:bg-accent"
          >
            <ShoppingBag className="size-6" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col p-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
