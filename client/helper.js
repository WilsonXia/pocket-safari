const { random } = require("underscore");

const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorBox').classList.remove('hidden');
};

const hideError = () => {
    if(document.getElementById('errorBox')){
        document.getElementById('errorBox').classList.add('hidden');
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

    if (handler) {
        console.log('Calling handler method...');
        handler(result);
    }
};

module.exports = {
    hideError,
    handleError,
    sendPost,
    chooseRandom,
}