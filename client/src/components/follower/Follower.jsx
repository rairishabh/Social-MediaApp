import React from 'react'
import "./follower.scss"
import Avatar from "../avatar/Avatar"

function Follower() {
  return (
    <div className="Follower">
        <div className="user-info">
        <Avatar/>
        <h4 className="namr">Robin Parker</h4>
        </div>
        <h5 className="hover-link follow-link">follow</h5>
    </div>
  )
}

export default Follower
