const bodyHidden = () => {
  document.querySelector("body").style.overflow = "hidden";
};

const bodyVisible = () => {
  document.querySelector("body").style.overflow = "visible";
};

const phoneInp = document.querySelectorAll('input[type="tel"]');

if (phoneInp.length) {
  phoneInp.forEach((el) => {
    IMask(el, {
      mask: "+{7}(000) 000-00-00",
    });
  });
}

document.querySelectorAll(".form-date__inp").forEach((wrapper) => {
  const inputs = wrapper.querySelectorAll("input");

  const configs = [
    { from: 1, to: 31 },
    { from: 1, to: 12 },
    { from: 1900, to: 9999 },
  ];

  inputs.forEach((inp, i) => {
    IMask(inp, {
      mask: IMask.MaskedRange,
      from: configs[i].from,
      to: configs[i].to,
      maxLength: inp.maxLength,
      autofix: true,
    });

    inp.addEventListener("input", () => {
      if (inp.value.length === inp.maxLength && inputs[i + 1]) {
        inputs[i + 1].focus();
      }
    });

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && inputs[i - 1]) {
        inputs[i - 1].focus();
      }
    });
  });
});

const dashboardBtn = document.querySelector(".dashboard-btn");
const dashboardLeft = document.querySelector(".dashboard-left");

if (dashboardBtn) {
  dashboardBtn.addEventListener("click", () => {
    dashboardBtn.classList.toggle("active");
    dashboardLeft.style.maxHeight = dashboardLeft.style.maxHeight
      ? null
      : dashboardLeft.scrollHeight + "px";
  });
}

const modalClasses = [".certificate-modal", ".data-modal", ".casey-modal"];
modalClasses.forEach((cls) => {
  const m = document.querySelector(cls);
  const mBg = document.querySelector(cls + " .modal-bg");
  const mCloseBtn = document.querySelector(cls + " .modal-close");

  if (m) {
    const closeModal = () => {
      m.classList.remove("active");
      bodyVisible();
    };

    if (mBg) mBg.onclick = closeModal;
    if (mCloseBtn) mCloseBtn.onclick = closeModal;
  }
});

// Casey modal open button
const caseyOpenBtns = document.querySelectorAll(".casey-modal__open");
const caseyModal = document.querySelector(".casey-modal");
caseyOpenBtns.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    if (caseyModal) {
      caseyModal.classList.add("active");
      bodyHidden();
    }
  };
});

const certificateTabBtns = document.querySelectorAll(
  ".certificate .tab-head button",
);
const certificateTabBody = document.querySelectorAll(".certificate .tab-body");

