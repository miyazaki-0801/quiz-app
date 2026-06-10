let currentQuestions = questions;

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

    /* 問題が1件も無い場合 */

    if (
        currentQuestions.length === 0
    ) {

        document.getElementById(
            "question-number"
        ).textContent = "";

        document.getElementById(
            "progress-text"
        ).textContent =
        "問題が登録されていません";

        document.getElementById(
            "progress-bar"
        ).style.width = "0%";

        questionElement.textContent =
        "この年度の問題はまだ登録されていません。";

        choicesElement.innerHTML = "";

        return;

    }

    const currentQuestion =
    currentQuestions[currentIndex];

    document.getElementById(
    "question-number"
).textContent =
`${currentQuestion.year} 第${currentQuestion.id}問`;

    document.getElementById(
        "progress-text"
    ).textContent =
    `${currentIndex + 1}問目 / 全${currentQuestions.length}問`;

    const progressPercent =
    (
        (currentIndex + 1)
        /
        currentQuestions.length
    ) * 100;

    document.getElementById(
        "progress-bar"
    ).style.width =
    `${progressPercent}%`;

    questionElement.textContent =
    currentQuestion.question;

    const imageElement =
document.getElementById(
    "question-image"
);

if(currentQuestion.image){

    imageElement.src =
    currentQuestion.image;

    imageElement.style.display =
    "block";

}
else{

    imageElement.src = "";

    imageElement.style.display =
    "none";

}

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

            const choiceNumber =

["①","②","③","④"];

button.innerHTML = `
<span class="choice-number">
${choiceNumber[index]}
</span>
${choice}
`;
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
        currentQuestions.length - 1
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
   スキップボタン
======================================== */
const skipButton =
document.getElementById(
    "skip-btn"
);

skipButton.addEventListener(
    "click",
    () => {

        userAnswers[currentIndex] = -1;

        localStorage.setItem(
            "quizAnswers",
            JSON.stringify(
                userAnswers
            )
        );

        if (
        currentIndex <
        currentQuestions.length - 1
        ) {

            currentIndex++;

            localStorage.setItem(
                "quizCurrentIndex",
                currentIndex
            );

            showQuestion();

        }

    }
);


/* ========================================
   採点
======================================== */

document
.getElementById("score-btn")
.onclick = () => {

    const unanswered = [];

    currentQuestions.forEach(
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

    let unansweredCount = 0;

    let skippedCount = 0;

    const skippedQuestions =
currentQuestions.filter(
    (question, index) =>
    userAnswers[index] === -1
);

let skippedHtml = "";

if (
    skippedQuestions.length > 0
) {

    skippedHtml +=
    "<h3>🟧 スキップした問題</h3>";

    skippedQuestions.forEach(
        question => {

            skippedHtml += `
                <p>
                    問${question.id}
                </p>
            `;

        }
    );

}

   currentQuestions.forEach(
    (question, index) => {

        if (
            userAnswers[index]
            === undefined
        ) {

            unansweredCount++;

        }

        if (
            userAnswers[index]
            === -1
        ) {

            skippedCount++;

        }

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
        currentQuestions.length
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
    ${currentQuestions.length}問中
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

    <p>
    スキップ：${skippedCount}問
    </p>

    ${skippedHtml}

    <p>
    未回答：${unansweredCount}問
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

button.classList.add(
    "unanswered-btn"
);
        
        button.onclick = () => {

            const targetIndex =
            currentQuestions.findIndex(
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

    currentQuestions.forEach(
        (question, index) => {

            const isCorrect =
            userAnswers[index]
            === question.answer;

            const result =
            isCorrect ? "○" : "×";

            let resultClass = "";

if (
    userAnswers[index] === -1
) {

    resultClass =
    "skipped";

}
else {

    resultClass =
    isCorrect
    ? "correct"
    : "incorrect";

}
            const choiceNumber =

["①","②","③","④"];

if (
    userAnswers[index] === -1
) {

    userAnswerText =
    "⏭️ スキップ";

}
else {

    userAnswerText =

`${choiceNumber[
    userAnswers[index]
]} ${question.choices[
    userAnswers[index]
]}`;

}

            const correctAnswerText =

`${choiceNumber[
    question.answer
]} ${question.choices[
    question.answer
]}`;

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

/* ========================================
   年度切替
======================================== */

function loadYear(year) {

    currentQuestions =
questions.filter(
    q => q.year === year
);

shuffleArray(
    currentQuestions
);

    userAnswers = [];

    localStorage.removeItem(
        "quizAnswers"
    );

    localStorage.removeItem(
        "quizCurrentIndex"
    );

    document.getElementById(
        "result"
    ).innerHTML = "";

    document.getElementById(
        "unanswered-area"
    ).innerHTML = "";

    document.getElementById(
        "answer-review"
    ).innerHTML = "";

    document.getElementById(
        "restart-btn"
    ).style.display =
    "none";

    showQuestion();
}

function loadAllQuestions() {

    currentQuestions =
[...questions];

shuffleArray(
    currentQuestions
);
    userAnswers = [];

    localStorage.removeItem(
        "quizAnswers"
    );

    localStorage.removeItem(
        "quizCurrentIndex"
    );

    document.getElementById(
        "result"
    ).innerHTML = "";

    document.getElementById(
        "unanswered-area"
    ).innerHTML = "";

    document.getElementById(
        "answer-review"
    ).innerHTML = "";

    document.getElementById(
        "restart-btn"
    ).style.display =
    "none";

    showQuestion();
}

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
        Math.floor(
            Math.random() * (i + 1)
        );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}
