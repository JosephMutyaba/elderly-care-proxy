'use client'

import {useEffect, useState} from 'react';
import {Tables} from "@/supabase/database.types";
import { toast } from "sonner"
import {getUsers, getUsersCount} from "@/app/actions/useractions";
import PaginatedUsersTable from "@/app/customcomponents/PaginatedUsersTable";


export default function UsersPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalUsers, setTotalUsers] = useState<number | null>(1);
    const [users, setUsers] = useState<Tables<'users'>[] | null>(null);
    const pageSize = 10;

    // Fetch devices from Supabase
    const fetchUsers = async () => {
        const { data, count, error } = await getUsers(currentPage, pageSize);
        const { count: countTotal, error:countError } = await getUsersCount();

        if (error || countError) {
            toast.error("Failed to fetch devices. Please try again later.");
            return;
        }
        setUsers(data);
        setTotalUsers(countTotal);
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {/*search bar*/}

            {/*devices table*/}
            <PaginatedUsersTable
                users={users}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                records={totalUsers}
            />
        </div>
    );
}