if (certificateTabBtns.length) {
  certificateTabBtns.forEach((btn, btnIdx) => {
    btn.onclick = () => {
      certificateTabBtns.forEach((el, elIdx) => {
        if (elIdx == btnIdx) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
      certificateTabBody.forEach((el, elIdx) => {
        if (elIdx == btnIdx) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    };
  });
}
// casey-modal__open

// Casey content slider
if (document.querySelector(".casey-swiper")) {
  new Swiper(".casey-swiper", {
    slidesPerView: 3.2,
    spaceBetween: 16,
    centeredSlides: false,
    navigation: {
      prevEl: ".casey-slider-prev",
      nextEl: ".casey-slider-next",
    },
    breakpoints: {
      1400: { slidesPerView: 3.2 },
      1200: { slidesPerView: 2.6 },
      992: { slidesPerView: 2.3 },
      600: { slidesPerView: 2.1 },
      0: { slidesPerView: 1.1 },
    },
  });
}

// Achievements slider
const achievementEl = document.querySelector(".achievement-levels.swiper");
if (achievementEl) {
  const achievementSwiper = new Swiper(".achievement-levels.swiper", {
    slidesPerView: "auto",
    spaceBetween: 0,
    grabCursor: true,
    allowTouchMove: true,
  });

  let isDragging = false;
  let dragStartX = 0;
  let dragStartTranslate = 0;

  achievementEl.addEventListener("mousedown", (e) => {
    if (e.target.closest("button, a, input")) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartTranslate = achievementSwiper.getTranslate();
    achievementEl.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    achievementSwiper.setTranslate(dragStartTranslate + (e.clientX - dragStartX));
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    achievementEl.style.cursor = "grab";
    achievementSwiper.slideToClosest(300);
  });
}

// Casey comments
const commentInput = document.getElementById("casey-comment-input");
const commentSubmit = document.getElementById("casey-comment-submit");
const commentsList = document.getElementById("casey-comments-list");

if (commentInput && commentSubmit && commentsList) {
  // --- Toolbar buttons ---
  const boldBtn = document.querySelector(
    '.casey-comments__tool[title="Жирний"]',
  );
  const italicBtn = document.querySelector(
    '.casey-comments__tool[title="Курсив"]',
  );
  const linkBtn = document.querySelector(
    '.casey-comments__tool[title="Посилання"]',
  );

  // mousedown + preventDefault — saqlab qolingan selectionni yo'qotmaslik uchun
  if (boldBtn) {
    boldBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      document.execCommand("bold");
      this.classList.toggle("is-active", document.queryCommandState("bold"));
    });
  }

  if (italicBtn) {
    italicBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      document.execCommand("italic");
      this.classList.toggle("is-active", document.queryCommandState("italic"));
    });
  }

  if (linkBtn) {
    linkBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      const url = prompt("Посилання (URL):", "https://");
      if (!url) return;
      document.execCommand("createLink", false, url);
      // target=_blank qo'shish
      commentInput.querySelectorAll("a").forEach((a) => {
        a.target = "_blank";
        a.rel = "noopener";
      });
    });
  }

  // Bold/Italic tugma holatini yangilash (kursor harakatida)
  commentInput.addEventListener("keyup", updateToolbarState);
  commentInput.addEventListener("mouseup", updateToolbarState);
  function updateToolbarState() {
    if (boldBtn)
      boldBtn.classList.toggle("is-active", document.queryCommandState("bold"));
    if (italicBtn)
      italicBtn.classList.toggle(
        "is-active",
        document.queryCommandState("italic"),
      );
  }

  // --- Relative time (Russian) ---
  function relativeTime(date) {
    const diff = Math.floor((Date.now() - date) / 1000);
    if (diff < 60) return "только что";
    if (diff < 3600) return Math.floor(diff / 60) + " мин назад";
    if (diff < 86400) return Math.floor(diff / 3600) + " ч назад";
    return Math.floor(diff / 86400) + " дн назад";
  }

  // Barcha timestamplarni har 30s yangilash
  setInterval(() => {
    document
      .querySelectorAll(".casey-comments__time[data-ts]")
      .forEach((el) => {
        el.textContent = relativeTime(Number(el.dataset.ts));
      });
  }, 30000);

  // --- Submit comment ---
  function addComment() {
    const html = commentInput.innerHTML.trim();
    const text = commentInput.textContent.trim();
    if (!text) return;

    const ts = Date.now();
    const item = document.createElement("div");
    item.className = "casey-comments__item";
    item.innerHTML = `
      <div class="casey-comments__item-head">
        <div class="casey-comments__avatar">
          <img src="./assets/images/user-logo.svg" alt="" />
        </div>
        <span class="casey-comments__name">Владимир</span>
      </div>
      <p class="casey-comments__text">${html}</p>
      <span class="casey-comments__time" data-ts="${ts}">только что</span>
    `;

    commentsList.insertBefore(item, commentsList.firstChild);
    commentInput.innerHTML = "";

    // Toolbar holati reset
    if (boldBtn) boldBtn.classList.remove("is-active");
    if (italicBtn) italicBtn.classList.remove("is-active");

    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  commentSubmit.addEventListener("click", addComment);

  // Ctrl+Enter / Cmd+Enter
  commentInput.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      addComment();
    }
  });
}

