const API_BASE_URL = window.__CONFIG__?.API_BASE_URL || "http://localhost:5000";
const authToken = localStorage.getItem("vh_token") || "";
const authUser = JSON.parse(localStorage.getItem("vh_user") || "null");

if (!authToken || !authUser) window.location.href = "/";

const currentUserEl = document.getElementById("currentUser");
const logoutBtn = document.getElementById("logoutBtn");
const logBox = document.getElementById("logBox");
const managerPanel = document.getElementById("managerPanel");
const managerOrgStatus = document.getElementById("managerOrgStatus");
const volunteerPanel = document.getElementById("volunteerPanel");
const adminPanel = document.getElementById("adminPanel");
const adminDataList = document.getElementById("adminDataList");
const clearLogBtn = document.getElementById("clearLogBtn");
const roleAliases = {
  organizationmanager: "OrganisationManager",
  organisationmanager: "OrganisationManager",
  admin: "Admin",
  volunteer: "Volunteer"
};

function normalizeRole(role) {
  const key = String(role || "").replace(/\s+/g, "").toLowerCase();
  return roleAliases[key] || role;
}

const userRole = normalizeRole(authUser?.role);

function log(message) {
  const time = new Date().toLocaleTimeString();
  logBox.textContent = `[${time}] ${message}\n` + logBox.textContent;
}

async function api(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` };
  const res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : null });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

function updateUserUI() {
  currentUserEl.textContent = `${authUser.name} (${authUser.role})`;
  managerPanel.classList.toggle("hidden", authUser.role !== "OrganisationManager");
  volunteerPanel.classList.toggle("hidden", authUser.role !== "Volunteer");
  adminPanel.classList.toggle("hidden", authUser.role !== "Admin");
}

async function loadManagerOrganizationStatus() {
  if (authUser.role !== "OrganisationManager") return;
  try {
    const org = await api("/auth/organizations/me");
    if (!org) {
      managerOrgStatus.innerHTML = `
        <h4>No organisation linked</h4>
        <p class="meta">Register your organisation below. It stays <strong>Pending</strong> until an admin approves it.</p>
      `;
      return;
    }
    managerOrgStatus.innerHTML = `
      <h4>My organisation</h4>
      <p class="meta"><strong>Name:</strong> ${org.name}</p>
      <p class="meta"><strong>Status:</strong> ${org.status}</p>
      <p class="meta"><strong>Category:</strong> ${org.category}</p>
      <p class="meta"><strong>Contact:</strong> ${org.contactEmail}</p>
    `;
  } catch (error) {
    managerOrgStatus.innerHTML = `<p class="meta">Could not load organisation: ${error.message}</p>`;
  }
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("vh_token");
  localStorage.removeItem("vh_user");
  window.location.href = "/";
});

document.getElementById("orgForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await api("/auth/organizations", "POST", {
      name: document.getElementById("orgName").value,
      description: document.getElementById("orgDescription").value,
      category: document.getElementById("orgCategory").value,
      address: document.getElementById("orgAddress").value,
      contactEmail: document.getElementById("orgEmail").value
    });
    log("Organisation submitted (Pending).");
    e.target.reset();
    loadManagerOrganizationStatus();
  } catch (error) {
    log(`Organisation submit failed: ${error.message}`);
  }
});

document.getElementById("loadOrgsBtn").addEventListener("click", async () => {
  try {
    const orgs = await api("/auth/organizations");
    adminDataList.innerHTML = orgs
      .map(
        (o) =>
          `<div class="event-card"><h3>${o.name}</h3><p class="meta">${o.category}</p><p class="meta">Status: ${o.status}</p><div class="actions"><button class="ghost" data-action="approveOrg" data-id="${o._id}">Approve</button><button class="ghost" data-action="rejectOrg" data-id="${o._id}">Reject</button></div></div>`
      )
      .join("");
    log(`Loaded ${orgs.length} organisation(s).`);
  } catch (error) {
    log(`Load organisations failed: ${error.message}`);
  }
});

adminDataList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  try {
    if (action === "approveOrg") await api(`/auth/organizations/${id}/review`, "PATCH", { status: "Approved" });
    if (action === "rejectOrg") await api(`/auth/organizations/${id}/review`, "PATCH", { status: "Rejected" });
    log("Review saved.");
    document.getElementById("loadOrgsBtn").click();
  } catch (error) {
    log(`Action failed: ${error.message}`);
  }
});

clearLogBtn.addEventListener("click", () => {
  logBox.textContent = "";
});

updateUserUI();
loadManagerOrganizationStatus();
