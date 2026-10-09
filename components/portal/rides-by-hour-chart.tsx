"use client";

import { useReducedMotion } from "motion/react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

function fillHours(data: { hour: number; count: number }[]) {
  const byHour = new Map(data.map((row) => [row.hour, row.count]));
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: String(hour).padStart(2, "0"),
    count: byHour.get(hour) ?? 0,
  }));
}

export function RidesByHourChart({
  data,
}: {
  data: { hour: number; count: number }[];
}) {
  const reduce = useReducedMotion();
  const chartData = fillHours(data);
  const empty = chartData.every((row) => row.count === 0);

  return (
    <Card className="border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Rides by hour
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Hourly ride volume across the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="py-16 text-sm text-sky-200/70">No rides in this range.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-[2/1] w-full min-h-[220px]"
          >
            <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="#0c4a6e" strokeOpacity={0.5} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#7dd3fc", fontSize: 11 }}
                interval={2}
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
                    nameKey="count"
                    labelKey="label"
                    labelFormatter={(label) => `${label}:00`}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={!reduce}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
