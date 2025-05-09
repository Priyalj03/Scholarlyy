import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, 
  Paper, Grid, Card, CardContent, Fade, CircularProgress, Tooltip, IconButton,
  Divider
} from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
        >
          Take Attendance
        </PurpleButton>
      </Box>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton 
          variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}
        >
          Provide Marks
        </PurpleButton>
      </Box>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <Fade in={true} timeout={500}>
        <Box>
          {getresponse ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                startIcon={<GroupIcon />}
                sx={{ py: 1.5, px: 3 }}
              >
                Add Students
              </GreenButton>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Tooltip title="Back to Subjects">
                    <IconButton 
                      onClick={() => navigate(`/Admin/subjects/subject/${classID}/${subjectID}`)}
                      sx={{ 
                        mr: 2,
                        '&:hover': { 
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                    Students List
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                  Manage student attendance and marks
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
                <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                      {selectedSection === 'attendance' ? 'Attendance Records' : 'Marks Records'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Attendance Records">
                        <IconButton 
                          onClick={() => setSelectedSection('attendance')}
                          sx={{ 
                            color: selectedSection === 'attendance' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            '&:hover': { 
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <TableChartIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Marks Records">
                        <IconButton 
                          onClick={() => setSelectedSection('marks')}
                          sx={{ 
                            color: selectedSection === 'marks' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            '&:hover': { 
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <InsertChartIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                
                {selectedSection === 'attendance' && (
                  <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
                )}
                {selectedSection === 'marks' && (
                  <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
                )}
              </Card>

              <Paper 
                sx={{ 
                  position: 'fixed', 
                  bottom: 0, 
                  left: 0, 
                  right: 0,
                  backgroundColor: 'var(--color-background-paper)',
                  borderTop: '1px solid var(--color-border)',
                  zIndex: 1000,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }} 
                elevation={3}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  p: 1,
                  height: 70
                }}>
                  <Box 
                    onClick={() => setSelectedSection('attendance')}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      cursor: 'pointer',
                      color: selectedSection === 'attendance' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      borderTop: selectedSection === 'attendance' ? '3px solid var(--color-primary)' : 'none',
                      pt: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    {selectedSection === 'attendance' ? 
                      <TableChartIcon sx={{ fontSize: 28, mb: 0.5 }} /> : 
                      <TableChartOutlinedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                    }
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: selectedSection === 'attendance' ? 600 : 400,
                        fontSize: '0.8rem'
                      }}
                    >
                      Attendance
                    </Typography>
                  </Box>
                  
                  <Box 
                    onClick={() => setSelectedSection('marks')}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      cursor: 'pointer',
                      color: selectedSection === 'marks' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      borderTop: selectedSection === 'marks' ? '3px solid var(--color-primary)' : 'none',
                      pt: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    {selectedSection === 'marks' ? 
                      <InsertChartIcon sx={{ fontSize: 28, mb: 0.5 }} /> : 
                      <InsertChartOutlinedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                    }
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: selectedSection === 'marks' ? 600 : 400,
                        fontSize: '0.8rem'
                      }}
                    >
                      Marks
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Fade>
    )
  }

  const InfoItem = ({ label, value, icon, color }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 36, 
            height: 36, 
            borderRadius: '50%',
            backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.1)' : 
                           color === 'success' ? 'rgba(46, 125, 50, 0.1)' : 
                           color === 'purple' ? 'rgba(156, 39, 176, 0.1)' : 
                           'rgba(0, 0, 0, 0.1)',
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: 'var(--color-text)', pl: 7 }}>
        {value}
      </Typography>
    </Box>
  );

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <Fade in={true} timeout={500}>
        <Box>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Tooltip title="Back to Subjects">
                <IconButton 
                  onClick={() => navigate(`/Admin/subjects/subject/${classID}/${subjectID}`)}
                  sx={{ 
                    mr: 2,
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                Subject Details
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
              View and manage subject information
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 2, 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background-paper)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                    Subject Information
                  </Typography>
                  
                  <InfoItem 
                    label="Subject Name" 
                    value={subjectDetails?.subName || 'Not specified'} 
                    icon={<MenuBookIcon sx={{ color: '#1976d2' }} />}
                    color="primary"
                  />
                  
                  <InfoItem 
                    label="Subject Code" 
                    value={subjectDetails?.subCode || 'Not specified'} 
                    icon={<MenuBookIcon sx={{ color: '#1976d2' }} />}
                    color="primary"
                  />
                  
                  <InfoItem 
                    label="Subject Sessions" 
                    value={subjectDetails?.sessions || '0'} 
                    icon={<AccessTimeIcon sx={{ color: '#9c27b0' }} />}
                    color="purple"
                  />
                  
                  <InfoItem 
                    label="Class Name" 
                    value={subjectDetails?.sclassName?.sclassName || 'Not specified'} 
                    icon={<SchoolIcon sx={{ color: '#2e7d32' }} />}
                    color="success"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 2, 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background-paper)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                    Teacher Information
                  </Typography>
                  
                  {subjectDetails && subjectDetails.teacher ? (
                    <InfoItem 
                      label="Teacher Name" 
                      value={subjectDetails.teacher.name} 
                      icon={<PersonIcon sx={{ color: '#1976d2' }} />}
                      color="primary"
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body1" sx={{ mb: 2, color: 'var(--color-text-secondary)' }}>
                        No teacher assigned to this subject
                      </Typography>
                      <GreenButton 
                        variant="contained"
                        onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}
                        startIcon={<PersonIcon />}
                      >
                        Add Subject Teacher
                      </GreenButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background-paper)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                Student Statistics
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    mr: 2
                  }}
                >
                  <GroupIcon sx={{ color: '#2e7d32' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                    Number of Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {numberOfStudents}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {subloading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <TabList onChange={handleChange} sx={{ 
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'var(--color-primary)',
                  },
                  '& .MuiTab-root': {
                    color: 'var(--color-text-secondary)',
                    '&.Mui-selected': {
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                    },
                  }
                }}>
                  <Tab label="Details" value="1" />
                  <Tab label="Students" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <SubjectDetailsSection />
              </TabPanel>
              <TabPanel value="2">
                <SubjectStudentsSection />
              </TabPanel>
            </TabContext>
          </Box>
        )}
      </Container>
    </Fade>
  )
}

export default ViewSubject;