import React from 'react';
import Login from './features/login';
import Signup from './features/signup';
import PageLayout from './layout/pageLayout';
import TitleBar from './components/titleBar';
import { ThemeProvider } from '@material-ui/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: { main: '#15c3e6' },
    secondary: { main: '#3cc26b'}
  }
})

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <TitleBar/>
        <Switch>
          <Route exact={true} component={Login} path="/"/>
          <Route component={Login} path="/login"/>
          <Route component={Signup} path="/signup"/>
          <Route/>

        </Switch>

      </Router>
    
    </ThemeProvider>
  );
}

export default App;
