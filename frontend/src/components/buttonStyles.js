import styled from 'styled-components';
import { Button } from '@mui/material';

const buttonBaseStyles = `
  && {
    text-transform: none;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px var(--shadow-color);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px var(--shadow-color);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

// New Theme Buttons
export const PrimaryButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: var(--color-primary);
    color: var(--color-bg);
    
    &:hover {
      background-color: var(--color-primary-variant);
    }
  }
`;

export const SecondaryButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: var(--color-secondary);
    color: var(--color-bg);
    
    &:hover {
      background-color: var(--color-secondary-variant);
    }
  }
`;

export const SurfaceButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    
    &:hover {
      background-color: var(--color-surface-variant);
      border-color: var(--color-primary);
    }
  }
`;

export const DangerButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
`;

export const SuccessButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #28a745;
    color: white;
    
    &:hover {
      background-color: #218838;
    }
  }
`;

export const WarningButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #ffc107;
    color: var(--color-bg);
    
    &:hover {
      background-color: #e0a800;
    }
  }
`;

export const InfoButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #17a2b8;
    color: white;
    
    &:hover {
      background-color: #138496;
    }
  }
`;

// Legacy Buttons (for backward compatibility)
export const RedButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
`;

export const BlackButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    
    &:hover {
      background-color: var(--color-surface-variant);
      border-color: var(--color-primary);
    }
  }
`;

export const DarkRedButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #8b0000;
    color: white;
    
    &:hover {
      background-color: #a52a2a;
    }
  }
`;

export const BlueButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: var(--color-primary);
    color: var(--color-bg);
    
    &:hover {
      background-color: var(--color-primary-variant);
    }
  }
`;

export const PurpleButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #6f42c1;
    color: white;
    
    &:hover {
      background-color: #5a32a3;
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #9c27b0;
    color: white;
    
    &:hover {
      background-color: #7b1fa2;
    }
  }
`;

export const GreenButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #28a745;
    color: white;
    
    &:hover {
      background-color: #218838;
    }
  }
`;

export const BrownButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #795548;
    color: white;
    
    &:hover {
      background-color: #5d4037;
    }
  }
`;

export const IndigoButton = styled(Button)`
  ${buttonBaseStyles}
  && {
    background-color: #3f51b5;
    color: white;
    
    &:hover {
      background-color: #303f9f;
    }
  }
`;
