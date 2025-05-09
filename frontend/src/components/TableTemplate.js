import React, { useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination, Paper, Box, Typography } from '@mui/material';

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, title }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                width: '100%', 
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
            }}
        >
            {title && (
                <Box sx={{ p: 2, borderBottom: '1px solid var(--color-border)' }}>
                    <Typography variant="h6" color="var(--color-primary)" fontWeight="600">
                        {title}
                    </Typography>
                </Box>
            )}
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {
                                                        column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value
                                                    }
                                                </StyledTableCell>
                                            );
                                        })}
                                        <StyledTableCell align="center">
                                            <ButtonHaver row={row} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5));
                    setPage(0);
                }}
                sx={{
                    borderTop: '1px solid var(--color-border)',
                    '.MuiTablePagination-select': {
                        color: 'var(--color-text)',
                    },
                    '.MuiTablePagination-selectIcon': {
                        color: 'var(--color-text)',
                    },
                    '.MuiTablePagination-displayedRows': {
                        color: 'var(--color-text)',
                    },
                }}
            />
        </Paper>
    )
}

export default TableTemplate