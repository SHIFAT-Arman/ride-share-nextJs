import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardClass =
  "border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]";

/** Small status card used on rider/driver dashboards. */
export function StatusCard({ status }: { status: string }) {
  return (
    <Card className={cardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Status
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Current account status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-lg tracking-wide text-sky-50 uppercase">
          {status.replaceAll("_", " ")}
        </p>
      </CardContent>
    </Card>
  );
}

/** Read-only account summary for dashboards. */
export function AccountSummaryCard({
  firstName,
  lastName,
  email,
  phone,
}: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}) {
  return (
    <Card className={cardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Account
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Your profile summary. Edit it from the email link in the sidebar.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <Row label="Name" value={`${firstName} ${lastName}`} />
        <Row label="Email" value={email || "—"} />
        <Row label="Phone" value={phone || "—"} />
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-sky-800/40 pb-2 last:border-0 last:pb-0">
      <span className="text-sky-200/70">{label}</span>
      <span className="truncate text-right text-sky-50">{value}</span>
    </div>
  );
}
