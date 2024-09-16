import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Register the Flip plugin
gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollTrigger);

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
  })()(
    //
    () => {
      let feedbackTrackerComponent = document.querySelector('.fr-tracker-component.for-team');
      if (!feedbackTrackerComponent) return;
      let feedbackFormBtn = document.querySelector('[feedback-button]');
      let feedbackFormWrapper = document.querySelector('[feedback-form]');
      console.log(feedbackFormBtn);
      feedbackFormBtn.addEventListener('click', () => {
        gsap.to(feedbackFormWrapper, { scale: 1, opacity: 1 });
        gsap.to(feedbackFormBtn, { scale: 0, opacity: 0 });
        feedbackTrackerComponent.classList.add('is-dark');
        gsap.to('.team-text-screens-wrap', { x: '-10%' });
      });
    }
  )();
}
