import {useEffect,useRef} from "react"
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import RequireUser from "./components/RequireUser";
import OnlyifNotLoggedIn from "./components/OnlyifNotLoggedIn";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import Notfound from "./pages/notfound/Notfound"
import LoadingBar from 'react-top-loading-bar'
import {useSelector} from "react-redux"

function App() {
  const isLoading = useSelector(state => state.appConfigReducer.isLoading)
  const loadingRef = useRef(null);
  useEffect(()=>{
    if (isLoading) {
      loadingRef.current?.continuousStart();
    }else{
      loadingRef.current?.complete();
    }
  },[isLoading])

  return (
    
    <div className="App">
    <LoadingBar color='linear-gradient(to right, #ff9933 0%, #ff0000 78%)' height="5px" ref={loadingRef} />
      <Routes> 
        <Route element={<RequireUser />}>
          <Route element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
          </Route>
        </Route>
        <Route element={<OnlyifNotLoggedIn/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
