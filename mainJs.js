const mainURL = 'http://localhost:8080/api/v1/'

document.getElementById('numberForm').addEventListener('submit', function(event) {
    event.preventDefault() // Prevent the form from submitting
    const number = document.getElementById('numberInput').value
    GetUserReviews(number)
})



function GetUserReviews(number) {
    fetch(mainURL + 'user/' + number)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            return res.json() // Convert response to JSON
        })
        .then(data => {
            displayReviews(data) // Call function to display data
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        })
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviewsContainer')
    
    // Clear previous reviews (if any)
    reviewsContainer.innerHTML = ''

    // Loop through the reviews array and create HTML elements to display each review
    reviews.forEach(review => {
        const reviewElement = document.createElement('div') // Create the div element
        reviewElement.classList.add('card') // Add the 'card' class
    
        // Set the content of the card
        reviewElement.innerHTML = `<strong>Movie:</strong> ${review.movie} | <strong>Review:</strong> ${review.review}`
    
        // Append the card to the reviewsContainer
        reviewsContainer.appendChild(reviewElement)
    })
    
}

