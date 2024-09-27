import {React, useState} from 'react'
//import { useNavigate } from 'react-router-dom'
import './home.css'
const mainURL = 'http://localhost:8080/api/v1/'

const Home = () => {
    const [id, setId] = useState(0)
    const [data, setData] = useState([])
    const [message, setMessage] = useState('')
    //const navigate  = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        GetUserReviews(id)
    }

    const GetUserReviews = async (id) => {
        try {
            const response = await fetch(`${mainURL}user/${id}`)
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
            setMessage('Failed to load reviews.');
        }
    }
    return (
        <div className="container">
        <h1>Form Test</h1>
        <form id="numberForm" onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="number" id="numberInput" name="quantity" placeholder="Enter a number" value={id} onChange={(e) => setId(e.target.value)}/>
            </div>
            <button type="submit">Submit</button>
        </form>
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