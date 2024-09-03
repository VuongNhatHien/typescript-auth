import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation()

    useEffect( () => {
        const userStorage = localStorage.getItem("user");
          if (userStorage) {
            navigate('/')
            return
          }
      },[])

    const [verifyCode, setVerifyCode] = useState("")

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post<VerifyResConfig>(
            "http://localhost:8080/api/auth/email/verify",
            {
                email: location.state.email,
                verify_code: verifyCode
            },
            );


            console.log(res.status)
            console.log(res.data.message)
            alert(res.data.message)

            navigate('/login')
            setVerifyCode("")

        } catch (error) {
            console.log(error);
            alert("Failed to verify")
        }
    
    };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Verify code</Form.Label>
        <Form.Control type="text" placeholder="Enter your verify code" name='verify_code' onChange={ e => setVerifyCode(e.target.value) }/>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}


export default Verify