import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './signupLogin.css'

const mainURL = 'http://localhost:8080/api/v1/'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [Message, setMessage] = useState('')
  const navigate = useNavigate() // Initialize useHistory

  const handleSubmit = (event) => {
    event.preventDefault()
    AddUser(username, email, password)
  }

  const AddUser = async (username, email, password) => {
    try {
      const response = await fetch(mainURL + 'adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await response.json()
      setMessage(data.message)
      if(data.message === 'User added successfully'){
        navigate('/ScreenGala/login')
      }
    } catch (err) {
      console.error('There was a problem with the fetch operation:', err)
      alert('Failed to add user: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div className="input-group">
        <label>Username</label>
        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div className="input-group">
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="input-group">
        <label>Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <button type="submit" className="btn">Sign Up</button>
      <div id="error-mes" style={{ color: 'red' }}>{Message}</div>
    </form>
  )
}

export default SignUp
