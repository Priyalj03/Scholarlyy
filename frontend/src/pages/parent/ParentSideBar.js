import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    StyledListItemButton, 
    StyledListItemIcon, 
    StyledListItemText, 
    StyledDivider
} from '../../components/styles';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ParentSideBar = () => {
    const location = useLocation();
    
    // Helper function to check if a path is active
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/Parent/dashboard";
        }
        return location.pathname.startsWith(path);
    };
    
    return (
        <>
            <React.Fragment>
                <StyledListItemButton 
                    component={Link} 
                    to="/"
                    selected={isActive("/")}
                >
                    <StyledListItemIcon>
                        <HomeIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Home" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Parent/subjects"
                    selected={isActive("/Parent/subjects")}
                >
                    <StyledListItemIcon>
                        <AssignmentIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Subjects" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Parent/attendance"
                    selected={isActive("/Parent/attendance")}
                >
                    <StyledListItemIcon>
                        <ClassOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Attendance" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Parent/complain"
                    selected={isActive("/Parent/complain")}
                >
                    <StyledListItemIcon>
                        <AnnouncementOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Complaints" />
                </StyledListItemButton>
            </React.Fragment>
            
            <StyledDivider />
            
            <React.Fragment>
                <StyledListItemButton 
                    component={Link} 
                    to="/Parent/profile"
                    selected={isActive("/Parent/profile")}
                >
                    <StyledListItemIcon>
                        <AccountCircleOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Profile" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/logout"
                    selected={isActive("/logout")}
                >
                    <StyledListItemIcon>
                        <ExitToAppIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Logout" />
                </StyledListItemButton>
            </React.Fragment>
        </>
    )
}

export default ParentSideBar 