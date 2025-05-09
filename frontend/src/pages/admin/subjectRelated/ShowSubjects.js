import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton, Typography, Container, Tooltip, Fade, CircularProgress,
    Card, CardContent, Grid, Divider, ThemeProvider, createTheme
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)
    const [displayedSessions, setDisplayedSessions] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const counterRef = useRef(null);

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    useEffect(() => {
        if (subjectsList && subjectsList.length > 0) {
            const total = subjectsList.reduce((sum, subject) => sum + (Number(subject.sessions) || 0), 0);
            const duration = 2000;
            const increment = total / (duration / 16);
            
            let start = 0;
            const timer = setInterval(() => {
                start += increment;
                if (start >= total) {
                    setDisplayedSessions(total);
                    clearInterval(timer);
                } else {
                    setDisplayedSessions(Math.floor(start));
                }
            }, 16);
            
            return () => clearInterval(timer);
        }
    }, [subjectsList]);

    useEffect(() => {
        const total = subjectsList.reduce((sum, subject) => sum + (Number(subject.sessions) || 0), 0);
        setTotalSessions(0);
        
        const timer = setTimeout(() => {
            const duration = 2000;
          const steps = 60;
            const increment = total / steps;
          const stepDuration = duration / steps;
          
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
                if (current >= total) {
              clearInterval(interval);
                    setTotalSessions(total);
            } else {
              setTotalSessions(Math.floor(current));
            }
          }, stepDuration);
          
          return () => clearInterval(interval);
        }, 100);
        
        return () => clearTimeout(timer);
    }, [subjectsList]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            })
    }

    const subjectColumns = [
        { id: 'subName', label: 'Subject Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Delete Subject">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Subject")}
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
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}
                >
                    View
                </BlueButton>
            </Box>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon sx={{ color: '#00E5FF' }} />, 
            name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon sx={{ color: '#FF3D00' }} />, 
            name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    // Calculate statistics
    const totalSubjects = subjectsList.length;
    const uniqueClasses = new Set(subjectsList.map(subject => subject.sclassName.sclassName)).size;

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
                                Subject Management
                            </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Manage all subjects across your school
                            </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={4}>
                                <StatCard
                                            icon={<MenuBookIcon sx={{ color: '#00E5FF' }} />}
                                    title="Total Subjects"
                                    value={totalSubjects}
                                    onClick={() => navigate("/Admin/subjects/chooseclass")}
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
                                            icon={<AccessTimeIcon sx={{ color: '#00E5FF' }} />}
                                    title="Total Sessions"
                                    value={totalSessions}
                                />
                            </Grid>
                        </Grid>

                        {response ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <GreenButton 
                                    variant="contained"
                                    onClick={() => navigate("/Admin/subjects/chooseclass")}
                                    startIcon={<PostAddIcon />}
                                    sx={{ py: 1.5, px: 3 }}
                                >
                                    Add Subjects
                                </GreenButton>
                            </Box>
                        ) : (
                                    <StyledPaper>
                                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                                            Subjects List
                                        </Typography>
                                        <SpeedDialTemplate actions={actions} />
                                    </Box>
                                </Box>
                                {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                                    <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                            No subjects found
                                        </Typography>
                                        <GreenButton 
                                            variant="contained"
                                            onClick={() => navigate("/Admin/subjects/chooseclass")}
                                            startIcon={<PostAddIcon />}
                                        >
                                            Add Your First Subject
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

export default ShowSubjects;