 document.addEventListener("DOMContentLoaded", () => {
  const counter = { value: 0 };
  const loaderText = document.querySelector(".loader-text");

  if (loaderText) {
    const tl = gsap.timeline();

    tl.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power4.inOut",
      onUpdate: () => {
        loaderText.textContent = Math.round(counter.value).toString().padStart(3, '0');
      },
      onComplete: () => {
        gsap.to(".loader-text", {
          y: -20,
          opacity: 0,
          duration: 0.5,
          ease: "power4.inOut",
        });
      }
    });
  }


  gsap.set(".revealer svg", { scale: 0 });

  const delays = [2.5, 3, 3.5];
  document.querySelectorAll(".revealer svg").forEach((el, i) => {
    gsap.to(el, {
      scale: 45,
      duration: 1.5,
      ease: "power4.inOut",
      delay: delays[i],
      onComplete: () => {
        if (i === delays.length - 2) {
          const loader = document.querySelector(".loader");
          if(loader) {
            loader.remove();
          }
        }
      },
    });
  });

  gsap.to(".toggle-btn, .logo, .shiny-cta", {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
        delay: 4.5,
      });

  gsap.to(".hero .content h1", {
        y: 0,
        duration: 1,
        opacity:1,
        ease: "power4.inOut",
        delay: 4.5,
      });
});
