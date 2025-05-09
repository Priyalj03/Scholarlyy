import {
    TableCell,
    TableRow,
    styled,
    tableCellClasses,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Divider,
    Paper,
    Container,
    Grid,
    Typography,
    Button,
} from "@mui/material";

const drawerWidth = 240;

// Modern Dark Theme Table Styles
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-primary)',
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: '2px solid var(--color-border)',
        padding: '12px 16px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: 'var(--color-text)',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 16px',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'var(--color-surface)',
    },
    '&:nth-of-type(even)': {
        backgroundColor: 'var(--color-surface-variant)',
    },
    '&:hover': {
        backgroundColor: 'var(--color-bg-variant)',
        transition: 'background-color 0.2s ease',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// Modern Dark Theme App Bar
export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    boxShadow: '0 2px 8px var(--shadow-color)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Modern Dark Theme Sidebar Drawer
export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            borderRight: '1px solid var(--color-border)',
            boxShadow: '2px 0 8px var(--shadow-color)',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

// Styled Sidebar Components
export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    margin: '4px 8px',
    borderRadius: '8px',
    color: 'var(--color-text-secondary)',
    transition: 'all 0.2s ease',
    
    '&:hover': {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-primary)',
    },
    
    '&.Mui-selected': {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-bg)',
        boxShadow: '0 2px 8px var(--shadow-color)',
        
        '&:hover': {
            backgroundColor: 'var(--color-primary-variant)',
        },
        
        '& .MuiListItemIcon-root': {
            color: 'var(--color-bg)',
        },
    },
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: 'var(--color-text-secondary)',
    minWidth: '40px',
    transition: 'color 0.2s ease',
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontWeight: 500,
        fontSize: '0.9rem',
    },
}));

export const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    fontWeight: 600,
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    padding: '16px 16px 8px',
    marginTop: '8px',
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: 'var(--color-border)',
    margin: '8px 16px',
    opacity: 0.5,
}));

// Dashboard Card Components
export const DashboardCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '200px',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 15px rgba(var(--color-primary-rgb), 0.1)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    position: 'relative',
    
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    
    '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(var(--color-primary-rgb), 0.1), transparent 70%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
    },
    
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12), 0 0 20px rgba(var(--color-primary-rgb), 0.2)',
        
        '&:before': {
            opacity: 1,
        },
        
        '&:after': {
            opacity: 1,
        },
        
        '& .card-icon': {
            transform: 'scale(1.1)',
        },
    },
}));

export const CardIcon = styled('div')(({ theme }) => ({
    width: '70px',
    height: '70px',
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.15), rgba(var(--color-primary-rgb), 0.05))',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    className: 'card-icon',
    boxShadow: '0 0 15px rgba(var(--color-primary-rgb), 0.1)',
    '& img': {
        width: '60%',
        height: '60%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    },
    '& svg': {
        width: '40px',
        height: '40px',
        color: 'var(--color-primary)',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    },
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: theme.spacing(1),
    letterSpacing: '0.5px',
}));

export const CardValue = styled(Typography)(({ theme }) => ({
    fontSize: '2.2rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    marginTop: theme.spacing(1),
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const DashboardContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

export const DashboardGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export const DashboardSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow-color)',
    border: '1px solid var(--color-border)',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid var(--color-border)',
}));

// Button Components
export const BlueButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-bg)',
    '&:hover': {
        backgroundColor: 'var(--color-primary-variant)',
    },
    textTransform: 'none',
    fontWeight: 500,
    padding: '6px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const GreenButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-bg)',
    '&:hover': {
        backgroundColor: 'var(--color-success-variant)',
    },
    textTransform: 'none',
    fontWeight: 500,
    padding: '6px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));
