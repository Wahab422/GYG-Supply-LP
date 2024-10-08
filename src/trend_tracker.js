import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
// Register the Plugins;
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText, Flip);
gsap.config({
  nullTargetWarn: false,
});
gsap.defaults({
  ease: 'cubic-bezier(.22,.6,.36,1)',
});

let lenis;
let screenHeight = window.innerHeight;
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

  document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      let targetSection = btn.getAttribute('data-scroll-to');
      lenis.scrollTo(targetSection);
    });
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
          duration: element.getAttribute('data-duration') || 1.5,
          y: '0rem',
          opacity: 1,
          stagger: {
            from: element.getAttribute('stagger-from') || 'start',
            each: element.getAttribute('stagger-amount') || 0.15,
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
    delay = delay || 0.15;
    duration = duration || 1.5;
    y = y || '2rem';
    gsap.fromTo(
      element,
      { y: y, opacity: 0 },
      {
        duration: duration,
        y: '0%',
        opacity: 1,
        ease: easing,
        scrollTrigger: {
          trigger: element,
          start: element.getAttribute('scrollTrigger-start') || 'top 95%',
          markers: element.getAttribute('anim-markers') || false,
        },
        delay: delay,
      }
    );
  }
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
  html.classList.add('ready');
  handleScroll();
  handleWeglot();
  handleCode();
  handleRegularAnimation();
  handleConfetti();
}
document.addEventListener('DOMContentLoaded', init);

