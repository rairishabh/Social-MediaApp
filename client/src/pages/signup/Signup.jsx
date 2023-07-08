import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import { axiosClient } from "../../utils/axiosClient";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/");
      console.log("result>>>", result);
    } catch (e) {
      console.log("Error while signup>>", e);
    }
  }
  return (
    <div className="signup">
      <div className="signupBox">
        <h2 className="heading">Sign Up</h2>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="text">Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input type="submit" className="submit" />
        </form>
        <p className="subHeading">
          Already have an account?
          <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
