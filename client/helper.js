const { random } = require("underscore");

const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorBox').classList.remove('hidden');
};

const handleMessage = (message) => {
    document.getElementById('message').textContent = message;
    document.getElementById('messageBox').classList.remove('hidden');
    document.getElementById('messageBox').classList.remove('fadeOut');
    document.getElementById('messageBox').classList.add('show');
    window.setTimeout(()=>{
        hideMessage();
    }, 1000)
};

const hideError = () => {
    if(document.getElementById('errorBox')){
        document.getElementById('errorBox').classList.add('hidden');
    }
}

const hideMessage = () => {
    if(document.getElementById('messageBox')){
        document.getElementById('messageBox').classList.remove('show');
        document.getElementById('messageBox').classList.add('fadeOut');
    }
}

const chooseRandom = (array) => {
    return array[random(array.length - 1)];
}

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    hideError();

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (result.message) {
        handleMessage(result.message);
    }

    if (handler) {
        console.log('Calling handler method...');
        handler(result);
    }
};

module.exports = {
    hideError,
    hideMessage,
    handleError,
    handleMessage,
    sendPost,
    chooseRandom,
}