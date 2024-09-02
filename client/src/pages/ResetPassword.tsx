import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

interface ResetResConfig {
    "data": null,
    "status": number
    "message": string
}

const ResetPassword = () => {
    const navigate = useNavigate()

    useEffect( () => {
        const userStorage = localStorage.getItem("user");
          if (userStorage) {
            navigate('/')
            return
          }
      },[])

    const [inputValue, setInputValue] = useState({
        password: "",
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
            const res = await axios.post<ResetResConfig>(
            "http://localhost:8080/api/auth/password/reset",
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
            password : "",
            verify_code: ""
            });

        } catch (error) {
            console.log(error);
            alert("Failed to set new password")
        }
    
    };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter new password" name='password' onChange={handleOnChange} />
      </Form.Group>

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


export default ResetPassword