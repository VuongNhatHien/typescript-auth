import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, useLocation } from 'react-router-dom';

interface ResetResConfig {
    "data": null,
    "status": number
    "message": string
}

const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect( () => {
        const userStorage = localStorage.getItem("user");
          if (userStorage) {
            navigate('/')
            return
          }
      },[])

    const [password, setPassword] = useState("")
    const [verifyCode, setVerifyCode] = useState("")


    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post<ResetResConfig>(
            "http://localhost:8080/api/auth/password/reset",
            {
                email: location.state.email,
                verify_code: verifyCode,
                password: password
            },
            );

            console.log(res.status)
            console.log(res.data.message)
            alert(res.data.message)

            navigate('/login')

            setPassword("")
            setVerifyCode("")

        } catch (error) {
            console.log(error);
            alert("Failed to set new password")
        }
    
    };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Verify code</Form.Label>
        <Form.Control type="text" placeholder="Enter your verify code" name='verify_code' onChange={e => setVerifyCode(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter new password" name='password' onChange={ e => setPassword(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}


export default ResetPassword