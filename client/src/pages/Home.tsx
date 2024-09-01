import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {jwtDecode} from 'jwt-decode';

interface resProps {
    "data": {
        "access_token": string,
    },
    "status": number
    "message": string
}

interface userProps {
    "user_id": number,
    "email": string,
    "username": string,
    "full_name": string,
    "phone": string,
    "day_of_birth": string,
    "decription": string,
    "is_verify": boolean,
    "avatar": string,
    "global_id_active": number,
    "created_at": string,
    "updated_at": string,
}

interface userStorageProps {
    "user": userProps,
    "access_token": string
}

interface resUser {
    "data": userProps,
    "status": number,
    "message": string,
}

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<userProps>();
  const [email, setEmail] = useState("")

  useEffect(() => {
    const verify = async () => {
      try {
      const temp: string | null = localStorage.getItem("user")

      if (!temp) {
        console.log("Not authorized, moved to login page")
        navigate('/login')
        return
      }
      const userStorage: userStorageProps = JSON.parse(temp)
      
      var access_token = userStorage.access_token
      if (!access_token){
        return
      }
      const decode = jwtDecode(access_token)

      if (Date.now() >= (decode.exp? decode.exp * 1000 : 0)) {
        try {
        const res = await axios.post<resProps>(
          "http://localhost:8080/api/auth/refresh",
          {},
          { withCredentials: true }
          );
        // console.log(res.data.message)
        access_token = res.data.data.access_token;

        } catch (err: any) {
          console.log(err.response.data.message)
          await logout()
        }
      }

      // const config = {
      //   headers: { Authorization: `Bearer ${access_token}` }
      // };

      const response = await axios.get<resUser>(
        "http://localhost:8080/api/users/" + userStorage.user.user_id,
        {
            // params:{
            //     user_id: userStorage.user.user_id
            // },
            headers: {
            Authorization: "Bearer " + access_token
            }
        }
      )

      setUser(userStorage.user);

      setEmail(response.data.data.email)
    } catch (err) {
      console.log(err)
    }
  }
    verify()
    
  }, []);


  const logout = async () => {
    try {
      const res = await axios.post<resProps>(
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
            <h2>Email: {email}</h2>
          <button onClick={logout}>LOGOUT</button>
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