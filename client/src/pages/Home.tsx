import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "react-bootstrap";

import getUserStorage from "../utils/getUserStorage";
import getAccessToken from "../utils/getAccessToken";

import { UserConfig, UserStorageConfig, ResponseGetUserConfig, ResponseLogoutConfig } from "../interface";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserConfig>();
  const [phone, setPhone] = useState("undefined")

  useEffect(() => {
      try {
        const userStorage: UserStorageConfig | null = getUserStorage()
        if (!userStorage) {
          console.log("No record in local storage, navigated to login page")
          localStorage.removeItem("user")
          navigate('/login')
          return
        }
        setUser(userStorage.user);
      } catch (err) {
        console.log(err)
      }    
  }, []);

  const getPhoneNum = async () => {
    try {
      const userStorage: UserStorageConfig = getUserStorage()
      //Get access token from local storage, if expired refresh a new one
      const access_token = await getAccessToken()
      if (!access_token) {
        console.log("Cannot get access token")
        localStorage.removeItem("user")
        navigate('/login')
        return
      }

      const response = await axios.get<ResponseGetUserConfig>(
        "http://localhost:8080/api/users/" + userStorage.user.user_id,
        {
            headers: {
            Authorization: "Bearer " + access_token
            }
        }
      )
      setPhone(response.data.data.user.phone);
    } catch (err) {
      console.log(err)
      localStorage.removeItem("user")
      navigate('/login')
      return
    }
  }

  const logout = async () => {
    try {
      const res = await axios.post<ResponseLogoutConfig>(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      )
      localStorage.removeItem("user");
      console.log(res.data.message)
      navigate('/login')
      //window.location.reload();
    }
    catch (err) {
      console.log(err)
    }
  };

  if (user) {
    return (
      <>
        <div className="home_page">
            <h2>Hello {user.full_name}</h2>
            <h2>Phone: {phone}</h2>
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
          <Button variant="primary" onClick={getPhoneNum}>
            Get phone number
          </Button>
        </div>
      </>
    );
  }
  else {
    return (
      <>
       <h1>Error</h1>
      </>
    )
  }
};

export default Home;