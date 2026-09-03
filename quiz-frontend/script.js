// ============================
// DOM ELEMENTS
// ============================

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

const previousButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");

const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");

const resultMessage = document.getElementById("result-message");
const progressBar = document.getElementById("progress");


// ============================
// QUIZ VARIABLES
// ============================

let quizQuestions = [];

let currentQuestionIndex = 0;

let score = 0;

// Stores the selected answer for every question
let userAnswers = [];


// ============================
// LOAD QUESTIONS FROM BACKEND
// ============================

async function loadQuestions() {

  try {

    const response = await fetch(
      "http://localhost:3000/questions"
    );

    if (!response.ok) {
      throw new Error("Could not load questions");
    }

    quizQuestions = await response.json();

    console.log("Questions loaded:", quizQuestions);

    totalQuestionsSpan.textContent = quizQuestions.length;
    maxScoreSpan.textContent = quizQuestions.length;

  } catch (error) {

    console.error("Error:", error);

    alert(
      "Could not load questions. Make sure the backend server is running."
    );

  }

}


// ============================
// START QUIZ
// ============================

function startQuiz() {

  if (quizQuestions.length === 0) {

    alert("Questions are still loading. Please wait!");

    return;

  }

  currentQuestionIndex = 0;

  score = 0;

  // Empty answers for a new quiz
  userAnswers = new Array(quizQuestions.length).fill(null);

  scoreSpan.textContent = score;


  startScreen.classList.remove("active");

  resultScreen.classList.remove("active");

  quizScreen.classList.add("active");


  showQuestion();

}


// ============================
// SHOW QUESTION
// ============================

function showQuestion() {

  const currentQuestion =
    quizQuestions[currentQuestionIndex];


  // Question number
  currentQuestionSpan.textContent =
    currentQuestionIndex + 1;


  // Progress bar
  const progressPercent =
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  progressBar.style.width =
    progressPercent + "%";


  // Show question
  questionText.textContent =
    currentQuestion.question_text;


  // Clear previous buttons
  answersContainer.innerHTML = "";


  // Create options
  const answers = [
    {
      text: currentQuestion.option_a,
      letter: "A"
    },

    {
      text: currentQuestion.option_b,
      letter: "B"
    },

    {
      text: currentQuestion.option_c,
      letter: "C"
    },

    {
      text: currentQuestion.option_d,
      letter: "D"
    }
  ];


  answers.forEach((answer) => {

    const button =
      document.createElement("button");


    button.textContent = answer.text;

    button.classList.add("answer-btn");


    // Store answer information
    button.dataset.answerText = answer.text;

    button.dataset.letter = answer.letter;


    // If user already answered this question
    if (userAnswers[currentQuestionIndex] !== null) {

      showSavedAnswer(
        button,
        currentQuestion
      );

    } else {

      button.addEventListener(
        "click",
        selectAnswer
      );

    }


    answersContainer.appendChild(button);

  });


  updateNavigationButtons();

}


// ============================
// CHECK CORRECT ANSWER
// ============================

function isCorrectAnswer(
  selectedText,
  selectedLetter,
  correctAnswer
) {

  // Convert to strings safely
  const correct =
    String(correctAnswer).trim().toLowerCase();

  const text =
    String(selectedText).trim().toLowerCase();

  const letter =
    String(selectedLetter).trim().toLowerCase();


  // Works if correct_answer is "A", "B", "C", or "D"
  if (correct === letter) {
    return true;
  }


  // Works if correct_answer contains the actual answer text
  if (correct === text) {
    return true;
  }


  return false;

}


// ============================
// SELECT ANSWER
// ============================

