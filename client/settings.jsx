const helper = require('./helper.js');
const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

const handleChangePass = (e) => {
    e.preventDefault();
    // Receive the values for currentPass and newPass
    // Post the data using helper
    const currentPass = document.getElementById('currPass').value;
    const newPass = document.getElementById('newPass').value;
    // Error handling
    if (!currentPass || !newPass) {
        helper.handleError('All fields are required!');
        return false;
    } else if (currentPass === newPass) {
        helper.handleError('Password must not match!');
        return false;
    }
    helper.sendPost(e.target.action, { currentPass, newPass });
    return false;
}

const handleToggleAdmin = (e) => {
    e.preventDefault();
    // Receive checkbox checked
    const isAdminCheck = document.getElementById('cb-admin').checked;
    // Post bool
    helper.sendPost('/admin', { isAdmin: isAdminCheck });
    return false;
}

const ChangePasswordForm = () => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            onSubmit={handleChangePass}
            action="/changePass"
            method="POST"
        >
            <label htmlFor="password">Current Password: </label>
            <input type="password" id="currPass" name="password" />
            <label htmlFor="newPassword">New Password: </label>
            <input type="password" id="newPass" name='newPassword' />
            <input className='formSubmit' type='submit' value="Submit" />
        </form>
    );
}

const ToggleAdminForm = (props) => {
    return (
        <form id="toggleAdminForm"
            name="toggleAdminForm"
            onSubmit={(e) => {
                handleToggleAdmin(e, props.triggerReload);
            }
            }
            action="/toggleAdminForm"
            method="POST"
        >
            <label htmlFor="cb-admin">Is Admin</label>
            <input type="checkbox" name="cb-admin" id="cb-admin" />
            <input className='formSubmit' type="submit" value="Submit" />
        </form>
    );
}

const Content = () => {
    return (
        <div id='settings'>
            <ChangePasswordForm />
            <ToggleAdminForm />
        </div>
    );
}

const init = () => {
    // trigger on load
    const root = createRoot(document.getElementById('content'));
    root.render(<Content />);
}

window.onload = init;