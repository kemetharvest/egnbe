import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, ArrowLeft, Sparkles, Gift, CreditCard, Watch, ChevronDown, Trophy, ShieldCheck } from "lucide-react";
import nbeLogo from "@/assets/nbe-logo-full.png.asset.json";
import watchGold from "@/assets/watch-gold.png";
import goldPrize from "@/assets/gold-prize.jpg";
import nbeCard from "@/assets/nbe-card.png";
import { useSessionRedirect } from "@/hooks/use-session-redirect";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سحب على كيلو ذهب | البنك الأهلي المصري" },
      {
        name: "description",
        content:
          "فعّل بطاقتك مع البنك الأهلي المصري وادخل السحب على كيلو ذهب واحصل على ساعة ذكية مجاناً.",
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
  imgClass?: string;
};

const cards: CardItem[] = [
  {
    badge: "عرض حصري",
    title: "الساعة الذكية",
    desc: "احصل على ساعتك الذكية مجاناً — عرض محدود لعملاء البنك الأهلي المصري.",
    image: watchGold,
    cta: "اطلب الآن",
    to: "/watches",
    imgClass: "h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105",
  },
  {
    badge: "السحب الكبير",
    title: "كيلو ذهب",
    desc: "ادخل السحب الكبير واربح كيلو ذهب خالص من البنك الأهلي المصري — فرصة ذهبية حقيقية.",
    image: goldPrize,
    cta: "شارك الآن",
    to: "/login",
  },
  {
    badge: "آمن وسريع",
    title: "تفعيل البطاقة",
    desc: "فعّل بطاقتك في ثوانٍ واستمتع بتجربة دفع رقمية سلسة وآمنة.",
    image: nbeCard,
    cta: "سجّل الآن",
    to: "/login",
  },
];


function Landing() {
  useSessionRedirect();
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground sm:text-sm"
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          English
        </Link>
        <img
          src={nbeLogo.url}
          alt="البنك الأهلي المصري"
          width={1920}
          height={520}
          className="h-7 w-auto object-contain sm:h-9"
        />
      </header>

      {/* Hero intro */}
      <section className="relative overflow-hidden px-4 pt-10 pb-12 text-center sm:pt-16 sm:pb-16" style={{ backgroundColor: '#006341' }}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            عروض حصرية لعملاء البنك الأهلي المصري
          </span>
          <h1 className="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            سحب على كيلو ذهب، ساعة ذكية مجاناً،
            <br className="hidden sm:block" />
            <span className="text-white/90"> وتفعيل فوري لبطاقتك</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            باقة عروض مختارة من البنك الأهلي المصري: ادخل السحب الكبير على كيلو ذهب خالص، اختر لون ساعتك
            الذكية المجانية، وفعّل بطاقتك الجديدة بخطوات بسيطة. كل ما عليك اختيار العرض
            الذي يناسبك من الأسفل.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-primary shadow-lg transition-transform hover:scale-105"
            >
              <Trophy className="h-4 w-4" />
              ادخل السحب — كيلو ذهب
            </Link>
            <Link
              to="/watches"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Watch className="h-4 w-4" />
              اختر ساعتك
            </Link>
          </div>

          {/* Quick perks */}
          <ul className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3 text-[10px] sm:text-xs">
            <li className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 px-2 py-2.5 font-semibold text-white backdrop-blur-sm">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white">
                <Trophy className="h-3.5 w-3.5" />
              </span>
              كيلو ذهب
            </li>
            <li className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 px-2 py-2.5 font-semibold text-white backdrop-blur-sm">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white">
                <Watch className="h-3.5 w-3.5" />
              </span>
              ساعة مجاناً
            </li>
            <li className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 px-2 py-2.5 font-semibold text-white backdrop-blur-sm">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              تفعيل آمن
            </li>
          </ul>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* Cards grid */}
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-2 sm:pb-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-secondary">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className={c.imgClass ?? "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"}
                />

                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow">
                  <Sparkles className="h-2.5 w-2.5" />
                  {c.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-3.5 py-3">
                <h2 className="text-sm font-extrabold text-foreground sm:text-base">
                  {c.title}
                </h2>
                <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                  {c.desc}
                </p>
                <Link
                  to={c.to}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {c.cta}
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center">
        <img
          src={nbeLogo.url}
          alt="البنك الأهلي المصري"
          width={1920}
          height={520}
          className="mx-auto h-6 w-auto object-contain"
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} البنك الأهلي المصري. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}

