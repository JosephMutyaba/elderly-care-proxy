'use client'

import {useEffect, useState} from 'react';
import {Tables} from "@/supabase/database.types";
import { toast } from "sonner"
import {getUsers} from "@/app/actions/useractions";
import PaginatedUsersTable from "@/app/customcomponents/PaginatedUsersTable";
import PaginatedMotionDataTable from "@/app/customcomponents/PaginatedmotionDataTable";
import {getMotionData, getMotionDataCount} from "@/app/actions/motion_sensor_actions";
import {getSpo2HeartRateAdmin, getSpo2HeartRateAdminCount} from "@/app/actions/heartrateoxygen_actions";
import PaginatedHeartRateOxygenDataTable from "@/app/customcomponents/PaginateHeartRateOxygenDataTable";

export default function HeartRateAdminPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number | null>(1);
    const [heartRateOxyRecords, setHeartRateOxyRecords] = useState<Tables<'heartrate'>[] | null>(null);
    const pageSize = 10;

    // Fetch devices from Supabase
    const fetchHeartRateOxyRecords = async () => {
        const { data, count, error } = await getSpo2HeartRateAdmin(currentPage, pageSize);
        const { count: countTotal, error:countError } = await getSpo2HeartRateAdminCount();

        if (error || countError) {
            toast.error("Failed to fetch heart rate. Please try again later.");
            return;
        }
        setHeartRateOxyRecords(data);
        setTotalRecords(countTotal);
    };

    useEffect(() => {
        fetchHeartRateOxyRecords();
    }, [currentPage]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Motion Records</h1>

            <PaginatedHeartRateOxygenDataTable
                heartoxyrecords={heartRateOxyRecords}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                records={totalRecords}
            />
        </div>
    );
}