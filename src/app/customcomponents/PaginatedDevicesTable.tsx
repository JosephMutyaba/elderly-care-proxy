import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {Tables} from "@/supabase/database.types";

interface PaginatedDevicesTableProps {
    devices : Tables<'devices'>[] | null;
    onPageChange: (page: number) => void;
    currentPage : number;
    pageSize : number;
}

const PaginatedDevicesTable = ({devices, pageSize = 10, currentPage = 1, onPageChange}:PaginatedDevicesTableProps) => {
    const totalPages = devices && Math.ceil(devices.length / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const visibleDevices = devices?.slice(startIndex, startIndex + pageSize);

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Device ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleDevices?.map((device, index) => (
                        <TableRow key={device.id}>
                            <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell>{device.device_name}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    device.status ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                  {device.status}
                                </span>
                            </TableCell>
                            <TableCell>{new Date(device.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                    {devices && devices.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4}>No devices found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index + 1}>
                            <PaginationLink
                                onClick={() => onPageChange(index + 1)}
                                isActive={currentPage === index + 1}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginatedDevicesTable;