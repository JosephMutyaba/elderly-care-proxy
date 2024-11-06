import {Chart1} from "@/app/charts/twomodelchart";

export default function HeartRateAndOxygenPage (){
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-muted/50">
                <Chart1/>
            </div>
        </div>
    )
}