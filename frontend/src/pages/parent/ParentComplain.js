import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Fade, 
    CircularProgress, 
    TextField, 
    Button, 
    Grid, 
    IconButton, 
    Tooltip,
    Alert,
    Snackbar
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { createComplain } from '../../redux/complainRelated/complainHandle';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

const ParentComplain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);

    const [complain, setComplain] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (currentUser) {
            dispatch(getUserDetails(currentUser._id, "Parent"));
        }
    }, [dispatch, currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!complain.trim()) {
            setSnackbar({
                open: true,
                message: 'Please enter your complaint',
                severity: 'error'
            });
            return;
        }

        const complainData = {
            student: userDetails?.student?._id,
            complain: complain.trim()
        };

        try {
            await dispatch(createComplain(complainData));
            setComplain('');
            setSnackbar({
                open: true,
                message: 'Complaint submitted successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to submit complaint',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Fade in={true} timeout={500}>
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
                                    onClick={() => navigate('/Parent/dashboard')}
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
                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Submit Complaint
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                            Submit a complaint or concern regarding your child's education
                        </Typography>
                    </Box>

                    <Paper elevation={0} sx={{ 
                        p: 4, 
                        borderRadius: 2, 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                    }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        label="Your Complaint"
                                        value={complain}
                                        onChange={(e) => setComplain(e.target.value)}
                                        placeholder="Please describe your complaint or concern in detail..."
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
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
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        sx={{
                                            background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                                            '&:hover': {
                                                background: 'linear-gradient(90deg, var(--color-primary-variant), var(--color-primary))',
                                            },
                                        }}
                                    >
                                        Submit Complaint
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

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
                </Container>
            </Box>
        </Fade>
    );
};

export default ParentComplain; 