function handleWeglot() {
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

function handleCode() {
  // Function to animate the counter
  function animateCounter(textElement, currentValue, newValue) {
    gsap.to(
      { value: currentValue },
      {
        value: newValue,
        duration: 1,
        ease: 'power2.out',
        onUpdate: function () {
          textElement.textContent = Math.round(this.targets()[0].value);
        },
      }
    );
  }
  // Function to draw SVG paths
  function drawSVGPaths(svgElement, duration = 2, staggerTime = 0.25, easeType = 'power2.inOut') {
    const paths = svgElement.querySelectorAll('path[anim-path]');
    const delay = svgElement.getAttribute('data-delay')
      ? parseFloat(svgElement.getAttribute('data-delay'))
      : 0;

    gsap.fromTo(
      paths,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        duration: duration,
        stagger: staggerTime,
        ease: easeType,
        scrollTrigger: {
          trigger: svgElement,
        },
        delay: delay,
      }
    );
  }
  //
  (() => {
    document.querySelectorAll('[anim-svg-path]').forEach((svg) => {
      drawSVGPaths(svg);
    });
  })();
  //
  (() => {
    if (!document.querySelector('.takeways-item')) return;
    document.querySelectorAll('.takeways-item').forEach((item) => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: '80% 80%',
            scrub: 1.25,
          },
        });
        tl.from(item, { width: '70%', duration: 1 }).from(
          item.querySelectorAll('[anim-child]'),
          {
            delay: 0.25,
            opacity: 0,
            y: '2rem',
            stagger: 0.1,
          },
          '-=0.2'
        );
      } else {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: item.querySelector('.takeways-item_img-block'),
            start: 'bottom bottom',
          },
        });
        tl.from(item.querySelector('.takeways-item_text-block'), {
          y: '-100%',
          duration: 0.7,
          ease: 'power1.out',
        }).from(
          item.querySelectorAll('[anim-child]'),
          {
            opacity: 0,
            y: '2rem',
            stagger: 0.1,
            ease: 'power1.out',
          },
          '-=0.4'
        );
      }
    });
  })();
  //
  (() => {
    if (!document.querySelector('[activities-tab]')) return;
    // Initial values
    let explorersValue = 0;
    let travelersValue = 0;

    //
    let activityBtns = document.querySelectorAll('[activities-tab] [activity-tab-btn]');
    let explorersValueText = document.querySelector('[activities-tab] #explorers-value');
    let travelersValueText = document.querySelector('[activities-tab] #travelers-value');

    // Add event listeners to all buttons
    activityBtns.forEach((button) => {
      button.addEventListener('click', () => {
        activityBtns.forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
        // Get new target explorers and travelers values from button attributes
        const newExplorersValue = parseInt(button.getAttribute('data-explorers-value'), 10);
        const newTravelersValue = parseInt(button.getAttribute('data-travelers-value'), 10);

        // Animate the explorers count to the new target value
        animateCounter(explorersValueText, explorersValue, newExplorersValue);
        explorersValue = newExplorersValue; // Update the explorers value to the new target

        // Animate the travelers count to the new target value
        animateCounter(travelersValueText, travelersValue, newTravelersValue);
        travelersValue = newTravelersValue; // Update the travelers value to the new target
      });
    });
  })();
  //
  //
  setTimeout(() => {
    if (!document.querySelector('[section-tt-explorer]')) return;
    let mySplitText = new SplitText('[split-text]', { type: 'words,chars' });
    let tl = gsap.timeline({
      ease: 'ease',
      scrollTrigger: {
        trigger: '[section-tt-explorer]',
        start: 'top 30%',
        end: 'bottom bottom',
        scrub: 1.24,
      },
    });
    tl.from('.section-tt-explorer_block1 [anim-child]', {
      opacity: 0,
      y: '2rem',
      stagger: 0.25,
    })
      .to(mySplitText.words, { color: '#1a2b49', stagger: 0.05 })
      .to('.section-tt-explorer_block1 [anim-child]', {
        opacity: 0,
        y: -screenHeight / 3,
        stagger: 0.05,
        scale: 0.5,
      })
      .from('.section-tt-explorer_block2', { y: '40%' }, '-=0.5')
      .from('.section-tt-explorer_block2 [anim-child]', { opacity: 0, scale: 0.5 }, '<')
      .to('.section-tt-explorer_block2 [anim-child]', { opacity: 0.16 })
      .to('[section-tt-explorer] .tt-explorer_circles-wrapper', {
        xPercent: window.innerWidth > 767 ? -100 : 0,
        yPercent: window.innerWidth > 767 ? 0 : -110,
        duration: window.innerWidth > 767 ? 1 : 1.5,
      });

    //
    gsap.from('[section-tt-explorer] .tt-explorer_circles-wrapper .tt-explorer_circle', {
      ease: 'ease',
      scale: window.innerWidth > 767 ? 0.5 : 0.75,
      stagger: 0.25,
      scrollTrigger: {
        trigger: '[section-tt-explorer]',
        start: '72% bottom',
        end: 'bottom bottom',
        scrub: 1.24,
      },
    });
  }, 1500);
  //   Count Up Animation
  (() => {
    // Function to animate the counter
    function animateCounter(target, startValue, endValue, delay) {
      ScrollTrigger.create({
        trigger: target, // Trigger when the target scrolls into view
        start: 'top 80%', // Start when the top of the element is at 80% of the viewport
        onEnter: () => {
          gsap.to(
            { count: startValue },
            {
              count: endValue,
              delay: delay ? parseFloat(delay) : 0, // Handle delay, convert to number if it exists
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                target.innerText = Math.round(this.targets()[0].count); // Update the displayed number
              },
            }
          );
        },
        once: true, // Trigger only once
      });
    }

    // Select all elements with the [anim-count-up] attribute
    document.querySelectorAll('[anim-count-up]').forEach((element) => {
      let endValue = parseInt(element.innerHTML, 10); // Get the end value from the content
      let delay = element.getAttribute('data-delay'); // Get delay from the attribute if any
      element.innerHTML = '0'; // Initialize with 0
      animateCounter(element, 0, endValue, delay); // Call the animation function
    });
  })();
  //
  (() => {
    if (!document.querySelector('[scale-up-anim]')) return;
    document.querySelectorAll('[scale-up-anim]').forEach((ele) => {
      gsap.fromTo(
        ele,
        { scale: 0 },
        {
          scrollTrigger: ele,
          scale: 1,
          duration: 1,
          delay: ele.getAttribute('data-delay') ? ele.getAttribute('data-delay') : 0,
        }
      );
    });
  })();
  //
  (() => {
    let chartsSection = document.querySelector('[section-tt-charts]');
    if (!chartsSection) return;
    if (window.innerWidth > 767) {
      chartsSection
        .querySelectorAll('[charts-anim-svg-path].for-mobile')
        .forEach((ele) => ele.remove());
    } else {
      chartsSection
        .querySelectorAll('[charts-anim-svg-path].for-desktop')
        .forEach((ele) => ele.remove());
    }
    // Set all the Paths to 0%
    document
      .querySelectorAll('[tt-charts_content-track] [charts-anim-element] path[anim-path]')
      .forEach((path) => {
        gsap.set(path, { drawSVG: '0%' });
      });
    gsap.set('[section-tt-charts] [charts-anim-element]', { opacity: 0, y: '2rem' });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[tt-charts_content-track]',
        start: 'top 30%',
        end: 'bottom bottom',
        scrub: 1.24,
      },
    });
    tl.to('[tt-charts_content="1"] [charts-anim-element]', {
      opacity: 1,
      y: '0rem',
      stagger: 0.15,
    })
      .to('[tt-charts_content="1"] [charts-anim-svg-path] path[anim-path]', {
        drawSVG: '100%',
        duration: 1,
      })
      .from('[tt-charts_content="1"] [label-element]', { opacity: 0, duration: 0.2 })
      .to('[tt-charts_content="1"] [charts-anim-element]', {
        delay: 1,
        opacity: 0,
        y: '-2rem',
        stagger: 0.15,
      })
      .to('[tt-charts_content="2"] [charts-anim-element]', {
        opacity: 1,
        y: '0rem',
        stagger: 0.15,
      })
      .to('[tt-charts_content="2"] [charts-anim-svg-path] path[anim-path]', {
        drawSVG: '100%',
        duration: 1,
      })
      .to('[tt-charts_content="2"] [charts-anim-element]', {
        delay: 1,
        opacity: 0,
        y: '-2rem',
        stagger: 0.15,
      })
      .to('[tt-charts_content="3"] [charts-anim-element]', {
        opacity: 1,
        y: '0rem',
        stagger: 0.15,
      })

      .to('nothing', { delay: 1, opacity: 0 });
    gsap.from('[tt-charts_content="3"] .graph-element-wrapper', {
      height: '0rem',
      duration: 1.55,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '[tt-charts_content-track]',
        start: '80% bottom',
      },
      onStart: () => {
        document.querySelectorAll('[count-up-element]').forEach((element) => {
          let endValue = parseInt(element.innerHTML, 10);
          let delay = element.getAttribute('data-delay');
          element.innerHTML = '0';
          animateCounter(element, 0, endValue, delay);
        });
      },
    });
  })();
  //
  (() => {
    let influenceTab = document.querySelector('[infulence-tabs-component]');
    if (!influenceTab) return;
    let tabBtns = influenceTab.querySelectorAll('[influence-btn]');
    let maxBarWidth = parseInt(influenceTab.getAttribute('max-bar-width'), 10);
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((btn) => btn.classList.remove('selected'));
        btn.classList.add('selected');
        let btnID = btn.getAttribute('id');
        let tabsBarsWrapper = influenceTab.querySelectorAll(`[data-${btnID}]`);
        influenceTab
          .querySelectorAll('[bar-label]')
          .forEach((label) => label.classList.add('hide'));
        document
          .querySelectorAll(`[text-${btnID}]`)
          .forEach((label) => label.classList.remove('hide'));
        tabsBarsWrapper.forEach((barWrapper) => {
          let barPercentage = parseInt(barWrapper.getAttribute(`data-${btnID}`));
          let barWidth = (barPercentage / maxBarWidth) * 100;
          let bar = barWrapper.querySelector('.influence-bar');
          gsap.to(bar, { width: barWidth + '%', duration: 1, ease: 'ease' });
          let barPercentageText = barWrapper.querySelector('.bar-percentage-text');
          animateCounter(barPercentageText, barPercentageText.innerHTML, barPercentage);
        });
      });
    });

    // Click on the Default Button
    gsap.to('nothing', {
      scrollTrigger: { trigger: '[infulence-tabs-component]', start: 'top bottom' },
      onStart: () => {
        influenceTab.querySelector('[influence-btn].selected').click();
      },
    });
  })();
  //   Animate Cards Scroll Into View
  (() => {
    if (!document.querySelector('[cards-blocks]')) return;
    gsap.utils.toArray('[cards-blocks] .card-block').forEach((card) => {
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
  //   section-globe-cards
  (() => {
    if (!document.querySelector('[section-globe-cards]')) return;
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[section-globe-cards]',
        start: 'top 50%',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });
    tl.from('[section-globe-cards_heading]', { scale: 0.5, ease: 'ease' })
      .from('.globe-wrapper', { opacity: 0 }, '<')
      .from(
        '[globe-cards-wrapper] ._03',
        { y: screenHeight / 1.25, ease: 'ease', rotate: '0deg' },
        '<'
      )
      .from('[globe-cards-wrapper] ._02', { y: screenHeight / 1.25, ease: 'ease', rotate: '0deg' })
      .from('[globe-cards-wrapper] ._01', { y: screenHeight / 1.25, ease: 'ease', rotate: '0deg' });
  })();
  //

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
  setTimeout(() => {
    let form = document.querySelector('[get-access-form]');
    if (!form) return;
    form.querySelector('#submit-btn').addEventListener('click', () => {
      gsap.to(form, { y: '-100%', ease: 'power4.out', duration: 0.7 });
      gsap.to(form.closest('.steps-form-block').querySelector('.form-success'), {
        y: '0%',
        duration: 0.7,
        ease: 'power4.out',
      });
    });

    // Placeholder text animation
    const inputField = form.querySelector('[type-effect-anim-field]');
    const placeholderText = form.querySelector('#input-placeholder-text-anim').innerHTML;
    inputField.setAttribute('placeholder', '');

    // Typewriter effect function with blinking caret
    function typeEffect(element, text, delay = 50) {
      let index = 0;
      let caretVisible = true;
      let caretInterval;

      function type() {
        if (index < text.length) {
          element.placeholder = text.substring(0, index) + (caretVisible ? '|' : ''); // Add caret
          index++;
          setTimeout(type, delay);
        } else {
          blinkCaret(); // Start caret blinking after typing is complete
        }
      }

      // Blinking caret function
      function blinkCaret() {
        caretInterval = setInterval(() => {
          caretVisible = !caretVisible; // Toggle caret visibility
          element.placeholder = text + (caretVisible ? '|' : '');
        }, 500); // Caret blink speed
      }

      type();

      // Stop caret blinking and remove it when the input is focused
      inputField.addEventListener('focus', () => {
        clearInterval(caretInterval); // Stop the caret blinking
        caretVisible = false; // Ensure the caret is hidden
        element.placeholder = text; // Set placeholder text without caret
      });

      inputField.addEventListener('blur', () => {
        caretVisible = true;
        blinkCaret();
      });
    }

    ScrollTrigger.create({
      trigger: inputField,
      start: 'top 80%',
      onEnter: () => {
        typeEffect(inputField, placeholderText);
      },
      once: true,
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
      }, 1500);
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
  }, 1500);

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
          if (!langDropdown.contains(event.target)) {
            langDropdown.classList.remove('open'); // Close if clicked outside
          }
        });
      });
    });
  })();
  //
  document.querySelector('[scrollToTop]').addEventListener('click', () => {
    lenis.scrollTo('top', { duration: 2 });
    if (footer2row && window.innerWidth > 991) {
      setTimeout(() => {
        gsap.set(footer2row, { y: '-100%' });
      }, 1500);
    }
  });
  //
  (() => {
    if (!document.querySelector('[anim-section-clipPath]')) return;
    gsap.to('[anim-section-clipPath]', {
      duration: 1,
      scrollTrigger: {
        trigger: '[anim-section-clipPath]',
        start: 'bottom bottom',
        end: 'bottom 30%',
        scrub: 1.5,
      },
      clipPath:
        window.innerWidth > 767
          ? 'inset(0rem round 0rem 0rem 3rem 4rem)'
          : 'inset(0rem round 0.8rem)',
    });
    document.querySelectorAll('[anim-section-clipPath-into-view]').forEach((section) => {
      gsap.to(section, {
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: section.getAttribute('start-at') ? section.getAttribute('start-at') : 'top top',
          //   end: section.getAttribute('end-at') ? section.getAttribute('end-at') : 'bottom bottom',
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
    if (window.matchMedia('(min-width: 768px)').matches) {
      gsap.from('.sr-footer', {
        yPercent: -100,
        scrollTrigger: {
          trigger: '.sr-footer',
          start: 'top top',
          scrub: true,
        },
      });
      //
      gsap.to('.section-average-traveler', {
        opacity: 0,
        y: '20%',
        scale: 0.85,
        scrollTrigger: {
          trigger: '.section-imgs',
          start: 'top 90%',
          end: 'bottom bottom',
          scrub: 1.25,
        },
      });
      //
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.section-imgs',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.25,
        },
      });

      tl.from('.explorers-img-wrapper._01', { yPercent: 30 })
        .from('.explorers-img-wrapper._02', { xPercent: -36 }, '<')
        .from('.explorers-img-wrapper._03', { xPercent: 32 }, '<')
        .from('.explorers-img-wrapper._04', { yPercent: 30 }, '<')
        .from('.explorers-img-wrapper._05', { xPercent: 35 }, '<')
        .from('.explorers-img-wrapper._06', { yPercent: -65 }, '<');

      // Hero section imgs Animation

      gsap.to('[hero-img_01]', {
        yPercent: -30,
        duration: 25,
        scrollTrigger: {
          trigger: '.section-tt-takeways',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.25,
        },
      });
      gsap.to('[hero-img_02]', {
        yPercent: -80,
        duration: 1,
        scrollTrigger: {
          trigger: '.section-tt-takeways',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.25,
        },
      });
      gsap.to('[hero-img_03]', {
        yPercent: -30,
        duration: 25,
        scrollTrigger: {
          trigger: '.section-tt-takeways',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.25,
        },
      });
      gsap.to('[hero-img_04]', {
        yPercent: -30,
        duration: 1,
        scrollTrigger: {
          trigger: '.section-tt-takeways',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.25,
        },
      });
    }
  })();
  //
  // (() => {
  //   // Get the path and hover label elements
  //   let pathElements = document.querySelectorAll('[path-element="hover"]');
  //   let hoverLabel = document.querySelector('[hover-label]');

  //   // Function to show the hover label at the mouse position
  //   function showLabel(event) {
  //     let x = event.clientX; // Get the X coordinate of the mouse
  //     let y = event.clientY; // Get the Y coordinate of the mouse

  //     // Calculate the width of the hover label (in pixels) and offset it to center on the mouse
  //     let hoverLabelWidth = hoverLabel.offsetWidth; // Get the actual width of the hover label

  //     // Position the hover label, centered above the mouse pointer
  //     hoverLabel.style.left = `${x - 1.35 * hoverLabelWidth}px`; // Center the label horizontally
  //     hoverLabel.style.top = `${y - hoverLabel.offsetHeight}px`; // Place the label above the cursor with an offset

  //     // Show the hover label (using fade-in effect)
  //     hoverLabel.style.opacity = '1';
  //     hoverLabel.style.visibility = 'visible';
  //   }

  //   // Function to hide the hover label with fade-out effect
  //   function hideLabel() {
  //     hoverLabel.style.opacity = '0';
  //     hoverLabel.style.visibility = 'hidden';
  //   }

  //   // Add event listeners for hover on all path elements
  //   pathElements.forEach((pathLine) => {
  //     pathLine.addEventListener('mouseenter', () => {
  //       hoverLabel.style.display = 'block'; // Ensure label is shown on hover
  //     });
  //     pathLine.addEventListener('mousemove', showLabel); // Update label position on mouse move
  //     pathLine.addEventListener('mouseleave', hideLabel); // Hide label when not hovering
  //   });

  //   // Initially hide the hover label
  //   hideLabel();
  // })();
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
