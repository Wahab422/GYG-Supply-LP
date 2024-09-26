// Create a button element
const button = document.querySelector('#btn');

const textSpan = document.createElement('span');
textSpan.textContent = 'Like';

// Function to trigger confetti effect
function onClick() {
    confetti({
        particleCount: 150,
        spread: 60,
    });
}

// Attach the click event listener to the button
button.addEventListener('click', onClick);
