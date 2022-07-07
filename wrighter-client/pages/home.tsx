import { Button } from "@chakra-ui/react";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { API_BASE_URL } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { getUser, logout } from "../services/authService";

const Home: NextPage = () => {
  const { fetchUser } = useContext(UserContext);

  useEffect(() => {
    fetchUser();
  }, []);

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
      <Button onClick={() => handleGetUser()}> User </Button>
      <Button onClick={() => handleLogOut()}> Logout </Button>
    </div>
  );
};

export default Home;
