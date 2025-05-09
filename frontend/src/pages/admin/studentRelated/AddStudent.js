import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
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
    InputLabel,
    Switch,
    FormControlLabel
} from "@mui/material";
import { 
    Save as SaveIcon,
    School as SchoolIcon
} from '@mui/icons-material';
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
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

const Container = styled.div`
    min-height: 100vh;
    padding: 2rem;
    background-color: #121212;
`;

const StyledPaper = styled(Paper)`
    padding: 2rem;
    border-radius: 12px;
    background-color: #1E1E1E;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormCard = styled(Box)`
    background-color: #1E1E1E;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
`;

const SubmitButton = styled(Button)`
    background-color: #00E5FF;
    color: white;
    padding: 0.75rem 2rem;
    &:hover {
        background-color: #00B8CC;
    }
`;

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [addParent, setAddParent] = useState(false);
    const [parentName, setParentName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [parentPhoneNumber, setParentPhoneNumber] = useState('');
    const [parentPassword, setParentPassword] = useState('');

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);

        if (!sclassName) {
            setMessage("Please select a class");
            setShowPopup(true);
            setLoader(false);
            return;
        }

        const fields = {
            name,
            rollNum: Number(rollNum),
            email,
            phoneNumber,
            address,
            password,
            sclassName,
            adminID,
            role,
            attendance
        };

        if (addParent) {
            if (!parentName || !parentEmail || !parentPhoneNumber || !parentPassword) {
                setMessage("Please fill in all parent information fields");
                setShowPopup(true);
                setLoader(false);
                return;
            }
            fields.parent = {
                name: parentName,
                email: parentEmail,
                phoneNumber: parentPhoneNumber,
                password: parentPassword
            };
        }

        dispatch(registerUser(fields, role));
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
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
                    <StyledPaper>
                        <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
                            Add New Student
                        </Typography>

                        <form onSubmit={submitHandler}>
                            <FormCard>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                            Student Information
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                                            required
                                        />
                                    </Grid>

                                    {situation === "Student" && (
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Class</InputLabel>
                                                <Select
                                value={className}
                                                    label="Class"
                                                    onChange={changeHandler}
                                                    required
                                                >
                                                    <MenuItem value='Select Class'>Select Class</MenuItem>
                                {sclassesList.map((classItem, index) => (
                                                        <MenuItem key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Roll Number"
                                            type="number"
                        value={rollNum}
                        onChange={(event) => setRollNum(event.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            value={phoneNumber}
                                            onChange={(event) => setPhoneNumber(event.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            multiline
                                            rows={3}
                                            value={address}
                                            onChange={(event) => setAddress(event.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={addParent}
                                                    onChange={(e) => setAddParent(e.target.checked)}
                                                />
                                            }
                                            label="Add Parent Information"
                                        />
                                    </Grid>

                                    {addParent && (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 2 }}>
                                                    Parent Information
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Parent Name"
                                                    value={parentName}
                                                    onChange={(event) => setParentName(event.target.value)}
                                                    required={addParent}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Parent Email"
                                                    type="email"
                                                    value={parentEmail}
                                                    onChange={(event) => setParentEmail(event.target.value)}
                                                    required={addParent}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Parent Phone Number"
                                                    value={parentPhoneNumber}
                                                    onChange={(event) => setParentPhoneNumber(event.target.value)}
                                                    required={addParent}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Parent Password"
                                                    type="password"
                                                    value={parentPassword}
                                                    onChange={(event) => setParentPassword(event.target.value)}
                                                    required={addParent}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </FormCard>

                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <SubmitButton
                                    type="submit"
                                    variant="contained"
                                    disabled={loader}
                                    startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                >
                                    {loader ? 'Creating...' : 'Create Student'}
                                </SubmitButton>
                            </Box>
                </form>
                    </StyledPaper>
                </Fade>
            </Container>
            <Popup
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                message={message}
            />
        </ThemeProvider>
    );
};

export default AddStudent;