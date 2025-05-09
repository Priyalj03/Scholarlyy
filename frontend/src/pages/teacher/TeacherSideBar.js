import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

const TeacherSideBar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass;
    const location = useLocation();
    
    // Helper function to check if a path is active
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/Teacher/dashboard";
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
                    to="/Teacher/class"
                    selected={isActive("/Teacher/class")}
                >
                    <StyledListItemIcon>
                        <ClassOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary={`Class ${sclassName.sclassName}`} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Teacher/complain"
                    selected={isActive("/Teacher/complain")}
                >
                    <StyledListItemIcon>
                        <AnnouncementOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Complain" />
                </StyledListItemButton>
            </React.Fragment>
            
            <StyledDivider />
            
            <React.Fragment>
                <StyledListItemButton 
                    component={Link} 
                    to="/Teacher/profile"
                    selected={isActive("/Teacher/profile")}
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

export default TeacherSideBar