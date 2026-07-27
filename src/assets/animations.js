gsap.registerPlugin(CustomEase);

CustomEase.create("default-ease", "0.625, 0.05, 0, 1");

gsap.defaults({
  ease: "default-ease",
  duration: 0.725
});

// Fade + slide-up entrance animation — same pattern used on brandondadam.github.io.
// Call with a selector, element, or NodeList.
//
// Options:
//   delay   — seconds before the animation starts (default: 0)
//   stagger — seconds between each element when animating a group (default: 0.1)
//   yOffset — how far below (in %) elements start before sliding up (default: 20)
function animateIn(targets, { delay = 0, stagger = 0.1, yOffset = 20 } = {}) {
  return gsap.fromTo(
    targets,
    { yPercent: yOffset, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, delay, stagger }
  );
}

// — Page-specific entrance animations —

document.addEventListener('DOMContentLoaded', () => {
  // Home feed: stagger each post card in on load
  const feedCards = document.querySelectorAll('#feed .post-card');
  if (feedCards.length) {
    animateIn(feedCards, { stagger: 0.08 });
  }
});
