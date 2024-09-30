import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

gsap.config({
  nullTargetWarn: false,
});
gsap.defaults({
  ease: 'cubic-bezier(.22,.6,.36,1)',
});
let lenis;
const html = document.documentElement;
// Lenis Code
function handleScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function handleRegularAnimation() {
  // Animate Stagger Elements
  let staggerElements = document.querySelectorAll('[anim-stagger]');
  if (staggerElements.length > 0) {
    staggerElements.forEach((element) => {
      animateStagger(element);
    });
  }
  // GSAP Stagger Animation Function
  function animateStagger(element, children, opacityValue) {
    if (children == null) {
      children = element.getAttribute('anim-stagger');
    }
    let childrens = element.querySelectorAll(children);
    gsap.set(childrens, {
      y: element.getAttribute('from-y') || '1rem',
      opacity: opacityValue || 0,
    });
    ScrollTrigger.batch(childrens, {
      onEnter: (target) => {
        // Animate sub-elements when they enter the viewport
        gsap.to(target, {
          autoAlpha: 1,
          duration: element.getAttribute('data-duration') || 1.3,
          y: '0rem',
          opacity: 1,
          stagger: {
            from: element.getAttribute('stagger-from') || 'start',
            each: element.getAttribute('stagger-amount') || 0.25,
          },
          ease: element.getAttribute('data-easing') || 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: element.getAttribute('scrollTrigger-start') || 'top 95%',
            markers: element.getAttribute('anim-markers') || false,
          },
          delay: element.getAttribute('data-delay') || 0.15,
        });
      },
    });
  }
  function animateElement(element) {
    let delay = element.getAttribute('data-delay');
    let duration = element.getAttribute('data-duration');
    let y = element.getAttribute('from-y');
    let easing = element.getAttribute('data-easing');
    easing = easing || 'power3.out';
    delay = delay || 0;
    duration = duration || 1.2;
    y = y || '30';
    gsap.fromTo(
      element,
      { y: y, opacity: 0 },
      {
        duration: duration,
        y: '0%',
        opacity: 1,
        ease: easing,
        scrollTrigger: element,
        delay: delay,
      }
    );
  }

  document.querySelectorAll('[anim-element]').forEach((ele) => {
    animateElement(ele);
  });

  gsap.utils.toArray('[anim-scale-opacity]').forEach((ele) => {
    gsap.fromTo(
      ele,
      { opacity: 0, scale: 1.1 },
      {
        duration: 2,
        opacity: 1,
        scale: 1,
        delay: ele.getAttribute('data-delay') || 0,
        scrollTrigger: {
          trigger: ele,
          markers: false,
        },
      }
    );
  });
}

function init() {
  handleScroll();
  handleCode();
  handleRegularAnimation();
}
init();

