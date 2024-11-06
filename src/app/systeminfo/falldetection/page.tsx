import {Chart2} from "@/app/charts/chart2";

export default function FallDetectionPage (){
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-muted/50">
                <Chart2/>
            </div>
        </div>
    )
}