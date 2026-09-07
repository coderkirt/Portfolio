const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile navigation
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
if (header && navToggle) {
  navToggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

// Print button (resume)
document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});

// Pointer follower: a small dot that eases toward the pointer and
// grows over links (difference blend keeps it visible on any color).
const pointerDot = document.querySelector(".pointer-dot");
if (pointerDot && !reducedMotion && window.matchMedia("(hover: hover)").matches) {
  const pos = { x: -100, y: -100 };
  const target = { x: -100, y: -100 };

  window.addEventListener("pointermove", (event) => {
    target.x = event.clientX;
    target.y = event.clientY;
  }, { passive: true });

  const follow = () => {
    pos.x += (target.x - pos.x) * 0.18;
    pos.y += (target.y - pos.y) * 0.18;
    pointerDot.style.transform = `translate(${pos.x - pointerDot.offsetWidth / 2}px, ${pos.y - pointerDot.offsetHeight / 2}px)`;
    requestAnimationFrame(follow);
  };
  follow();

  document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
    const cls = el.hasAttribute("data-hover-big") ? "is-big" : "is-link";
    el.addEventListener("pointerenter", () => pointerDot.classList.add(cls));
    el.addEventListener("pointerleave", () => pointerDot.classList.remove(cls));
  });
}

// Split headline text into letters that rise in one by one
document.querySelectorAll("[data-letters]").forEach((node) => {
  const text = node.textContent;
  node.textContent = "";
  node.setAttribute("aria-hidden", "true");
  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char === " " ? "\u00a0" : char;
    span.style.animationDelay = `${0.03 * index + 0.1}s`;
    node.appendChild(span);
  });
});

// Scroll reveal
if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, current) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-in");
      current.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("reveal-init");
    observer.observe(el);
  });
}

// Gentle parallax on work panel visuals while scrolling
const visuals = document.querySelectorAll(".work-panel__visual");
if (visuals.length && !reducedMotion) {
  let ticking = false;
  const update = () => {
    visuals.forEach((visual) => {
      const box = visual.getBoundingClientRect();
      const center = box.top + box.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-40, Math.min(40, -center * 0.06));
      visual.style.setProperty("translate", `0 ${shift.toFixed(1)}px`);
    });
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

// Contact form: inline validation before the server checks again
const form = document.querySelector("[data-live-form]");
if (form) {
  const rules = {
    name: (value) => value.trim().length >= 2 || "Enter at least 2 characters.",
    email: (value) => /.+@.+\..+/.test(value) || "Use a valid email address.",
    subject: (value) => value.trim().length >= 3 || "Add a short subject.",
    message: (value) => value.trim().length >= 12 || "Write at least one sentence.",
  };

  const check = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const ok = result === true;
    const label = input.closest("label");
    const note = form.querySelector(`[data-for="${input.name}"]`);
    if (label) label.classList.toggle("is-invalid", !ok && input.value.length > 0);
    if (note) note.textContent = ok || input.value.length === 0 ? "" : result;
    return ok;
  };

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => check(input));
  });

  form.addEventListener("submit", (event) => {
    const fields = [...form.querySelectorAll("input, textarea")];
    const allOk = fields.every((field) => check(field) && field.value.trim());
    if (!allOk) event.preventDefault();
  });
}
