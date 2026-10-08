"use client";

import { useReducedMotion } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  count: { label: "Rides", color: "#38bdf8" },
} satisfies ChartConfig;

export function RidesOverTimeChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const reduce = useReducedMotion();

  return (
    <Card className="border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Rides over time
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Daily ride volume for the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-sm text-sky-200/70">No rides in this range.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-[2/1] w-full min-h-[220px]"
          >
            <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="#0c4a6e" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#7dd3fc", fontSize: 11 }}
                tickFormatter={(v: string) =>
                  v.length >= 10 ? v.slice(5) : v
                }
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fill: "#7dd3fc", fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-sky-950 text-sky-50 ring-sky-800"
                    labelFormatter={(label) => String(label)}
                  />
                }
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="var(--color-count)"
                fillOpacity={0.25}
                stroke="var(--color-count)"
                strokeWidth={2}
                isAnimationActive={!reduce}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
