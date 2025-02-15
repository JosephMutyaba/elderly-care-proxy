'use client'

import {useEffect, useState} from 'react';
import PaginatedDevicesTable from "@/app/customcomponents/PaginatedDevicesTable";
import {Tables} from "@/supabase/database.types";
import {getDevices} from "@/app/actions/devicesActions";
import { toast } from "sonner"


export default function DevicesPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalDevices, setTotalDevices] = useState<number | null>(1);
    const [devices, setDevices] = useState<Tables<'devices'>[] | null>(null);
    const pageSize = 10;

    // Fetch devices from Supabase
    const fetchDevices = async () => {
        const { data, count, error } = await getDevices(currentPage, pageSize);

        if (error) {
            toast.error("Failed to fetch devices. Please try again later.");
            return;
        }
        setDevices(data);
        setTotalDevices(count);
    };

    useEffect(() => {
        fetchDevices();
    }, [currentPage]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Devices</h1>
            {/*search bar*/}

            {/*devices table*/}
            <PaginatedDevicesTable
                devices={devices}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}