import { Box, Button, Container, Grid } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Students from "../assets/1BI.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <ImageContainer>
                        <StyledImage src={Students} alt="students" />
                    </ImageContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <StyledTitle>
                            <span style={{ fontSize: "28px", color: "var(--color-primary)", fontWeight: "500" }}>Welcome to</span>
                            <br />
                            <span style={{ 
                                fontSize: "80px", 
                                fontWeight: "700",
                                background: "linear-gradient(45deg, var(--color-primary), var(--color-secondary))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "block",
                                margin: "10px 0"
                            }}>Scholarly</span>
                            <br />
                            <span style={{ fontSize: "24px", color: "var(--color-text-secondary)" }}>A School Management System</span>
                        </StyledTitle>
                        <StyledText>
                            Your all-in-one school management system designed to simplify and streamline daily operations. From student enrollment to attendance tracking, grade management, and communication, Scholarly empowers educators, administrators, and parents with seamless, efficient, and intuitive tools.
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="/choose">
                                <LightPurpleButton variant="contained" fullWidth>
                                    Login
                                </LightPurpleButton>
                            </StyledLink>
                            {/* <StyledLink to="/chooseasguest">
                                <Button variant="outlined" fullWidth
                                    sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                                >
                                    Login as Guest
                                </Button>
                            </StyledLink> */}
                            <StyledText>
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "none" }}>
                                    Sign up
                                </Link>
                            </StyledText>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-bg);
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, var(--color-primary-variant) 0%, transparent 70%);
    opacity: 0.1;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 0 20px var(--color-primary-variant));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const StyledPaper = styled.div`
  padding: 40px;
  height: 100vh;
  background-color: var(--color-surface);
  box-shadow: 0 8px 32px var(--shadow-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: var(--color-text);
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
  text-align: center;
`;

const StyledText = styled.p`
  color: var(--color-text-secondary);
  margin: 24px 0;
  letter-spacing: 0.3px;
  line-height: 1.6;
  font-size: 16px;
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
