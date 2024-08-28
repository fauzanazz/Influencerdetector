"use client"

import React from 'react';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

interface GraphComponentProps {
    graphData: {
        "id" : string,
        "name" : string,
        "influence_score" : number,
    }[]
}

const GraphComponent: React.FC<GraphComponentProps> = ({ graphData }) => {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px]">
            <BarChart accessibilityLayer data={graphData}>
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={value => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="influence_score" fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
};

export default GraphComponent;