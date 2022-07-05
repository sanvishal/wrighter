import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { API_BASE_URL } from "../constants";
import { getUser, logout } from "../services/authService";

const Home: NextPage = () => {
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
      <button onClick={() => handleGetUser()}> User </button>
      <button onClick={() => handleLogOut()}> Logout </button>
    </div>
  );
};

export default Home;
