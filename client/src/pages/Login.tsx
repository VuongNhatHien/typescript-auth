// import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { UserConfig } from '../interface';


interface LoginResConfig {
    "data": {
        "user": UserConfig
        "accessToken": string,
    },
  "status": number
  "message": string
}

const Login = () => {
    const navigate = useNavigate()

    useEffect( () => {
        const userStorage = localStorage.getItem("user");
          if (userStorage) {
            navigate('/')
            return
          }
      },[])

    const [inputValue, setInputValue] = useState({
        username: "",
        password: "",
      });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInputValue({
          ...inputValue,
          [name]: value,
        });
      };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post<LoginResConfig>(
            "http://localhost:8080/api/auth/login",
            {
                ...inputValue,
            },
            { withCredentials: true }
            );

        //   const { user, access_token } = response.data.data;

            localStorage.setItem("user", JSON.stringify({
            user: res.data.data.user,
            access_token: res.data.data.accessToken,
            }))

            console.log(res.status)
            console.log(res.data.message)

            navigate('/')

            setInputValue({
            ...inputValue,
            username: "",
            password: "",
            });

        } catch (error) {
            console.log(error);
        }
    };


  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" name='username' onChange={handleOnChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name='password' onChange={handleOnChange} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>

      <Button variant="primary" onClick={() => navigate('/register')}>
        Register
      </Button>

      <Button variant="primary" onClick={() => navigate('/emailreset')}>
        Forgot password
      </Button>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}


export default Login