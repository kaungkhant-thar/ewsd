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
import { ChartsData } from "./api";

type Props = {
  chartData: ChartsData;
};

export function SystemReportPie({ chartData }: Props) {
  const charts = chartData.data.map((dept, index) => ({
    label: dept.departmentName,
    value: dept.ideaCount,
    percent: dept.percentage,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const config = charts.reduce((acc, chart, index) => {
    acc[chart.label] = {
      label: chart.label,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);
  console.log({ config, charts });

  return (
    <Card className="flex flex-col">
      <CardHeader className=" pb-0">
        <CardTitle className="text-base font-semibold">
          Percentages of ideas by each Department
        </CardTitle>
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
                            {chartData.totalIdeas}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Ideas
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex-1 pb-0 flex items-center gap-6">
          <ul className="flex-1 space-y-3 ">
            {charts.map((chart, index) => (
              <li key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 "
                  style={{ backgroundColor: chart.fill }}
                />
                <span>{chart.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
