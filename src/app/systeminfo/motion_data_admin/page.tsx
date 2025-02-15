'use client'

import {useEffect, useState} from 'react';
import {Tables} from "@/supabase/database.types";
import { toast } from "sonner"
import {getUsers} from "@/app/actions/useractions";
import PaginatedUsersTable from "@/app/customcomponents/PaginatedUsersTable";
import PaginatedMotionDataTable from "@/app/customcomponents/PaginatedmotionDataTable";
import {getMotionData, getMotionDataCount} from "@/app/actions/motion_sensor_actions";


export default function MotionDataPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number | null>(1);
    const [motionRecords, setMotionRecords] = useState<Tables<'motion_data'>[] | null>(null);
    const pageSize = 10;

    // Fetch devices from Supabase
    const fetchMotionRecords = async () => {
        const { data, count, error } = await getMotionData(currentPage, pageSize);
        const { count: countTotal, error:countError } = await getMotionDataCount();

        if (error || countError) {
            toast.error("Failed to fetch devices. Please try again later.");
            return;
        }
        setMotionRecords(data);
        setTotalRecords(countTotal);
    };

    useEffect(() => {
        fetchMotionRecords();
    }, [currentPage]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Motion Records</h1>

            <PaginatedMotionDataTable
                motionRecords={motionRecords}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                records={totalRecords}
            />
        </div>
    );
}