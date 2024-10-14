const logoWrapper = document.querySelector('.logo-screen'); // Assuming .logo-list is the container for all logos
const logos = document.querySelectorAll('.logo-item');

gsap.set(logos, { autoAlpha: 1 });

// Clone the list to create an infinite looping effect
const listHeight = logoWrapper.scrollHeight; // Get the height of the entire list
const duration = logos.length * 2.5; // Duration for the full scroll

gsap.to(logoWrapper, {
  yPercent: -100, // Move the entire list upwards
  duration: duration,
  ease: 'none',
  repeat: -1, // Infinite loop
  modifiers: {
    yPercent: gsap.utils.wrap(0, -100), // Wrap the movement to loop it continuously
  },
});
