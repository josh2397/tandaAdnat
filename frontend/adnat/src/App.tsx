import React from 'react';
import Login from './features/login';
import Signup from './features/signup';
import PageLayout from './layout/pageLayout';
import TitleBar from './titleBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <TitleBar/>
      <Switch>
        <Route component={Login} path="/login"/>
        <Route component={Signup} path="/signup"/>
        <Route/>
        <Route/>

      </Switch>

    </Router>
  );
}

export default App;
