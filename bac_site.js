document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const contactForm = document.querySelector("[data-contact-form]");
  const inquiryType = document.querySelector("[data-inquiry-type]");
  const equipmentSection = document.querySelector("[data-equipment-section]");
  const otherManufacturer = document.querySelector("[data-other-manufacturer]");
  const manufacturerSelect = document.querySelector("[data-manufacturer]");
  const successBanner = document.querySelector("[data-form-success]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeNavItem = null;
  let closeTimer = null;

  function clearNavState() {
    navItems.forEach((entry) => entry.classList.remove("open"));
    activeNavItem = null;
  }

  function scheduleClose() {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      clearNavState();
    }, 16);
  }

  function openNavItem(item) {
    window.clearTimeout(closeTimer);
    if (activeNavItem && activeNavItem !== item) {
      activeNavItem.classList.remove("open");
    }
    item.classList.add("open");
    activeNavItem = item;
  }

  function prepareMotion() {
    const animateMap = [
      [".section-head", "left"],
      [".card-grid", "stagger"],
      [".story-grid", "stagger"],
      [".split-section", "stagger"],
      [".table-list", "stagger"],
      [".news-list", "stagger"],
      [".hero-metrics", "stagger"],
      [".footer-bar", "left"],
      [".highlight-band", "zoom"]
    ];

    animateMap.forEach(([selector, type]) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (element.hasAttribute("data-animate") || element.hasAttribute("data-animate-stagger")) {
          return;
        }
        if (type === "stagger") {
          element.setAttribute("data-animate-stagger", "");
        } else {
          element.setAttribute("data-animate", type);
        }
      });
    });

    document.querySelectorAll(".card, .news-item, .side-panel, .hero-panel").forEach((element, index) => {
      if (!element.hasAttribute("data-animate")) {
        element.setAttribute("data-animate", index % 2 === 0 ? "up" : "zoom");
      }
    });
  }

  function setupScrollReveal() {
    if (reducedMotion) {
      document.querySelectorAll("[data-animate]").forEach((element) => element.classList.add("is-visible"));
      document.querySelectorAll("[data-animate-stagger]").forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll("[data-animate], [data-animate-stagger]").forEach((element) => observer.observe(element));
  }

  function setupHeroParallax() {
    if (reducedMotion) {
      return;
    }

    const hero = document.querySelector(".hero-home, .page-hero");
    if (!hero) {
      return;
    }

    window.addEventListener("mousemove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;
      hero.style.setProperty("--hero-shift-x", `${x}px`);
      hero.style.setProperty("--hero-shift-y", `${y}px`);
    });
  }

  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
  });

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      body.classList.toggle("menu-open");
    });
  }

  navItems.forEach((item) => {
    const trigger = item.querySelector(".nav-link");
    const megaMenu = item.querySelector(".mega-menu");
    if (!trigger || item.classList.contains("no-menu")) {
      return;
    }

    if (window.innerWidth > 860 && megaMenu) {
      item.addEventListener("mouseenter", () => openNavItem(item));
      item.addEventListener("mouseleave", scheduleClose);
      megaMenu.addEventListener("mouseenter", () => openNavItem(item));
      megaMenu.addEventListener("mouseleave", scheduleClose);
    }

    trigger.addEventListener("click", (event) => {
      if (window.innerWidth > 860) {
        return;
      }
      event.preventDefault();
      const isOpen = item.classList.contains("open");
      clearNavState();
      if (!isOpen) {
        item.classList.add("open");
        activeNavItem = item;
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      clearNavState();
      body.classList.remove("menu-open");
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-item") && !event.target.closest(".mega-menu")) {
      clearNavState();
    }
  });

  document.querySelectorAll(".nav-list a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860 && link.closest(".mega-menu") === null) {
        body.classList.remove("menu-open");
      }
    });
  });

  function syncInquiryFields() {
    if (!inquiryType || !equipmentSection) {
      return;
    }
    const showEquipment = inquiryType.value === "parts-inspection";
    equipmentSection.classList.toggle("hidden", !showEquipment);
  }

  function syncManufacturerField() {
    if (!manufacturerSelect || !otherManufacturer) {
      return;
    }
    otherManufacturer.classList.toggle("hidden", manufacturerSelect.value !== "other");
  }

  if (inquiryType) {
    inquiryType.addEventListener("change", syncInquiryFields);
    syncInquiryFields();
  }

  if (manufacturerSelect) {
    manufacturerSelect.addEventListener("change", syncManufacturerField);
    syncManufacturerField();
  }

  if (contactForm && successBanner) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      successBanner.classList.add("visible");
      contactForm.reset();
      syncInquiryFields();
      syncManufacturerField();
      successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  prepareMotion();
  setupScrollReveal();
  setupHeroParallax();
  requestAnimationFrame(() => body.classList.add("is-ready"));
});
