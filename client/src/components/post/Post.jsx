import React from 'react'
import "./Post.scss"
import Avatar from "../avatar/Avatar"
import backgroundImg from "../../assets/background.jpg"
import {AiOutlineHeart} from "react-icons/ai"

function Post({post}) {
  return (
    <div className="post">
      <div className="heading">
        <Avatar/>
        <h4>Rishabh Rai</h4>
      </div>
      <div className="content">
        <img src={backgroundImg} alt="" />
      </div>
      <div className="footer">
         <div className="like">
            <AiOutlineHeart className="icon"/>
            <h4>4 likes</h4>
         </div>
         <p className="caption">This is nature Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae, eligendi?</p>
         <h6 className="time-ago">4 hrs ago</h6>
      </div>
    </div>
  )
}

export default Post
