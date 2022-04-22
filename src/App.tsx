import { Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import './App.scss';
import MaterialForm from './mui-form/MuiForm';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth='lg'
        sx={{
          padding: {
            xs: 2,
            md: 6
          }
        }}
      >
        <MaterialForm />
      </Container>
    </LocalizationProvider>
  );
};

export default App;
