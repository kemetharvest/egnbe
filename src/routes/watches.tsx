import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import nbeLogo from "@/assets/nbe-logo-full.png.asset.json";
import nbeBadge from "@/assets/nbe-logo-badge.png.asset.json";
import watchRoseGold from "@/assets/watch-rosegold.png";
import watchMidnight from "@/assets/watch-midnight.png";
import watchSilver from "@/assets/watch-silver.png";
import watchGold from "@/assets/watch-gold.png";
import watchBlue from "@/assets/watch-blue.png";
import watchGreen from "@/assets/watch-green.png";
import { useSessionRedirect } from "@/hooks/use-session-redirect";

export const Route = createFileRoute("/watches")({
  head: () => ({
    meta: [
      { title: "اختر لون ساعتك الذكية | البنك الأهلي المصري" },
      {
        name: "description",
        content: "اختر لون ساعتك الذكية المجانية من ٦ ألوان مميزة.",
      },
    ],
  }),
  component: WatchesPage,
});

const watches = [
  { src: watchGold, name: "جولد", desc: "ذهبي فاخر" },
  { src: watchRoseGold, name: "روز جولد", desc: "وردي ناعم" },
  { src: watchMidnight, name: "ميدنايت", desc: "أسود مطفي" },
  { src: watchSilver, name: "فضي", desc: "أبيض ناصع" },
  { src: watchBlue, name: "أزرق", desc: "كحلي أنيق" },
  { src: watchGreen, name: "أخضر", desc: "زمردي مميز" },
];

function WatchesPage() {
  useSessionRedirect();
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm font-semibold text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Link>
        <img
          src={nbeLogo.url}
          alt="البنك الأهلي المصري"
          width={1920}
          height={520}
          className="h-9 w-auto object-contain md:h-11"
        />
      </header>

      {/* Welcome banner with NBE badge logo */}
      <section className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:flex-row sm:gap-6 sm:p-6 sm:text-right">
          <div className="flex-shrink-0">
            <img
              src={nbeBadge.url}
              alt="شعار البنك الأهلي المصري"
              width={200}
              height={200}
              className="h-20 w-auto object-contain sm:h-24"
            />
          </div>
          <div className="mt-3 flex-1 sm:mt-0">
            <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
              هدية البنك الأهلي المصري لعملائنا المميزين
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              بمناسبة مرور 125 عاماً على تأسيس البنك الأهلي المصري، نقدم لكم ساعة ذكية مجاناً
              عند تفعيل بطاقتك. اختر لونك المفضّل من الأسفل واستمتع بتجربة رقمية متكاملة.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-8 pb-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-md">
          <Star className="h-3 w-3 fill-current" />
          عرض حصري
        </span>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
          اختر لون <span className="text-primary">ساعتك الذكية</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-loose text-muted-foreground">
          ٦ ألوان مميزة — اختر اللون المفضّل لك واستلم ساعتك مجاناً.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {watches.map((w) => (
            <Link
              key={w.name}
              to="/login"
              className="group flex flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src={w.src}
                  alt={w.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground md:text-lg">
                {w.name}
              </h3>
              <p className="text-xs text-muted-foreground md:text-sm">{w.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} البنك الأهلي المصري. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}