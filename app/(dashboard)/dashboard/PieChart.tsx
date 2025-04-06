"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type PieChartItem = {
  label: string;
  value: number;
  percent?: number;
};

type Props = {
  title: string;
  data: PieChartItem[];
  totalLabel?: string;
  totalValue?: number;
  getColor?: (index: number) => string;
};

export function PieChartCard({
  title,
  data,
  totalLabel = "Total",
  totalValue,
  getColor = (index) => `hsl(var(--chart-${index + 1}))`,
}: Props) {
  const charts = data.map((item, index) => ({
    ...item,
    fill: getColor(index),
  }));

  const config: ChartConfig = charts.reduce((acc, item, index) => {
    acc[item.label] = {
      label: item.label,
      color: getColor(index),
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ChartContainer
            config={config}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={charts}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                strokeWidth={5}
              >
                {totalValue !== undefined && (
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalValue}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              {totalLabel}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                )}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex-1 pb-0 flex items-center gap-6">
          <ul className="flex-1 space-y-3">
            {charts.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: item.fill }}
                />
                <span>
                  {item.label}
                  {item.percent !== undefined ? ` (${item.percent}%)` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
