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
  lenis.on('scroll', () => {
    if (window.innerWidth > 768) {
      ScrollTrigger.refresh();
    } else {
      ScrollTrigger.update();
    }
  });
  requestAnimationFrame(raf);

  document.querySelector('[scrollToTop]').addEventListener('click', () => {
    lenis.scrollTo('top', { duration: 2 });
  });
  //
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
      y: element.getAttribute('from-y') || '2rem',
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
          delay: element.getAttribute('data-delay') || 0.35,
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
    delay = delay || 0.35;
    duration = duration || 1.2;
    y = y || '2rem';
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
  if (window.innerWidth > 768) {
    let parallaxElements = document.querySelectorAll('[parallax-element]');
    parallaxElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: '-10%',
          scale: 1.1,
        },
        {
          y: '10%',
          scale: 1.1,
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom -50%',
            scrub: 0.2,
            markers: false,
          },
        }
      );
    });
  }
}

function init() {
  handleWeglot();
  handleScroll();
  anchorNavigation();
  handleCode();
  handleRegularAnimation();
  handleFeatureThubnailVideos();
  setTimeout(() => {
    handleSlider();
  }, 1000);
  setTimeout(() => {
    handleVideos();
    handleConfetti();
    handlePopups();
    FooterScroll();
  }, 2000);
}
init();

