import React, { useState, useEffect } from 'react';
import Login from './features/auth/login';
import Signup from './features/auth/signup';
import OrganisationsIndex from './features/organisations/organisationsIndex';
import TitleBar from './components/titleBar';
import { ThemeProvider } from '@material-ui/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { AuthProvider } from './components/authContext';
import { IUserDetails } from './models/users';
import PrivateRoute from './helpers/privateRoute';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import ChangePassword from './features/auth/changePassword';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: { main: '#15c3e6' },
    secondary: { main: '#3cc26b'}
  }
})



const App: React.FC = () => {
  
  const [authenticated, setAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({} as IUserDetails);

  const updateAuthentication = (authenticationValue: boolean) => setAuthenticated(authenticationValue);
  const updateUserDetails = (updatedUserDetails: IUserDetails) => setUserDetails(updatedUserDetails);

  useEffect(() => {
    console.log("updated authenticated in app", authenticated);
  }, [authenticated])

  const api = {updateAuthentication, authenticated, updateUserDetails, userDetails}

  return (
    <AuthProvider value={api}>
      
      <ThemeProvider theme={theme}>
        <Router>
          <TitleBar/>
          <Switch>
            <Route exact={true} component={Login} path="/login"/>
            <Route exact={true} component={Signup} path="/signup"/>
            <Route exact={true} component={ChangePassword} path="/changepassword"/>
            <PrivateRoute authenticated={authenticated} component={OrganisationsIndex} path="/organisation"/>
            <Route render={() => <Redirect to={{pathname: "/login"}} />} />
          </Switch>

        </Router>
      
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
