import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  ThemeProvider, 
  createTheme,
  Fade
} from '@mui/material';
import { Logout as LogoutIcon, Cancel as CancelIcon } from '@mui/icons-material';

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
  },
});

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Container maxWidth="sm">
                    <Fade in={true} timeout={500}>
                        <StyledPaper elevation={6}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Log Out Confirmation
                                </Typography>
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
                                    {currentUser?.name || 'User'}
                                </Typography>
                            </Box>
                            <LogoutMessage>
                                Are you sure you want to log out?
                            </LogoutMessage>
                            
                            <ButtonContainer>
                                <LogoutButtonLogout 
                                    variant="contained" 
                                    onClick={handleLogout}
                                    startIcon={<LogoutIcon />}
                                >
                                    Log Out
                                </LogoutButtonLogout>
                                
                                <LogoutButtonCancel 
                                    variant="outlined" 
                                    onClick={handleCancel}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </LogoutButtonCancel>
                            </ButtonContainer>
                        </StyledPaper>
                    </Fade>
                </Container>
            </StyledContainer>
        </ThemeProvider>
    );
};

export default Logout;

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

const LogoutMessage = styled.p`
  margin: 2rem 0;
  font-size: 1.1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const LogoutButtonLogout = styled(Button)`
  background-color: #FF3D00 !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 14px 0 rgba(255, 61, 0, 0.39) !important;
  
  &:hover {
    background-color: #E53900 !important;
    box-shadow: 0 6px 20px 0 rgba(255, 61, 0, 0.5) !important;
  }
`;

const LogoutButtonCancel = styled(Button)`
  border-color: #00E5FF !important;
  color: #00E5FF !important;
  font-weight: 600 !important;
  
  &:hover {
    background-color: rgba(0, 229, 255, 0.1) !important;
    border-color: #00E5FF !important;
  }
`;
