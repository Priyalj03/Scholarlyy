import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    CircularProgress,
    Box,
    Fade,
    Tooltip,
    Card,
    CardContent,
    ThemeProvider,
    createTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import Popup from '../../../components/Popup';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import styled from 'styled-components';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Create a dark theme that matches the other pages
const defaultTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00E5FF',
        },
        secondary: {
            main: '#FF3D00',
        },
        background: {
            default: '#0a0a0a',
            paper: '#121212',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
    },
});

const ShowParents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parents/${currentUser._id}`);
                setParents(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchParents();
    }, [currentUser._id]);

    const handleMenuClick = (event, parent) => {
        setAnchorEl(event.currentTarget);
        setSelectedParent(parent);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedParent(null);
    };

    const deleteHandler = (deleteID) => {
        dispatch(deleteUser(deleteID, "Parent"))
            .then(() => {
                setParents(parents.filter(parent => parent._id !== deleteID));
            })
            .catch((error) => {
                setMessage("Error deleting parent");
                setShowPopup(true);
            });
    };

    const handleView = () => {
        if (selectedParent) {
            navigate(`/Admin/parents/parent/${selectedParent._id}`);
        }
        handleMenuClose();
    };

    const parentColumns = [
        { id: 'name', label: 'Parent Name', minWidth: 170 },
        { id: 'email', label: 'Email', minWidth: 170 },
        { id: 'phoneNumber', label: 'Phone Number', minWidth: 130 },
        { id: 'student', label: 'Student', minWidth: 170 },
    ];

    const parentRows = parents.map((parent) => {
        return {
            name: parent.name,
            email: parent.email,
            phoneNumber: parent.phoneNumber || 'Not provided',
            student: parent.student?.name || 'Not assigned',
            id: parent._id,
        };
    });

    const ParentButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Delete Parent">
                    <IconButton 
                        onClick={() => deleteHandler(row.id)}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: 'rgba(255, 61, 0, 0.1)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <DeleteIcon sx={{ color: '#FF3D00' }} />
                    </IconButton>
                </Tooltip>
                <BlueButton 
                    variant="contained"
                    onClick={() => navigate(`/Admin/parents/parent/${row.id}`)}
                >
                    View
                </BlueButton>
            </Box>
        );
    };

    const actions = [
        {
            icon: <AddCardIcon sx={{ color: '#00E5FF' }} />, 
            name: 'Add New Parent',
            action: () => navigate("/Admin/addparent")
        },
        {
            icon: <DeleteIcon sx={{ color: '#FF3D00' }} />, 
            name: 'Delete All Parents',
            action: () => deleteHandler(currentUser._id)
        },
    ];

    // Calculate statistics
    const totalParents = parents.length;
    const parentsWithStudents = parents.filter(parent => parent.student).length;
    const parentsWithoutStudents = totalParents - parentsWithStudents;

    const StatCard = ({ icon, title, value, color, onClick }) => (
        <StyledCard onClick={onClick}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconWrapper>
                        {icon}
                    </IconWrapper>
                    <Typography variant="h6" sx={{ color: 'white', ml: 2, fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 700 }}>
                    {value}
                </Typography>
            </CardContent>
        </StyledCard>
    );

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Fade in={true} timeout={500}>
                    <Container maxWidth="lg" sx={{ py: 4 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                                <CircularProgress sx={{ color: '#00E5FF' }} />
                            </Box>
                        ) : error ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                                <Typography color="error">{error}</Typography>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ mb: 4, textAlign: 'center' }}>
                                    <Typography 
                                        variant="h4" 
                                        component="h1" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            mb: 1,
                                            background: 'linear-gradient(45deg, #00E5FF, #FF3D00)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Parent Management
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Manage all parents in your school
                                    </Typography>
                                </Box>

                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={4}>
                                        <StatCard
                                            icon={<GroupIcon sx={{ color: '#00E5FF' }} />}
                                            title="Total Parents"
                                            value={totalParents}
                                            onClick={() => navigate("/Admin/addparent")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <StatCard
                                            icon={<PersonAddAlt1Icon sx={{ color: '#00E5FF' }} />}
                                            title="Parents with Students"
                                            value={parentsWithStudents}
                                            onClick={() => navigate("/Admin/students")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <StatCard
                                            icon={<SchoolIcon sx={{ color: '#00E5FF' }} />}
                                            title="Parents without Students"
                                            value={parentsWithoutStudents}
                                            onClick={() => navigate("/Admin/addparent")}
                                        />
                                    </Grid>
                                </Grid>

                                <StyledPaper>
                                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                                                Parents List
                                            </Typography>
                                            <SpeedDialTemplate actions={actions} />
                                        </Box>
                                    </Box>
                                    {parents.length > 0 ? (
                                        <TableTemplate buttonHaver={ParentButtonHaver} columns={parentColumns} rows={parentRows} />
                                    ) : (
                                        <Box sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                                No parents found
                                            </Typography>
                                            <GreenButton 
                                                variant="contained"
                                                onClick={() => navigate("/Admin/addparent")}
                                                startIcon={<AddCardIcon />}
                                            >
                                                Add Your First Parent
                                            </GreenButton>
                                        </Box>
                                    )}
                                </StyledPaper>
                            </>
                        )}
                        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                    </Container>
                </Fade>
            </StyledContainer>
        </ThemeProvider>
    );
};

const StyledContainer = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  position: relative;
  overflow: hidden;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(0, 229, 255, 0.1), transparent 40%),
                radial-gradient(circle at bottom left, rgba(255, 61, 0, 0.1), transparent 40%);
    pointer-events: none;
  }
`;

const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  }
`;

const StyledPaper = styled(Paper)`
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 229, 255, 0.1);
  color: #00E5FF;
  transition: all 0.3s ease-in-out;

  svg {
    font-size: 24px;
  }

  ${StyledCard}:hover & {
    background: rgba(0, 229, 255, 0.2);
    transform: scale(1.1);
  }
`;

export default ShowParents; 