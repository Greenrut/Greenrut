import { useEffect } from "react";

/**
 * A robust, high-performance scroll reveal hook that sets up an
 * IntersectionObserver to add a `.reveal-visible` class to elements with the
 * `.reveal-on-scroll` class when they scroll into view.
 * 
 * To handle asynchronously loaded elements (like products or blog posts),
 * this hook uses a MutationObserver to automatically discover and observe
 * new `.reveal-on-scroll` elements when they are added to the DOM.
 */
export function useScrollReveal(triggerDependency) {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px", // Trigger slightly before entering full viewport
      threshold: 0.05,
    };

    // Keep track of observed elements so we don't observe them multiple times
    const observedElements = new Set();

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          // Stop observing once visible to maintain peak performance
          intersectionObserver.unobserve(entry.target);
          observedElements.delete(entry.target);
        }
      });
    }, observerOptions);

    const observeNewElements = () => {
      const revealElements = document.querySelectorAll(".reveal-on-scroll");
      revealElements.forEach((el) => {
        if (!observedElements.has(el)) {
          // If the element is already visible or has class reveal-visible, don't observe
          if (el.classList.contains("reveal-visible")) {
            return;
          }
          
          // Check if element is already in viewport on discovery
          const rect = el.getBoundingClientRect();
          const inViewport = 
            rect.top >= 0 && 
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
          
          if (inViewport) {
            el.classList.add("reveal-visible");
          } else {
            intersectionObserver.observe(el);
            observedElements.add(el);
          }
        }
      });
    };

    // Perform an initial scan on mount
    observeNewElements();

    // Set up a MutationObserver to listen for dynamically added items (like async loaded cards)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observedElements.forEach((el) => intersectionObserver.unobserve(el));
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [triggerDependency]);
}
