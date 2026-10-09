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

function formatFare(value: number) {
  return `৳${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function VehicleMixChart({
  data,
}: {
  data: { vehicleType: string; count: number; estimatedFare: number }[];
}) {
  const reduce = useReducedMotion();

  return (
    <Card className="border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Vehicle mix
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Ride counts by vehicle type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-sm text-sky-200/70">No vehicle data yet.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-[2/1] w-full min-h-[220px]"
          >
            <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="#0c4a6e" strokeOpacity={0.5} />
              <XAxis
                dataKey="vehicleType"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#7dd3fc", fontSize: 11 }}
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
                    labelKey="vehicleType"
                    formatter={(value, _name, item) => {
                      const fare = Number(item.payload?.estimatedFare ?? 0);
                      return (
                        <div className="flex flex-1 justify-between gap-4 leading-none">
                          <span className="text-sky-200/70">Rides</span>
                          <span className="font-mono font-medium text-sky-50 tabular-nums">
                            {Number(value).toLocaleString()}
                            <span className="ml-2 text-sky-200/60">
                              · {formatFare(fare)}
                            </span>
                          </span>
                        </div>
                      );
                    }}
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
