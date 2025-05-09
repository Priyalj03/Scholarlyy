import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Box, 
    Button, 
    Collapse, 
    Table, 
    TableBody, 
    TableHead, 
    Typography,
    ThemeProvider,
    createTheme,
    Fade,
    CircularProgress,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp,
    Person as PersonIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    Assignment as AssignmentIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import styled from 'styled-components';

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
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
    },
});

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const address = "Student";
    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    if (response) { console.log(response); }
    else if (error) { console.log(error); }

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Fade in={true} timeout={500}>
                    <StyledPaper elevation={6}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                                <CircularProgress sx={{ color: '#00E5FF' }} />
                            </Box>
                        ) : (
                            <>
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
                                        Student Details
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        View and manage student information
                                    </Typography>
                                </Box>

                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <StyledCard>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                                                    Basic Information
                                                </Typography>
                                                <InfoItem 
                                                    label="Name" 
                                                    value={userDetails?.name} 
                                                    icon={<PersonIcon />}
                                                />
                                                <InfoItem 
                                                    label="Roll Number" 
                                                    value={userDetails?.rollNum} 
                                                    icon={<AssignmentIcon />}
                                                />
                                                <InfoItem 
                                                    label="Class" 
                                                    value={sclassName?.sclassName} 
                                                    icon={<ClassIcon />}
                                                />
                                                <InfoItem 
                                                    label="School" 
                                                    value={studentSchool?.schoolName} 
                                                    icon={<SchoolIcon />}
                                                />
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <StyledCard>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                                                    Overall Attendance
                                                </Typography>
                                                <Box sx={{ height: 200 }}>
                                                    <CustomPieChart data={chartData} />
                                                </Box>
                                                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                                                    Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                                                </Typography>
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>
                                </Grid>

                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 3,
                                        fontWeight: 600,
                                        color: 'white'
                                    }}
                                >
                                    Subject Details
                                </Typography>

                                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                                    <StyledTablePaper>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachSubject) {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                                    return (
                                        <Table key={index}>
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>Subject</StyledTableCell>
                                                    <StyledTableCell>Present</StyledTableCell>
                                                    <StyledTableCell>Total Sessions</StyledTableCell>
                                                    <StyledTableCell>Attendance Percentage</StyledTableCell>
                                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>

                                            <TableBody>
                                                <StyledTableRow>
                                                    <StyledTableCell>{subName}</StyledTableCell>
                                                    <StyledTableCell>{present}</StyledTableCell>
                                                    <StyledTableCell>{sessions}</StyledTableCell>
                                                    <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                                    <ActionButton 
                                                                        variant="contained" 
                                                                        onClick={() => handleOpen(subId)}
                                                                        startIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                                    >
                                                                        Details
                                                                    </ActionButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <StyledTableRow>
                                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                            <Typography variant="h6" gutterBottom component="div" sx={{ color: 'white' }}>
                                                                    Attendance Details
                                                                </Typography>
                                                                <Table size="small" aria-label="purchases">
                                                                    <TableHead>
                                                                        <StyledTableRow>
                                                                            <StyledTableCell>Date</StyledTableCell>
                                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                                        </StyledTableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {allData.map((data, index) => {
                                                                            const date = new Date(data.date);
                                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                            return (
                                                                                <StyledTableRow key={index}>
                                                                                    <StyledTableCell component="th" scope="row">
                                                                                        {dateString}
                                                                                    </StyledTableCell>
                                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                                </StyledTableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        </Table>
                                                );
                                }
                                            return null;
                            })}
                                    </StyledTablePaper>
                                )}

                                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <ActionButton
                        variant="contained"
                                        onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                                        startIcon={<AddIcon />}
                    >
                        Add Attendance
                                    </ActionButton>
                                </Box>

                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mt: 4,
                                        mb: 3,
                                        fontWeight: 600,
                                        color: 'white'
                                    }}
                                >
                                    Subject Marks
                                </Typography>

                                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 && (
                                    <StyledTablePaper>
                            {subjectMarks.map((result, index) => {
                                if (result.subName.subName === teachSubject) {
                                    return (
                                        <Table key={index}>
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>Subject</StyledTableCell>
                                                    <StyledTableCell>Marks</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                <StyledTableRow>
                                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        </Table>
                                                );
                                }
                                    return null;
                            })}
                                    </StyledTablePaper>
                                )}

                                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <ActionButton
                                        variant="contained"
                                        onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                                        startIcon={<AddIcon />}
                                    >
                        Add Marks
                                    </ActionButton>
                                </Box>
                            </>
                        )}
                    </StyledPaper>
                </Fade>
            </StyledContainer>
        </ThemeProvider>
    );
};

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
  max-width: 1200px;
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

const StyledCard = styled(Card)`
  background-color: rgba(18, 18, 18, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  }
`;

const StyledTablePaper = styled(Paper)`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(18, 18, 18, 0.5);
  margin-bottom: 2rem;
`;

const StyledTableRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  &:hover {
    background-color: rgba(0, 229, 255, 0.05);
  }
`;

const StyledTableCell = styled.td`
  padding: 16px;
  color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled(Button)`
  background-color: rgba(0, 229, 255, 0.1) !important;
  color: #00E5FF !important;
  font-weight: 600 !important;
  
  &:hover {
    background-color: rgba(0, 229, 255, 0.2) !important;
  }
`;

const InfoItem = ({ label, value, icon }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        p: 1,
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
        }
    }}>
        <Box sx={{ 
            mr: 2, 
            display: 'flex', 
            alignItems: 'center',
            color: '#00E5FF'
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                {value || 'Not Available'}
            </Typography>
        </Box>
    </Box>
);

export default TeacherViewStudent;