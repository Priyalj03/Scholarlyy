import React, { useState } from 'react';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    School as SchoolIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Class as ClassIcon,
    Subject as SubjectIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';
import { 
    Button, 
    Collapse, 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    IconButton, 
    Divider,
    ThemeProvider, 
    createTheme,
    Fade,
    Alert,
    Snackbar
} from '@mui/material';
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

const TeacherProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');

    const fields = password === '' ? { name, email } : { name, email, password };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(currentUser?.name || '');
        setEmail(currentUser?.email || '');
        setPassword('');
    };

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, currentUser._id, "Teacher"));
        setIsEditing(false);
        setSnackbar({
            open: true,
            message: 'Profile updated successfully!',
            severity: 'success'
        });
    };

    const deleteHandler = () => {
        try {
            dispatch(deleteUser(currentUser._id, "Teacher"));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: 'Error deleting account. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                                Teacher Profile
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Manage your account information
                            </Typography>
                        </Box>
                        
                        <ProfileSection>
                            <ProfileHeader>
                                <ProfileAvatar>
                                    {currentUser?.name?.charAt(0).toUpperCase() || 'T'}
                                </ProfileAvatar>
                                <ProfileInfo>
                                    <ProfileName>{currentUser?.name || 'Teacher'}</ProfileName>
                                    <ProfileRole>Teacher</ProfileRole>
                                </ProfileInfo>
                                <ActionButtons>
                                    {!isEditing ? (
                                        <IconButton 
                                            color="primary" 
                                            onClick={handleEdit}
                                            sx={{ 
                                                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                                '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.2)' }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton 
                                            color="error" 
                                            onClick={handleCancel}
                                            sx={{ 
                                                backgroundColor: 'rgba(255, 61, 0, 0.1)',
                                                '&:hover': { backgroundColor: 'rgba(255, 61, 0, 0.2)' }
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    )}
                                </ActionButtons>
                            </ProfileHeader>
                            
                            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            
                            {!isEditing ? (
                                <ProfileDetails>
                                    <DetailItem>
                                        <PersonIcon sx={{ color: '#00E5FF', mr: 2 }} />
                                        <DetailContent>
                                            <DetailLabel>Name</DetailLabel>
                                            <DetailValue>{currentUser?.name || 'Not set'}</DetailValue>
                                        </DetailContent>
                                    </DetailItem>
                                    
                                    <DetailItem>
                                        <EmailIcon sx={{ color: '#00E5FF', mr: 2 }} />
                                        <DetailContent>
                                            <DetailLabel>Email</DetailLabel>
                                            <DetailValue>{currentUser?.email || 'Not set'}</DetailValue>
                                        </DetailContent>
                                    </DetailItem>
                                    
                                    <DetailItem>
                                        <ClassIcon sx={{ color: '#00E5FF', mr: 2 }} />
                                        <DetailContent>
                                            <DetailLabel>Class</DetailLabel>
                                            <DetailValue>{currentUser?.teachSclass?.sclassName || 'Not assigned'}</DetailValue>
                                        </DetailContent>
                                    </DetailItem>

                                    <DetailItem>
                                        <SubjectIcon sx={{ color: '#00E5FF', mr: 2 }} />
                                        <DetailContent>
                                            <DetailLabel>Subject</DetailLabel>
                                            <DetailValue>{currentUser?.teachSubject?.subName || 'Not assigned'}</DetailValue>
                                        </DetailContent>
                                    </DetailItem>

                                    <DetailItem>
                                        <SchoolIcon sx={{ color: '#00E5FF', mr: 2 }} />
                                        <DetailContent>
                                            <DetailLabel>School</DetailLabel>
                                            <DetailValue>{currentUser?.school?.schoolName || 'Not set'}</DetailValue>
                                        </DetailContent>
                                    </DetailItem>
                                </ProfileDetails>
                            ) : (
                                <EditForm onSubmit={submitHandler}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        margin="normal"
                                        required
                                        InputProps={{
                                            startAdornment: <PersonIcon sx={{ color: '#00E5FF', mr: 1 }} />,
                                        }}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        margin="normal"
                                        required
                                        type="email"
                                        InputProps={{
                                            startAdornment: <EmailIcon sx={{ color: '#00E5FF', mr: 1 }} />,
                                        }}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="New Password (leave blank to keep current)"
                                        variant="outlined"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        margin="normal"
                                        type="password"
                                    />
                                    
                                    <ButtonContainer>
                                        <SaveButton 
                                            type="submit" 
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                        >
                                            Save Changes
                                        </SaveButton>
                                    </ButtonContainer>
                                </EditForm>
                            )}
                            
                            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            
                            <DangerZone>
                                <Typography variant="h6" sx={{ color: '#FF3D00', mb: 2 }}>
                                    Danger Zone
                                </Typography>
                                <DeleteButton 
                                    variant="outlined" 
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Delete Account
                                </DeleteButton>
                            </DangerZone>
                        </ProfileSection>
                    </StyledPaper>
                </Fade>
                
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
                
                {showDeleteConfirm && (
                    <DeleteConfirmDialog>
                        <DeleteConfirmPaper>
                            <Typography variant="h6" sx={{ mb: 2, color: '#FF3D00' }}>
                                Delete Account
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Are you sure you want to delete your account? This action cannot be undone.
                            </Typography>
                            <ButtonContainer>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    sx={{ mr: 2 }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    onClick={deleteHandler}
                                >
                                    Delete
                                </Button>
                            </ButtonContainer>
                        </DeleteConfirmPaper>
                    </DeleteConfirmDialog>
                )}
            </StyledContainer>
        </ThemeProvider>
    );
};

export default TeacherProfile;

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
  max-width: 800px;
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

const ProfileSection = styled.div`
  text-align: left;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00E5FF, #FF3D00);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-right: 1.5rem;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const ProfileRole = styled.p`
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.7);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const DetailValue = styled.p`
  margin: 0;
  font-size: 1rem;
  color: white;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SaveButton = styled(Button)`
  background-color: #00E5FF !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 14px 0 rgba(0, 229, 255, 0.39) !important;
  
  &:hover {
    background-color: #00B8D4 !important;
    box-shadow: 0 6px 20px 0 rgba(0, 229, 255, 0.5) !important;
  }
`;

const DangerZone = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: rgba(255, 61, 0, 0.05);
  border: 1px solid rgba(255, 61, 0, 0.2);
`;

const DeleteButton = styled(Button)`
  border-color: #FF3D00 !important;
  color: #FF3D00 !important;
  font-weight: 600 !important;
  
  &:hover {
    background-color: rgba(255, 61, 0, 0.1) !important;
    border-color: #FF3D00 !important;
  }
`;

const DeleteConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DeleteConfirmPaper = styled(Paper)`
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  background-color: rgba(18, 18, 18, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 61, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 61, 0, 0.3);
`;