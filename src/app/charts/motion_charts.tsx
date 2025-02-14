"use client";

import { useEffect, useState } from "react";
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
import { getMotionValues } from "../actions/motion_sensor_actions";

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
    mobilerd: {
        label: "rd",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function MotionDataCharts() {
    const [chartData, setChartData] = useState<{
        time: string; 
        acc_x: number | null; 
        acc_y: number | null; 
        acc_z: number | null 
        gyro_x: number | null; 
        gyro_y: number | null; 
        gyro_z: number | null; 
        temperature: number | null; 
    }[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());

    useEffect(() => {
        async function fetchAndProcessData() {
            const data = await getMotionValues(selectedDate, selectedHour);
            if (!data) return;

            const processedData = data.map(item => ({
                time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                acc_x: item.accel_x,
                acc_y: item.accel_y,
                acc_z: item.accel_z,
                gyro_x: item.gyro_x,
                gyro_y: item.gyro_y,
                gyro_z: item.gyro_z,
                temperature: item.temperature,
            }));

            setChartData(processedData);
        }

        fetchAndProcessData();
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
                        <CardTitle>Accelerometer Readings</CardTitle>
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
                                    dataKey="acc_x"
                                    type="monotone"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="acc_y"
                                    type="monotone"
                                    stroke="var(--color-mobile)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="acc_z"
                                    type="monotone"
                                    stroke="var(--color-mobilerd)"
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
                        <CardTitle>Gyrometer Readings</CardTitle>
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
                                    dataKey="gyro_x"
                                    type="monotone"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="gyro_y"
                                    type="monotone"
                                    stroke="var(--color-mobile)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="gyro_z"
                                    type="monotone"
                                    stroke="var(--color-mobilerd)"
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
                        <CardTitle>Temperature</CardTitle>
                        {/* <CardDescription>combined</CardDescription> */}
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
                                    dataKey="temperature"
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
            </div>
        </div>
    );
}
