'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const Comments = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Kommentarer här</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
