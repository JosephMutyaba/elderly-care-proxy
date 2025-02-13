import { HeartAndOxygenLevelCharts } from "@/app/charts/heartrateandoxygen";

export default function HeartRateAndOxygenPage() {
    return (
        <div className="rounded-xl bg-muted/50 w-full">
            <HeartAndOxygenLevelCharts />
        </div>
    )
}