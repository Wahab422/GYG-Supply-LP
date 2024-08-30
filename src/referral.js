import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

function handleAnimation() {
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
  html.classList.add('ready');
  handleScroll();
  handleCode();
  handleAnimation();
  handleSwiper();
}
init();

//
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.querySelector('main').appendChild(script);
  });
}
//
function handleSwiper() {
  if (!document.querySelector('.swiper')) return;
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js')
    .then(() => {
      if (document.querySelector('.swiper.is-testimonial')) {
        new Swiper('.swiper.is-testimonial', {
          slidesPerView: window.innerWidth > 767 ? '1' : 'auto',
          effect: window.innerWidth > 767 ? 'fade' : 'slide',
          spaceBetween: 8,
          grabCursor: true,
          speed: 500,
          navigation: {
            nextEl: '.swiper.is-testimonial [swiper-button-next]',
            prevEl: '.swiper.is-testimonial [swiper-button-prev]',
          },
        });
        document.querySelectorAll('.slider-btn.is-next').forEach((btn) => {
          btn.addEventListener('click', () => {
            document.querySelector('.swiper.is-testimonial [swiper-button-next]').click();
          });
        });
        document.querySelectorAll('.slider-btn.is-prev').forEach((btn) => {
          btn.addEventListener('click', () => {
            document.querySelector('.swiper.is-testimonial [swiper-button-prev]').click();
          });
        });
        document.querySelectorAll('.swiper.is-testimonial .swiper-slide').forEach((slide) => {
          if (slide.querySelector('[slider-slide-label]')) {
            slide.querySelector('[slider-slide-label]').innerHTML =
              slide.getAttribute('aria-label');
          }
        });
      }
      if (document.querySelector('[supplier-slider-wrapper]')) {
        new Swiper('[supplier-slider-wrapper] .swiper', {
          slidesPerView: window.innerWidth > 767 ? 3 : 'auto',
          effect: 'slide',
          spaceBetween: window.innerWidth > 767 ? 32 : 8,
          grabCursor: true,
          speed: 500,
          on: {
            slideChange: function () {
              document.querySelector('[supplier-slider-wrapper] [current-slide]').innerHTML =
                this.activeIndex + 1;
            },
            init: function () {
              document.querySelector('[supplier-slider-wrapper] [total-slides]').innerHTML =
                this.slides.length;
            },
          },
          navigation: {
            nextEl: '[supplier-slider-wrapper] [swiper-button-next]',
            prevEl: '[supplier-slider-wrapper] [swiper-button-prev]',
          },
        });
      }
    })
    .catch((error) => {
      console.error('Error loading Swiper:', error);
    });
}
//
function handleCode() {
  (() => {
    document.querySelectorAll('[scroll-to]').forEach((btn) => {
      if (btn.getAttribute('scroll-to')) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[scroll-to]').forEach((btn) => btn.classList.remove('active'));
          btn.classList.add('active');
          lenis.scrollTo(
            document.querySelector(`[anchor-navigation-title= "${btn.getAttribute('scroll-to')}"]`)
          );
        });
      } else {
        btn.remove();
      }
    });
    //
    // document.querySelectorAll('[anchor-navigation-title]').forEach((item) => {
    //   window.addEventListener('scroll', () => {
    //     let anchorID = item.getAttribute('feature_ID');
    //     let rect2 = item.getBoundingClientRect();
    //     let offsetTop = rect2.top + window.pageYOffset;
    //     let topDifference = offsetTop - window.scrollY;
    //     if ((topDifference < 500) & (topDifference > 0)) {
    //       document.querySelectorAll('[anchor_ID]').forEach((ele) => ele.classList.remove('active'));
    //       document.querySelector(`[anchor_ID="${anchorID}"]`).classList.add('active');
    //     }
    //   });
    // });
  })();
  //
  (() => {
    const sections = document.querySelectorAll('section, footer');
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          ScrollTrigger.update();
          ScrollTrigger.refresh();
        },
      });
    });
  })();
  //
  (() => {
    if (window.innerWidth < 767) return;
    gsap.to('[logos-block-1]', {
      x: '30%',
      duration: 2,
      scrollTrigger: {
        trigger: '.section-booking',
        scrub: 1.5,
        start: 'top 50%',
        end: 'bottom bottom',
      },
    });
    gsap.to('[logos-block-2]', {
      x: '-30%',
      duration: 2,
      scrollTrigger: {
        trigger: '.section-booking',
        scrub: 1.5,
        start: 'top 50%',
        end: 'bottom bottom',
      },
    });
  })();
  //
  (() => {
    document.querySelectorAll('[count-up]').forEach((ele) => {
      gsap.from(ele, {
        textContent: 0, // start from 0
        duration: 3,
        scrollTrigger: ele,
        snap: { textContent: 1 }, // increment by 1
      });
    });
  })();
  //
  (() => {
    const tl = gsap.timeline(); // No easing applied at the timeline level

    tl.from('[supply-hero-image-circle]', {
      width: '50%',
      duration: 1,
      ease: 'back.out(1.7)', // Apply elastic easing here
    })
      .from(
        '[supply-hero-image]',
        {
          scale: 3,
          duration: 1,
          ease: 'back.out(1.7)', // Apply elastic easing here
        },
        '<'
      )
      .from(
        '[supply-hero-mobile-mockup]',
        {
          y: '20%',
          duration: 1,
          opacity: 0,
          ease: 'back.out(1.7)', // Apply elastic easing here
        },
        '<'
      )
      .from(
        '[supply-hero-item-1]',
        {
          x: '-40%',
          duration: 1,
          opacity: 0,
          ease: 'back.out(1.7)', // Apply elastic easing here
        },
        '<'
      )
      .from(
        '[supply-hero-item-2]',
        {
          x: '40%',
          duration: 1,
          opacity: 0,
          ease: 'back.out(1.7)', // Apply elastic easing here
        },
        '<'
      );
  })();

  // Footer Scroll Animation
  FooterScroll();
  function FooterScroll() {
    let footer2row = document.querySelector('.footer-row-2');
    document.querySelector('[scrollToTop]').addEventListener('click', () => {
      lenis.scrollTo('top', { duration: 2 });
      if (footer2row && window.innerWidth > 991) {
        setTimeout(() => {
          gsap.set(footer2row, { y: '-100%' });
        }, 1500);
      }
    });
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
        trigger: '.footer-row-2',
        start: `70% ${window.innerHeight - footer2row.scrollHeight + 200}`,
        end: `10% ${window.innerHeight - footer2row.scrollHeight - footer2row.scrollHeight}`,
        animation: FooterScroll,
        scrub: 2,
      });
    }
  }
  // Accordion Code
  handleAccordion();
  function handleAccordion() {
    let accordions = document.querySelectorAll('[accordion]');
    if (accordions.length < 1) return;
    accordions.forEach((accordion) => {
      let accordionHead = accordion.querySelector('[accordion-head]');
      let accordionBody = accordion.querySelector('[accordion-body]');
      gsap.set(accordionBody, { height: '0px' });
      accordionHead.addEventListener('click', () => {
        if (accordion.classList.contains('open')) {
          gsap.to(accordionBody, { height: '0px', duration: 0.5, ease: 'power1.inOut' });
          accordion.classList.remove('open');
        } else {
          accordions.forEach((element) => {
            element.classList.remove('open');
            gsap.to(element.querySelector('[accordion-body]'), {
              height: '0px',
              duration: 0.5,
              ease: 'power1.inOut',
            });
          });
          accordion.classList.add('open');
          gsap.to(accordionBody, { height: 'auto', duration: 0.5, ease: 'power1.inOut' });
        }
      });
    });
  }
}
