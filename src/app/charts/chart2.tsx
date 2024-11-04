"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {getFallDetection} from "@/app/actions/actions"; // Adjust the import path as necessary

// Chart configuration
const chartConfig = {
    desktop: {
        label: "Fall Detected",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function Chart2() {
    const [chartData, setChartData] = useState<{ time: string; fall_detected: number }[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());

    useEffect(() => {
        async function fetchAndProcessData() {
            const data = await getFallDetection(selectedDate, selectedHour);
            if (!data) return;

            // Get the current date and hour for filtering
            const currentHour = new Date().getHours();

            // Process data to fit chart requirements
            const processedData = data
                .map(item => ({
                    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toString(),
                    fall_detected: item.fall_detected ? 10 : 5, // Convert boolean to 1 or 0 for chart display
                }));

            setChartData(processedData);
        }

        fetchAndProcessData();
    }, [selectedDate, selectedHour]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fall Detection Chart</CardTitle>
                <CardDescription>Displaying falls detected in the selected hour</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4">
                    <div>
                        <label>Date: </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label>Hour: </label>
                        <input
                            type="number"
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(Number(e.target.value))}
                            min="0"
                            max="23"
                            className="border rounded px-2 py-1"
                        />
                    </div>
                </div>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />

                        <Line
                            dataKey="fall_detected"
                            type="linear"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />


                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing fall detections for the current hour
                </div>
            </CardFooter>
        </Card>
    );
}


// "use client"
//
// import { TrendingUp } from "lucide-react"
// import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
//
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
//
// export const description = "A linear line chart"
//
// const chartData = [
//     { month: "00", desktop: 186 },
//     { month: "05", desktop: 305 },
//     { month: "10", desktop: 237 },
//     { month: "15", desktop: 73 },
//     { month: "20", desktop: 209 },
//     { month: "25", desktop: 214 },
//     { month: "30", desktop: 186 },
//     { month: "35", desktop: 305 },
//     { month: "40", desktop: 237 },
//     { month: "45", desktop: 73 },
//     { month: "50", desktop: 209 },
//     { month: "55", desktop: 214 },
// ]
//
// const chartConfig = {
//     desktop: {
//         label: "Desktop",
//         color: "hsl(var(--chart-1))",
//     },
// } satisfies ChartConfig
//
// export function Chart2() {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Line Chart - Linear</CardTitle>
//                 <CardDescription>January - June 2024</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig}>
//                     <LineChart
//                         accessibilityLayer
//                         data={chartData}
//                         margin={{
//                             left: 12,
//                             right: 12,
//                         }}
//                     >
//                         <CartesianGrid vertical={false} />
//                         <XAxis
//                             dataKey="month"
//                             tickLine={false}
//                             axisLine={false}
//                             tickMargin={8}
//                             tickFormatter={(value) => value.slice(0, 3)}
//                         />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Line
//                             dataKey="desktop"
//                             type="linear"
//                             stroke="var(--color-desktop)"
//                             strokeWidth={2}
//                             dot={false}
//                         />
//                     </LineChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col items-start gap-2 text-sm">
//                 <div className="flex gap-2 font-medium leading-none">
//                     Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="leading-none text-muted-foreground">
//                     Showing total visitors for the last 6 months
//                 </div>
//             </CardFooter>
//         </Card>
//     )
// }
