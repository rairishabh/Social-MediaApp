import React from 'react'
import "./avatar.scss"
import userImage from "../../assets/man.png"

function Avatar({src}) {
  return (
    <div>
      <div className="Avatar">
        <img src={src ? src : userImage} alt="" />
      </div>
    </div>
  )
}

export default Avatar
