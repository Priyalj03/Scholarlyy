import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';
import { School, Assignment, Event } from '@mui/icons-material';

const Home = () => {
    const { currentUser } = useSelector(state => state.user);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Welcome, {currentUser?.name}
                    </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Student Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                View your child's academic information and progress
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Academic Performance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track your child's marks and academic achievements
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Event sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Attendance Record
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Monitor your child's attendance and participation
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home; 