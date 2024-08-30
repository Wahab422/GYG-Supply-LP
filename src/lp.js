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
}
init();

function handleCode() {
    //
    document.querySelectorAll('[copy-clipboard]').forEach((btn) => {
        btn.addEventListener('click', function () {
            const button = this;
            const textToCopy = button.getAttribute('copy-clipboard');
            navigator.clipboard
                .writeText(textToCopy)
                .then(function () {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';

                    setTimeout(function () {
                        button.textContent = originalText;
                    }, 3000);
                })
                .catch(function (error) {
                    console.error('Failed to copy text: ', error);
                });
        });
    });
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
