import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails, deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Typography, Container, Card, CardContent, Grid, Fade,
    CircularProgress, IconButton, Tooltip, Button, CardHeader
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from '../../../styles/theme';
import styled from 'styled-components';
import Popup from '../../../components/Popup';
import axios from 'axios';

// Styled Components
const StyledContainer = styled.div`
    min-height: 100vh;
    padding: 2rem;
    background-color: #121212;
`;

const StyledPaper = styled(Card)`
    padding: 2rem;
    border-radius: 12px;
    background-color: #1E1E1E;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoCard = styled(Card)`
    height: 100%;
    background-color: #1E1E1E;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
`;

const ViewParent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [parentDetails, setParentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parentID = params.id;

    useEffect(() => {
        const fetchParentDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parent/${parentID}`);
                setParentDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchParentDetails();
    }, [parentID]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = () => {
        setMessage("Are you sure you want to delete this parent?");
        setShowPopup(true);
    };

    const handleDelete = () => {
        dispatch(deleteUser(parentID, "Parent"))
            .then(() => {
                navigate("/Admin/parents");
            })
            .catch((error) => {
                setMessage("Error deleting parent");
                setShowPopup(true);
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Fade in={true} timeout={500}>
                    <StyledPaper>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h4" sx={{ color: 'white' }}>
                                Parent Details
                            </Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ mr: 2 }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={deleteHandler}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>

                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <Typography color="error">{error}</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {/* Parent Information Card */}
                                <Grid item xs={12} md={6}>
                                    <InfoCard>
                                        <CardHeader
                                            title="Parent Information"
                                            avatar={<PersonIcon />}
                                        />
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" color="primary">
                                                        {parentDetails?.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Email
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                        {parentDetails?.email || 'Not provided'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Phone Number
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                        {parentDetails?.phoneNumber || 'Not provided'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        School
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                        {parentDetails?.school?.schoolName || 'Not provided'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </InfoCard>
                                </Grid>

                                {/* Student Information Card */}
                                <Grid item xs={12} md={6}>
                                    <InfoCard>
                                        <CardHeader
                                            title="Student Information"
                                            avatar={<PersonIcon />}
                                        />
                                        <CardContent>
                                            {parentDetails?.student ? (
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6" color="primary">
                                                            {parentDetails.student.name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Roll Number
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                            {parentDetails.student.rollNum}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Class
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                            {parentDetails.student.sclassName?.sclassName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            startIcon={<PersonIcon />}
                                                            onClick={() => navigate(`/Admin/students/student/${parentDetails.student._id}`)}
                                                            sx={{ 
                                                                borderColor: 'var(--color-primary)',
                                                                color: 'var(--color-primary)',
                                                                '&:hover': {
                                                                    borderColor: 'var(--color-primary)',
                                                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                                }
                                                            }}
                                                        >
                                                            View Student Profile
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <Box textAlign="center" py={2}>
                                                    <Typography variant="body1" color="textSecondary" gutterBottom>
                                                        No student information available
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<PersonIcon />}
                                                        onClick={() => navigate('/Admin/addstudent')}
                                                        sx={{ 
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            '&:hover': {
                                                                borderColor: 'var(--color-primary)',
                                                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                            }
                                                        }}
                                                    >
                                                        Add Student
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </InfoCard>
                                </Grid>
                            </Grid>
                        )}
                    </StyledPaper>
                </Fade>
                <Popup 
                    message={message} 
                    setShowPopup={setShowPopup} 
                    showPopup={showPopup}
                    onConfirm={handleDelete}
                />
            </StyledContainer>
        </ThemeProvider>
    );
};

export default ViewParent; 