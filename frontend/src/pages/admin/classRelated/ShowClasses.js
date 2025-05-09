import { useEffect, useState } from 'react';
import { 
    IconButton, 
    Box, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    Tooltip, 
    Typography, 
    Container, 
    Fade, 
    CircularProgress, 
    Card, 
    CardContent, 
    Grid, 
    Paper,
    ThemeProvider,
    createTheme
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
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
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
    },
});

const ShowClasses = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    if (error) {
        console.log(error)
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllSclasses(adminID, "Sclass"));
            })
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ]

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    })

    const SclassButtonHaver = ({ row }) => {
        const actions = [
            { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
            { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
        ];
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Delete Class">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Sclass")}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: 'rgba(255, 61, 0, 0.1)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <DeleteIcon sx={{ color: '#FF3D00' }} />
                    </IconButton>
                </Tooltip>
                <BlueButton 
                    variant="contained"
                    onClick={() => navigate("/Admin/classes/class/" + row.id)}
                >
                    View
                </BlueButton>
                <ActionMenu actions={actions} />
            </Box>
        );
    };

    const ActionMenu = ({ actions }) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title="Add Students & Subjects">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{
                                ml: 2,
                                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 229, 255, 0.2)',
                                },
                            }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Typography sx={{ mr: 1, color: '#00E5FF' }}>Add</Typography>
                            <SpeedDialIcon sx={{ color: '#00E5FF' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 4,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            backgroundColor: 'rgba(18, 18, 18, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '& .MuiMenuItem-root': {
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                },
                            },
                            '& .MuiListItemIcon-root': {
                                color: '#00E5FF',
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'rgba(18, 18, 18, 0.95)',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {actions.map((action, index) => (
                        <MenuItem key={index} onClick={action.action}>
                            <ListItemIcon>
                                {action.icon}
                            </ListItemIcon>
                            {action.name}
                        </MenuItem>
                    ))}
                </Menu>
            </>
        );
    }

    const actions = [
        {
            icon: <AddCardIcon sx={{ color: '#00E5FF' }} />, 
            name: 'Add New Class',
            action: () => navigate("/Admin/addclass")
        },
        {
            icon: <DeleteIcon sx={{ color: '#FF3D00' }} />, 
            name: 'Delete All Classes',
            action: () => deleteHandler(adminID, "Sclasses")
        },
    ];

    // Calculate statistics
    const totalClasses = sclassesList ? sclassesList.length : 0;
    const totalStudents = sclassesList ? sclassesList.reduce((sum, sclass) => sum + (sclass.students?.length || 0), 0) : 0;
    const totalSubjects = sclassesList ? sclassesList.reduce((sum, sclass) => sum + (sclass.subjects?.length || 0), 0) : 0;

    const StatCard = ({ icon, title, value, color, onClick }) => (
        <StyledCard onClick={onClick}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconWrapper>
                        {icon}
                    </IconWrapper>
                    <Typography variant="h6" sx={{ color: 'white', ml: 2, fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 700 }}>
                    {value}
                </Typography>
            </CardContent>
        </StyledCard>
    );

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
        <Fade in={true} timeout={500}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                                <CircularProgress sx={{ color: '#00E5FF' }} />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
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
                                Class Management
                            </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Manage all classes in your school
                            </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={4}>
                                <StatCard
                                            icon={<SchoolIcon sx={{ color: '#00E5FF' }} />}
                                    title="Total Classes"
                                    value={totalClasses}
                                    onClick={() => navigate("/Admin/addclass")}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatCard
                                            icon={<GroupIcon sx={{ color: '#00E5FF' }} />}
                                    title="Total Students"
                                    value={totalStudents}
                                    onClick={() => navigate("/Admin/students")}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatCard
                                            icon={<MenuBookIcon sx={{ color: '#00E5FF' }} />}
                                    title="Total Subjects"
                                    value={totalSubjects}
                                    onClick={() => navigate("/Admin/subjects")}
                                />
                            </Grid>
                        </Grid>

                        {getresponse ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <GreenButton 
                                    variant="contained"
                                    onClick={() => navigate("/Admin/addclass")}
                                    startIcon={<AddCardIcon />}
                                    sx={{ py: 1.5, px: 3 }}
                                >
                                    Add Class
                                </GreenButton>
                            </Box>
                        ) : (
                                    <StyledPaper>
                                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                                            Classes List
                                        </Typography>
                                        <SpeedDialTemplate actions={actions} />
                                    </Box>
                                </Box>
                                {Array.isArray(sclassesList) && sclassesList.length > 0 ? (
                                    <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                            No classes found
                                        </Typography>
                                        <GreenButton 
                                            variant="contained"
                                            onClick={() => navigate("/Admin/addclass")}
                                            startIcon={<AddCardIcon />}
                                        >
                                            Add Your First Class
                                        </GreenButton>
                                    </Box>
                                )}
                                    </StyledPaper>
                        )}
                    </>
                )}
                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </Container>
        </Fade>
            </StyledContainer>
        </ThemeProvider>
    );
};

const StyledContainer = styled.div`
  min-height: 100vh;
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

const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  }
`;

const StyledPaper = styled(Paper)`
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 229, 255, 0.1);
  color: #00E5FF;
  transition: all 0.3s ease-in-out;

  svg {
    font-size: 24px;
  }

  ${StyledCard}:hover & {
    background: rgba(0, 229, 255, 0.2);
    transform: scale(1.1);
  }
`;

export default ShowClasses;