import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography, Paper, Container, MenuItem, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from "@emotion/styled";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");
    const [section, setSection] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [capacity, setCapacity] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        section,
        gradeLevel,
        capacity,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id)
            dispatch(underControl())
            setLoader(false)
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
        }
    }, [status, navigate, error, response, dispatch, tempDetails]);
    
    return (
        <Container maxWidth="md">
            <StyledPaper elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => navigate(-1)}
                        sx={{ 
                            color: 'var(--color-text-secondary)',
                            '&:hover': { 
                                backgroundColor: 'var(--color-surface-variant)',
                            }
                        }}
                    >
                        Back
                    </Button>
                </Box>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    alignItems: 'center',
                    gap: 4,
                    mb: 4
                }}>
                    <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ 
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            mb: 1
                        }}>
                            Create New Class
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            mb: 3,
                            color: 'var(--color-text-secondary)'
                        }}>
                            Add a new class to your school. You can manage students, subjects, and teachers for this class later.
                        </Typography>
                        
                        <form onSubmit={submitHandler} style={{ width: '100%' }}>
                            <Stack spacing={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Class Name"
                                            variant="outlined"
                                            value={sclassName}
                                            onChange={(event) => {
                                                setSclassName(event.target.value);
                                            }}
                                            required
                                            fullWidth
                                            placeholder="e.g., Class 10-A"
                                            InputProps={{
                                                startAdornment: <SchoolIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />,
                                            }}
                                            sx={inputFieldStyle}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="Section"
                                            variant="outlined"
                                            value={section}
                                            onChange={(event) => setSection(event.target.value)}
                                            required
                                            fullWidth
                                            sx={inputFieldStyle}
                                        >
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    Section {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="Grade Level"
                                            variant="outlined"
                                            value={gradeLevel}
                                            onChange={(event) => setGradeLevel(event.target.value)}
                                            required
                                            fullWidth
                                            sx={inputFieldStyle}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                                                <MenuItem key={grade} value={grade}>
                                                    Grade {grade}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Capacity"
                                            variant="outlined"
                                            type="number"
                                            value={capacity}
                                            onChange={(event) => setCapacity(event.target.value)}
                                            required
                                            fullWidth
                                            placeholder="Maximum number of students"
                                            inputProps={{ min: 1, max: 100 }}
                                            sx={inputFieldStyle}
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <BlueButton
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                        disabled={loader}
                                        sx={{ 
                                            py: 1.5,
                                            backgroundColor: 'var(--color-primary)',
                                            boxShadow: '0 4px 14px 0 var(--shadow-color)',
                                            '&:hover': {
                                                backgroundColor: 'var(--color-primary-variant)',
                                                boxShadow: '0 6px 20px 0 var(--shadow-color)',
                                            }
                                        }}
                                    >
                                        {loader ? <CircularProgress size={24} color="inherit" /> : "Create Class"}
                                    </BlueButton>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                    
                    <Box sx={{ 
                        flex: 1,
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <img
                            src={Classroom}
                            alt="classroom"
                            style={{ 
                                width: '100%',
                                maxWidth: '400px',
                                filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))'
                            }}
                        />
                    </Box>
                </Box>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

const inputFieldStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        '& fieldset': {
            borderColor: 'var(--color-border)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--color-primary)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--color-primary)',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'var(--color-text-secondary)',
        '&.Mui-focused': {
            color: 'var(--color-primary)',
        },
    },
};

const StyledPaper = styled(Paper)`
  padding: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-radius: 16px;
  background-color: var(--color-bg-variant);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
`;

export default AddClass;