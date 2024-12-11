const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleLogin = (e) => {
    // Prevent Default
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        // Handle Error
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });
    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="is-flex-direction-column is-justify-content-center has-background-primary p-4"
        >
            <h1 className='has-text-centered title is-size-4'>Login to Continue!</h1>
            <div className="field">
                <label htmlFor="username">Username</label>
                <div className="control">
                    <input className="input" id="user" type="text" name="username" placeholder="username" />
                </div>
            </div>
            <div className="field">
                <label htmlFor="pass">Password</label>
                <div className="control">
                    <input className="input" type="password" id="pass" name='pass' placeholder='password' />
                </div>
            </div>
            <div className="field">
                <div className="control is-flex is-justify-content-center">
                    <input className='button formSubmit' type='submit' value="Log In" />
                </div>
            </div>
        </form>
    )
}
const SignupWindow = (props) => {
    return (

        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="is-flex-direction-column is-justify-content-center has-background-primary p-4"
        >
            <h2 className='has-text-centered title is-size-4'>Sign up to play!</h2>
            <div className="field">
                <label htmlFor="username">Username</label>
                <div className="control">
                    <input className="input" id="user" type="text" name="username" placeholder="username" />
                </div>
            </div>
            <div className="field">
                <label htmlFor="pass">Password</label>
                <div className="control">
                    <input className="input" type="password" id="pass" name='pass' placeholder='password' />
                </div>
            </div>
            <div className="field">
                <label htmlFor="pass2">Retype Password</label>
                <div className="control">
                    <input className="input" type="password" id="pass2" name='pass2' placeholder='retype password' />
                </div>
            </div>
            <div className="field">
                <div className="control is-flex is-justify-content-center">
                    <input className='button formSubmit' type='submit' value="Sign In" />
                </div>
            </div>
            
        </form>
    )
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));
    // Default state
    root.render(<LoginWindow />);

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });
}

window.onload = init;