function selectAnswer(event) {

  const selectedButton =
    event.target;


  const currentQuestion =
    quizQuestions[currentQuestionIndex];


  const selectedText =
    selectedButton.dataset.answerText;


  const selectedLetter =
    selectedButton.dataset.letter;


  // Check correctness
  const isCorrect =
    isCorrectAnswer(
      selectedText,
      selectedLetter,
      currentQuestion.correct_answer
    );


  // Save answer
  userAnswers[currentQuestionIndex] = {

    text: selectedText,

    letter: selectedLetter,

    correct: isCorrect

  };


  // Calculate score again
  calculateScore();


  // Disable all answer buttons
  const buttons =
    Array.from(answersContainer.children);


  buttons.forEach((button) => {

    button.disabled = true;

    const buttonText =
      button.dataset.answerText;

    const buttonLetter =
      button.dataset.letter;


    const correct =
      isCorrectAnswer(
        buttonText,
        buttonLetter,
        currentQuestion.correct_answer
      );


    // Correct answer → GREEN
    if (correct) {

      button.classList.add("correct");

    }

    // Selected wrong answer → RED
    else if (button === selectedButton) {

      button.classList.add("incorrect");

    }

  });


  updateNavigationButtons();

}


// ============================
// SHOW SAVED ANSWER
// ============================

function showSavedAnswer(
  button,
  currentQuestion
) {

  const savedAnswer =
    userAnswers[currentQuestionIndex];


  button.disabled = true;


  const buttonText =
    button.dataset.answerText;

  const buttonLetter =
    button.dataset.letter;


  const correct =
    isCorrectAnswer(
      buttonText,
      buttonLetter,
      currentQuestion.correct_answer
    );


  // Show correct answer green
  if (correct) {

    button.classList.add("correct");

  }


  // Show user's wrong answer red
  if (
    buttonText === savedAnswer.text &&
    !savedAnswer.correct
  ) {

    button.classList.add("incorrect");

  }

}


// ============================
// CALCULATE SCORE
// ============================

function calculateScore() {

  score = userAnswers.filter((answer) => {

    return answer !== null &&
      answer.correct === true;

  }).length;


  scoreSpan.textContent = score;

}


// ============================
// NEXT QUESTION
// ============================

function nextQuestion() {

  // User must answer before moving next
  if (userAnswers[currentQuestionIndex] === null) {

    alert("Please select an answer first!");

    return;

  }


  // If last question
  if (
    currentQuestionIndex ===
    quizQuestions.length - 1
  ) {

    showResults();

    return;

  }


  currentQuestionIndex++;

  showQuestion();

}


// ============================
// PREVIOUS QUESTION
// ============================

function previousQuestion() {

  if (currentQuestionIndex > 0) {

    currentQuestionIndex--;

    showQuestion();

  }

}


// ============================
// UPDATE BUTTONS
// ============================

function updateNavigationButtons() {

  // Disable Previous on first question
  previousButton.disabled =
    currentQuestionIndex === 0;


  // Last question button text
  if (
    currentQuestionIndex ===
    quizQuestions.length - 1
  ) {

    nextButton.textContent =
      "Finish Quiz";

  }

  else {

    nextButton.textContent =
      "Next →";

  }

}


// ============================
// SHOW RESULTS
// ============================

function showResults() {

  quizScreen.classList.remove("active");

  resultScreen.classList.add("active");


  finalScoreSpan.textContent = score;


  maxScoreSpan.textContent =
    quizQuestions.length;


  progressBar.style.width = "100%";


  const percentage =
    (score / quizQuestions.length) * 100;


  if (percentage === 100) {

    resultMessage.textContent =
      "Perfect! You're a genius!";

  }

  else if (percentage >= 80) {

    resultMessage.textContent =
      "Great job! You know your stuff!";

  }

  else if (percentage >= 60) {

    resultMessage.textContent =
      "Good effort! Keep learning!";

  }

  else if (percentage >= 40) {

    resultMessage.textContent =
      "Not bad! Try again to improve!";

  }

  else {

    resultMessage.textContent =
      "Keep studying! You'll get better!";

  }

}


// ============================
// RESTART QUIZ
// ============================

function restartQuiz() {

  resultScreen.classList.remove("active");

  startScreen.classList.add("active");

  progressBar.style.width = "0%";

}


// ============================
// BUTTON EVENTS
// ============================

startButton.addEventListener(
  "click",
  startQuiz
);


restartButton.addEventListener(
  "click",
  restartQuiz
);


previousButton.addEventListener(
  "click",
  previousQuestion
);


nextButton.addEventListener(
  "click",
  nextQuestion
);


// ============================
// LOAD QUESTIONS
// ============================

loadQuestions();