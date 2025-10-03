document.addEventListener('DOMContentLoaded', () => {
            
    // --- Configuration ---
    const DURATION_MS = 1000; // 1.0 seconds
    
    // Define the three counters and their specific targets
    const counters = [
        // Target 900 (0.9K)
        { target: 900, duration: DURATION_MS, hasStarted: false, selector: '.big-number.counter-1', display: null },
        // Target 1450 (1.45K)
        { target: 1450, duration: DURATION_MS, hasStarted: false, selector: '.big-number.counter-2', display: null },
        // Target 12 (12 - no K-conversion needed, but formatting handles it)
        { target: 12, duration: DURATION_MS, hasStarted: false, selector: '.big-number.counter-3', display: null },
    ];

    // The element whose top boundary triggers the animation
    const triggerElement = document.querySelector('.values'); 

    // Initialize display element references
    counters.forEach(c => {
        c.display = document.querySelector(c.selector);
        if (c.display) {
            // Ensure all starting values are 0 before animation begins
            c.display.textContent = '0';
        }
    });

    // --- Utility Functions (unchanged from last version) ---

    const formatNumber = (num) => {
        num = Math.round(num * 10) / 10; 

        if (num >= 700 && num < 1000000) {
            let kValue = num / 1000;
            
            if (kValue < 1) { 
                 return kValue.toFixed(1) + 'K';
            }
            if (kValue % 1 === 0) {
                return kValue.toFixed(0) + 'K';
            }
            return kValue.toFixed(2) + 'K'; 
        }
        
        if (num >= 1000000) {
            let mValue = num / 1000000;
            if (mValue % 1 === 0) {
                return mValue.toFixed(0) + 'M';
            }
            return mValue.toFixed(1) + 'M';
        }

        return Math.round(num).toString(); 
    };

    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };

    const animateCounter = (counter) => {
        let startTime = null;
        const targetValue = counter.target;
        const duration = counter.duration;
        const displayElement = counter.display;
        
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            
            const elapsed = timestamp - startTime;
            let progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            let currentCount = easedProgress * targetValue;
            let displayContent;
            
            if (progress === 1) {
                currentCount = targetValue;
                displayContent = formatNumber(currentCount) + '+'; 
            } else {
                displayContent = formatNumber(currentCount);
            }

            displayElement.textContent = displayContent;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    };


    // --- Intersection Observer Logic (New Implementation) ---

    if (triggerElement) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Check if the element is currently intersecting (visible)
                if (entry.isIntersecting) {
                    // Start animations only if the element is entering the viewport
                    counters.forEach(counter => {
                        if (!counter.hasStarted && counter.display) {
                            counter.hasStarted = true; // Mark as started
                            animateCounter(counter);
                        }
                    });
                    
                    // Stop observing once the animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // threshold: 0.0 means the callback executes as soon as even 1 pixel
            // of the target element crosses the root boundary (the viewport).
            threshold: 0.0 
        });

        // Start observing the target element
        observer.observe(triggerElement);
    }
    
    
    // --- Theme Toggle Logic (Kept for completeness of the original template) ---
    
    const toggleCheckbox = document.getElementById('theme-toggle');
    const body = document.body;
    const localStorageKey = 'theme-preference';
  
    const getSystemPreference = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
  
    let savedTheme = localStorage.getItem(localStorageKey);
    let initialTheme = savedTheme || getSystemPreference();
  
    body.setAttribute('data-theme', initialTheme);
  
    if (toggleCheckbox) {
        if (initialTheme === 'dark') {
            toggleCheckbox.checked = true;
        } else {
            toggleCheckbox.checked = false;
        }
        
        toggleCheckbox.addEventListener('change', () => {
            const newTheme = toggleCheckbox.checked ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem(localStorageKey, newTheme);
        });
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(localStorageKey)) { // Only update if no explicit preference is set
                const systemTheme = e.matches ? 'dark' : 'light';
                body.setAttribute('data-theme', systemTheme);
                toggleCheckbox.checked = e.matches;
            }
        });
    }
});