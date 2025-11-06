// ==================== PARTICLES ANIMATION ====================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particlesArray = [];
const numberOfParticles = 100;

function init() {
  particlesArray.length = 0;
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();

// ==================== NAVIGATION ====================
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const navLinkItems = document.querySelectorAll(".nav-link");

// Scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close mobile menu on link click
navLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinkItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// ==================== TYPEWRITER EFFECT ====================
const texts = [
  "Webfejlesztő",
  "Full-Stack Fejlesztő",
  "Frontend Kódoló",
  "Backend Kódoló",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextSpan = document.getElementById("typed-text");
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function type() {
  const currentText = texts[textIndex];

  if (isDeleting) {
    typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentText.length) {
    typeSpeed = pauseTime;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(type, 1000);
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated");
    }
  });
}, observerOptions);

// Observe all sections and cards
const animatedElements = document.querySelectorAll(
  ".skill-card, .project-card, .about-content, .contact-content"
);
animatedElements.forEach((el) => {
  el.setAttribute("data-animate", "");
  observer.observe(el);
});

// ==================== FORM HANDLING ====================
const contactForm = document.querySelector(".contact-form");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(contactForm);

  // Disable submit button during sending
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.querySelector("span").textContent;
  submitButton.querySelector("span").textContent = "Küldés...";
  submitButton.disabled = true;

  try {
    // Send form data to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    // Show message
    formMessage.style.display = "block";
    if (result.success) {
      formMessage.style.color = "var(--primary-color)";
      formMessage.textContent =
        "Köszönöm az üzeneted! Hamarosan válaszolok. 🚀";
      // Reset form on success
      contactForm.reset();
    } else {
      formMessage.style.color = "var(--accent-color)";
      formMessage.textContent =
        "Hiba történt. Kérlek próbáld újra vagy írj közvetlenül a vargimatix@gmail.com címre!";
    }
  } catch (error) {
    formMessage.style.display = "block";
    formMessage.style.color = "var(--accent-color)";
    formMessage.textContent =
      "Hiba történt. Kérlek írj közvetlenül a vargimatix@gmail.com címre!";
  } finally {
    // Re-enable submit button
    submitButton.querySelector("span").textContent = originalButtonText;
    submitButton.disabled = false;

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }
});

// ==================== SKILL PROGRESS ANIMATION ====================
const skillCards = document.querySelectorAll(".skill-card");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector(".progress-bar");
        if (progressBar) {
          progressBar.style.animation =
            "progressAnimation 2s ease-out forwards";
        }
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

skillCards.forEach((card) => {
  skillObserver.observe(card);
});

// ==================== CURSOR EFFECT ====================
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

const cursorFollower = document.createElement("div");
cursorFollower.classList.add("cursor-follower");
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateFollower() {
  const distX = mouseX - followerX;
  const distY = mouseY - followerY;

  followerX += distX / 10;
  followerY += distY / 10;

  cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

  requestAnimationFrame(animateFollower);
}

animateFollower();

// Cursor hover effects
const hoverElements = document.querySelectorAll(
  "a, button, .btn, .social-icon, .project-card"
);

hoverElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform += " scale(1.5)";
    cursorFollower.style.transform += " scale(1.5)";
  });

  el.addEventListener("mouseleave", () => {
    cursor.style.transform = cursor.style.transform.replace(" scale(1.5)", "");
    cursorFollower.style.transform = cursorFollower.style.transform.replace(
      " scale(1.5)",
      ""
    );
  });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".hero-content");

  parallaxElements.forEach((el) => {
    const speed = 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ==================== EASTER EGG - KONAMI CODE ====================
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode.splice(
    -konamiSequence.length - 1,
    konamiCode.length - konamiSequence.length
  );

  if (konamiCode.join("") === konamiSequence.join("")) {
    activateEasterEgg();
  }
});

function activateEasterEgg() {
  document.body.style.animation = "rainbow 2s infinite";
  setTimeout(() => {
    document.body.style.animation = "";
    alert("🎉 Gratulálok! Megtaláltad a titkos kódot! 🚀");
  }, 2000);
}

// Add rainbow animation to CSS dynamically
const style = document.createElement("style");
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .custom-cursor {
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    }
    
    .cursor-follower {
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.5;
        transition: transform 0.15s ease;
    }
`;
document.head.appendChild(style);

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images when they come into view
const images = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      imageObserver.unobserve(img);
    }
  });
});

images.forEach((img) => imageObserver.observe(img));

// ==================== CONSOLE MESSAGE ====================
console.log(
  "%c🚀 Szia! 👋",
  "font-size: 20px; font-weight: bold; color: #00ff88;"
);
console.log(
  "%cÉrdeklődsz a kód iránt? Keress meg bátran! 💻",
  "font-size: 14px; color: #0099ff;"
);
console.log("vargimatix@gmail.com", "font-size: 14px; color: #a0a0b0;");
