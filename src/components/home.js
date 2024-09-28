import { React, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './home.css'

const mainURL = 'http://localhost:8080/api/v1/'

const Home = () => {
    const [data, setData] = useState([])
    const [message, setMessage] = useState('')
    const location = useLocation()
    const token = location.state.accssToken
    const GetUserReviews = async () => {
        try {
            const response = await fetch(`${mainURL}user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the Authorization header here
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)

            if (result.length === 0) {
                setMessage('No reviews to show')
            } else {
                setMessage('')
            }
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err)
            alert('Failed to load reviews: ' + err.message)
            setMessage('Failed to load reviews.')
        }
    }

    useEffect(() => {
        if (token) { // Ensure that the access token is present before fetching
            GetUserReviews(); // Call the function on component mount
        }
    }, [token]); // Run only if accessToken changes


    return (
        <div className="container">
            <h1>Form Test</h1>
            {message && <div>{message}</div>}
            <div id="reviewsContainer">
                {data.length > 0 && (
                    data.map((item, index) => (
                        <div key={index} className="card"> 
                            <h3>{item.movie}</h3> 
                            <p>{item.review}</p> 
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Home
