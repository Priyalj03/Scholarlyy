import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Box, Container, Typography, Tab, IconButton, Paper, Grid, Card, CardContent,
    CardActions, Divider, Chip, Avatar, Tooltip, Fade, CircularProgress
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import styled from '@emotion/styled';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        '& .card-overlay': {
            opacity: 1,
        },
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-variant) 100%)',
    },
}));

const StyledTabList = styled(TabList)({
    '& .MuiTabs-indicator': {
        backgroundColor: '#1976d2',
        height: 3,
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        minHeight: 48,
        color: '#666666',
        '&.Mui-selected': {
            color: '#1976d2',
        },
    },
});

const CardOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.03)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const StatCard = ({ icon, title, value, color, onClick }) => (
    <StyledCard onClick={onClick}>
        <CardOverlay className="card-overlay">
            <Typography variant="button" sx={{ 
                color: color === 'primary' ? '#1976d2' : '#2e7d32',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem'
            }}>
                View Details
            </Typography>
        </CardOverlay>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                    bgcolor: color === 'primary' ? '#e3f2fd' : '#e8f5e9', 
                    color: color === 'primary' ? '#1976d2' : '#2e7d32', 
                    mr: 2,
                    width: 48,
                    height: 48
                }}>
                    {icon}
                </Avatar>
                <Typography variant="h6" color="#333333" sx={{ fontWeight: 500 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ 
                fontWeight: 700, 
                color: color === 'primary' ? '#1976d2' : '#2e7d32',
                mb: 1
            }}>
                {value}
            </Typography>
            <Typography variant="body2" color="#666666">
                Click to view {title.toLowerCase()}
            </Typography>
        </CardContent>
    </StyledCard>
);

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);
    const { teachersList, loading: teachersLoading } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
        dispatch(getAllTeachers(currentUser._id));
    }, [dispatch, classID, currentUser._id])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getClassStudents(classID));
        //         dispatch(resetSubjects())
        //         dispatch(getSubjectList(classID, "ClassSubjects"))
        //     })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Delete Subject">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Subject")}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: '#ffebee',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <DeleteIcon sx={{ color: '#d32f2f' }} />
                    </IconButton>
                </Tooltip>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton>
            </Box>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(classID, "SubjectsClass")
        },
        {
            icon: <PeopleIcon color="primary" />, name: 'Add Teacher',
            action: () => navigate(`/Admin/teachers/chooseclass/${classID}`)
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <Fade in={true} timeout={500}>
                <Box>
                    {response ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/addsubject/" + classID)}
                                startIcon={<PostAddIcon />}
                            >
                                Add Subjects
                            </GreenButton>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333' }}>
                                    Subjects List
                                </Typography>
                                <SpeedDialTemplate actions={subjectActions} />
                            </Box>
                            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                            </Paper>
                        </>
                    )}
                </Box>
            </Fade>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Remove Student">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Student")}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: '#ffebee',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <PersonRemoveIcon sx={{ color: '#d32f2f' }} />
                    </IconButton>
                </Tooltip>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}
                >
                    Attendance
                </PurpleButton>
            </Box>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
        return (
            <Fade in={true} timeout={500}>
                <Box>
                    {getresponse ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                startIcon={<PersonAddAlt1Icon />}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333' }}>
                                    Students List
                                </Typography>
                                <SpeedDialTemplate actions={studentActions} />
                            </Box>
                            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            </Paper>
                        </>
                    )}
                </Box>
            </Fade>
        )
    }

    const teacherColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'email', label: 'Email', minWidth: 200 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
    ];

    const teacherRows = teachersList && teachersList
        .filter(teacher => teacher.teachSclass._id === classID)
        .map((teacher) => {
            return {
                name: teacher.name,
                email: teacher.email,
                teachSubject: teacher.teachSubject?.subName || 'Not Assigned',
                id: teacher._id,
            };
        });

    const TeachersButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Remove Teacher">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Teacher")}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: '#ffebee',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <PersonRemoveIcon sx={{ color: '#d32f2f' }} />
                    </IconButton>
                </Tooltip>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate(`/Admin/teachers/teacher/${row.id}`)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() => navigate(`/Admin/teachers/chooseclass/${classID}/${row.id}`)}
                >
                    Assign Subject
                </PurpleButton>
            </Box>
        );
    };

    const teacherActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate(`/Admin/teachers/chooseclass/${classID}`)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Remove All Teachers',
            action: () => deleteHandler(classID, "TeachersClass")
        }
    ];

    const ClassTeachersSection = () => {
        return (
            <Fade in={true} timeout={500}>
                <Box>
                    {teachersLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <CircularProgress />
                        </Box>
                    ) : teachersList?.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No teachers assigned to this class yet
                            </Typography>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate(`/Admin/teachers/chooseclass/${classID}`)}
                                startIcon={<PersonAddAlt1Icon />}
                            >
                                Add Teacher
                            </GreenButton>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333' }}>
                                    Teachers List
                                </Typography>
                                <SpeedDialTemplate actions={teacherActions} />
                            </Box>
                            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                <TableTemplate buttonHaver={TeachersButtonHaver} columns={teacherColumns} rows={teacherRows} />
                            </Paper>
                        </>
                    )}
                </Box>
            </Fade>
        );
    };

    const InfoItem = ({ label, value, multiline }) => (
        <Box sx={{ mb: multiline ? 2 : 0 }}>
            <Typography variant="subtitle2" sx={{ 
                mb: 0.5,
                color: 'var(--color-text)',
                fontWeight: 600
            }}>
                {label}
            </Typography>
            <Typography 
                variant="body1" 
                sx={{ 
                    whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'var(--color-text)',
                    fontWeight: 500
                }}
            >
                {value}
            </Typography>
        </Box>
    );

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        return (
            <Fade in={true} timeout={500}>
                <Box>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 1 }}>
                            {sclassDetails && sclassDetails.sclassName}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                            Class Management Dashboard
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <StatCard
                                icon={<MenuBookIcon />}
                                title="Total Subjects"
                                value={numberOfSubjects}
                                color="primary"
                                onClick={() => setValue('2')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StatCard
                                icon={<GroupIcon />}
                                title="Total Students"
                                value={numberOfStudents}
                                color="success"
                                onClick={() => setValue('3')}
                            />
                        </Grid>
                    </Grid>

                    <Paper elevation={0} sx={{ 
                        p: 3, 
                        mb: 3, 
                        borderRadius: 2, 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)'
                    }}>
                        <Typography variant="h6" sx={{ 
                            mb: 2, 
                            color: 'var(--color-text)',
                            fontWeight: 600
                        }}>
                            Class Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Class Name"
                                    value={sclassDetails?.sclassName || 'Not specified'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="School"
                                    value={sclassDetails?.school?.schoolName || 'Not specified'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Total Subjects"
                                    value={`${numberOfSubjects} subjects`}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    label="Total Students"
                                    value={`${numberOfStudents} students`}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            startIcon={<PersonAddAlt1Icon />}
                        >
                            Add Students
                        </GreenButton>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            startIcon={<PostAddIcon />}
                        >
                            Add Subjects
                        </GreenButton>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate(`/Admin/teachers/chooseclass/${classID}`)}
                            startIcon={<PeopleIcon />}
                        >
                            Add Teachers
                        </GreenButton>
                    </Box>
                </Box>
            </Fade>
        );
    }

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0', mb: 3 }}>
                                <StyledTabList onChange={handleChange} aria-label="class details tabs">
                                    <Tab icon={<SchoolIcon />} label="Overview" value="1" />
                                    <Tab icon={<MenuBookIcon />} label="Subjects" value="2" />
                                    <Tab icon={<GroupIcon />} label="Students" value="3" />
                                    <Tab icon={<PeopleIcon />} label="Teachers" value="4" />
                                </StyledTabList>
                            </Box>
                            <TabPanel value="1">
                                <ClassDetailsSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <ClassSubjectsSection />
                            </TabPanel>
                            <TabPanel value="3">
                                <ClassStudentsSection />
                            </TabPanel>
                            <TabPanel value="4">
                                <ClassTeachersSection />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Container>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ClassDetails;