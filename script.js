let inputElement;
let chatElement;
let isStart = false;

let firstNumber = null;
let secondNumber = null;
let isWaitingForSign = false;

let typingIndicator = null;
let isTypingVisible = false;

function addMessage(text, sender) {
  const row = document.createElement("div");
  row.classList.add("row", sender);

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");

  if (sender === "bot") {
    avatar.src = "assets/avatars/bot_avatar.png";
    avatar.alt = "bot";
  } else {
    avatar.src = "assets/avatars/user_avatar.png";
    avatar.alt = "user";
  }

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  row.appendChild(avatar);
  row.appendChild(bubble);

  chatElement.appendChild(row);
  chatElement.scrollTop = chatElement.scrollHeight;
}

function showTypingIndicator() {
  if (isTypingVisible) {
    return;
  }

  const row = document.createElement("div");
  row.classList.add("row", "user");
  row.id = "typing-indicator";

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = "assets/avatars/user_avatar.png";
  avatar.alt = "user";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "typing-bubble");

  const dot1 = document.createElement("span");
  dot1.classList.add("dot");

  const dot2 = document.createElement("span");
  dot2.classList.add("dot");

  const dot3 = document.createElement("span");
  dot3.classList.add("dot");

  bubble.appendChild(dot1);
  bubble.appendChild(dot2);
  bubble.appendChild(dot3);

  row.appendChild(avatar);
  row.appendChild(bubble);

  chatElement.appendChild(row);
  chatElement.scrollTop = chatElement.scrollHeight;

  typingIndicator = row;
  isTypingVisible = true;
}

function hideTypingIndicator() {
  if (typingIndicator) {
    typingIndicator.remove();
    typingIndicator = null;
  }

  isTypingVisible = false;
}

window.onload = function () {
  inputElement = document.getElementById("message");
  chatElement = document.getElementById("chat");

  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkMessage();
    }
  });

  inputElement.addEventListener("input", function () {
    const text = inputElement.value.trim();

    if (text.length > 0) {
      showTypingIndicator();
    } else {
      hideTypingIndicator();
    }
  });
};

function checkMessage() {
  const message = inputElement.value.trim();

  if (message === "") {
    return;
  }

  hideTypingIndicator();

  addMessage(message, "user");
  inputElement.value = "";

  if (message === "/start") {
    isStart = true;
    start();
    return;
  }

  if (!isStart) {
    addMessage("Введите команду /start, для начала общения", "bot");
    return;
  }

  if (isWaitingForSign) {
    if (
      message !== "+" &&
      message !== "-" &&
      message !== "*" &&
      message !== "/"
    ) {
      addMessage("Введите один знак: + - * /", "bot");
      return;
    }

    const result = calculate(firstNumber, secondNumber, message);

    if (result === undefined) {
      return;
    }

    addMessage(`Результат: ${result}`, "bot");

    isWaitingForSign = false;
    firstNumber = null;
    secondNumber = null;
    return;
  }

  if (message.startsWith("/name:")) {
    name(message);
  } else if (message.startsWith("/number:")) {
    countNumber(message);
  } else if (message === "/stop") {
    stop();
  } else {
    addMessage("Я не понимаю, введите другую команду!", "bot");
  }
}

function start() {
  addMessage("Привет, меня зовут Чат-бот, а как зовут тебя?", "bot");
}

function name(message) {
  const userName = message.slice(6).trim();

  if (userName.length === 0) {
    addMessage("Введите имя после /name:", "bot");
  } else {
    addMessage(
      `Привет ${userName}, приятно познакомиться. Я умею считать, введи числа которые надо посчитать`,
      "bot"
    );
  }
}

function countNumber(message) {
  const numbersPart = message.slice(8).trim();

  if (numbersPart.includes("+")) {
    calculateExpression(numbersPart, "+");
  } else if (numbersPart.includes("-")) {
    calculateExpression(numbersPart, "-");
  } else if (numbersPart.includes("*")) {
    calculateExpression(numbersPart, "*");
  } else if (numbersPart.includes("/")) {
    calculateExpression(numbersPart, "/");
  } else if (numbersPart.includes(",")) {
    const parts = numbersPart.split(",");

    if (parts.length !== 2) {
      addMessage("Введите два числа в формате: /number: 1, 2", "bot");
      return;
    }

    firstNumber = Number(parts[0].trim());
    secondNumber = Number(parts[1].trim());

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
      addMessage("Введите два числа в формате: /number: 1, 2", "bot");
      return;
    }

    isWaitingForSign = true;
    addMessage("Выберите знак: + - * /", "bot");
  } else {
    addMessage("Введите пример так: /number: 1 + 2 или /number: 1, 2", "bot");
  }
}

function calculateExpression(expression, sign) {
  const parts = expression.split(sign);

  if (parts.length !== 2) {
    addMessage("Введите пример правильно", "bot");
    return;
  }

  const num1 = Number(parts[0].trim());
  const num2 = Number(parts[1].trim());

  if (isNaN(num1) || isNaN(num2)) {
    addMessage("Введите два числа правильно", "bot");
    return;
  }

  const result = calculate(num1, num2, sign);

  if (result === undefined) {
    return;
  }

  addMessage(`Результат: ${result}`, "bot");
}

function calculate(num1, num2, sign) {
  if (sign === "+") {
    return num1 + num2;
  } else if (sign === "-") {
    return num1 - num2;
  } else if (sign === "*") {
    return num1 * num2;
  } else if (sign === "/") {
    if (num2 === 0) {
      addMessage("На ноль делить нельзя", "bot");
      return;
    }
    return num1 / num2;
  }
}

function stop() {
  isStart = false;
  isWaitingForSign = false;
  firstNumber = null;
  secondNumber = null;
  hideTypingIndicator();

  addMessage("Всего доброго, если хочешь поговорить пиши /start", "bot");
}