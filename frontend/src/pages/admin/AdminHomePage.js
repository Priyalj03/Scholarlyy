import React, { useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { 
    DashboardCard, 
    CardIcon, 
    CardTitle, 
    CardValue, 
    DashboardContainer, 
    DashboardGrid,
    DashboardSection,
    SectionTitle
} from '../../components/styles';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    const handleStudentsClick = () => {
        navigate('/Admin/students');
    };

    const handleClassesClick = () => {
        navigate('/Admin/classes');
    };

    const handleTeachersClick = () => {
        navigate('/Admin/teachers');
    };

    return (
        <Box sx={{ 
            background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
            minHeight: '100vh',
            padding: '24px 0',
        }}>
            <DashboardContainer maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: 'var(--color-text)',
                        mb: 1,
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                        Welcome back! Here's what's happening in your school today.
                    </Typography>
                </Box>
                
                <DashboardGrid container spacing={3}>
                    <Grid item xs={12} md={3} lg={3}>
                        <DashboardCard onClick={handleStudentsClick} sx={{ cursor: 'pointer' }}>
                            <CardIcon>
                                <img src={Students} alt="Students" />
                            </CardIcon>
                            <CardTitle>
                                Total Students
                            </CardTitle>
                            <CardValue>
                                <CountUp start={0} end={numberOfStudents} duration={2.5} />
                            </CardValue>
                        </DashboardCard>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <DashboardCard onClick={handleClassesClick} sx={{ cursor: 'pointer' }}>
                            <CardIcon>
                                <img src={Classes} alt="Classes" />
                            </CardIcon>
                            <CardTitle>
                                Total Classes
                            </CardTitle>
                            <CardValue>
                                <CountUp start={0} end={numberOfClasses} duration={5} />
                            </CardValue>
                        </DashboardCard>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <DashboardCard onClick={handleTeachersClick} sx={{ cursor: 'pointer' }}>
                            <CardIcon>
                                <img src={Teachers} alt="Teachers" />
                            </CardIcon>
                            <CardTitle>
                                Total Teachers
                            </CardTitle>
                            <CardValue>
                                <CountUp start={0} end={numberOfTeachers} duration={2.5} />
                            </CardValue>
                        </DashboardCard>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <DashboardCard>
                            <CardIcon>
                                <img src={Fees} alt="Fees" />
                            </CardIcon>
                            <CardTitle>
                                Fees Collection
                            </CardTitle>
                            <CardValue>
                                <CountUp start={0} end={250000} duration={2.5} prefix="₹" />
                            </CardValue>
                        </DashboardCard>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <DashboardSection>
                            <SectionTitle>Recent Notices</SectionTitle>
                            <SeeNotice />
                        </DashboardSection>
                    </Grid>
                </DashboardGrid>
            </DashboardContainer>
        </Box>
    );
};

export default AdminHomePage;