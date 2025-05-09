import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Button, 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    MenuItem, 
    ThemeProvider, 
    createTheme,
    Fade,
    Alert,
    Snackbar,
    InputAdornment
} from '@mui/material';
import { 
    Person as PersonIcon,
    Email as EmailIcon,
    School as SchoolIcon,
    ChildCare as ChildIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { registerUser } from '../../redux/userRelated/userHandle';

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
    },
});

const AddParent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, currentUser, response, error } = useSelector(state => state.user);
    const { studentsList } = useSelector(state => state.student);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        student: '',
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        dispatch(getAllStudents());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'success') {
            setSnackbar({
                open: true,
                message: 'Parent added successfully!',
                severity: 'success'
            });
            setTimeout(() => {
                navigate('/Admin/parents');
            }, 2000);
        } else if (status === 'failed') {
            setSnackbar({
                open: true,
                message: error || 'Failed to add parent',
                severity: 'error'
            });
        }
    }, [status, navigate, error]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData, "Parent"));
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                                Add New Parent
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Create a new parent account
                            </Typography>
                        </Box>

                        <ContentSection>
                            <BackButton
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/Admin/parents')}
                            >
                                Back to Parents
                            </BackButton>

                            <FormContainer component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: '#00E5FF' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: '#00E5FF' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SchoolIcon sx={{ color: '#00E5FF' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    select
                                    label="Student"
                                    name="student"
                                    value={formData.student}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ChildIcon sx={{ color: '#00E5FF' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    {studentsList?.map((student) => (
                                        <MenuItem key={student._id} value={student._id}>
                                            {student.name} - {student.sclassName?.sclassName}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <SubmitButton
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    Add Parent
                                </SubmitButton>
                            </FormContainer>
                        </ContentSection>
                    </StyledPaper>
                </Fade>

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity} 
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </StyledContainer>
        </ThemeProvider>
    );
};

export default AddParent;

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
  max-width: 600px;
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

const ContentSection = styled.div`
  text-align: left;
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem;
  border-color: rgba(255, 255, 255, 0.23);
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    border-color: #00E5FF;
    color: #00E5FF;
    background-color: rgba(0, 229, 255, 0.1);
  }
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SubmitButton = styled(Button)`
  background-color: #00E5FF !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 14px 0 rgba(0, 229, 255, 0.39) !important;
  margin-top: 1rem !important;
  
  &:hover {
    background-color: #00B8D4 !important;
    box-shadow: 0 6px 20px 0 rgba(0, 229, 255, 0.5) !important;
  }
`; 