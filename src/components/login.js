import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './signupLogin.css'

const mainURL = 'http://localhost:8080/api/v1/'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [Message, setMessage] = useState('')
  const navigate = useNavigate() 

  const handleSubmit = (event) => {
    event.preventDefault()
    AddUser(email, password)
  }

  const AddUser = async (email, password) => {
    try {
      const response = await fetch(mainURL + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      setMessage(data.message)
      if(data.message === 'Logged in successfully'){
        navigate('/ScreenGala/home', { 
          state: {
            accssToken: data.access_token
        } })
      }
    } catch (err) {
      console.error('There was a problem with the fetch operation:', err)
      alert('Failed to login user: ' + err.message)
    }
  }

  const handleSignUp = () => {
    navigate('/ScreenGala/signup')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <div className="input-group">
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="input-group">
        <label>Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="btn-group">
        <button type="button" className="signup-link" onClick={handleSignUp}>Sign Up</button>
        <button type="submit" className="btn">Log In</button>
      </div>
      <div id="error-mes" style={{ color: 'red' }}>{Message}</div>
    </form>
  )
}

export default LogIn
