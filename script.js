

const nameInput    = document.getElementById("siteName");
const urlInput     = document.getElementById("siteUrl");
const addBtn       = document.getElementById("addBtn");
const tableBody    = document.getElementById("tableBody");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose   = document.getElementById("modalClose");


const STORAGE_KEY = "route_bookmarks";
let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");


function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function isValidName(name) {
  return name.trim().length >= 3;
}


function showModal() {
  modalOverlay.classList.add("show");
}

function hideModal() {
  modalOverlay.classList.remove("show");
}

modalClose.addEventListener("click", hideModal);

modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay) hideModal();
});


function renderTable() {
  tableBody.innerHTML = "";

  if (bookmarks.length === 0) {
    tableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">No bookmarks yet. Add your first one!</td>
      </tr>`;
    return;
  }

  bookmarks.forEach(function (bookmark, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(bookmark.name)}</td>
      <td>
        <a class="btn-visit" href="${escapeHtml(bookmark.url)}" target="_blank" rel="noopener noreferrer">
          <i class="fa-regular fa-eye"></i> Visit
        </a>
      </td>
      <td>
        <button class="btn-delete" onclick="deleteBookmark(${index})">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}


function addBookmark() {
  const name = nameInput.value.trim();
  const url  = urlInput.value.trim();

  const nameOk = isValidName(name);
  const urlOk  = isValidUrl(url);

  nameInput.className = nameOk ? "is-valid" : "is-invalid";
  urlInput.className  = urlOk  ? "is-valid" : "is-invalid";

  if (!nameOk || !urlOk) {
    showModal();
    return;
  }

  bookmarks.push({ name: name, url: url });
  saveToStorage();
  renderTable();

  nameInput.value     = "";
  urlInput.value      = "";
  nameInput.className = "";
  urlInput.className  = "";
}


function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  saveToStorage();
  renderTable();
}


function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}


function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


nameInput.addEventListener("input", function () {
  if (nameInput.value.trim().length > 0) {
    nameInput.className = isValidName(nameInput.value) ? "is-valid" : "is-invalid";
  } else {
    nameInput.className = "";
  }
});

urlInput.addEventListener("input", function () {
  if (urlInput.value.trim().length > 0) {
    urlInput.className = isValidUrl(urlInput.value.trim()) ? "is-valid" : "is-invalid";
  } else {
    urlInput.className = "";
  }
});


addBtn.addEventListener("click", addBookmark);


renderTable();
