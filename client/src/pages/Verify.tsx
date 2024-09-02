// import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { UserConfig } from '../interface';


interface VerifyResConfig {
    "data": {
        "user": UserConfig
    },
  "status": number
  "message": string
}
const Verify = () => {
    const navigate = useNavigate()

    useEffect( () => {
        const userStorage = localStorage.getItem("user");
          if (userStorage) {
            navigate('/')
            return
          }
      },[])

    const [inputValue, setInputValue] = useState({
        verify_code: ""
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
            const res = await axios.post<VerifyResConfig>(
            "http://localhost:8080/api/auth/email/verify",
            {
                ...inputValue,
            },
            );

        //   const { user, access_token } = response.data.data;

            console.log(res.status)
            console.log(res.data.message)
            alert(res.data.message)

            navigate('/login')

            setInputValue({
            ...inputValue,
            verify_code: ""
            });

        } catch (error) {
            console.log(error);
            alert("Failed to verify")
        }
    
    };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Verify code</Form.Label>
        <Form.Control type="text" placeholder="Enter your verify code" name='verify_code' onChange={handleOnChange}/>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}


export default Verify