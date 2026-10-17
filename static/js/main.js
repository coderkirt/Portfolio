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

// Chapter reader: pick a chapter, or step with previous / next.
const origins = document.querySelector("[data-origins]");
if (origins) {
  const tabs = [...origins.querySelectorAll("[data-origins-tab]")];
  const panels = [...origins.querySelectorAll("[data-origins-panel]")];
  const indexLabel = origins.querySelector("[data-origins-index]");
  const bar = origins.querySelector("[data-origins-bar]");
  const prevButton = origins.querySelector("[data-origins-prev]");
  const nextButton = origins.querySelector("[data-origins-next]");
  const chapterList = origins.querySelector(".origins__chapters");
  const openButton = origins.querySelector("[data-origins-open]");
  const card = origins.querySelector("[data-origins-card]");
  const closeButtons = [...origins.querySelectorAll("[data-origins-close]")];
  const backdrop = origins.querySelector("[data-origins-backdrop]");
  let index = 0;

  const show = (target) => {
    index = Math.max(0, Math.min(tabs.length - 1, target));
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
    if (indexLabel) indexLabel.textContent = String(index + 1).padStart(2, "0");
    if (bar) bar.style.transform = `scaleX(${(index + 1) / tabs.length})`;
    if (prevButton) prevButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === tabs.length - 1;
    const tab = tabs[index];
    if (chapterList && tab && chapterList.scrollWidth > chapterList.clientWidth) {
      chapterList.scrollTo({
        left: tab.offsetLeft - 12,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  };

  const setOpen = (open) => {
    if (!card || !openButton) return;
    card.hidden = !open;
    openButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("origins-open", open);
    if (!open) return;
    show(0);
    const timelineTab = tabs[0];
    if (timelineTab) timelineTab.focus();
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => show(i)));
  if (prevButton) prevButton.addEventListener("click", () => show(index - 1));
  if (nextButton) nextButton.addEventListener("click", () => show(index + 1));
  if (openButton) {
    openButton.addEventListener("click", () => setOpen(card.hidden));
  }
  const shut = () => {
    setOpen(false);
    openButton.focus();
  };
  closeButtons.forEach((button) => button.addEventListener("click", shut));
  if (backdrop) backdrop.addEventListener("click", shut);

  origins.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && card && !card.hidden) {
      event.preventDefault();
      setOpen(false);
      openButton.focus();
      return;
    }
    if (!event.target.closest("[data-origins-tab], [data-origins-prev], [data-origins-next]")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      show(index + 1);
      tabs[index].focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      show(index - 1);
      tabs[index].focus();
    }
  });

  show(0);
}

const codeStage = document.querySelector("[data-code-stage]");
if (codeStage) {
  const picks = [...codeStage.querySelectorAll("[data-code-pick]")];
  const pieces = [...codeStage.querySelectorAll("[data-code-piece]")];
  const showPiece = (target) => {
    const next = Math.max(0, Math.min(pieces.length - 1, target));
    picks.forEach((pick, i) => pick.setAttribute("aria-pressed", String(i === next)));
    pieces.forEach((piece, i) => {
      piece.hidden = i !== next;
    });
  };
  picks.forEach((pick, i) => pick.addEventListener("click", () => showPiece(i)));
  codeStage.addEventListener("keydown", (event) => {
    if (!event.target.closest("[data-code-pick]")) return;
    const current = picks.findIndex((pick) => pick.getAttribute("aria-pressed") === "true");
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPiece(current + 1);
      picks[Math.min(pieces.length - 1, current + 1)].focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPiece(current - 1);
      picks[Math.max(0, current - 1)].focus();
    }
  });
}

// Print button (resume)
document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});

// Dark / light theme toggle (saved in localStorage; label shows the target theme)
const themeToggle = document.querySelector("[data-theme-toggle]");
if (themeToggle) {
  const label = themeToggle.querySelector("[data-theme-label]");
  const apply = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {}
    if (label) label.textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  };
  apply(document.documentElement.getAttribute("data-theme") || "dark");
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    apply(current === "dark" ? "light" : "dark");
  });
}

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

  // Submit to Formspree in the background so the visitor stays on the page.
  // If fetch is unavailable, the browser falls back to a normal form post.
  const status = form.querySelector("[data-form-status]");
  const showStatus = (text, ok) => {
    if (!status) return;
    status.textContent = text;
    status.hidden = false;
    status.classList.toggle("is-ok", ok);
  };

  form.addEventListener("submit", async (event) => {
    const fields = [...form.querySelectorAll("input, textarea")];
    const allOk = fields.every((field) => check(field) && field.value.trim());
    if (!allOk) {
      event.preventDefault();
      return;
    }
    if (!window.fetch) return;
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        form.reset();
        showStatus("Thanks — your message is on its way. I usually reply within a day.", true);
      } else {
        showStatus("Something went wrong. Please email me directly instead.", false);
      }
    } catch (error) {
      showStatus("Network error. Please try again or email me directly.", false);
    } finally {
      if (button) button.disabled = false;
    }
  });
}