function handleCode() {
  //
  (() => {
    let tabSliderSection = document.querySelector('.fr-acc_grid_slider-block');
    if (!tabSliderSection) return;

    let sliderVideos = tabSliderSection.querySelectorAll('video');

    // Play the 1st Video using GSAP
    gsap.to(sliderVideos[0], {
      duration: 1,
      scrollTrigger: sliderVideos[0],
      onStart: () => {
        tabSliderSection.querySelector('[slide-to="1"]').click();
        playVideo(sliderVideos[0]);
      },
    });

    let videoBtns = tabSliderSection.querySelectorAll('[slide-to]');
    videoBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        // Pause all videos and wait for each pause to complete
        await pauseAllVideos();

        // Find the selected video and play it
        let selectedVideo = tabSliderSection.querySelector(
          `[data-video="${btn.getAttribute('slide-to')}"]`
        );

        playVideo(selectedVideo);
      });
    });

    // Function to play a video with error handling and ensuring no overlapping play/pause calls
    function playVideo(video) {
      if (video) {
        video.pause(); // Make sure to stop it first in case it's playing

        try {
          // Play the video
          video.play();
        } catch (error) {
          console.error('Error attempting to play video:', error);
        }
      }
    }

    // Function to pause all videos and ensure all videos are paused before continuing
    async function pauseAllVideos() {
      let promises = Array.from(sliderVideos).map((video) => {
        return new Promise((resolve) => {
          video.pause();
          video.currentTime = 0; // Optional: reset video to the beginning
          resolve();
        });
      });

      // Await for all videos to be paused before continuing
      await Promise.all(promises);
    }

    // Function to play the next video in the slider
    function playNextVideo(currentIndex) {
      let nextIndex = (currentIndex + 1) % sliderVideos.length; // Calculate the next index
      tabSliderSection.querySelector(`[slide-to="${nextIndex + 1}"]`).click();
      playVideo(sliderVideos[nextIndex]); // Play the next video
    }

    // Add event listeners to each video element for the 'ended' event
    sliderVideos.forEach((video, index) => {
      video.addEventListener('ended', () => {
        playNextVideo(index); // Play the next video when the current one ends
      });
    });
  })();
  //
  (() => {
    if (!document.querySelector('.section-fr-videos')) return;
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section-fr-videos',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.25,
      },
    });
    tl.to('.fr-videos-content_img._01', { duration: 1, x: '-4.375rem', y: '-2.8125rem' }).to(
      '.fr-videos-content_img._02',
      { duration: 1, x: '4.375rem' },
      '<'
    );
  })();
  //  Block Animations
  (() => {
    //
    gsap.from('[jump-start-block] [jump-start-block01]', {
      duration: 1,
      x: '2rem',
      scrollTrigger: '[jump-start-block]',
    });
    gsap.from('[jump-start-block] [jump-start-block02]', {
      duration: 1,
      x: '-2rem',
      scrollTrigger: '[jump-start-block]',
    });
    //
    gsap.from('[supply-portal-block] [left-side-image]', {
      duration: 1,
      x: '100%',
      ease: 'power1.out',
      scrollTrigger: '[supply-portal-block]',
    });
    gsap.from('[supply-portal-block] [right-side-image]', {
      duration: 1,
      x: '-100%',
      ease: 'power1.out',
      scrollTrigger: '[supply-portal-block]',
    });
    //
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
    if (window.innerWidth > 767) {
      gsap.fromTo(
        '.section-fr-tracker .graph-items-list',
        { y: '40%', rotate: '-16deg' },
        {
          duration: 1,
          y: '-45%',
          rotate: '16deg',
          scrollTrigger: {
            trigger: '.section-fr-tracker .graph-items-list',
            start: 'top bottom',
            end: 'bottom center',
            scrub: 1.25,
          },
        }
      );
    }
  })();
  //
  (() => {
    if (!document.querySelector('[show-letter-modal]')) return;
    document.querySelectorAll('[show-letter-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelector('[letter-modal]').classList.add('show');
      });
    });
    document.querySelector('[hide-letter-modal]').addEventListener('click', () => {
      document.querySelector('[letter-modal]').classList.remove('show');
    });
  })();
  //
  (() => {
    if (document.querySelector('[hero-video-play-btn]')) {
      let tl = gsap.timeline({ scrollTrigger: '[hero-video-play-btn]' });
      tl.from('[hero-video-play-btn]', { duration: 0.6, width: '3rem', ease: 'power4.Out' }).from(
        '[hero-video-play-btn] .hero-video-btn-text',
        { display: 'none', opacity: 0, duration: 0.35, ease: 'power4.Out' }
      );
    }
    if (document.querySelector('.video-style-button')) {
      document.querySelectorAll('.video-style-button').forEach((btn) => {
        let tl = gsap.timeline({ scrollTrigger: btn });
        tl.from(btn, {
          delay: 0.5,
          duration: 0.6,
          width: '4.0625rem',
          ease: 'power4.Out',
        }).from(btn.querySelector('.video-style-button-text'), {
          display: 'none',
          opacity: 0,
          duration: 0.35,
          ease: 'power4.Out',
        });
      });
    }
  })();
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
  setTimeout(() => {
    if (!document.querySelector('.section-fr-unlock')) return;
    let mySplitText = new SplitText('[split-text]', { type: 'words,chars' });
    gsap.to(mySplitText.words, {
      color: '#1a2b49',
      stagger: 0.05,
      scrollTrigger: {
        trigger: '.unlock-heading-track',
        start: 'top 80%',
        bottom: 'bottom bottom',
        scrub: 1,
      },
    });
    gsap.from('.unlock-huge-header', {
      scale: 2,
      scrollTrigger: {
        trigger: '.unlock-heading-track',
        start: 'top 80%',
        bottom: 'bottom bottom',
        scrub: 1,
      },
    });
  }, 1500);
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
    document.querySelectorAll('[anim-section-clipPath-into-view-desktop]').forEach((section) => {
      gsap.to(section, {
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: section.getAttribute('start-at') ? section.getAttribute('start-at') : 'top top',
          //   end: section.getAttribute('end-at') ? section.getAttribute('end-at') : 'bottom bottom',
          scrub: 1.5,
        },
        clipPath: window.innerWidth > 991 ? 'inset(1.25rem round 3rem)' : 'inset(0rem round 0rem)',
      });
    });
  })();
  //
  (() => {
    if (!document.querySelector('.experience-cards')) return;
    gsap.utils.toArray('.experience-cards .experience-card').forEach((card) => {
      gsap.from(card, {
        y: window.innerWidth > 767 ? '20rem' : '4rem',
        scale: 0.75,
        opacity: 0,
        duration: 1.5,
        ease: 'ease',
        scrollTrigger: {
          trigger: card,
          start: window.innerWidth > 767 ? '-30rem bottom' : '-7rem bottom',
        },
      });
    });
  })();

  //
  (() => {
    let feedbackTrackerComponent = document.querySelector('[section-fr-feedback-form]');
    if (!feedbackTrackerComponent) return;
    let feedbackFormBtn = feedbackTrackerComponent.querySelector('[feedback-btn]');
    let feedbackFormCloseBtns = feedbackTrackerComponent.querySelectorAll('[feedback-form-btn]');
    let feedbackFormWrapper = feedbackTrackerComponent.querySelector('[feedback-form-wrapper]');
    feedbackFormBtn.addEventListener('click', () => {
      gsap.to(feedbackFormWrapper, { scale: 1, opacity: 1, ease: 'power4.out' });
      // gsap.to(feedbackFormBtn, { scale: 0, opacity: 0, ease: 'power4.out' });
      feedbackTrackerComponent.classList.add('is-dark');
      gsap.to('.team-text-screens-wrap', { x: '-10%', ease: 'power4.out' });
    });
    feedbackFormCloseBtns.forEach((btn) => {
      btn.addEventListener('click', closeForm);
    });
    // Close FOrm
    function closeForm() {
      gsap.to(feedbackFormWrapper, { scale: 0, opacity: 0, ease: 'power4.out' });
      // gsap.to(feedbackFormBtn, { scale: 1, opacity: 1, ease: 'power4.out' });
      feedbackTrackerComponent.classList.remove('is-dark');
      gsap.to('.team-text-screens-wrap', { x: '0%', ease: 'power4.out' });
    }
    //
    let form = feedbackTrackerComponent.querySelector('[get-access-form]');
    form.querySelector('#submit-btn').addEventListener('click', () => {
      gsap.to(form, { y: '-100%', ease: 'power4.out', duration: 0.7 });
      gsap.to(form.closest('[feedback-form-wrapper]').querySelector('.form-success'), {
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
    });
    // Reload Form after submission
    form.addEventListener('submit', () => {
      setTimeout(() => {
        closeForm();
        form.reset();
      }, 2000);
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
  (() => {
    // Download assets //
    function DownloadFile(fileName, fileUrl) {
      // Create XMLHttpRequest.
      var req = new XMLHttpRequest();
      req.open('GET', fileUrl, true);
      req.responseType = 'blob';

      req.onload = function () {
        // Convert the Byte Data to a Blob object.
        var blob = new Blob([req.response], { type: 'application/octet-stream' });

        // Check browser type to handle IE separately.
        var isIE = false || !!document.documentMode;
        if (isIE) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          // For non-IE browsers.
          var url = window.URL || window.webkitURL;
          var link = url.createObjectURL(blob);
          var a = document.createElement('a');
          a.setAttribute('download', fileName);
          a.setAttribute('href', link);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      };

      req.send();
    }

    // Handle download-asset clicks dynamically
    document.querySelectorAll('[download-asset]').forEach((button) => {
      button.addEventListener('click', function () {
        let assetUrl = this.getAttribute('download-asset');
        let fileName = assetUrl.split('/').pop(); // Extract file name from URL
        DownloadFile(fileName, assetUrl); // Call download function
      });
    });

    // Download PDF according to Language
    let pdfLinks = {
      en: 'https://cdn.prod.website-files.com/63bd3a43429a8b2425999aec/67043c48d27af9576d205dac_unlocked-fall-24-getyourguide-en.pdf',
      es: 'https://cdn.prod.website-files.com/63bd3a43429a8b2425999aec/67043c485445de53f69fb111_unlocked-fall-24-getyourguide-es.pdf',
      de: 'https://cdn.prod.website-files.com/63bd3a43429a8b2425999aec/67043c4859e6afbd0bbcedc1_unlocked-fall-24-getyourguide-de.pdf',
      fr: 'https://cdn.prod.website-files.com/63bd3a43429a8b2425999aec/67043c48babea820b3eebb3d_unlocked-fall-24-getyourguide-fr.pdf',
      it: 'https://cdn.prod.website-files.com/63bd3a43429a8b2425999aec/67043c48686759f9ae07e79d_unlocked-fall-24-getyourguide-it.pdf',
      br: 'https://cdn.prod.website-files.com/63bd3a43429a8b2425999aec/6704f8384f8fa7ca366e44ba_unlocked-fall-24-getyourguide-es.pdf',
    };

    document.querySelectorAll('[download-pdf]').forEach((button) => {
      button.addEventListener('click', function () {
        let currentLanguage = document.documentElement.lang || 'en';
        let pdfLink = pdfLinks[currentLanguage] || pdfLinks['en'];
        let fileName = pdfLink.split('/').pop();
        DownloadFile(fileName, pdfLink);
      });
    });
  })();
  //
  (() => {
    // Share buttons
    document.querySelectorAll('[share-to]').forEach((button) => {
      button.addEventListener('click', function () {
        const platform = this.getAttribute('share-to').toLowerCase();
        const shareLink = this.getAttribute('share-link');

        if (!shareLink) return; // Exit if no share link is provided

        let url = '';
        switch (platform) {
          case 'linkedin':
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
            break;
          case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
            break;
          case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(shareLink)}`;
            break;
          case 'email':
            url = `mailto:?subject=Check this out&body=${encodeURIComponent(shareLink)}`;
            break;
          default:
            return; // If an unsupported platform is used
        }

        window.open(url, '_blank');
      });
    });
  })();
}

function anchorNavigation() {
  let anchorNavigationBlock = document.querySelector('.features-navigation');
  if (!anchorNavigationBlock) return;

  // Cache the selector to avoid multiple DOM queries
  const navWrapper = document.querySelector('.features-navigation-wrapper');

  // GSAP animation when scrolling into '.section-fr-experience'
  gsap.fromTo(
    navWrapper,
    { opacity: 0, x: -40, pointerEvents: 'none' }, // Initial state
    {
      duration: 0.75,
      opacity: 1,
      x: 0,
      pointerEvents: 'auto',
      scrollTrigger: {
        trigger: '.section-fr-experience',
        start: 'top 1%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // GSAP animation to hide navWrapper when '.sr-footer' comes into view
  ScrollTrigger.create({
    trigger: '.sr-footer',
    start: 'top bottom', // When the top of .sr-footer hits the bottom of the viewport
    onEnter: () => {
      gsap.to(navWrapper, {
        opacity: 0,
        x: -40,
        pointerEvents: 'none',
        duration: 0.75,
      });
    },
    onLeaveBack: () => {
      // Optionally, you can reverse the animation if scrolling back up
      gsap.to(navWrapper, {
        opacity: 1,
        x: 0,
        pointerEvents: 'auto',
        duration: 0.75,
      });
    },
  });

  let anchorSections = document.querySelectorAll('[anchor-navigation-title]');
  let featureAnchorTexts = [];
  anchorSections.forEach((item, index) => {
    let featureAnchorText = item.getAttribute('anchor-navigation-title');
    featureAnchorTexts.push(featureAnchorText);
    item.setAttribute('feature_ID', `anchor_${index}`);

    window.addEventListener('scroll', () => {
      let anchorID = item.getAttribute('feature_ID');
      let rect2 = item.getBoundingClientRect();
      let offsetTop = rect2.top + window.pageYOffset;
      let topDifference = offsetTop - window.scrollY;
      if ((topDifference < 500) & (topDifference > 0)) {
        document.querySelectorAll('[anchor_ID]').forEach((ele) => ele.classList.remove('active'));
        document.querySelector(`[anchor_ID="${anchorID}"]`).classList.add('active');
      }
    });
  });

  anchorNavigationBlock.innerHTML = '';
  featureAnchorTexts.forEach((text, index) => {
    let anchorBlock = document.createElement('div');
    let anchorDot = document.createElement('div');
    let anchorText = document.createElement('div');
    anchorBlock.classList.add('features-anchor');
    anchorDot.classList.add('features-navigation-dot');
    anchorText.classList.add('features-anchor-title');
    anchorText.innerHTML = text;

    anchorNavigationBlock.appendChild(anchorBlock);
    anchorBlock.appendChild(anchorDot);
    anchorBlock.appendChild(anchorText);
    anchorBlock.setAttribute('anchor_ID', `anchor_${index}`);
  });

  let tl = gsap.timeline({ paused: true });
  tl.to('.features-anchor-title', {
    duration: 0.35,
    width: 'auto',
    marginLeft: '0.3125rem',
    ease: 'power2.inOut',
  }).to('.features-anchor-title', { duration: 0.45, opacity: 1, ease: 'power2.inOut' }, '-=0.15');
  anchorNavigationBlock.addEventListener('mouseenter', () => {
    tl.play();
  });

  anchorNavigationBlock.addEventListener('mouseleave', () => {
    tl.reverse();
  });

  let featuresAnchors = document.querySelectorAll('[anchor_ID]');
  featuresAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      let anchor_ID = anchor.getAttribute('anchor_ID');
      let anchorTargetSection = document.querySelector(`[feature_ID="${anchor_ID}"]`);
      let rect = anchorTargetSection.getBoundingClientRect();
      let offsetTop = rect.top + window.pageYOffset;
      let topDifference = anchorTargetSection.tagName === 'SECTION' ? 0 : 90;
      lenis.scrollTo(offsetTop - topDifference, { duration: 1 });
    });
  });
}
//
function handleVideos() {
  let videosOuterWrappers = document.querySelectorAll('[video-wrapper]');

  const createIntersectionObserver = (video) => {
    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause(); // Pause the video if it's playing and is out of view
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 25% of the video is visible
      }
    );

    observer.observe(video); // Observe the video element
  };

  videosOuterWrappers.forEach((wrapper) => {
    let togglePlayVideoBtns = wrapper.querySelectorAll('[toggle-play-video]');
    let toggleCloseVideoBtns = wrapper.querySelectorAll('[toggle-close-video]');
    let videoWrapper = wrapper.querySelector('[styled-video-player-wrapper]');
    let video = videoWrapper.querySelector('video');

    // Create an intersection observer for each video
    createIntersectionObserver(video);

    toggleCloseVideoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        video.pause();
        if (
          !btn.hasAttribute('hero-video-play-btn') &&
          window.innerWidth < 767 &&
          videoWrapper.closest('.video-element-wrapper')
        ) {
          gsap.to(videoWrapper, {
            duration: 0.35,
            opacity: 0,
            pointerEvents: 'none',
            height: '0',
            marginTop: '0',
            onComplete: () => {
              gsap.to(videoWrapper, { zIndex: '-1' });
            },
          });
        } else {
          gsap.to(videoWrapper, {
            duration: 0.35,
            opacity: 0,
            pointerEvents: 'none',
            onComplete: () => {
              gsap.to(videoWrapper, { zIndex: '-1' });
            },
          });
        }
      });
    });

    togglePlayVideoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        video.play();
        lenis.scrollTo(videoWrapper, {
          offset: window.innerWidth > 767 ? -20 : -200,
        });
        if (
          !btn.hasAttribute('hero-video-play-btn') &&
          window.innerWidth < 767 &&
          videoWrapper.closest('.video-element-wrapper')
        ) {
          gsap.to(videoWrapper, {
            duration: 0.35,
            opacity: 1,
            pointerEvents: 'auto',
            zIndex: '100',
            height: 'auto',
            marginTop: '-7rem',
          });
        } else {
          gsap.to(videoWrapper, {
            duration: 0.35,
            opacity: 1,
            pointerEvents: 'auto',
            zIndex: '100',
          });
        }
      });
    });
  });
}

//
// Handle Thumbnail Video
function handleFeatureThubnailVideos() {
  let featureThumbnailVideos = document.querySelectorAll('[feature-thumbnail-video] video');
  featureThumbnailVideos.forEach((video) => {
    gsap.to(video, {
      duration: 1,
      scrollTrigger: {
        trigger: video,
        start: 'top 70%',
      },
      onStart: () => {
        video.play();
      },
    });

    let pauseBtn = video.closest('[feature-thumbnail-video]').querySelector('[pause-btn]');
    let pauseIcon = pauseBtn.querySelector('[pause-icon]');
    let playIcon = pauseBtn.querySelector('[play-icon]');
    video.addEventListener('ended', () => {
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'block';
    });
    video.addEventListener('playing', () => {
      pauseIcon.style.display = 'block';
      playIcon.style.display = 'none';
    });
    video.addEventListener('pause', () => {
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'block';
    });
  });

  let videoPauseBtns = document.querySelectorAll('[feature-thumbnail-video] [pause-btn]');

  videoPauseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let video = btn.closest('[feature-thumbnail-video]').querySelector('video');
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
}

function handlePopups() {
  let popupSections = document.querySelectorAll('[popup-section]');
  if (popupSections.length === 0) return;
  popupSections.forEach((popupSection) => {
    let openPopupBtns = popupSection.querySelectorAll('[open-popup]');
    let closePopupBtns = popupSection.querySelectorAll('[close-popup]');
    let popup = popupSection.querySelector('[popup]');
    let openVideoPopup = (popup) => {
      return gsap.to(popup, { duration: 0.5, ease: 'ease', opacity: 1, pointerEvents: 'auto' });
    };
    let closeVideoPopup = (popup) => {
      return gsap.to(popup, { duration: 0.5, ease: 'ease', opacity: 0, pointerEvents: 'none' });
    };
    closePopupBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        lenis.start();
        closeVideoPopup(popup);
      });
    });
    openPopupBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        lenis.stop();
        openVideoPopup(popup);
        e.preventDefault();
      });
    });
  });
}

function handleSlider() {
  if (document.querySelector('[tab-video-slider]')) {
    var mySwiper = new Swiper('[tab-video-slider]', {
      direction: 'vertical',
      effect: 'slide',
      slidesPerView: 'auto',
      spaceBetween: 0,
      loop: false,
      speed: 1000,
      on: {
        init: function () {
          let activeSlideIndex = this.activeIndex + 1;
          activateButtons(activeSlideIndex);
        },
        slideChange: function () {
          let activeSlideIndex = this.activeIndex + 1;
          activateButtons(activeSlideIndex);
        },
      },
    });

    function activateButtons(slideIndex) {
      document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('slide-to') === slideIndex) {
          btn.classList.add('active');
        }
      });
    }

    document.querySelectorAll('.tab-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        let slideIndex = this.getAttribute('slide-to');
        mySwiper.slideTo(slideIndex - 1);
        activateButtons(slideIndex);
      });
    });
  }
  if (document.querySelector('[stories-slider]')) {
    var swiper = new Swiper('[stories-slider]', {
      navigation: {
        nextEl: '[stories-slider] [slider-next-btn]',
        prevEl: '[stories-slider] [slider-prev-btn]',
      },
      slidesPerView: 1,
      spaceBetween: 10,
      on: {
        init: function () {
          updateSlideInfo(this);
          updateNextSlideHeading(this); // Update next slide heading on init
        },
        slideChange: function () {
          updateSlideInfo(this);
          updateNextSlideHeading(this); // Update next slide heading on slide change
        },
      },
    });

    // Function to update the slide information with leading zeros
    function updateSlideInfo(swiper) {
      const currentSlide = swiper.realIndex + 1;
      document.querySelector('[stories-slider] [current-slide]').textContent =
        currentSlide < 10 ? `0${currentSlide}` : currentSlide;

      const totalSlides = swiper.slides.length;
      document.querySelector('[stories-slider] [total-slides]').textContent =
        totalSlides < 10 ? `0${totalSlides}` : totalSlides;
    }

    // Function to update the next slide heading
    function updateNextSlideHeading(swiper) {
      let nextSlideIndex = swiper.realIndex + 1;

      // If there's no next slide, loop back to the first slide
      if (nextSlideIndex >= swiper.slides.length) {
        nextSlideIndex = 0;
      }

      // Get the heading of the next slide
      const nextSlide = swiper.slides[nextSlideIndex];
      const nextSlideHeading = nextSlide.querySelector('[slide-heading]');

      // If a heading exists, update the content
      if (nextSlideHeading) {
        document.querySelector('[stories-slider] [next-slide-heading]').textContent =
          nextSlideHeading.textContent;
      }
    }
  }
}
// Footer Animation
function FooterScroll() {
  let footer2row = document.querySelector('[footer-row-2]');
  if (footer2row && window.innerWidth > 991) {
    let FooterScroll = gsap.fromTo(
      footer2row,
      { y: '-100%' },
      {
        y: '0%',
        ease: 'linear',
      }
    );
    ScrollTrigger.create({
      trigger: '[footer-row-2]',
      start: `70% ${window.innerHeight - footer2row.scrollHeight + 700}`,
      end: `0% ${window.innerHeight - footer2row.scrollHeight - footer2row.scrollHeight}`,
      animation: FooterScroll,
      scrub: 2,
    });
  }
}
function handleWeglot() {
  //   Lang Toggle
  (() => {
    let langToggles = document.querySelectorAll('.lang-toggle');
    if (langToggles.length < 1) return;
    langToggles.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        let langDropdown = btn.closest('.lang-dropdown');
        event.stopPropagation(); // Prevent the click from bubbling to the document
        langDropdown.classList.toggle('open');

        document.addEventListener('click', (event) => {
          if (!langDropdown.contains(event.target) && !event.target.closest('[slide-to]')) {
            langDropdown.classList.remove('open'); // Close if clicked outside
          }
        });
      });
    });
  })();
  // init Weglot
  Weglot.initialize({
    api_key: 'wg_bb2924345b48f25dde987ebf8015b20a4',
  });

  document.querySelectorAll('.lang-dropdown [lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      let lang = btn.getAttribute('lang');
      document.querySelectorAll('[lang-text]').forEach((text) => (text.innerHTML = lang));
      Weglot.switchTo(lang);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  });

  Weglot.on('languageChanged', function (newLang, prevLang) {
    document.querySelectorAll('[lang-text]').forEach((text) => (text.innerHTML = newLang));
    document.querySelectorAll('[form-success-pdf-link]').forEach((link) => {
      link.setAttribute(
        'href',
        link
          .closest('[get-access-form-wrapper]')
          .querySelector('form')
          .getAttribute(`data-pdf-${newLang}`)
      );
    });
  });
  Weglot.on('initialized', () => {
    let currentLanguage = Weglot.getCurrentLang();
    document.querySelectorAll('[data-wg-lang-element]').forEach((ele) => {
      if (ele.getAttribute('data-wg-lang-element') !== currentLanguage) {
        ele.remove();
      }
    });
  });
}
function handleConfetti() {
  let button = document.querySelector('#submit-btn');
  let formBlock = document.querySelector('[get-access-form]');

  function onClick() {
    const rect = formBlock.getBoundingClientRect();
    confetti({
      particleCount: 150,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth, // horizontal center of the block
        y: (rect.top + rect.height / 2) / window.innerHeight, // vertical center of the block
      },
    });
  }
  button.addEventListener('click', onClick);
}
