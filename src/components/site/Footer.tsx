import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { SHOP } from "@/data/config";

export function Footer() {
  return (
    <footer className="surface-ink mt-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-extrabold">{SHOP.name}</h3>
          <p className="mt-2 text-sm opacity-70">
            بيع وتركيب بطاريات السيارات — في موقعك أو في المحل.
          </p>
        </div>
        <ul className="space-y-3 text-sm opacity-80">
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <a href={SHOP.mapUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {SHOP.address}
            </a>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-4 shrink-0" />
            {SHOP.hours}
          </li>
          <li className="flex items-start gap-2">
            <Phone className="mt-0.5 size-4 shrink-0" />
            <span dir="ltr">+{SHOP.whatsapp}</span>
          </li>
        </ul>
        <ul className="space-y-2 text-sm opacity-80">
          <li>
            <Link to="/batteries" className="hover:underline">
              البطاريات
            </Link>
          </li>
          <li>
            <Link to="/how-it-works" className="hover:underline">
              كيف تعمل الخدمة
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:underline">
              تواصل معنا
            </Link>
          </li>
        </ul>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-50">
        © {new Date().getFullYear()} {SHOP.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
