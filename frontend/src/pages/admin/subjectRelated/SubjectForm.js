import React, { useEffect, useState } from "react";
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
    IconButton,
    Card,
    CardContent
} from "@mui/material";
import { 
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
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
    },
});

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
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
                                Add Subjects
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Add subjects for the selected class
                            </Typography>
                        </Box>

        <form onSubmit={submitHandler}>
                            {subjects.map((subject, index) => (
                                <SubjectCard key={index}>
                                    <CardContent>
            <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Subject Name"
                                value={subject.subName}
                                onChange={handleSubjectNameChange(index)}
                                required
                            />
                        </Grid>
                                            <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Subject Code"
                                value={subject.subCode}
                                onChange={handleSubjectCodeChange(index)}
                                required
                            />
                        </Grid>
                                            <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sessions"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={subject.sessions}
                                onChange={handleSessionsChange(index)}
                                required
                            />
                        </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box display="flex" alignItems="flex-end" height="100%">
                                {index === 0 ? (
                                                        <AddButton
                                        variant="outlined"
                                        onClick={handleAddSubject}
                                                            startIcon={<AddIcon />}
                                    >
                                                            Add Another Subject
                                                        </AddButton>
                                ) : (
                                                        <DeleteButton
                                        variant="outlined"
                                        onClick={handleRemoveSubject(index)}
                                                            startIcon={<DeleteIcon />}
                                    >
                                        Remove
                                                        </DeleteButton>
                                )}
                            </Box>
                        </Grid>
                                        </Grid>
                                    </CardContent>
                                </SubjectCard>
                            ))}

                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <SubmitButton
                                    type="submit"
                                    variant="contained"
                                    disabled={loader}
                                    startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                >
                                    {loader ? 'Saving...' : 'Save Subjects'}
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

export default SubjectForm;

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

const SubjectCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.6);
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #00E5FF;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
  }
`;

const AddButton = styled(Button)`
  border-color: #00E5FF;
  color: #00E5FF;
  
  &:hover {
    border-color: #00E5FF;
    background-color: rgba(0, 229, 255, 0.1);
  }
`;

const DeleteButton = styled(Button)`
  border-color: #FF3D00;
  color: #FF3D00;
  
  &:hover {
    border-color: #FF3D00;
    background-color: rgba(255, 61, 0, 0.1);
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