document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".comparison-section");
  if (!section) return; 

  const q = gsap.utils.selector(section);
  
  // Set up GSAP MatchMedia for responsive animations
  let mm = gsap.matchMedia();

  // ==========================================
  // DESKTOP ANIMATION (Pinned & Scrubbed)
  // ==========================================
  mm.add("(min-width: 901px)", () => {
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=200%", 
        scrub: 1,
        pin: true,
        anticipatePin: 1, 
        invalidateOnRefresh: true 
      }
    });

    // 1. Text Entry
    tl.fromTo(q(".animate-title"), { opacity: 0, y: 50, rotationX: -60 }, { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "none" })
      .fromTo(q(".animate-desc"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "none" }, "-=0.5");

    // 2. Old Way Entry
    tl.fromTo(q(".old-way"), { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "none" }, "-=0.5");
    tl.fromTo(q('.old-way .step, .old-way .arrow'), { opacity: 0, y: -20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.4, ease: "none" });

    // 3. The Crash & Fade
    tl.to(q(".step.error"), { x: -10, rotation: -2, duration: 0.1, ease: "none" })
      .to(q(".step.error"), { x: 10, rotation: 2, duration: 0.1, ease: "none" })
      .to(q(".step.error"), { x: -10, rotation: -2, duration: 0.1, ease: "none" })
      .to(q(".step.error"), { x: 0, rotation: 0, duration: 0.1, ease: "none" })
      .to(q(".old-way"), { opacity: 0.3, filter: "grayscale(100%)", scale: 0.95, duration: 1, ease: "none" }, "+=0.2");

    // 4. VS Badge Spin
    tl.fromTo(q(".vs-badge"), { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1.2, rotation: 0, duration: 0.8, ease: "none" })
      .to(q(".vs-badge"), { scale: 1, duration: 0.2, ease: "none" });

    // 5. New Way Entry
    tl.fromTo(q(".new-way"), { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, ease: "none" }, "-=0.5");
    tl.fromTo(q('.new-way .step, .new-way .arrow'), { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.3, ease: "none" });

    // 6. The Glow Up
    tl.to(q(".new-way .magic"), { scale: 1.05, boxShadow: "0 0 30px var(--base)", duration: 0.8, ease: "none" })
      .to(q(".new-way .success"), { scale: 1.05, boxShadow: "0 0 20px var(--base)", borderColor: "var(--base)", duration: 0.8, ease: "none" }, "<"); 
    tl.to(q(".new-way"), { scale: 1.05, boxShadow: "0 0 60px rgba(199, 235, 6, 0.1)", borderColor: "var(--base)", duration: 1, ease: "none" });

  });

  // ==========================================
  // MOBILE ANIMATION (Unpinned, Trigger on Scroll)
  // ==========================================
  mm.add("(max-width: 900px)", () => {
    
    // Animate text when it comes into view
    gsap.fromTo(q(".animate-title, .animate-desc"), 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 80%" }
      }
    );

    // Animate Old Way elements
    gsap.fromTo(q(".old-way .step, .old-way .arrow"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power1.out",
        scrollTrigger: { trigger: q(".old-way"), start: "top 75%" }
      }
    );

    // Animate VS Badge
    gsap.fromTo(q(".vs-badge"),
      { opacity: 0, scale: 0.5, rotation: -90 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)",
        scrollTrigger: { trigger: q(".vs-badge"), start: "top 85%" }
      }
    );

    // Animate New Way elements
    const newWayTl = gsap.timeline({
      scrollTrigger: { trigger: q(".new-way"), start: "top 75%" }
    });

    newWayTl.fromTo(q(".new-way .step, .new-way .arrow"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    ).to(q(".new-way .magic, .new-way .success"), 
      { scale: 1.05, boxShadow: "0 0 20px var(--base)", borderColor: "var(--base)", duration: 0.4, ease: "power1.inOut" }
    );
  });

});