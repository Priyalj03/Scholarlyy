import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  CircularProgress,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Grid,
  ThemeProvider,
  createTheme,
  Fade
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/userRelated/userHandle';
import { addStuff } from '../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
              transition: 'border-color 0.3s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00E5FF',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#00E5FF',
            },
          },
        },
      },
    },
  },
});

const BulkAdd = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { status, response, error } = useSelector((state) => state.user);
  
  const [activeTab, setActiveTab] = useState(0);
  const [loader, setLoader] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Teachers state
  const [teachers, setTeachers] = useState([
    { name: '', email: '', password: '', teachSubject: '', teachSclass: '' }
  ]);
  
  // Students state
  const [students, setStudents] = useState([
    { name: '', rollNum: '', password: '', sclassName: '' }
  ]);
  
  // Subjects state
  const [subjects, setSubjects] = useState([
    { subName: '', subCode: '', sessions: '' }
  ]);
  
  const [selectedClass, setSelectedClass] = useState('');
  
  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }
  }, [currentUser, dispatch]);
  
  useEffect(() => {
    if (status === 'added') {
      setSnackbar({
        open: true,
        message: 'Items added successfully!',
        severity: 'success'
      });
      setLoader(false);
      
      // Reset forms after successful addition
      if (activeTab === 0) {
        setTeachers([{ name: '', email: '', password: '', teachSubject: '', teachSclass: '' }]);
      } else if (activeTab === 1) {
        setStudents([{ name: '', rollNum: '', password: '', sclassName: '' }]);
      } else if (activeTab === 2) {
        setSubjects([{ subName: '', subCode: '', sessions: '' }]);
      }
    } else if (status === 'failed') {
      setSnackbar({
        open: true,
        message: response || 'Failed to add items',
        severity: 'error'
      });
      setLoader(false);
    } else if (status === 'error') {
      setSnackbar({
        open: true,
        message: 'Network Error',
        severity: 'error'
      });
      setLoader(false);
    }
  }, [status, response, error, activeTab]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Teacher handlers
  const handleTeacherChange = (index, field) => (event) => {
    const newTeachers = [...teachers];
    newTeachers[index][field] = event.target.value;
    setTeachers(newTeachers);
  };
  
  const addTeacher = () => {
    setTeachers([...teachers, { name: '', email: '', password: '', teachSubject: '', teachSclass: '' }]);
  };
  
  const removeTeacher = (index) => () => {
    const newTeachers = [...teachers];
    newTeachers.splice(index, 1);
    setTeachers(newTeachers);
  };
  
  // Student handlers
  const handleStudentChange = (index, field) => (event) => {
    const newStudents = [...students];
    newStudents[index][field] = event.target.value;
    setStudents(newStudents);
  };
  
  const addStudent = () => {
    setStudents([...students, { name: '', rollNum: '', password: '', sclassName: '' }]);
  };
  
  const removeStudent = (index) => () => {
    const newStudents = [...students];
    newStudents.splice(index, 1);
    setStudents(newStudents);
  };
  
  // Subject handlers
  const handleSubjectChange = (index, field) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = event.target.value;
    setSubjects(newSubjects);
  };
  
  const addSubject = () => {
    setSubjects([...subjects, { subName: '', subCode: '', sessions: '' }]);
  };
  
  const removeSubject = (index) => () => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };
  
  // Class selection handler
  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };
  
  // Submit handlers
  const handleTeacherSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    
    // Process each teacher
    for (const teacher of teachers) {
      if (teacher.name && teacher.email && teacher.password && teacher.teachSubject && teacher.teachSclass) {
        const fields = {
          name: teacher.name,
          email: teacher.email,
          password: teacher.password,
          role: "Teacher",
          school: currentUser._id,
          teachSubject: teacher.teachSubject,
          teachSclass: teacher.teachSclass
        };
        
        await dispatch(registerUser(fields, "Teacher"));
      }
    }
  };
  
  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    
    // Process each student
    for (const student of students) {
      if (student.name && student.rollNum && student.password && student.sclassName) {
        const fields = {
          name: student.name,
          rollNum: student.rollNum,
          password: student.password,
          sclassName: student.sclassName,
          adminID: currentUser._id,
          role: "Student",
          attendance: []
        };
        
        await dispatch(registerUser(fields, "Student"));
      }
    }
  };
  
  const handleSubjectSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    
    if (!selectedClass) {
      setSnackbar({
        open: true,
        message: 'Please select a class',
        severity: 'error'
      });
      setLoader(false);
      return;
    }
    
    const fields = {
      sclassName: selectedClass,
      subjects: subjects.map((subject) => ({
        subName: subject.subName,
        subCode: subject.subCode,
        sessions: subject.sessions,
      })),
      adminID: currentUser._id,
    };
    
    dispatch(addStuff(fields, "Subject"));
  };
  
  // Download template handlers
  const downloadTeacherTemplate = () => {
    const template = "Name,Email,Password,Subject ID,Class ID\n";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teacher_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const downloadStudentTemplate = () => {
    const template = "Name,Roll Number,Password,Class ID\n";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const downloadSubjectTemplate = () => {
    const template = "Subject Name,Subject Code,Sessions\n";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subject_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledContainer>
        <Fade in={true} timeout={500}>
          <StyledPaper elevation={6}>
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
                Bulk Add
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Add multiple teachers, students, or subjects at once
              </Typography>
            </Box>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              centered
              sx={{
                mb: 4,
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00E5FF',
                },
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: '#00E5FF',
                  },
                },
              }}
            >
              <Tab label="Teachers" />
              <Tab label="Students" />
              <Tab label="Subjects" />
            </Tabs>
            
            {activeTab === 0 && (
              <TeacherForm>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Add Teachers</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />}
                    onClick={downloadTeacherTemplate}
                    sx={{ mr: 2 }}
                  >
                    Download Template
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<UploadIcon />}
                    component="label"
                  >
                    Upload CSV
                    <input
                      type="file"
                      hidden
                      accept=".csv"
                      onChange={(e) => {
                        // Handle CSV upload here
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const csvData = event.target.result;
                            const rows = csvData.split('\n');
                            const newTeachers = [];
                            
                            for (let i = 1; i < rows.length; i++) {
                              if (rows[i].trim()) {
                                const [name, email, password, teachSubject, teachSclass] = rows[i].split(',');
                                newTeachers.push({ name, email, password, teachSubject, teachSclass });
                              }
                            }
                            
                            if (newTeachers.length > 0) {
                              setTeachers(newTeachers);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </Button>
                </Box>
                
                <form onSubmit={handleTeacherSubmit}>
                  {teachers.map((teacher, index) => (
                    <TeacherCard key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={teacher.name}
                            onChange={handleTeacherChange(index, 'name')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={teacher.email}
                            onChange={handleTeacherChange(index, 'email')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={teacher.password}
                            onChange={handleTeacherChange(index, 'password')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Subject ID"
                            variant="outlined"
                            value={teacher.teachSubject}
                            onChange={handleTeacherChange(index, 'teachSubject')}
                            required
                            helperText="Enter the subject ID from the subjects list"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Class ID"
                            variant="outlined"
                            value={teacher.teachSclass}
                            onChange={handleTeacherChange(index, 'teachSclass')}
                            required
                            helperText="Enter the class ID from the classes list"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="flex-end">
                            {index === 0 ? (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={addTeacher}
                                startIcon={<AddIcon />}
                              >
                                Add Another Teacher
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={removeTeacher(index)}
                                startIcon={<DeleteIcon />}
                              >
                                Remove
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </TeacherCard>
                  ))}
                  
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <SubmitButton 
                      type="submit" 
                      variant="contained"
                      disabled={loader}
                    >
                      {loader ? <CircularProgress size={24} color="inherit" /> : 'Add Teachers'}
                    </SubmitButton>
                  </Box>
                </form>
              </TeacherForm>
            )}
            
            {activeTab === 1 && (
              <StudentForm>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Add Students</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />}
                    onClick={downloadStudentTemplate}
                    sx={{ mr: 2 }}
                  >
                    Download Template
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<UploadIcon />}
                    component="label"
                  >
                    Upload CSV
                    <input
                      type="file"
                      hidden
                      accept=".csv"
                      onChange={(e) => {
                        // Handle CSV upload here
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const csvData = event.target.result;
                            const rows = csvData.split('\n');
                            const newStudents = [];
                            
                            for (let i = 1; i < rows.length; i++) {
                              if (rows[i].trim()) {
                                const [name, rollNum, password, sclassName] = rows[i].split(',');
                                newStudents.push({ name, rollNum, password, sclassName });
                              }
                            }
                            
                            if (newStudents.length > 0) {
                              setStudents(newStudents);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </Button>
                </Box>
                
                <form onSubmit={handleStudentSubmit}>
                  {students.map((student, index) => (
                    <StudentCard key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={student.name}
                            onChange={handleStudentChange(index, 'name')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Roll Number"
                            variant="outlined"
                            value={student.rollNum}
                            onChange={handleStudentChange(index, 'rollNum')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={student.password}
                            onChange={handleStudentChange(index, 'password')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Class ID"
                            variant="outlined"
                            value={student.sclassName}
                            onChange={handleStudentChange(index, 'sclassName')}
                            required
                            helperText="Enter the class ID from the classes list"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="flex-end">
                            {index === 0 ? (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={addStudent}
                                startIcon={<AddIcon />}
                              >
                                Add Another Student
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={removeStudent(index)}
                                startIcon={<DeleteIcon />}
                              >
                                Remove
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </StudentCard>
                  ))}
                  
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <SubmitButton 
                      type="submit" 
                      variant="contained"
                      disabled={loader}
                    >
                      {loader ? <CircularProgress size={24} color="inherit" /> : 'Add Students'}
                    </SubmitButton>
                  </Box>
                </form>
              </StudentForm>
            )}
            
            {activeTab === 2 && (
              <SubjectForm>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Add Subjects</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />}
                    onClick={downloadSubjectTemplate}
                    sx={{ mr: 2 }}
                  >
                    Download Template
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<UploadIcon />}
                    component="label"
                  >
                    Upload CSV
                    <input
                      type="file"
                      hidden
                      accept=".csv"
                      onChange={(e) => {
                        // Handle CSV upload here
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const csvData = event.target.result;
                            const rows = csvData.split('\n');
                            const newSubjects = [];
                            
                            for (let i = 1; i < rows.length; i++) {
                              if (rows[i].trim()) {
                                const [subName, subCode, sessions] = rows[i].split(',');
                                newSubjects.push({ subName, subCode, sessions });
                              }
                            }
                            
                            if (newSubjects.length > 0) {
                              setSubjects(newSubjects);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </Button>
                </Box>
                
                <form onSubmit={handleSubjectSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      select
                      fullWidth
                      label="Select Class"
                      variant="outlined"
                      value={selectedClass}
                      onChange={handleClassChange}
                      required
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select a class</option>
                      {sclassesList && sclassesList.map((classItem) => (
                        <option key={classItem._id} value={classItem._id}>
                          {classItem.sclassName}
                        </option>
                      ))}
                    </TextField>
                  </Box>
                  
                  {subjects.map((subject, index) => (
                    <SubjectCard key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Subject Name"
                            variant="outlined"
                            value={subject.subName}
                            onChange={handleSubjectChange(index, 'subName')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Subject Code"
                            variant="outlined"
                            value={subject.subCode}
                            onChange={handleSubjectChange(index, 'subCode')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Sessions"
                            variant="outlined"
                            type="number"
                            value={subject.sessions}
                            onChange={handleSubjectChange(index, 'sessions')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="flex-end">
                            {index === 0 ? (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={addSubject}
                                startIcon={<AddIcon />}
                              >
                                Add Another Subject
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={removeSubject(index)}
                                startIcon={<DeleteIcon />}
                              >
                                Remove
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </SubjectCard>
                  ))}
                  
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <SubmitButton 
                      type="submit" 
                      variant="contained"
                      disabled={loader}
                    >
                      {loader ? <CircularProgress size={24} color="inherit" /> : 'Add Subjects'}
                    </SubmitButton>
                  </Box>
                </form>
              </SubjectForm>
            )}
            
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
          </StyledPaper>
        </Fade>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default BulkAdd;

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
  max-width: 1000px;
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

const TeacherForm = styled.div`
  text-align: left;
`;

const StudentForm = styled.div`
  text-align: left;
`;

const SubjectForm = styled.div`
  text-align: left;
`;

const TeacherCard = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StudentCard = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SubjectCard = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SubmitButton = styled(Button)`
  background-color: #00E5FF !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 14px 0 rgba(0, 229, 255, 0.39) !important;
  
  &:hover {
    background-color: #00B8D4 !important;
    box-shadow: 0 6px 20px 0 rgba(0, 229, 255, 0.5) !important;
  }
`; 