document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initial Hero Animations
  const tl = gsap.timeline();
  
  tl.fromTo(".hero-text-bg", 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 0.1, duration: 1.5, ease: "power4.out" }
  )
  .fromTo(".hero-content h1",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    "-=1"
  )
  .fromTo(".hero-content p",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    "-=0.8"
  );



  // 2. Horizontal Scroll Section (Theme Switcher)
  const track = document.getElementById("slider-track");
  const panels = gsap.utils.toArray(".slide-panel");

  // Create horizontal scroll tween
  const scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".slider-container",
      pin: ".slider-pinned",
      start: "top top",
      end: "+=300%", // Depends on slider-container height
      scrub: 1,
    }
  });

  // Background color change logic based on the visible panel
  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      containerAnimation: scrollTween,
      start: "left center",
      end: "right center",
      onEnter: () => updateTheme(panel),
      onEnterBack: () => updateTheme(panel),
    });
  });

  function updateTheme(activePanel) {
    const bgColor = activePanel.getAttribute("data-color");
    const bgText = activePanel.getAttribute("data-text-bg");
    
    // Animate body background color
    gsap.to("body", {
      backgroundColor: bgColor,
      duration: 0.8,
      ease: "power2.inOut"
    });

    // We can also change the hero bg text if we want, or do other theme effects
    const heroBg = document.getElementById("hero-bg-text");
    if (heroBg && bgText) {
      // Fade out, change text, fade in
      gsap.to(heroBg, {
        opacity: 0,
        y: -50,
        duration: 0.3,
        onComplete: () => {
          heroBg.textContent = bgText;
          gsap.to(heroBg, { opacity: 0.1, y: 0, duration: 0.4 });
        }
      });
    }
  }

  // 3. Feature Cards Fade Up
  gsap.utils.toArray(".gsap-fade-up").forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Trigger when element is 85% down the viewport
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 4. FAQ Accordion Logic
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      // Close other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
        }
      });
      // Toggle current item
      item.classList.toggle("active");
      
      // Refresh ScrollTrigger to recalculate heights if it affects pinning
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);
    });
  });
});