function handleCode() {
  // handle Loading Animation Code
  (() => {
    if (!document.querySelector('.loading-screen')) return;
    //
    function checkCookie(name) {
      const cookieArr = document.cookie.split(';');
      for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].trim();
        if (cookiePair.startsWith(name + '=')) {
          return true;
        }
      }
      return false;
    }

    // Example usage
    if (checkCookie('loading-animation')) {
      document.querySelector('.loading-screen').remove();
      window.scrollTo({ top: 0 });
      html.classList.add('ready');
      gsap.from('[data-anim-element]', { opacity: 0, y: '2rem', duration: 1.25, stagger: 0.25 });
    } else {
      document.querySelector('.loading-screen').style.display = 'flex';
      let tl = gsap.timeline();
      let loadingLogo = document.querySelector('.loading-screen [loading-screen-logo]');
      tl.to(loadingLogo, { scale: 2 })
        .call(() => {
          loadingLogo.click();
          document.querySelector('.fs-hero-logo-wrap').style.display = 'none';
        })
        .to(loadingLogo, {
          scale: 1,
          delay: loadingLogo.getAttribute('lottie-animation-duration'),
        })
        .to(loadingLogo, { duration: 1, color: '#f53' }, '<')
        .to(
          '.loading-screen',
          {
            duration: 1,
            backgroundColor: 'transparent',
          },
          '<'
        )
        .call(() => {
          let state = Flip.getState(document.querySelector('[loading-screen-logo-wrapper]'));
          document
            .querySelector('[logo-flip-item-wrapper]')
            .appendChild(document.querySelector('[loading-screen-logo-wrapper]'));
          Flip.from(state, {
            duration: 0.65,
            ease: 'power1.inOut',
            onComplete: () => {
              document.querySelector('.loading-screen').remove();
              html.classList.add('ready');
              gsap.from('[data-anim-element]', {
                opacity: 0,
                y: '2rem',
                duration: 1.25,
                stagger: 0.25,
              });
              function setCookie(name, value, days) {
                let expires = '';
                if (days) {
                  const date = new Date();
                  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
                  expires = '; expires=' + date.toUTCString();
                }
                document.cookie = name + '=' + (value || '') + expires + '; path=/';
              }

              setCookie('loading-animation', '1', 1);
            },
          });
        });
    }
  })();
  // Hero Section Animation
  (() => {
    gsap.to('.fs-hero-text', {
      duration: 0.5,
      y: '80%',
      opacity: 0,
      scale: 0.98,
      ease: 'linear',
      scrollTrigger: {
        trigger: '.section-fr',
        scrub: 1,
        start: 'top top',
        end: 'bottom bottom',
      },
    });
  })();
  // Unlock section animation
  (() => {
    if (!document.querySelector('.section-fr-unlock')) return;
    gsap.from('.unlock-huge-header', {
      scale: 2,
      scrollTrigger: {
        trigger: '.unlock-heading-track',
        start: 'top 80%',
        bottom: 'bottom bottom',
        scrub: 1,
      },
    });
  })();
  // Three Images Anim
  (() => {
    if (!document.querySelector('[three-imgs-wrapper]')) return;
    let tl = gsap.timeline();
    tl.from('[left-side-image]', { xPercent: 100 });
  })();
  //  Block Animations
  (() => {
    gsap.fromTo(
      '[help-center-block] .help-items-list',
      { y: '2rem' },
      {
        y: '-2rem',
        scrollTrigger: {
          trigger: '[help-center-block]',
          start: 'top bottom',
          bottom: 'bottom bottom',
          scrub: 5,
        },
      }
    );
    gsap.fromTo(
      '[growth-hub-block] .media-blocks-list',
      { x: '3rem' },
      {
        x: '-3rem',
        duration: 5,
        scrollTrigger: {
          trigger: '[growth-hub-block]',
          start: 'top bottom',
          bottom: 'bottom bottom',
          scrub: 5,
        },
      }
    );
    gsap.fromTo(
      '[media-assets-block] .media-blocks-list',
      { x: '-3rem' },
      {
        x: '3rem',
        duration: 5,
        scrollTrigger: {
          trigger: '[media-assets-block]',
          start: 'top bottom',
          bottom: 'bottom bottom',
          scrub: 5,
        },
      }
    );
  })();
  //
  (() => {
    document.querySelectorAll('[anim-section-clipPath-into-view]').forEach((section) => {
      gsap.to(section, {
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: section.getAttribute('start-at') ? section.getAttribute('start-at') : 'top center',
          end: section.getAttribute('end-at') ? section.getAttribute('end-at') : 'bottom bottom',
          scrub: 1.5,
        },
        clipPath:
          window.innerWidth > 767 ? 'inset(1.25rem round 3rem)' : 'inset(1.25rem round 2rem)',
      });
    });
  })();
  //
  (() => {
    if (!document.querySelector('.experience-cards')) return;
    gsap.utils.toArray('.experience-cards .experience-card').forEach((card) => {
      gsap.from(card, {
        y: '40rem',
        scale: 0.75,
        opacity: 0,
        duration: 1.5,
        ease: 'ease',
        scrollTrigger: {
          trigger: card,
          start: '-=200% bottom',
        },
      });
    });
  })();
  //
  (() => {
    if (!document.querySelector('.section-fr-tracker_track')) return;
    if (window.innerWidth > 767) {
      let circle = document.querySelector('.experience-creators-imgs-wrapper');
      let rects = document.querySelectorAll('.experience-creators-img');
      let radius = circle.offsetWidth / 2;
      let rectCount = rects.length;
      let angleStep = 360 / rectCount; // Evenly space the rectangles

      rects.forEach((rect, index) => {
        let angle = angleStep * index;
        let radian = angle * (Math.PI / 180); // Convert to radians

        // Calculate the position on the circle's edge
        let x = radius + radius * Math.cos(radian) - rect.offsetWidth / 2;
        let y = radius + radius * Math.sin(radian) - rect.offsetHeight / 2;

        rect.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
      });
      //
      gsap.fromTo(
        '.section-fr-tracker_track .experience-creators-imgs-wrapper',
        {
          rotate: '77deg',
        },
        {
          duration: 1,
          rotate: '180deg',
          scrollTrigger: {
            trigger: '.section-fr-tracker_track',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
            markers: true,
          },
        }
      );
    }
  })();
  //
  (() => {
    let feedbackTrackerComponent = document.querySelector('[section-fr-feedback-form]');
    if (!feedbackTrackerComponent) return;
    let feedbackFormBtn = feedbackTrackerComponent.querySelector('[feedback-btn]');
    let feedbackFormCloseBtn = feedbackTrackerComponent.querySelector('[feedback-form-btn]');
    let feedbackFormWrapper = feedbackTrackerComponent.querySelector('[feedback-form]');
    feedbackFormBtn.addEventListener('click', () => {
      gsap.to(feedbackFormWrapper, { scale: 1, opacity: 1, ease: 'power4.out' });
      gsap.to(feedbackFormBtn, { scale: 0, opacity: 0, ease: 'power4.out' });
      feedbackTrackerComponent.classList.add('is-dark');
      gsap.to('.team-text-screens-wrap', { x: '-10%', ease: 'power4.out' });
    });
    feedbackFormCloseBtn.addEventListener('click', () => {
      gsap.to(feedbackFormWrapper, { scale: 0, opacity: 0, ease: 'power4.out' });
      gsap.to(feedbackFormBtn, { scale: 1, opacity: 1, ease: 'power4.out' });
      feedbackTrackerComponent.classList.remove('is-dark');
      gsap.to('.team-text-screens-wrap', { x: '0%', ease: 'power4.out' });
    });
    //
    let form = feedbackTrackerComponent.querySelector('[get-access-form]');
    form.querySelector('#submit-btn').addEventListener('click', () => {
      gsap.to(form, { y: '-100%', ease: 'power4.out', duration: 0.7 });
      gsap.to(form.closest('.steps-form-block').querySelector('.form-success'), {
        y: '0%',
        duration: 0.7,
        ease: 'power4.out',
      });
    });

    //
    let prevBtn = form.querySelector('[form-prev-btn]');
    let nextBtn = form.querySelector('[form-next-btn]');
    let submitBtn = form.querySelector('[form-submit-btn]');
    let prevBlock = form.querySelector('[form-prev-step-block]');
    let currentBlock = form.querySelector('[form-current-step-block]');
    let nextBlock = form.querySelector('[form-next-step-block]');
    submitBtn.addEventListener('click', () => {
      form.querySelector('#submit-btn').click();
      let pdfLink = form.parentElement
        .querySelector('[form-success-pdf-link]')
        .getAttribute('href');
      setTimeout(() => {
        window.open(pdfLink, '_blank');
      }, 700);
    });
    // Stop Form Submit on the Enter
    form.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault(); // Prevent the default form submission on 'Enter' key
        if (!nextBtn.hasAttribute('disabled')) {
          nextBtn.click();
        }
      }
    });
    // Function to update button states
    function updateButtonStates() {
      // Disable prev button if prevBlock is empty
      if (prevBlock.children.length === 0) {
        prevBtn.setAttribute('disabled', '');
      } else {
        prevBtn.removeAttribute('disabled');
      }

      // Disable next button if nextBlock is empty or required fields are not filled
      if (nextBlock.children.length === 0 || !isCurrentBlockValid()) {
        nextBtn.setAttribute('disabled', '');
        if (isCurrentBlockValid()) {
          nextBtn.removeAttribute('disabled');
        }
      } else {
        nextBtn.removeAttribute('disabled');
      }
      if (nextBlock.children.length === 0) {
        submitBtn.classList.remove('hide');
        nextBtn.classList.add('hide');
        if (isCurrentBlockValid()) {
          submitBtn.removeAttribute('disabled');
        } else {
          submitBtn.setAttribute('disabled', '');
        }
      } else {
        submitBtn.classList.add('hide');
        nextBtn.classList.remove('hide');
      }
    }

    // Function to check if required fields, select fields, and checkboxes in current block are valid
    function isCurrentBlockValid() {
      // Validate required input fields
      let requiredFields = currentBlock.querySelectorAll(
        'input[required], select[required], input[type="checkbox"][required]'
      );

      for (let field of requiredFields) {
        if (field.getAttribute('type') === 'checkbox') {
          // Check if at least one required checkbox is checked
          let checkboxGroup = currentBlock.querySelectorAll(
            `input[type="checkbox"][name="${field.name}"]`
          );
          let isChecked = Array.from(checkboxGroup).some((checkbox) => checkbox.checked);
          if (!isChecked) {
            return false;
          }
        } else if (field.tagName === 'SELECT') {
          // Check if a select field has a value
          if (!field.value || field.value === '') {
            return false;
          }
        } else if (field.getAttribute('type') === 'email') {
          // Validate email field
          let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            return false;
          }
        } else {
          // Check other input fields
          if (!field.value.trim()) {
            return false;
          }
        }
      }
      return true; // All required fields, select fields, and checkboxes are valid
    }

    function handleNextClick() {
      let state = Flip.getState('.form-step'); // Save current positions of elements

      // Move input from current block to prev block
      prevBlock.appendChild(currentBlock.querySelector('.form-step'));

      // Move first input from next block to current block
      currentBlock.appendChild(nextBlock.querySelector('.form-step'));

      // Animate the transition using Flip
      Flip.from(state, {
        duration: 0.75,
        ease: 'power1.inOut',
        stagger: 0.05,
      });

      // Update button states
      updateButtonStates();
    }

    function handlePrevClick() {
      let state = Flip.getState('.form-step'); // Save current positions of elements

      // Move last input from prev block to current block
      currentBlock.appendChild(prevBlock.querySelector('.form-step:last-child'));

      // Move input from current block back to next block
      nextBlock.prepend(currentBlock.querySelector('.form-step'));

      // Animate the transition using Flip
      Flip.from(state, {
        duration: 0.75,
        ease: 'power1.inOut',
        stagger: 0.05,
      });

      // Update button states
      updateButtonStates();
    }

    // Attach event listeners to buttons
    nextBtn.addEventListener('click', handleNextClick);
    prevBtn.addEventListener('click', handlePrevClick);

    // Check the validity of input fields, select fields, and checkboxes in current block on input or change
    currentBlock.addEventListener('input', updateButtonStates);
    currentBlock.addEventListener('change', updateButtonStates); // For checkboxes and select fields

    // Initial button state check on page load
    updateButtonStates();
  })();
  //
}