if (commentInput && commentSubmit && commentsList) {
  // --- Textarea wrapper helper ---
  function wrapSelection(before, after) {
    const start = commentInput.selectionStart;
    const end = commentInput.selectionEnd;
    const selected = commentInput.value.substring(start, end);
    const replacement = before + (selected || "текст") + after;
    commentInput.value =
      commentInput.value.substring(0, start) +
      replacement +
      commentInput.value.substring(end);
    // Курсорни wrapper ichiga qo'yish
    const cursorPos = selected
      ? start + replacement.length
      : start + before.length;
    commentInput.setSelectionRange(
      selected ? start + before.length : start + before.length,
      selected
        ? start + before.length + (selected || "текст").length
        : start + before.length + "текст".length,
    );
    commentInput.focus();
    // auto-resize
    commentInput.style.height = "auto";
    commentInput.style.height = commentInput.scrollHeight + "px";
  }

  // --- Toolbar button handlers ---
  const boldBtn = document.querySelector(
    '.casey-comments__tool[title="Жирний"]',
  );
  const italicBtn = document.querySelector(
    '.casey-comments__tool[title="Курсив"]',
  );
  const linkBtn = document.querySelector(
    '.casey-comments__tool[title="Посилання"]',
  );

  if (boldBtn) {
    boldBtn.addEventListener("click", function () {
      wrapSelection("**", "**");
      this.classList.toggle("is-active");
    });
  }

  if (italicBtn) {
    italicBtn.addEventListener("click", function () {
      wrapSelection("*", "*");
      this.classList.toggle("is-active");
    });
  }

  if (linkBtn) {
    linkBtn.addEventListener("click", function () {
      const url = prompt("Посилання (URL):", "https://");
      if (!url) return;
      wrapSelection("[", "](" + url + ")");
    });
  }

  // --- Relative time (Russian) ---
  function relativeTime(date) {
    const diff = Math.floor((Date.now() - date) / 1000); // seconds
    if (diff < 60) return "только что";
    if (diff < 3600) {
      const m = Math.floor(diff / 60);
      return m + " мин назад";
    }
    if (diff < 86400) {
      const h = Math.floor(diff / 3600);
      return h + " ч назад";
    }
    const d = Math.floor(diff / 86400);
    return d + " дн назад";
  }

  // Update all dynamic timestamps every 30s
  setInterval(() => {
    document
      .querySelectorAll(".casey-comments__time[data-ts]")
      .forEach((el) => {
        el.textContent = relativeTime(Number(el.dataset.ts));
      });
  }, 30000);

  // --- Markdown → HTML converter ---
  function parseMarkdown(raw) {
    return (
      raw
        // XSS: escape real HTML first
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        // **bold**
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // *italic*
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        // [text](url)
        .replace(
          /\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener">$1</a>',
        )
        // newlines
        .replace(/\n/g, "<br>")
    );
  }

  // --- Auto-resize textarea ---
  commentInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // --- Add comment ---
  function addComment() {
    const raw = commentInput.value.trim();
    if (!raw) return;

    const item = document.createElement("div");
    item.className = "casey-comments__item";
    item.innerHTML = `
      <div class="casey-comments__item-head">
        <div class="casey-comments__avatar">
          <img src="./assets/images/user-logo.svg" alt="" />
        </div>
        <span class="casey-comments__name">Владимир</span>
      </div>
      <p class="casey-comments__text">${parseMarkdown(raw)}</p>
      <span class="casey-comments__time" data-ts="${Date.now()}">только что</span>
    `;

    commentsList.insertBefore(item, commentsList.firstChild);
    commentInput.value = "";
    commentInput.style.height = "auto";

    // Reset active states
    [boldBtn, italicBtn].forEach((b) => b && b.classList.remove("is-active"));

    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  commentSubmit.addEventListener("click", addComment);

  // Ctrl+Enter / Cmd+Enter
  commentInput.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      addComment();
    }
  });
}
