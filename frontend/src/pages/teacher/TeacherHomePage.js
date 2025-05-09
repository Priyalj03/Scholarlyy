import { Grid } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { 
    Box,
    Card,
    CardContent,
    Typography,
    ThemeProvider,
    createTheme,
    Fade,
    CircularProgress
} from '@mui/material';
import { 
    People as PeopleIcon,
    MenuBook as MenuBookIcon,
    Assignment as AssignmentIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
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
    },
});

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions;

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Fade in={true} timeout={500}>
                    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
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
                                Welcome Back!
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Here's an overview of your class
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <IconWrapper>
                                                <PeopleIcon />
                                            </IconWrapper>
                                            <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
                                Class Students
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 600 }}>
                                <CountUp start={0} end={numberOfStudents} duration={2.5} />
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                    </Grid>

                            <Grid item xs={12} md={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <IconWrapper>
                                                <MenuBookIcon />
                                            </IconWrapper>
                                            <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
                                Total Lessons
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 600 }}>
                                <CountUp start={0} end={numberOfSessions} duration={5} />
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                    </Grid>

                            <Grid item xs={12} md={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <IconWrapper>
                                                <AssignmentIcon />
                                            </IconWrapper>
                                            <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
                                Tests Taken
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 600 }}>
                                <CountUp start={0} end={24} duration={4} />
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                    </Grid>

                            <Grid item xs={12} md={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <IconWrapper>
                                                <AccessTimeIcon />
                                            </IconWrapper>
                                            <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
                                Total Hours
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 600 }}>
                                <CountUp start={0} end={30} duration={4} suffix="hrs"/>
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                    </Grid>

                    <Grid item xs={12}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                mb: 3,
                                                fontWeight: 600,
                                                color: 'white'
                                            }}
                                        >
                                            Recent Notices
                                        </Typography>
                            <SeeNotice />
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                    </Grid>
                    </Box>
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

export default TeacherHomePage