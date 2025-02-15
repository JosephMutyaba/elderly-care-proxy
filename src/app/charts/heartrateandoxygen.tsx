"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
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
import {getHeartbeatAndOxygenLevel} from "@/app/actions/heartrateoxygen_actions";

// Chart configuration
const chartConfig = {
    desktop: {
        label: "Heart Rate",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "SpO2",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function HeartAndOxygenLevelCharts() {
    const [chartData, setChartData] = useState<{ time: string; heart_rate: number | null; spo2: number | null }[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());

    useEffect(() => {
        async function fetchAndProcessData() {
            const data = await getHeartbeatAndOxygenLevel(selectedDate, selectedHour);
            if (!data) return;

            const processedData = data.map(item => ({
                time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                heart_rate: item.heart_rate,
                spo2: item.spo2,
            }));

            setChartData(processedData);
        }

        fetchAndProcessData();

        // Set up interval for subsequent fetches
        const intervalId = setInterval(fetchAndProcessData, 60000); // 60000 ms = 1 minute

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);

    }, [selectedDate, selectedHour]);

    return (
        <div className="w-full p-4">
            <div className="flex gap-4 mb-4 w-full">
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
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Heart rate</CardTitle>
                        {/* <CardDescription>Filter by date and hour</CardDescription> */}
                    </CardHeader>
                    <CardContent>

                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 5)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line
                                    dataKey="heart_rate"
                                    type="monotone"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Showing data for selected date and hour
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Blood oxygen level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={true} />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 5)}
                                />
                                
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                                <Line
                                    dataKey="spo2"
                                    type="monotone"
                                    stroke="var(--color-mobile)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Showing data for selected date and hour
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

            </div>
            <div className="w-full mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Combined Heart rate and oxygen level</CardTitle>
                        {/* <CardDescription>combined</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        {/* <div className="flex gap-4 mb-4">
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
                        </div> */}
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 5)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line
                                    dataKey="heart_rate"
                                    type="monotone"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="spo2"
                                    type="monotone"
                                    stroke="var(--color-mobile)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Showing data for selected date and hour
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
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
// import {useEffect, useState} from "react";
// import {getFallDetection, getHeartbeatAndOxygenLevel} from "@/app/actions/actions";
//
// export const description = "A multiple line chart"
//
// // const chartData = [
// //     { month: "00", desktop: 186, mobile: 80 },
// //     { month: "05", desktop: 305, mobile: 200 },
// //     { month: "10", desktop: 237, mobile: 120 },
// //     { month: "15", desktop: 73, mobile: 190 },
// //     { month: "20", desktop: 209, mobile: 130 },
// //     { month: "25", desktop: 214, mobile: 140 },
// //     { month: "30", desktop: 186, mobile: 80 },
// //     { month: "35", desktop: 305, mobile: 200 },
// //     { month: "40", desktop: 237, mobile: 120 },
// //     { month: "45", desktop: 73, mobile: 190 },
// //     { month: "50", desktop: 209, mobile: 130 },
// //     { month: "55", desktop: 214, mobile: 140 },
// // ]
//
// const chartConfig = {
//     desktop: {
//         label: "Desktop",
//         color: "hsl(var(--chart-1))",
//     },
//     mobile: {
//         label: "Mobile",
//         color: "hsl(var(--chart-2))",
//     },
// } satisfies ChartConfig
//
// export function Chart1() {
//     const [chartData, setChartData] = useState<{ time: string; heart_rate: number|null; spo2: number|null }[]>([]);
//
//     useEffect(() => {
//         async function fetchAndProcessData() {
//             const data = await getHeartbeatAndOxygenLevel();
//             if (!data) return;
//
//             // Get the current date and hour for filtering
//             const currentHour = new Date().getHours();
//
//             // Process data to fit chart requirements
//             const processedData = data
//                 .filter(item => new Date(item.created_at).getHours() === currentHour)
//                 .map(item => ({
//                     time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toString(),
//                     heart_rate: item.heart_rate, // Convert boolean to 1 or 0 for chart display
//                     spo2: item.spo2, // Convert boolean to 1 or 0 for chart display
//                 }));
//
//             setChartData(processedData);
//         }
//
//         fetchAndProcessData();
//     }, []);
//
//
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Line Chart - Multiple</CardTitle>
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
//                             dataKey="time"
//                             tickLine={false}
//                             axisLine={false}
//                             tickMargin={8}
//                             tickFormatter={(value) => value.slice(0, 5)}
//                         />
//                         <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//                         <Line
//                             dataKey="heart_rate"
//                             type="monotone"
//                             stroke="var(--color-desktop)"
//                             strokeWidth={2}
//                             dot={false}
//                         />
//                         <Line
//                             dataKey="spo2"
//                             type="monotone"
//                             stroke="var(--color-mobile)"
//                             strokeWidth={2}
//                             dot={false}
//                         />
//                     </LineChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter>
//                 <div className="flex w-full items-start gap-2 text-sm">
//                     <div className="grid gap-2">
//                         <div className="flex items-center gap-2 font-medium leading-none">
//                             Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//                         </div>
//                         <div className="flex items-center gap-2 leading-none text-muted-foreground">
//                             Showing total visitors for the last 6 months
//                         </div>
//                     </div>
//                 </div>
//             </CardFooter>
//         </Card>
//     )
// }
