import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import ChatPage from './components/ChatPage/ChatPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'

function App() {
  return <Router>
  

    {/*
      A <Switch> looks through all its children <Route>
      elements and renders the first one whose path
      matches the current URL. Use a <Switch> any time
      you have multiple routes, but you want only one
      of them to render at a time
    */}
    <Switch>
      <Route exact path="/" component={ChatPage}/>
      <Route exact path="/Login" component={LoginPage}/>
      <Route exact path="/Register" component={RegisterPage}/>
    </Switch>
</Router>
}

export default App;
