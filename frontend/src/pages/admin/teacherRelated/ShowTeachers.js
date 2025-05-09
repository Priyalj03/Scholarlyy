import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Box, IconButton, Typography, Container, Tooltip, Fade, CircularProgress,
    Card, CardContent, Grid, Divider, ThemeProvider, createTheme
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';

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

const ShowTeachers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const counterRef = useRef(null);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    useEffect(() => {
        if (teachersList && teachersList.length > 0) {
            // Set initial value immediately
            setTotalTeachers(0);
            
            // Start animation after a short delay to allow page to render first
            const timer = setTimeout(() => {
                const duration = 2000; // 2 seconds
                const steps = 60;
                const increment = teachersList.length / steps;
                const stepDuration = duration / steps;
                
                let current = 0;
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= teachersList.length) {
                        clearInterval(interval);
                        setTotalTeachers(teachersList.length);
                    } else {
                        setTotalTeachers(Math.floor(current));
                    }
                }, stepDuration);
                
                return () => clearInterval(interval);
            }, 100); // Small delay to ensure page renders first
            
            return () => clearTimeout(timer);
        }
    }, [teachersList]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address)).then(() => {
            dispatch(getAllTeachers(currentUser._id));
        });
    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const TeachersButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Delete Teacher">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Teacher")}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: 'rgba(255, 61, 0, 0.1)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <PersonRemoveIcon sx={{ color: '#FF3D00' }} />
                    </IconButton>
                </Tooltip>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                >
                    View
                </BlueButton>
                {!row.teachSubject && (
                    <PurpleButton
                        variant="contained"
                        onClick={() => navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)}
                    >
                        Assign Subject
                    </PurpleButton>
                )}
            </Box>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon sx={{ color: '#00E5FF' }} />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <DeleteIcon sx={{ color: '#FF3D00' }} />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    // Calculate statistics
    const uniqueClasses = new Set(teachersList.map(teacher => teacher.teachSclass.sclassName)).size;
    const teachersWithSubjects = teachersList.filter(teacher => teacher.teachSubject).length;

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
                                        Teacher Management
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Manage all teachers across your school
                                    </Typography>
                                </Box>

                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={4}>
                                        <StatCard
                                            icon={<PersonIcon sx={{ color: '#00E5FF' }} />}
                                            title="Total Teachers"
                                            value={totalTeachers}
                                            onClick={() => navigate("/Admin/teachers/chooseclass")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <StatCard
                                            icon={<SchoolIcon sx={{ color: '#00E5FF' }} />}
                                            title="Classes"
                                            value={uniqueClasses}
                                            onClick={() => navigate("/Admin/classes")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <StatCard
                                            icon={<MenuBookIcon sx={{ color: '#00E5FF' }} />}
                                            title="Teachers with Subjects"
                                            value={teachersWithSubjects}
                                        />
                                    </Grid>
                                </Grid>

                                {response ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                        <GreenButton 
                                            variant="contained"
                                            onClick={() => navigate("/Admin/teachers/chooseclass")}
                                            startIcon={<PersonAddAlt1Icon />}
                                            sx={{ py: 1.5, px: 3 }}
                                        >
                                            Add Teachers
                                        </GreenButton>
                                    </Box>
                                ) : (
                                    <StyledPaper>
                                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                                                    Teachers List
                                                </Typography>
                                                <SpeedDialTemplate actions={actions} />
                                            </Box>
                                        </Box>
                                        {Array.isArray(teachersList) && teachersList.length > 0 ? (
                                            <TableTemplate buttonHaver={TeachersButtonHaver} columns={columns} rows={rows} />
                                        ) : (
                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                                    No teachers found
                                                </Typography>
                                                <GreenButton 
                                                    variant="contained"
                                                    onClick={() => navigate("/Admin/teachers/chooseclass")}
                                                    startIcon={<PersonAddAlt1Icon />}
                                                >
                                                    Add Your First Teacher
                                                </GreenButton>
                                            </Box>
                                        )}
                                    </StyledPaper>
                                )}
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

export default ShowTeachers;