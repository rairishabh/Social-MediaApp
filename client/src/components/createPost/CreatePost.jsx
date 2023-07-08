import React, { useState } from "react";
import "./CreatePost.scss";
import Avatar from "../avatar/Avatar";
import backgroundDummyImg from "../../assets/background.jpg";
import { BsCardImage } from "react-icons/bs";
import {axiosClient} from "../../utils/axiosClient";
import {useDispatch} from "react-redux"
import {setLoading} from "../../redux/slices/appConfigSlice"

function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
        console.log("fileReader.result", fileReader.result);
      }
    };
  };

  const handlePostSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const result = await axiosClient.post("/post", {
        caption,
        postImg,
      });
      console.log("post done",result)
    } catch (error) {
      console.log("error form handlepost",error);
    }finally{
        dispatch(setLoading(false))
        setCaption('');
        setPostImg('');
    }
  };

  return (
    <div className="CreatePost">
      <div className="left-part">
        <Avatar />
      </div>
      <div className="right-part">
        <input
          value={caption}
          type="text"
          className="captionInput"
          placeholder="say something"
          onChange={(e)=>setCaption(e.target.value)}
        />
        {postImg && (
          <div className="img-container">
            <img className="post-img" src={postImg} alt="postImg" />
          </div>
        )}

        <div className="bottom-part">
          <div className="input-post-image">
            <label htmlFor="inputImg" className="lableImg">
              <BsCardImage />
            </label>
            <input
              type="file"
              accept="image/*"
              id="inputImg"
              className="inputImg"
              onChange={handleImageChange}
            />
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
