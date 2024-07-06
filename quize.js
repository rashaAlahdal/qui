document.addEventListener('DOMContentLoaded', function() {
  
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");

let shuffledQuestions, currentQuestionIndex, score;
async function getQuestions() {
  const querySnapshot = await getDocs(collection(db, 'NewQuiz'));
  const questions = [];
  querySnapshot.forEach((doc) => {
      questions.push(doc.data());
  });
  return questions;
}

async function startQuiz() {
  score = 0;
  questionContainer.style.display = "flex";
  const questions = await getQuestions();
  shuffledQuestions = questions.sort(() => Math.random() - 0.5); //يرتب الاسئلة بشكل عشوائي من البداية للنهاية

  currentQuestionIndex = 0;
  nextButton.classList.remove("hide");
  restartButton.classList.add("hide");
  resultDiv.classList.add("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer, index) => {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = "answer" + index;
    radio.name = "answer";
    radio.value = index;

    const label = document.createElement("label");
    label.htmlFor = "answer" + index;
    label.innerText = answer.text;

    inputGroup.appendChild(radio);
    inputGroup.appendChild(label);
    answerButtons.appendChild(inputGroup);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

nextButton.addEventListener("click", () => {
  const answerIndex = Array.from(
    answerButtons.querySelectorAll("input")
  ).findIndex((radio) => radio.checked);
  if (answerIndex !== -1) {
    if (shuffledQuestions[currentQuestionIndex].answers[answerIndex].correct) {
      score++;
    }
    currentQuestionIndex++;
    if (shuffledQuestions.length > currentQuestionIndex) {
      setNextQuestion();
    } else {
      endQuiz();
    }
  } else {
    alert("Please select an answer.");
  }
});

restartButton.addEventListener("click", startQuiz);


function endQuiz() {
  questionContainer.style.display = "none";
  nextButton.classList.add("hide");
  restartButton.classList.remove("hide");
  resultDiv.classList.remove("hide");
  resultDiv.innerText = `Your final score: ${score} / ${shuffledQuestions.length}`;
  
  // Get the correct and incorrect answers
  const correctAnswers = shuffledQuestions.filter(
    (questions, index) =>
      shuffledQuestions[index].answers[
        Array.from(
          answerButtons.querySelectorAll("input")
        ).findIndex((radio) => radio.checked)
      ].correct
  ).length;
  const incorrectAnswers = shuffledQuestions.length - correctAnswers;

    // Display the final result
    resultDiv.innerHTML = `
      Your final score: ${score} / ${shuffledQuestions.length}<br>
      Correct answers: ${correctAnswers}<br>
      Incorrect answers: ${incorrectAnswers}
    `;
}


startQuiz();
});

