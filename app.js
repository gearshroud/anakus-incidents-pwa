const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbybvNKLtz6fg27tMWF_DHZY1VNLkwNri85wlODZmwgbCqCI39Xul7SZ2jgTYqB4NMDesg/exec";
const SHARED_KEY = "tails-and-ales-incident-v1";

const form = document.getElementById("incidentForm");
const statusEl = document.getElementById("networkStatus");
const submitMessageEl = document.getElementById("submitMessage");
const submitButton = document.getElementById("submitButton");
const injuryToggle = document.getElementById("anyInjuries");
const injuryFields = document.getElementById("injuryFields");
const whoInjured = document.getElementById("whoInjured");
const injuryDescription = document.getElementById("injuryDescription");
const attendantNameInput = document.getElementById("attendantName");
const dateInput = document.getElementById("dateOfIncident");
const timeInput = document.getElementById("timeOfIncident");

function toLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toLocalTimeValue(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function setNowDefaults() {
  const now = new Date();
  dateInput.value = toLocalDateValue(now);
  timeInput.value = toLocalTimeValue(now);
}

function updateConnectionStatus() {
  if (navigator.onLine) {
    statusEl.textContent = "Online";
    statusEl.classList.add("online");
    statusEl.classList.remove("offline");
  } else {
    statusEl.textContent = "Offline";
    statusEl.classList.add("offline");
    statusEl.classList.remove("online");
  }
}

function toggleInjuryFields() {
  const show = injuryToggle.value === "Yes";
  injuryFields.classList.toggle("is-hidden", !show);
  whoInjured.required = show;
  injuryDescription.required = show;
  if (!show) {
    whoInjured.value = "";
    injuryDescription.value = "";
  }
}

function saveAttendantName() {
  localStorage.setItem("tails-and-ales.attendantName", attendantNameInput.value.trim());
}

function loadAttendantName() {
  const saved = localStorage.getItem("tails-and-ales.attendantName");
  if (saved) attendantNameInput.value = saved;
}

async function submitIncident(event) {
  event.preventDefault();
  submitMessageEl.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  const formData = new FormData(form);
  const payload = {
    key: SHARED_KEY,
    attendantName: formData.get("attendantName"),
    emailAddress: formData.get("emailAddress"),
    dateOfIncident: formData.get("dateOfIncident"),
    timeOfIncident: formData.get("timeOfIncident"),
    timeOfDay: formData.get("timeOfDay"),
    typeOfIncident: formData.get("typeOfIncident"),
    severityLevel: formData.get("severityLevel"),
    dogNames: formData.get("dogNames"),
    ownerNames: formData.get("ownerNames"),
    dogsSeparated: formData.get("dogsSeparated"),
    dogRemoved: formData.get("dogRemoved"),
    anyInjuries: formData.get("anyInjuries"),
    whoInjured: formData.get("whoInjured"),
    injuryDescription: formData.get("injuryDescription"),
    actionsTaken: formData.get("actionsTaken"),
    mediaLink: formData.get("mediaLink"),
    requiresFollowUp: formData.get("requiresFollowUp"),
    managerNotes: formData.get("managerNotes"),
    incidentDescription: formData.get("incidentDescription"),
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    submitMessageEl.textContent = "Report submitted successfully.";
    saveAttendantName();
    const savedName = attendantNameInput.value;
    form.reset();
    attendantNameInput.value = savedName;
    setNowDefaults();
    toggleInjuryFields();
  } catch (error) {
    submitMessageEl.textContent =
      "Unable to submit right now. Check your connection and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Report";
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // No-op: app still works without service worker registration.
    });
  }
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
injuryToggle.addEventListener("change", toggleInjuryFields);
attendantNameInput.addEventListener("change", saveAttendantName);
form.addEventListener("submit", submitIncident);

loadAttendantName();
setNowDefaults();
toggleInjuryFields();
updateConnectionStatus();
registerServiceWorker();
