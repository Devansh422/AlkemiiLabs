 lucide.createIcons();

      function handleCycle(cycleType, trigger) {
        // Switch UI state
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('is-active'));
        trigger.classList.add('is-active');

        const rateElements = document.querySelectorAll('.cost-value');
        const subLabels = document.querySelectorAll('.yearly-disclosure');

        rateElements.forEach((el, i) => {
          el.classList.add('is-updating');

          setTimeout(() => {
            const updatedRate = el.getAttribute(`data-${cycleType}`);
            el.innerHTML = `${updatedRate}<span>/month</span>`;
            el.classList.remove('is-updating');
            
            // Adjust the visibility of the annual sub-label
            // Note: The index-1 logic from your snippet implies the first card (Free) has no label
            if (subLabels[i - 1]) {
              cycleType === 'yearly' 
                ? subLabels[i - 1].classList.add('is-visible') 
                : subLabels[i - 1].classList.remove('is-visible');
            }
          }, 250);
        });
      }