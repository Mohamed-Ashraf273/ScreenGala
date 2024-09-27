const mainURL = 'http://localhost:8080/api/v1/'

document.getElementById('signup-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const username = document.getElementById('signup-username').value
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
    AddUser(username, email, password)
})

document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    userLogin(email, password)
})

function userLogin(email, password){
    fetch(mainURL + 'login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => {
        if(res.status === 500){
            throw new Error("Network response was't ok " + res.statusText)
        }
        if(res.ok){alert("User logged in successgully")}
        return res.json()
    })
    .then(data => {
        handleLogin(data)
    })
    .catch(err => {
        console.error('There was a problem with the fetch operation:', err)
        alert('Failed to login user: ' + err.message)
    })
}

function AddUser(username, email, password){
    fetch(mainURL + 'adduser', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    .then(res => {
        if(res.status === 500){
            throw new Error("Network response was't ok " + res.statusText)
        }
        if(res.ok){alert("User added successgully")}
        return res.json()
    })
    .then(data => {
        afterSignUp(data)
    })
    .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
        alert('Failed to add user: ' + err.message);
    })
}

function afterSignUp(data){
    if(data.message == 'User added successfully'){
        window.location.href = 'app.html'
    }else{
        const errContainer = document.getElementById('error-mes')
        errContainer.innerHTML = ''
        const message = document.createElement('p')
        message.innerHTML = `<strong>${data.message}</strong>`
        message.style.color = 'red'
        errContainer.appendChild(message)
    }
}

function handleLogin(data){
    if(data.message == 'Logged in successfully'){
        window.location.href = 'app.html'
    }else{
        const errContainer = document.getElementById('login-error-mes')
        errContainer.innerHTML = ''
        const message = document.createElement('p')
        message.innerHTML = `<strong>${data.message}</strong>`
        message.style.color = 'red'
        errContainer.appendChild(message)
    }
}
