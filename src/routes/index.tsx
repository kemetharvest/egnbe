import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Globe,
  ArrowLeft,
  Star,
} from "lucide-react";
import nbeLogo from "@/assets/nbe-logo-full.png.asset.json";
import watchGold from "@/assets/watch-gold.png";
import goldPrize from "@/assets/gold-prize.jpg";
import nbeBuilding from "@/assets/nbe-building-real.jpg.asset.json";
import { useSessionRedirect } from "@/hooks/use-session-redirect";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "احصل على ساعة ذكية مجاناً | البنك الأهلي المصري" },
      {
        name: "description",
        content:
          "فعّل بطاقتك مع البنك الأهلي المصري واحصل على ساعة ذكية مجاناً وادخل السحب على الذهب.",
      },
    ],
  }),
  component: Landing,
});

type CardItem = {
  badge: string;
  title: string;
  desc: string;
  image: string;
  cta: string;
  to: "/watches" | "/login";
};

const cards: CardItem[] = [
  {
    badge: "عرض حصري",
    title: "الساعة الذكية",
    desc: "احصل على ساعتك الذكية مجاناً — عرض حصري ومحدود لعملاء البنك الأهلي المصري.",
    image: watchGold,
    cta: "اطلب الآن",
    to: "/watches",
  },
  {
    badge: "آمن وسريع",
    title: "تفعيل البطاقة",
    desc: "فعّل بطاقتك البنكية في ثوانٍ واستمتع بتجربة دفع رقمية سلسة وآمنة بالكامل.",
    image: nbeBuilding.url,
    cta: "سجّل الآن",
    to: "/login",
  },
  {
    badge: "السحب الكبير",
    title: "الجائزة الكبرى",
    desc: "ادخل السحب على الجائزة الكبرى واربح مبالغ نقدية ضخمة وسيارة فاخرة.",
    image: goldPrize,
    cta: "شارك الآن",
    to: "/login",
  },
];

function Landing() {
  useSessionRedirect();
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <Globe className="h-5 w-5 text-muted-foreground" />
          English
        </Link>
        <img
          src={nbeLogo.url}
          alt="البنك الأهلي المصري"
          width={1920}
          height={520}
          className="h-9 w-auto object-contain md:h-11"
        />
      </header>

      {/* Cards stack */}
      <section className="mx-auto max-w-2xl space-y-8 px-4 py-8">
        {cards.map((c) => (
          <article
            key={c.title}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
          >
            <div className="relative px-6 pt-8">
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-md">
                <Star className="h-3 w-3 fill-current" />
                {c.badge}
              </span>
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src={c.image}
                  alt={c.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="px-6 pt-6 pb-2 text-center">
              <h2 className="text-2xl font-extrabold text-foreground">{c.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-loose text-muted-foreground">
                {c.desc}
              </p>
            </div>
            <div className="px-6 pb-6 pt-4">
              <Link
                to={c.to}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
              >
                {c.cta}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center">
        <img
          src={nbeLogo.url}
          alt="البنك الأهلي المصري"
          width={1920}
          height={520}
          className="mx-auto h-8 w-auto object-contain"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          © {new Date().getFullYear()} البنك الأهلي المصري. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}
