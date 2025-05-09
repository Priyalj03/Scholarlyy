import { AccountCircle, Group, School, FamilyRestroom } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Popup from '../components/Popup';
import { loginUser } from '../redux/userRelated/userHandle';

// Create a dark theme that matches the LoginPage
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
        },
      },
    },
  },
});

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = "zxc"

  const { status, currentUser, currentRole } = useSelector(state => state.user);;

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Adminlogin');
      }
    }

    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1"
        const studentName = "Dipesh Awasthi"
        const fields = { rollNum, studentName, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Studentlogin');
      }
    }

    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Teacherlogin');
      }
    }

    else if (user === "Parent") {
      if (visitor === "guest") {
        const email = "parent@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Parentlogin');
      }
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      }
      else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      } else if (currentRole === 'Parent') {
        navigate('/Parent/dashboard');
      }
    }
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledContainer>
        <Container maxWidth="lg">
          <HeaderSection>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(45deg, #00E5FF, #FF3D00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Scholarly
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 6 }}>
              Choose your role to get started
            </Typography>
          </HeaderSection>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <CardContainer onClick={() => navigateHandler("Admin")}>
                <StyledPaper elevation={6}>
                  <IconWrapper>
                    <AccountCircle fontSize="large" />
                  </IconWrapper>
                  <CardTitle>
                    Admin
                  </CardTitle>
                  <CardDescription>
                    Login as an administrator to access the dashboard to manage app data.
                  </CardDescription>
                </StyledPaper>
              </CardContainer>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardContainer onClick={() => navigateHandler("Student")}>
                <StyledPaper elevation={6}>
                  <IconWrapper>
                    <School fontSize="large" />
                  </IconWrapper>
                  <CardTitle>
                    Student
                  </CardTitle>
                  <CardDescription>
                    Login as a student to explore course materials and assignments.
                  </CardDescription>
                </StyledPaper>
              </CardContainer>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardContainer onClick={() => navigateHandler("Parent")}>
                <StyledPaper elevation={6}>
                  <IconWrapper>
                    <FamilyRestroom fontSize="large" />
                  </IconWrapper>
                  <CardTitle>
                    Parent
                  </CardTitle>
                  <CardDescription>
                    Login as a parent to monitor your child's progress and activities.
                  </CardDescription>
                </StyledPaper>
              </CardContainer>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardContainer onClick={() => navigateHandler("Teacher")}>
                <StyledPaper elevation={6}>
                  <IconWrapper>
                    <Group fontSize="large" />
                  </IconWrapper>
                  <CardTitle>
                    Teacher
                  </CardTitle>
                  <CardDescription>
                    Login as a teacher to create courses, assignments, and track student progress.
                  </CardDescription>
                </StyledPaper>
              </CardContainer>
            </Grid>
          </Grid>
        </Container>
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
          open={loader}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Please Wait</Typography>
          </Box>
        </Backdrop>
        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
      </StyledContainer>
    </ThemeProvider>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #0a0a0a;
  position: relative;
  overflow: hidden;
  padding: 4rem 0;

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

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CardContainer = styled.div`
  cursor: pointer;
  height: 100%;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  text-align: center;
  background-color: rgba(18, 18, 18, 0.95);
  color: rgba(255, 255, 255, 0.7);
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(0, 229, 255, 0.2);
    background-color: rgba(30, 30, 30, 0.95);
    color: white;
  }
`;

const IconWrapper = styled(Box)`
  margin-bottom: 1.5rem;
  color: #00E5FF;
  font-size: 3rem;
  transition: all 0.3s ease-in-out;
  
  ${StyledPaper}:hover & {
    transform: scale(1.1);
    color: #FF3D00;
  }
`;

const CardTitle = styled.h2`
  margin-bottom: 1rem;
  font-weight: 700;
  color: white;
`;

const CardDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;