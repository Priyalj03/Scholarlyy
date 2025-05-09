import React, { useState } from 'react';
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
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { 
    Save as SaveIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/userRelated/userHandle';
import { underControl } from '../../redux/userRelated/userSlice';
import Popup from '../../components/Popup';
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
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1E1E1E',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#00E5FF',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00E5FF',
                        },
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#00E5FF',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00E5FF',
                        },
                    },
                },
            },
        },
    },
});

const AddTeacher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, currentUser, response, error } = useSelector(state => state.user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [school, setSchool] = useState('');
    const [subject, setSubject] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const adminID = currentUser._id;

    const fields = { name, email, password, school, subject, adminID, role: "Teacher" };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(registerUser(fields, "register"));
    };

    React.useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/teachers");
            dispatch(underControl());
            setLoader(false);
        }
        else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        }
        else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container>
                <Fade in={true} timeout={500}>
                    <StyledPaper elevation={0}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 700, 
                                    mb: 1,
                                    color: '#00E5FF',
                                    textShadow: '0 0 10px rgba(0, 229, 255, 0.3)'
                                }}
                            >
                                Add New Teacher
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Create a new teacher account
                            </Typography>
                        </Box>

                        <form onSubmit={submitHandler}>
                            <FormCard>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>School</InputLabel>
                                            <Select
                                                value={school}
                                                label="School"
                                                onChange={(e) => setSchool(e.target.value)}
                                                required
                                            >
                                                <MenuItem value="School A">School A</MenuItem>
                                                <MenuItem value="School B">School B</MenuItem>
                                                <MenuItem value="School C">School C</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Subject</InputLabel>
                                            <Select
                                                value={subject}
                                                label="Subject"
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                            >
                                                <MenuItem value="Mathematics">Mathematics</MenuItem>
                                                <MenuItem value="Science">Science</MenuItem>
                                                <MenuItem value="English">English</MenuItem>
                                                <MenuItem value="History">History</MenuItem>
                                                <MenuItem value="Geography">Geography</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </FormCard>

                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <SubmitButton
                                    type="submit"
                                    variant="contained"
                                    disabled={loader}
                                    startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                >
                                    {loader ? 'Creating...' : 'Create Teacher'}
                                </SubmitButton>
                            </Box>
                        </form>
                    </StyledPaper>
                </Fade>

                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </Container>
        </ThemeProvider>
    );
};

export default AddTeacher;

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #121212 0%, #1E1E1E 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
`;

const FormCard = styled(Box)`
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.6);
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #00E5FF;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(45deg, #00E5FF 30%, #00B8D4 90%);
  color: white;
  padding: 10px 24px;
  
  &:hover {
    background: linear-gradient(45deg, #00B8D4 30%, #00E5FF 90%);
  }
`; 