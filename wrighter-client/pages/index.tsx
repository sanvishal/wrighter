import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { getUser, login, logout } from "../services/authService";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const credentials = { email, password };

      const user = await login(credentials);

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetUser = async () => {
    try {
      const user = await getUser();

      console.log(user);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogOut = async () => {
    const user = await logout();
    console.log(user);
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="email"> Username </label>
        <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password"> Password </label>
        <input type="text" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
        <button> Log in </button>
      </form>
    </div>
  );
};

export default Login;
