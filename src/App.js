import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './login';
import ServiceDashboard from './service';


export default function App() {
  return (
    <div>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/service">Service Dashboard</Link>
              </li>
            </ul>
          </nav>

          <hr />

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/service">
              <ServiceDashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}