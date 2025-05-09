import React, { useEffect, useState } from 'react';
import { 
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllParents, deleteUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { 
    Button, 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    IconButton, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    ThemeProvider,
    createTheme,
    Menu,
    MenuItem,
    InputAdornment
} from '@mui/material';
import styled from 'styled-components';

const defaultTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '4px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 600,
                },
            },
        },
    },
});

const ShowParent = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { parentsList, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllParents());
    }, [dispatch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuClick = (event, parent) => {
        setAnchorEl(event.currentTarget);
        setSelectedParent(parent);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedParent(null);
    };

    const handleEdit = () => {
        if (selectedParent) {
            navigate(`/Admin/parent/${selectedParent._id}`);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedParent) {
            dispatch(deleteUser(selectedParent._id, "Parent"));
        }
        handleMenuClose();
    };

    const filteredParents = parentsList?.filter((parent) =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container>
                <StyledPaper elevation={1}>
                    <HeaderSection>
                        <Typography variant="h4" gutterBottom>
                            Parents
                        </Typography>
                        <AddButton 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/Admin/addparent')}
                        >
                            Add Parent
                        </AddButton>
                    </HeaderSection>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Student</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredParents
                                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((parent) => (
                                        <TableRow key={parent._id}>
                                            <TableCell>{parent.name}</TableCell>
                                            <TableCell>{parent.email}</TableCell>
                                            <TableCell>
                                                {parent.student?.name} (Roll No: {parent.student?.rollNum})
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={(e) => handleMenuClick(e, parent)}
                                                    size="small"
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredParents?.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </StyledPaper>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                    </MenuItem>
                </Menu>
            </Container>
        </ThemeProvider>
    );
};

export default ShowParent;

const Container = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  border-radius: 8px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  
  &:hover {
    background-color: #1565c0;
  }
`; 