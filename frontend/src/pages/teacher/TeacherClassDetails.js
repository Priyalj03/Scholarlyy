import { useEffect } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
    Paper, 
    Box, 
    Typography, 
    ButtonGroup, 
    Button, 
    Popper, 
    Grow, 
    ClickAwayListener, 
    MenuList, 
    MenuItem,
    ThemeProvider,
    createTheme,
    Fade,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    MenuBook as MenuBookIcon
} from "@mui/icons-material";
import styled from 'styled-components';
import TableTemplate from "../../components/TableTemplate";

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

const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
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
        const options = ['Take Attendance', 'Provide Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            console.info(`You clicked ${options[selectedIndex]}`);
            if (selectedIndex === 0) {
                handleAttendance();
            } else if (selectedIndex === 1) {
                handleMarks();
            }
        };

        const handleAttendance = () => {
            navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
        }
        const handleMarks = () => {
            navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }

            setOpen(false);
        };
        return (
            <ButtonContainer>
                <ViewButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Teacher/class/student/" + row.id)
                    }
                    startIcon={<PersonIcon />}
                >
                    View
                </ViewButton>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                    <ActionButton onClick={handleClick}>
                        {options[selectedIndex]}
                    </ActionButton>
                    <IconButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        sx={{
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.2)' }
                        }}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                            <StyledMenuPaper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'rgba(0, 229, 255, 0.2)',
                                                    },
                                                }}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                            </StyledMenuPaper>
                            </Grow>
                        )}
                    </Popper>
            </ButtonContainer>
        );
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
                        Class Details
                    </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Manage your class and students
                            </Typography>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                                <CircularProgress sx={{ color: '#00E5FF' }} />
                            </Box>
                        ) : getresponse ? (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                minHeight: '200px',
                                backgroundColor: 'rgba(255, 61, 0, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 61, 0, 0.2)',
                                p: 3
                            }}>
                                <Typography variant="h6" sx={{ color: '#FF3D00' }}>
                                No Students Found
                                </Typography>
                            </Box>
                    ) : (
                            <Box>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 3,
                                        fontWeight: 600,
                                        color: 'white'
                                    }}
                                >
                                    Students List
                            </Typography>

                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 &&
                                    <StyledTablePaper>
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                                    </StyledTablePaper>
                                }
                            </Box>
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

const StyledTablePaper = styled(Paper)`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(18, 18, 18, 0.5);
`;

const StyledMenuPaper = styled(Paper)`
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ViewButton = styled(Button)`
  background-color: #00E5FF !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 14px 0 rgba(0, 229, 255, 0.39) !important;
  
  &:hover {
    background-color: #00B8D4 !important;
    box-shadow: 0 6px 20px 0 rgba(0, 229, 255, 0.5) !important;
  }
`;

const ActionButton = styled(Button)`
  background-color: rgba(0, 229, 255, 0.1) !important;
  color: #00E5FF !important;
  font-weight: 600 !important;
  
  &:hover {
    background-color: rgba(0, 229, 255, 0.2) !important;
  }
`;

export default TeacherClassDetails;