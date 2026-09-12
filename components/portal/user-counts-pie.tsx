"use client";

import { useReducedMotion } from "motion/react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type RoleCounts = {
  admin: number;
  rider: number;
  driver: number;
};

const chartConfig = {
  count: { label: "Accounts" },
  admin: { label: "Admins", color: "#7dd3fc" },
  rider: { label: "Riders", color: "#38bdf8" },
  driver: { label: "Drivers", color: "#0369a1" },
} satisfies ChartConfig;

const ROLES = ["admin", "rider", "driver"] as const;

export function UserCountsPie({ counts }: { counts: RoleCounts }) {
  const reduce = useReducedMotion();
  const chartData = ROLES.map((role) => ({
    role,
    count: counts[role],
    fill: `var(--color-${role})`,
  }));
  const total = counts.admin + counts.rider + counts.driver;

  return (
    <Card className="border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Accounts
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Admins, riders, and drivers currently on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="py-16 text-sm text-sky-200/70">No accounts yet.</p>
        ) : (
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_12rem]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[280px] min-h-[220px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="role"
                      className="bg-sky-950 text-sky-50 ring-sky-800"
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="role"
                  stroke="#082f49"
                  strokeWidth={2}
                  isAnimationActive={!reduce}
                />
              </PieChart>
            </ChartContainer>
            <ul className="grid gap-4">
              {ROLES.map((role) => (
                <li
                  key={role}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className="flex items-center gap-2 text-sm text-sky-200">
                    <span
                      className="size-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: chartConfig[role].color }}
                      aria-hidden
                    />
                    {chartConfig[role].label}
                  </span>
                  <span className="font-mono text-lg tabular-nums text-sky-50">
                    {counts[role].toLocaleString()}
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4 border-t border-sky-800/60 pt-4">
                <span className="text-sm text-sky-200/70">Total</span>
                <span className="font-mono text-lg tabular-nums text-sky-50">
                  {total.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
