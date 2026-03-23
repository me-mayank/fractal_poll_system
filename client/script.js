const BASE_URL = "https://fractal-poll-system.onrender.com";

const userId = localStorage.getItem("uid") || Math.random().toString();
localStorage.setItem("uid", userId);

let token = localStorage.getItem("adminToken");

// ---------------------- STUDENT ----------------------

function vote(option) {
  fetch(`${BASE_URL}/poll/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ option, userId }),
  });
}

function updateUI(data) {
  for (let key in data) {
    const percent = data[key];
    document.getElementById(`bar-${key}`).style.width = percent + "%";
    document.getElementById(`text-${key}`).innerText = `${key} - ${percent}%`;
  }
}

function fetchResults() {
  fetch(`${BASE_URL}/poll/results`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "Voting in progress") {
        document.getElementById("status").innerText = "Voting in progress...";
      } else if (data.status === "ENDED") {
        document.getElementById("status").innerText = "Results";

        updateUI(data.result);
      } else {
        document.getElementById("status").innerText = "Waiting for poll...";
      }
    });
}

setInterval(fetchResults, 1000);

// ---------------------- ADMIN ----------------------

function login() {
  fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        token = data.token;
        localStorage.setItem("adminToken", token);
        alert("Logged in!");
      } else {
        alert("Invalid credentials");
      }
    });
}

function startPoll() {
  fetch(`${BASE_URL}/poll/start`, {
    method: "POST",
    headers: { Authorization: token },
  });
}

function endPoll() {
  fetch(`${BASE_URL}/poll/end`, {
    method: "POST",
    headers: { Authorization: token },
  });
}

function resetPoll() {
  fetch(`${BASE_URL}/poll/reset`, {
    method: "POST",
    headers: { Authorization: token },
  });
}
