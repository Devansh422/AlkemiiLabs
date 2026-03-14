document.addEventListener("DOMContentLoaded", () => {
      // Initialize Lucide Icons
      lucide.createIcons();

      gsap.registerPlugin(ScrollTrigger);

      const section = document.querySelector("#premium-features-v4");
      if (!section) return; 

      const q = gsap.utils.selector(section);
      const cards = q(".tilt-card");

      // Header slides up
      gsap.from(q(".animate-header"), {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Cards float up in a staggered grid
      gsap.from(cards, {
        scrollTrigger: {
          trigger: q(".features-grid"),
          start: "top 85%", // Trigger slightly earlier on mobile
        },
        y: 60,
        opacity: 0,
        rotationX: -15, 
        transformOrigin: "center top",
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)" 
      });

      // 3D Hover Tilt Effect (Desktop Only)
      if (window.matchMedia("(pointer: fine)").matches) {
        cards.forEach(card => {
          const xTo = gsap.quickTo(card, "rotationY", { ease: "power2", duration: 0.3 });
          const yTo = gsap.quickTo(card, "rotationX", { ease: "power2", duration: 0.3 });

          card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);
            
            const maxTilt = 12;
            
            xTo(percentX * maxTilt);
            yTo(-(percentY * maxTilt)); 
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.5)" 
            });
          });
        });
      }
    });