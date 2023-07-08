import "./Navbar.scss"
import Avatar from "../avatar/Avatar.jsx"
import { useNavigate } from "react-router";
import { AiOutlineLogout } from "react-icons/ai";
import {useDispatch, useSelector} from 'react-redux';
import { setLoading } from "../../redux/slices/appConfigSlice";

function Navbar() {

  const navigate = useNavigate();
  const myProfile = useSelector(state => state.appConfigReducer.myProfile)

  function handleLogoutClicked(){

  }

  return (
    <div className="Navbar">  
      <div className="container">
        <h2 className="banner hover-link" onClick={()=>navigate('/')}>Social Media</h2>
        <div className="right-side">
          <div className="profile hover-link"  onClick={()=>navigate(`/profile/${myProfile?._id}`)}>
            <Avatar src={myProfile?.avatar?.url}/>
          </div>
          <div className="logout hover-link" onClick={handleLogoutClicked}>
             <AiOutlineLogout/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
