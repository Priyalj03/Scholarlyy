import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    StyledListItemButton, 
    StyledListItemIcon, 
    StyledListItemText, 
    StyledDivider
} from '../../components/styles';

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const SideBar = () => {
    const location = useLocation();
    
    // Helper function to check if a path is active
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/Admin/dashboard";
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
                    to="/Admin/classes"
                    selected={isActive("/Admin/classes")}
                >
                    <StyledListItemIcon>
                        <ClassOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Classes" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/subjects"
                    selected={isActive("/Admin/subjects")}
                >
                    <StyledListItemIcon>
                        <AssignmentIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Subjects" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/teachers"
                    selected={isActive("/Admin/teachers")}
                >
                    <StyledListItemIcon>
                        <SupervisorAccountOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Teachers" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/students"
                    selected={isActive("/Admin/students")}
                >
                    <StyledListItemIcon>
                        <PersonOutlineIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Students" />
                </StyledListItemButton>

                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/parents"
                    selected={isActive("/Admin/parents")}
                >
                    <StyledListItemIcon>
                        <FamilyRestroomIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Parents" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/notices"
                    selected={isActive("/Admin/notices")}
                >
                    <StyledListItemIcon>
                        <AnnouncementOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Notices" />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/complains"
                    selected={isActive("/Admin/complains")}
                >
                    <StyledListItemIcon>
                        <ReportIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Complains" />
                </StyledListItemButton>
            </React.Fragment>
            
            <StyledDivider />
            
            <React.Fragment>
                <StyledListItemButton 
                    component={Link} 
                    to="/Admin/profile"
                    selected={isActive("/Admin/profile")}
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

export default SideBar
