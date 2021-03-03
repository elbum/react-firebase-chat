import React,{useEffect} from 'react';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import ChatPage from './components/ChatPage/ChatPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'
import firebase from './firebase';

import  {useDispatch , useSelector} from 'react-redux'
import {setUser , clearUser} from './redux/actions/user_action'
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user',user)
      // 로그인 상태
      if(user){
        history.push("/")

        //user 를 redux 에 넣자.
        dispatch(setUser(user))

      } else {
        console.log('pushing head')
        history.push("/Login")
        dispatch(clearUser())
        console.log('pushing foot')

      }
    })
  },[])
  
  if(isLoading) {
    return (
      <div>
        ...Loading...
      </div>
    )


  } else {
  return (
    <Switch>
      <Route exact path="/" component={ChatPage}/>
      <Route exact path="/Login" component={LoginPage}/>
      <Route exact path="/Register" component={RegisterPage}/>
    </Switch>
    );
}
}

export default App;
