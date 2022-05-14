import { createTheme } from '@mui/material';

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3F51B5',
      dark: '#2C387E',
      light: '#6573C3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F50057',
      dark: '#F73378',
      light: '#AB003C',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#ffffff',
      default: '#fafafa',
    }
  }
});
