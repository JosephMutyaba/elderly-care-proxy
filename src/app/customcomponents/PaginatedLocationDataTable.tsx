import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {Tables} from "@/supabase/database.types";

interface PaginatedLocationDataTableProps {
    locationRecords : Tables<'locationdata'>[] | null;
    onPageChange: (page: number) => void;
    currentPage : number;
    pageSize : number;
    records : number | null;
}

const PaginatedLocationDataTable = ({locationRecords, pageSize = 10, currentPage = 1, onPageChange, records}:PaginatedLocationDataTableProps) => {
    const totalPages = (records != null && pageSize > 0) ? Math.ceil(records / pageSize) : 1;

    const startIndex = (currentPage - 1) * pageSize;
    return (
        <div className="space-y-4 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Longitude</TableHead>
                        <TableHead>Latitude</TableHead>
                        <TableHead>Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {locationRecords?.map((locationRecord, index) => (
                        <TableRow key={locationRecord.id}>
                            <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell>{locationRecord.device_id}</TableCell>
                            <TableCell>{locationRecord.longitude}</TableCell>
                            <TableCell>{locationRecord.latitude}</TableCell>
                            <TableCell>{new Date(locationRecord.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                    {locationRecords && locationRecords.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4}>No locationRecords found.</TableCell>
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

                    {/* Display pages */}
                    {[...Array(totalPages)].map((_, index) => {
                        // Determine the range of pages to show around the current page
                        const pageNumbersToShow = 5; // Show 5 pages
                        const startPage = Math.max(currentPage - Math.floor(pageNumbersToShow / 2), 1);
                        const endPage = Math.min(startPage + pageNumbersToShow - 1, totalPages);

                        // Check if the current index is within the range
                        if (index >= startPage - 1 && index <= endPage - 1) {
                            return (
                                <PaginationItem key={index + 1}>
                                    <PaginationLink
                                        className={'hover:cursor-pointer'}
                                        onClick={() => onPageChange(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }

                        // Optionally show ellipsis for skipped pages
                        if (index === startPage - 2 || index === endPage) {
                            return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationLink >...</PaginationLink>
                                </PaginationItem>
                            );
                        }

                        return null;
                    })}

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

export default PaginatedLocationDataTable;