const startBtn = document.getElementById("startBtn");
const questionCountSelect = document.getElementById("questionCount");
const statusEl = document.getElementById("status");
const quizEl = document.getElementById("quiz");

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

function decodeHtml(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function updateStatus() {
  statusEl.textContent = `Question ${currentIndex + 1} / ${questions.length} | Score: ${score}`;
}

function renderResult() {
  quizEl.innerHTML = `
    <div class="quiz-card">
      <h2>Quiz Finished</h2>
      <p>Your final score is <strong>${score}</strong> out of <strong>${questions.length}</strong>.</p>
      <button id="restartBtn">Play Again</button>
    </div>
  `;

  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", loadQuiz);
}

function renderQuestion() {
  if (currentIndex >= questions.length) {
    renderResult();
    return;
  }

  answered = false;
  const current = questions[currentIndex];
  const answers = shuffleArray([...current.incorrect_answers, current.correct_answer]);

  const answersHtml = answers
    .map(
      (answer, index) =>
        `<button class="answer-btn" data-index="${index}" data-answer="${encodeURIComponent(answer)}">${decodeHtml(answer)}</button>`
    )
    .join("");

  quizEl.innerHTML = `
    <div class="quiz-card">
      <p class="question">${decodeHtml(current.question)}</p>
      ${answersHtml}
      <button id="nextBtn" class="next-btn" disabled>Next</button>
    </div>
  `;

  updateStatus();

  const answerButtons = document.querySelectorAll(".answer-btn");
  const nextBtn = document.getElementById("nextBtn");

  answerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (answered) {
        return;
      }

      answered = true;
      const picked = decodeURIComponent(btn.dataset.answer);
      const correct = current.correct_answer;

      answerButtons.forEach((button) => {
        const value = decodeURIComponent(button.dataset.answer);
        button.disabled = true;
        if (value === correct) {
          button.classList.add("correct");
        }
      });

      if (picked === correct) {
        score += 1;
      } else {
        btn.classList.add("wrong");
      }

      nextBtn.disabled = false;
      updateStatus();
    });
  });

  nextBtn.addEventListener("click", () => {
    currentIndex += 1;
    renderQuestion();
  });
}

async function loadQuiz() {
  const amount = Number(questionCountSelect.value) || 10;
  statusEl.textContent = "Loading questions...";
  quizEl.innerHTML = "";

  try {
    const response = await fetch(`/quiz?amount=${amount}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No questions returned from API");
    }

    questions = data;
    currentIndex = 0;
    score = 0;
    renderQuestion();
  } catch (error) {
    statusEl.textContent = "Failed to load quiz questions. Please try again.";
  }
}

startBtn.addEventListener("click", loadQuiz);
