let msgInput = document.getElementById("msg");
let send = document.getElementById("send");
let container = document.getElementsByClassName("chat-messages")[0];
let dots = document.getElementsByClassName("typing-animation")[0];

var io = io("http://localhost:9000");

let user = "";

function fun(evt) {
  if (msgInput.value.trim() !== "") {
    if (evt.key === "Enter") {
      let msg = evt.path[0].value;
      io.emit("msg", { msg, username: user });
      msgInput.value = "";
      io.emit("stopedTyping");
    }
    if (evt.target === send) {
      let msg = msgInput.value;
      io.emit("msg", { msg, username: user });
      msgInput.value = "";
      io.emit("stopedTyping");
    }
  }
}

send.addEventListener("click", fun);
msgInput.addEventListener("keypress", fun);

let id = "";

io.on("yourSocketId", (newid) => {
  id = newid;
});

io.on("newMsg", (data) => {
  console.log(data);
  if (data.visitor === id) {
    addMsg(data.msg, data.username);
  } else {
    addMsg(data.msg, data.username, false);
  }
});

function addMsg(msg = "", username = "User", mine = true) {
  username = username.split(" ");
  if (username.length >= 2) {
    var firstLetter = username[0][0].toUpperCase();
    var secondLetter = username[1][0].toUpperCase();
  } else {
    var firstLetter = username[0][0].toUpperCase();
    var secondLetter = "";
  }
  if (mine) {
    var msgBox = `
      <div class="message received">
        <div class="avatar">${firstLetter + secondLetter}</div>
        <div class="message-content">
          <p>${msg}</p>
        </div>
      </div>`;
  } else {
    var msgBox = `
    <div class="message sent">
        <div class="avatar avatar-right">${firstLetter + secondLetter}</div>
        <div class="message-content">
          <p>${msg}</p>
        </div>
      </div>`;
  }
  container.innerHTML += msgBox;
  container.scrollBy(0, 500);
}

msgInput.addEventListener("keydown", (evt) => {
  io.emit("typing");
});

msgInput.addEventListener("keyup", (evt) => {
  io.emit("stopedTyping");
});

io.on("someoneIsTyping", () => {
  dots.style.display = "flex";
});
io.on("clearTypingStatus", () => {
  setTimeout(() => {
    dots.style.display = "none";
  }, 2000);
});

const alert = document.getElementById("alert");

io.on("newUser", (user) => {
  alert.style.bottom = "20px";
  alert.innerHTML = `${user} Joined The Chat`;
  setTimeout(() => {
    alert.style.bottom = "-100px";
  }, 2000);
});

// MODEL FOR USERNAME
// Get the modal element
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("sendMessage");

// Get the close button element
const closeBtn = document.getElementsByClassName("close")[0];

// When the page loads, show the modal
window.onload = function () {
  modal.style.display = "block";
};

// When the user clicks the button, save the username and hide the modal
document.getElementById("saveUserName").addEventListener("click", function () {
  const userName = document.getElementById("userNameInput").value;
  if (userName.trim() !== "") {
    user = userName;
    io.emit("userConnected", user);
    modal.style.display = "none"; // Hide the modal
  } else {
    alert("Please enter a valid name.");
  }
});

// When the user clicks on the close button, hide the modal
// closeBtn.onclick = function () {
//   modal.style.display = "none";
// };

// When the user clicks anywhere outside of the modal, hide it
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };
