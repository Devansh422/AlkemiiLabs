document.addEventListener("DOMContentLoaded", () => {

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });

    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const toggleBtn = document.querySelector(".toggle-btn");
    const toggleLabel = toggleBtn?.querySelector("span");
    const menuPanel = document.getElementById("site-menu");
    if (toggleBtn && toggleLabel && menuPanel) {
        toggleBtn.setAttribute("role", "button");
        toggleBtn.setAttribute("tabindex", "0");

        const setOpen = (isOpen) => {
            menuPanel.classList.toggle("is-open", isOpen);
            menuPanel.setAttribute("aria-hidden", String(!isOpen));
            toggleLabel.textContent = isOpen ? "Close" : "Menu";
        };

        const toggle = () => {
            const isOpen = menuPanel.classList.contains("is-open");
            setOpen(!isOpen);
        };

        toggleBtn.addEventListener("click", toggle);
        toggleBtn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
            }
        });

        setOpen(false);
    }

});