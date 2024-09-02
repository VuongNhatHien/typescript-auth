// import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

interface RegisterResConfig {
    "data": null,
    "status": number
    "message": string
}

const Register = () => {
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
        full_name: "",
        email: "",
        password: "",
      });
    // const { username, password } = inputValue;

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
            const res = await axios.post<RegisterResConfig>(
            "http://localhost:8080/api/auth/register",
            {
                ...inputValue,
            },
            );

        //   const { user, access_token } = response.data.data;

            console.log(res.status)
            console.log(res.data.message)
            alert(res.data.message)
            navigate('/verify')

            setInputValue({
            ...inputValue,
            username: "",
            full_name: "",
            email: "",
            password: "",
            });

        } catch (error) {
            console.log(error);
        }
    
    };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail1">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" name='username' onChange={handleOnChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail2">
        <Form.Label>Full name</Form.Label>
        <Form.Control type="text" placeholder="Enter fullname" name='full_name' onChange={handleOnChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name='email' onChange={handleOnChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name='password' onChange={handleOnChange} />
      </Form.Group>

      <Button variant="primary" onClick={() => navigate('/login')}>
        Login
      </Button>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}


export default Register