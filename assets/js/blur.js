document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const blurMax = 20; // Maximum blur in pixels
    const blurStart = 100; // Scroll position (in px) where blur starts
    const blurEnd = 105; // Scroll position (in px) where max blur is reached

    function updateHeroBlur() {
        const scrollY = window.scrollY;

        if (scrollY < blurStart) {
            // No blur above the start point
            hero.style.filter = 'blur(0px)';
        } else if (scrollY >= blurStart && scrollY <= blurEnd) {
            // Calculate blur dynamically between start and end
            const distance = blurEnd - blurStart;
            const scrolled = scrollY - blurStart;
            const blurAmount = (scrolled / distance) * blurMax;
            
            hero.style.filter = `blur(${blurAmount}px)`;
        } else {
            // Maximum blur after the end point
            hero.style.filter = `blur(${blurMax}px)`;
        }
    }

    // Attach the function to the scroll event
    window.addEventListener('scroll', updateHeroBlur);

    // Run once on load in case the page is already scrolled
    updateHeroBlur();
});
