 document.addEventListener("DOMContentLoaded", () => {

    
/** Fade animation **/  
const fadeSections = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.remove('hidden');
        } else {
          entry.target.classList.remove('visible');
          entry.target.classList.add('hidden');
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  fadeSections.forEach(section => {
    section.classList.add('hidden'); // Start hidden
    observer.observe(section);
  });


  /** Name Typing animation with cursor **/  
    const name = "Ibrahim Itani";
    const nameElement = document.getElementById("typed-name");
    let i = 0;
  
    function typeNextChar() {
      if (i < name.length) {
        nameElement.textContent += name.charAt(i);
        i++;
        setTimeout(typeNextChar, 100); // typing speed
      }
    }
  
    window.addEventListener("DOMContentLoaded", typeNextChar);


   /** Project bounce animation **/  
 function handleScrollAnimation() {
      const projects = document.querySelectorAll(".project");
  
      projects.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight - 100;
  
        if (inView) {
          el.classList.add("visible");
          el.classList.remove("not-visible");
        } else {
          el.classList.remove("visible");
          el.classList.add("not-visible");
        }
      });
    }
  
    window.addEventListener("scroll", handleScrollAnimation);
    window.addEventListener("DOMContentLoaded", handleScrollAnimation);

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

});