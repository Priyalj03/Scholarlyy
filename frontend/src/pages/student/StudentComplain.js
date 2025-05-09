import { useEffect, useState } from 'react';
import { 
    Box, 
    CircularProgress, 
    Stack, 
    TextField, 
    Typography, 
    Container, 
    Fade, 
    Card, 
    CardContent, 
    IconButton, 
    Tooltip, 
    Divider,
    Paper
} from '@mui/material';
import Popup from '../../components/Popup';
import { BlueButton } from '../../components/buttonStyles';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const dispatch = useDispatch()

    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id
    const school = currentUser.school._id
    const address = "Complain"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        user,
        date,
        complaint,
        school,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Complaint submitted successfully")
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error])

    return (
        <Box sx={{ 
            background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
            minHeight: '100vh',
            padding: '24px 0',
        }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Tooltip title="Back to Dashboard">
                            <IconButton 
                                onClick={() => navigate('/Student/dashboard')}
                                sx={{ 
                                    mr: 2,
                                    color: 'var(--color-primary)',
                                    '&:hover': { backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 700, 
                            color: 'var(--color-text)',
                            background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Submit a Complaint
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                        Use this form to submit any complaints or feedback to the school administration
                    </Typography>
                </Box>

                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                        mb: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: 48, 
                                    height: 48, 
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                    mr: 2
                                }}
                            >
                                <FeedbackIcon sx={{ color: '#1976d2' }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                                Complaint Form
                            </Typography>
                        </Box>
                        
                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarTodayIcon sx={{ color: 'var(--color-primary)', mr: 1, fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                                            Date of Issue
                                        </Typography>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)} 
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'var(--color-background-paper)',
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
                                            '& .MuiInputBase-input': {
                                                color: 'var(--color-text)',
                                            },
                                        }}
                                    />
                                </Box>
                                
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <FeedbackIcon sx={{ color: 'var(--color-primary)', mr: 1, fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                                            Your Complaint
                                        </Typography>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={complaint}
                                        onChange={(event) => {
                                            setComplaint(event.target.value);
                                        }}
                                        required
                                        multiline
                                        maxRows={6}
                                        placeholder="Please describe your complaint in detail..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'var(--color-background-paper)',
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
                                            '& .MuiInputBase-input': {
                                                color: 'var(--color-text)',
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            <BlueButton
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                disabled={loader}
                                startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                sx={{ 
                                    py: 1.5,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                    }
                                }}
                            >
                                {loader ? "Submitting..." : "Submit Complaint"}
                            </BlueButton>
                        </form>
                    </CardContent>
                </Card>
                
                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                        mb: 4,
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--color-text)' }}>
                            Guidelines for Submitting Complaints
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
                            Please follow these guidelines when submitting your complaint:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, color: 'var(--color-text-secondary)' }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Be specific about the issue you're experiencing
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Include relevant dates and details
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Maintain a professional and respectful tone
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Provide any supporting information that might help resolve the issue
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 2 }}>
                            Your complaint will be reviewed by the school administration and addressed as soon as possible.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default StudentComplain;