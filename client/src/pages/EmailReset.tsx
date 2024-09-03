// import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';


interface EmailResetConfig {
    "data": null,
    "status": number
    "message": string
}

const EmailReset = () => {
    const navigate = useNavigate()

    useEffect( () => {
        const userStorage = localStorage.getItem("user");
          if (userStorage) {
            navigate('/')
            return
          }
      },[])

    const [email, setEmail] = useState("")

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post<EmailResetConfig>(
            "http://localhost:8080/api/auth/email/code",
            {
                email: email
            },
            );

            console.log(res.status)
            console.log(res.data.message)
            alert("Verify code sent!")

            navigate('/reset', {state: {email: email}})

            setEmail("")

        } catch (error) {
            console.log(error);
            alert("Failed to verify")
        }
    
    };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="Enter your email to get verify code" name='email' onChange={ e => setEmail(e.target.value) }/>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}


export default EmailReset