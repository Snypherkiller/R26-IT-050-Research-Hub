
const state = {
  files: [],
  filter: "all",
  search: ""
};

const $ = (id) => document.getElementById(id);

function isTemplate(file) {
  return (
    file.format === "POTM" ||
    file.name.toLowerCase().includes("template")
  );
}

function fileType(file) {
  if (isTemplate(file)) return "Template";
  if (file.type === "Presentation") return "Presentation";
  return "Document";
}

function formatSize(bytes) {
  if (!bytes) return "Unknown size";
  if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(1) + " MB";
  }
  return (bytes / 1024).toFixed(0) + " KB";
}

function getFilteredFiles() {
  return state.files.filter((file) => {
    const matchesCategory =
      state.filter === "all" ||
      fileType(file) === state.filter;

    const searchText = [
      file.name,
      file.type,
      file.category,
      file.format
    ].join(" ").toLowerCase();

    return matchesCategory &&
      searchText.includes(state.search.toLowerCase());
  });
}

function updateStats() {
  $("totalCount").textContent = state.files.length;

  $("documentCount").textContent =
    state.files.filter(f => fileType(f) === "Document").length;

  $("presentationCount").textContent =
    state.files.filter(f => fileType(f) === "Presentation").length;

  $("templateCount").textContent =
    state.files.filter(f => fileType(f) === "Template").length;

  $("fileCount").textContent = state.files.length;
}

function createFileCard(file) {
  const card = document.createElement("article");
  card.className = "file-card";
  card.dataset.format = file.format;

  const top = document.createElement("div");
  top.className = "file-top";

  const icon = document.createElement("div");
  icon.className = "file-icon";
  icon.textContent =
    file.format === "PDF" ? "▧" :
    file.format === "XLSM" ? "▦" :
    file.type === "Presentation" ? "▣" : "▤";

  const badge = document.createElement("span");
  badge.className = "file-format";
  badge.textContent = file.format;

  top.append(icon, badge);

  const title = document.createElement("h3");
  title.textContent = file.name;

  const meta = document.createElement("div");
  meta.className = "file-meta";

  const category = document.createElement("span");
  category.textContent = file.category;

  const size = document.createElement("span");
  size.textContent = formatSize(file.size);

  meta.append(category, size);

  const actions = document.createElement("div");
  actions.className = "file-actions";

  const viewButton = document.createElement("button");
  viewButton.className = "view-btn";
  viewButton.textContent = "View Details  ";
  viewButton.addEventListener("click", () => previewFile(file));

  const downloadButton = document.createElement("a");
  downloadButton.className = "download-btn";
  downloadButton.href = file.path;
  downloadButton.download = file.name;
  downloadButton.textContent = "↓ Download";

  actions.append(viewButton, downloadButton);
  card.append(top, title, meta, actions);

  return card;
}

function renderFiles() {
  const grid = $("fileGrid");
  const filtered = getFilteredFiles();

  grid.replaceChildren();

  filtered.forEach((file) => {
    grid.appendChild(createFileCard(file));
  });

  $("resultCount").textContent =
    `Showing ${filtered.length} of ${state.files.length} files`;

  $("emptyState").hidden = filtered.length !== 0;
}

function setFilter(filter) {
  state.filter = filter;

  document.querySelectorAll("[data-filter], [data-category]")
    .forEach((button) => {
      const value = button.dataset.filter || button.dataset.category;
      button.classList.toggle("active", value === filter);
    });

  renderFiles();
  $("sidebar").classList.remove("open");
}

function previewFile(file) {
  $("previewTitle").textContent = file.name;

  $("previewInfo").textContent =
    `${file.category} • ${file.format} • ${formatSize(file.size)}`;

  const area = $("previewContent");
  area.replaceChildren();

  if (file.format === "PDF") {
    const frame = document.createElement("iframe");
    frame.className = "preview-frame";
    frame.src = file.path;
    frame.title = "PDF Preview";
    area.appendChild(frame);
  } else {
    const message = document.createElement("div");
    message.className = "preview-message";
    message.textContent =
      "This file is available for download. Open it using a compatible document viewer or text editor.";
    area.appendChild(message);
  }

  $("previewDownload").href = file.path;
  $("previewDownload").download = file.name;
  $("previewModal").showModal();
}

document.querySelectorAll("[data-filter], [data-category]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.filter || button.dataset.category);
      $("library").scrollIntoView({ behavior: "smooth" });
    });
  });

$("searchInput").addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  renderFiles();
});

$("menuBtn").addEventListener("click", () => {
  const open = $("sidebar").classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", String(open));
});

$("closePreview").addEventListener("click", () => {
  $("previewModal").close();
});

$("cancelPreview").addEventListener("click", () => {
  $("previewModal").close();
});

async function loadFiles() {
  try {
    const response = await fetch("assets/manifest.json");

    if (!response.ok) {
      throw new Error("Could not load file manifest");
    }

    state.files = await response.json();

    updateStats();
    renderFiles();

  } catch (error) {
    console.error(error);

    $("fileGrid").textContent =
      "Unable to load files. Please run the website using a local server or GitHub Pages.";
  }
}

loadFiles();

document.querySelectorAll('.section-nav a').forEach(link => {
  link.addEventListener('click', () => {
    $('sidebar').classList.remove('open');
    $('menuBtn').setAttribute('aria-expanded', 'false');
  });
});


// Contact form: GitHub Pages is static, so deliver messages through FormSubmit.
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const button = document.getElementById("contactSubmit");
    const status = document.getElementById("contactStatus");
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "Submitting your enquiry…";
    status.removeAttribute("data-state");
    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error("Submission was not accepted");
      }
      status.textContent = "Your enquiry was submitted. Thank you for contacting us!";
      status.dataset.state = "success";
      contactForm.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      status.textContent = "We couldn't submit your message. Please email dnimtharu@gmail.com directly."; 
      status.dataset.state = "error";
    } finally {
      button.disabled = false;
      button.textContent = "Send message →";
    }
  });
}
