import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Backdrop, Box, Checkbox, CircularProgress, CssBaseline, FormControlLabel, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bgpic from "../assets/designlogin.jpg";
import Popup from '../components/Popup';
import { LightPurpleButton } from '../components/buttonStyles';
import { loginUser } from '../redux/userRelated/userHandle';

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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
              transition: 'border-color 0.3s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00E5FF',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#00E5FF',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-checked': {
            color: '#00E5FF',
          },
        },
      },
    },
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

const LoginPage = ({ role }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [guestLoader, setGuestLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
        else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    const guestModeHandler = () => {
        const password = "zxc"

        if (role === "Admin") {
            const email = "yogendra@12"
            const fields = { email, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Student") {
            const rollNum = "1"
            const studentName = "Dipesh Awasthi"
            const fields = { rollNum, studentName, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Parent") {
            const rollNum = "1"
            const studentName = "Parent User"
            const fields = { rollNum, studentName, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Teacher") {
            const email = "tony@12"
            const fields = { email, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
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
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
            setGuestLoader(false)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <CssBaseline />
                <StyledGrid container>
                    <StyledImageGrid item xs={12} md={6}>
                        <ImageContainer>
                            <StyledImage src={bgpic} alt="Login background" />
                            <ImageOverlay>
                                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                                    Welcome to Scholarly
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                                    Your all-in-one school management system
                                </Typography>
                            </ImageOverlay>
                        </ImageContainer>
                    </StyledImageGrid>
                    <StyledFormGrid item xs={12} md={6}>
                        <StyledPaper elevation={6}>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h4" sx={{ 
                                    mb: 2, 
                                    fontWeight: 700,
                                    background: 'linear-gradient(45deg, #00E5FF, #FF3D00)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {role} Login
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                                    Welcome back! Please enter your details
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                                    {role === "Student" ? (
                                        <>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="rollNumber"
                                                label="Enter your Roll Number"
                                                name="rollNumber"
                                                autoComplete="off"
                                                type="number"
                                                autoFocus
                                                error={rollNumberError}
                                                helperText={rollNumberError && 'Roll Number is required'}
                                                onChange={handleInputChange}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="studentName"
                                                label="Enter your name"
                                                name="studentName"
                                                autoComplete="name"
                                                autoFocus
                                                error={studentNameError}
                                                helperText={studentNameError && 'Name is required'}
                                                onChange={handleInputChange}
                                            />
                                        </>
                                    ) : (
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Enter your email"
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                            error={emailError}
                                            helperText={emailError && 'Email is required'}
                                            onChange={handleInputChange}
                                        />
                                    )}
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={toggle ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        error={passwordError}
                                        helperText={passwordError && 'Password is required'}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        onClick={() => setToggle(!toggle)}
                                                        edge="end"
                                                    >
                                                        {toggle ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Grid container sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                        <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" />}
                                            label="Remember me"
                                        />
                                        <StyledLink href="#">
                                            Forgot password?
                                        </StyledLink>
                                    </Grid>
                                    <LightPurpleButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ 
                                            mt: 3, 
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.39)',
                                            '&:hover': {
                                                boxShadow: '0 6px 20px 0 rgba(0, 229, 255, 0.5)',
                                            }
                                        }}
                                    >
                                        {loader ?
                                            <CircularProgress size={24} color="inherit" />
                                            : "Login"}
                                    </LightPurpleButton>
                                    {role === "Admin" &&
                                        <Grid container sx={{ mt: 3, justifyContent: 'center' }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Don't have an account?
                                            </Typography>
                                            <StyledLink to="/Adminregister" sx={{ ml: 1 }}>
                                                Sign up
                                            </StyledLink>
                                        </Grid>
                                    }
                                </Box>
                            </Box>
                        </StyledPaper>
                    </StyledFormGrid>
                </StyledGrid>
            </StyledContainer>
            <Popup
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                message={message}
            />
        </ThemeProvider>
    );
};

export default LoginPage;

const StyledContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: #0a0a0a;
  position: relative;
  overflow: hidden;

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

const StyledGrid = styled(Grid)`
  min-height: 100vh;
`;

const StyledImageGrid = styled(Grid)`
  @media (max-width: 960px) {
    display: none;
  }
`;

const StyledFormGrid = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
  transform: scale(1.1);
  transition: transform 0.3s ease-in-out;

  ${ImageContainer}:hover & {
    transform: scale(1.15);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(0, 229, 255, 0.1) 0%, 
    rgba(255, 61, 0, 0.1) 100%
  );
  color: white;
  text-align: center;
  backdrop-filter: blur(5px);
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background-color: rgba(18, 18, 18, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 229, 255, 0.2);
  }
`;

const StyledLink = styled(Link)`
  color: #00E5FF;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease-in-out;
  
  &:hover {
    color: #FF3D00;
    text-decoration: underline;
  }
`;
