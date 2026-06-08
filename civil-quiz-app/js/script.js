/* ========================================
   現在表示中の問題番号
======================================== */

let currentIndex =
Number(
    localStorage.getItem(
        "quizCurrentIndex"
    )
) || 0;


/* ========================================
   ユーザー回答
======================================== */

let userAnswers =
JSON.parse(
    localStorage.getItem(
        "quizAnswers"
    )
) || [];


/* ========================================
   HTML取得
======================================== */

const questionElement =
document.getElementById(
    "question"
);

const choicesElement =
document.getElementById(
    "choices"
);


/* ========================================
   問題表示
======================================== */

function showQuestion() {

    const currentQuestion =
    questions[currentIndex];

    document.getElementById(
        "question-number"
    ).textContent =
    `問 ${currentQuestion.id}`;

    document.getElementById(
        "progress-text"
    ).textContent =
    `${currentIndex + 1}問目 / 全${questions.length}問`;

    const progressPercent =
    (
        (currentIndex + 1)
        /
        questions.length
    ) * 100;

    document.getElementById(
        "progress-bar"
    ).style.width =
    `${progressPercent}%`;

    questionElement.textContent =
    currentQuestion.question;

    choicesElement.innerHTML = "";

    currentQuestion.choices.forEach(
        (choice, index) => {

            const button =
            document.createElement(
                "button"
            );

            button.classList.add(
                "choice-btn"
            );

            button.textContent =
            choice;

            if (
                userAnswers[currentIndex]
                === index
            ) {
                button.classList.add(
                    "selected"
                );
            }

            button.onclick = () => {

                userAnswers[currentIndex] =
                index;

                localStorage.setItem(
                    "quizAnswers",
                    JSON.stringify(
                        userAnswers
                    )
                );

                showQuestion();

            };

            choicesElement.appendChild(
                button
            );

        }
    );

}


/* ========================================
   初回表示
======================================== */

showQuestion();


/* ========================================
   次へ
======================================== */

document
.getElementById("next-btn")
.onclick = () => {

    if (
        currentIndex <
        questions.length - 1
    ) {

        currentIndex++;

        localStorage.setItem(
            "quizCurrentIndex",
            currentIndex
        );

        showQuestion();

    }

};


/* ========================================
   前へ
======================================== */

document
.getElementById("prev-btn")
.onclick = () => {

    if (
        currentIndex > 0
    ) {

        currentIndex--;

        localStorage.setItem(
            "quizCurrentIndex",
            currentIndex
        );

        showQuestion();

    }

};


/* ========================================
   採点
======================================== */

document
.getElementById("score-btn")
.onclick = () => {

    const unanswered = [];

    questions.forEach(
        (question, index) => {

            if (
                userAnswers[index]
                === undefined
            ) {

                unanswered.push(
                    question.id
                );

            }

        }
    );

    if (
        unanswered.length > 0
    ) {

        document
        .getElementById("result")
        .innerHTML = "";

        document
        .getElementById(
            "answer-review"
        ).innerHTML = "";

        showUnansweredList(
            unanswered
        );

        return;

    }

    gradeQuiz();

};


/* ========================================
   採点処理
======================================== */

function gradeQuiz() {

    document
    .getElementById(
        "unanswered-area"
    ).innerHTML = "";

    let correctCount = 0;

    questions.forEach(
        (question, index) => {

            if (
                userAnswers[index]
                === question.answer
            ) {

                correctCount++;

            }

        }
    );

    const rate =
    (
        correctCount
        /
        questions.length
        * 100
    ).toFixed(1);

    let message = "";

    if (rate >= 90) {
        message =
        "素晴らしい成績です！";
    }
    else if (rate >= 70) {
        message =
        "合格圏内です！";
    }
    else if (rate >= 50) {
        message =
        "あと少しです！";
    }
    else {
        message =
        "復習をおすすめします";
    }

    let rank = "";

    if (rate >= 90) {
        rank = "S";
    }
    else if (rate >= 80) {
        rank = "A";
    }
    else if (rate >= 70) {
        rank = "B";
    }
    else if (rate >= 60) {
        rank = "C";
    }
    else {
        rank = "D";
    }

    document
    .getElementById("result")
    .innerHTML = `

        <h2>
        ${questions.length}問中
        ${correctCount}問正解
        </h2>

        <p class="score-rate">
        ${rate}%
        </p>

        <h3>
        ランク：${rank}
        </h3>

        <p>
        ${message}
        </p>

    `;

    showAnswerReview();

    document
    .getElementById(
        "restart-btn"
    ).style.display =
    "inline-block";

}


/* ========================================
   未回答一覧
======================================== */

function showUnansweredList(
    unanswered
) {

    const area =
    document.getElementById(
        "unanswered-area"
    );

    area.innerHTML =
    `<h3>未回答が${unanswered.length}問あります</h3>`;

    unanswered.forEach(
        questionId => {

            const button =
            document.createElement(
                "button"
            );

            button.textContent =
            `問${questionId}`;

            button.onclick = () => {

                const targetIndex =
                questions.findIndex(
                    q =>
                    q.id === questionId
                );

                currentIndex =
                targetIndex;

                showQuestion();

                area.innerHTML = "";

            };

            area.appendChild(
                button
            );

        }
    );

}


/* ========================================
   答え合わせ
======================================== */

function showAnswerReview() {

    const reviewArea =
    document.getElementById(
        "answer-review"
    );

    reviewArea.innerHTML = "";

    questions.forEach(
        (question, index) => {

            const isCorrect =
            userAnswers[index]
            === question.answer;

            const result =
            isCorrect ? "○" : "×";

            const resultClass =
            isCorrect
            ? "correct"
            : "incorrect";

            const userAnswerText =
            question.choices[
                userAnswers[index]
            ];

            const correctAnswerText =
            question.choices[
                question.answer
            ];

            /* ==========================
               解説がある時だけ表示
            ========================== */

            let explanationHtml = "";

            if (
                question.explanation
            ) {

                explanationHtml = `

                    <p>
                        <strong>解説</strong><br>
                        ${question.explanation}
                    </p>

                `;

            }

            reviewArea.innerHTML += `

                <div class="review-card">

                    <h3 class="${resultClass}">
                        問${question.id}
                        ${result}
                    </h3>

                    <p>
                        <strong>あなたの回答</strong><br>
                        ${userAnswerText}
                    </p>

                    <p>
                        <strong>正解</strong><br>
                        ${correctAnswerText}
                    </p>

                    ${explanationHtml}

                </div>

            `;

        }
    );

}


/* ========================================
   リスタート
======================================== */

document
.getElementById("restart-btn")
.onclick = () => {

    if (
        !confirm(
            "最初からやり直しますか？"
        )
    ) {
        return;
    }

    currentIndex = 0;
    userAnswers = [];

    localStorage.removeItem(
        "quizAnswers"
    );

    localStorage.removeItem(
        "quizCurrentIndex"
    );

    document
    .getElementById("result")
    .innerHTML = "";

    document
    .getElementById("unanswered-area")
    .innerHTML = "";

    document
    .getElementById("answer-review")
    .innerHTML = "";

    document
    .getElementById("restart-btn")
    .style.display =
    "none";

    showQuestion();

};