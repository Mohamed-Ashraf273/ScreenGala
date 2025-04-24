import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './home.css';

const mainURL = 'http://localhost:8080/api/v1/';
const authURL = 'http://localhost:4000/api/v1/';


const Home = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [access_token, setAccess_token] = useState(location.state.accessToken);
    const refresh_token = location.state.refreshToken;
    console.log(access_token);
    const GetUserReviews = async () => {
        try {
            const response = await fetch(`${mainURL}user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 401) { // Token is expired
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    setMessage('Failed to refresh token. Please log in again.');
                }
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);

            if (result.length === 0) {
                setMessage('No reviews to show');
            } else {
                setMessage('');
            }
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err);
            alert('Failed to load reviews: ' + err.message);
            setMessage('Failed to load reviews.');
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${authURL}token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: refresh_token })
            });

            if (!response.ok) {
                throw new Error(`Failed to refresh token: ${response.statusText}`);
            }

            const result = await response.json();
            setAccess_token(result.accessToken);
            return true;
        } catch (err) {
            console.error('Failed to refresh token:', err);
            return false;
        }
    };

    const Logout = async () => {
        try {
            const response = await fetch(`${authURL}logout`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: refresh_token
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setMessage(result.message);
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err);
            alert('Failed to logout: ' + err.message);
            setMessage('Failed to logout.');
        }
    };

    useEffect(() => {
        if (access_token) {
            GetUserReviews(); // Call the function on component mount
        }
    }, [access_token]); // Run only if accessToken changes

    return (
        <div className="container">
            <h1>My Reviews</h1>
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
            <button onClick={Logout}>Log out</button> {/* Pass the function reference */}
        </div>
    );
};

export default Home;
