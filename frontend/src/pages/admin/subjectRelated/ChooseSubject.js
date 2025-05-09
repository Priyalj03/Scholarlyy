import React, { useEffect, useState } from 'react';
import { 
    Button, 
    TextField, 
    Grid, 
    Box, 
    Typography, 
    CircularProgress,
    Paper,
    ThemeProvider,
    createTheme,
    Fade,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Avatar
} from "@mui/material";
import { 
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Book as BookIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSubjects } from '../../../redux/subjectRelated/subjectHandle';
import { deleteSubject } from '../../../redux/subjectRelated/subjectHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

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
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease-in-out',
                    padding: '10px 24px',
                    fontSize: '1rem',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#121212',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(18, 18, 18, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
    },
});

const ChooseSubject = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { subjectsList, loading, error, response } = useSelector((state) => state.subject);
    const { currentUser } = useSelector((state) => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllSubjects(currentUser._id));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (error) {
            setMessage(error);
            setShowPopup(true);
        }
        if (response) {
            setMessage(response);
            setShowPopup(true);
        }
    }, [error, response]);

    const deleteHandler = (id) => {
        dispatch(deleteSubject(id));
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Fade in={true} timeout={500}>
                    <StyledPaper elevation={6}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                                Subjects List
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Manage your subjects
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <AddButton
                                variant="contained"
                                onClick={() => navigate("/Admin/addsubject")}
                                startIcon={<AddIcon />}
                            >
                                Add New Subject
                            </AddButton>
                        </Box>

                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <CircularProgress sx={{ color: '#00E5FF' }} />
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {subjectsList && subjectsList.length > 0 ? (
                                    subjectsList.map((subject) => (
                                        <Grid item xs={12} sm={6} md={4} key={subject._id}>
                                            <SubjectCard>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar 
                                                            sx={{ 
                                                                bgcolor: 'rgba(0, 229, 255, 0.1)',
                                                                border: '1px solid #00E5FF'
                                                            }}
                                                        >
                                                            <BookIcon sx={{ color: '#00E5FF' }} />
                                                        </Avatar>
                                                        <Typography variant="h6" sx={{ color: '#00E5FF' }}>
                                                            {subject.subName}
                                                        </Typography>
                                                    </Box>
                                                    <InfoItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Subject Code
                                                        </Typography>
                                                        <Typography variant="body1" color="text.primary">
                                                            {subject.subCode}
                                                        </Typography>
                                                    </InfoItem>
                                                    <InfoItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Sessions
                                                        </Typography>
                                                        <Typography variant="body1" color="text.primary">
                                                            {subject.sessions}
                                                        </Typography>
                                                    </InfoItem>
                                                </CardContent>
                                                <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => navigate(`/Admin/subject/${subject._id}`)}
                                                        sx={{ 
                                                            color: '#00E5FF',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 229, 255, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => deleteHandler(subject._id)}
                                                        sx={{ 
                                                            color: '#FF3D00',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255, 61, 0, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </CardActions>
                                            </SubjectCard>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <EmptyState>
                                            <BookIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                No subjects found
                                            </Typography>
                                        </EmptyState>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </StyledPaper>
                </Fade>

                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </StyledContainer>
        </ThemeProvider>
    );
};

export default ChooseSubject;

const StyledContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

const StyledPaper = styled(Paper)`
  width: 100%;
  max-width: 1200px;
  padding: 3rem 2rem;
  text-align: center;
  background-color: rgba(18, 18, 18, 0.95);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 229, 255, 0.2);
  }
`;

const SubjectCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  height: 100%;
  background: rgba(18, 18, 18, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    border-color: #00E5FF;
    box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const InfoItem = styled(Box)`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const AddButton = styled(Button)`
  background: linear-gradient(45deg, #00E5FF 30%, #00B8D4 90%);
  color: white;
  padding: 10px 24px;
  
  &:hover {
    background: linear-gradient(45deg, #00B8D4 30%, #00E5FF 90%);
    box-shadow: 0 6px 20px rgba(0, 229, 255, 0.3);
  }
`; 