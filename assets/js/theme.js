document.addEventListener('DOMContentLoaded', () => {
    const toggleCheckbox = document.getElementById('theme-toggle');
    const body = document.body;
    const localStorageKey = 'theme-preference';
  
    // Function to get the current system preference
    const getSystemPreference = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
  
    // 1. Load initial theme
    let savedTheme = localStorage.getItem(localStorageKey);
    let initialTheme = savedTheme || getSystemPreference();
  
    // Set the theme on the body
    body.setAttribute('data-theme', initialTheme);
  
    // Set the initial state of the switch
    if (initialTheme === 'dark') {
      toggleCheckbox.checked = true;
    } else {
      toggleCheckbox.checked = false;
    }
    
    // 2. Handle theme toggle
    toggleCheckbox.addEventListener('change', () => {
      const newTheme = toggleCheckbox.checked ? 'dark' : 'light';
      
      // Apply and save the new theme
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem(localStorageKey, newTheme);
    });
    
    // 3. Optional: Listen for system preference changes (real-time update)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if the user hasn't explicitly set a preference (savedTheme is null)
      if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        body.setAttribute('data-theme', systemTheme);
        toggleCheckbox.checked = e.matches;
      }
    });
  });