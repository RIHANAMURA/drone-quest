const wordBank = [
  { japanese: "小型無人航空機", answer: "small unmanned aircraft", decoys: ["controlled airspace", "visual observer", "remote pilot"] },
  { japanese: "遠隔操縦者", answer: "remote pilot", decoys: ["visual observer", "air traffic control", "registration"] },
  { japanese: "遠隔操縦者証明書", answer: "remote pilot certificate", decoys: ["airspace authorization", "waiver", "registration"] },
  { japanese: "目視内飛行", answer: "visual line of sight", decoys: ["night operation", "lost link", "ground speed"] },
  { japanese: "補助目視者", answer: "visual observer", decoys: ["remote pilot", "air traffic control", "crew member"] },
  { japanese: "管制空域", answer: "controlled airspace", decoys: ["uncontrolled airspace", "temporary flight restriction", "ground control station"] },
  { japanese: "非管制空域", answer: "uncontrolled airspace", decoys: ["controlled airspace", "restricted area", "prohibited area"] },
  { japanese: "空域許可", answer: "airspace authorization", decoys: ["waiver", "registration", "preflight inspection"] },
  { japanese: "特別許可・免除", answer: "waiver", decoys: ["certificate", "payload", "airspace authorization"] },
  { japanese: "一時的飛行制限", answer: "temporary flight restriction", decoys: ["remote ID", "cloud ceiling", "loading"] },
  { japanese: "飛行前点検", answer: "preflight inspection", decoys: ["maintenance log", "flight restriction", "registration"] },
  { japanese: "対地速度", answer: "ground speed", decoys: ["airspeed", "altitude", "visibility"] },
  { japanese: "高度", answer: "altitude", decoys: ["ceiling", "latitude", "longitude"] },
  { japanese: "視程", answer: "visibility", decoys: ["cloud ceiling", "payload", "observer"] },
  { japanese: "雲底高度", answer: "cloud ceiling", decoys: ["ground speed", "airspace", "waiver"] },
  { japanese: "積載物", answer: "payload", decoys: ["latitude", "registration", "visibility"] },
  { japanese: "登録", answer: "registration", decoys: ["waiver", "payload", "airspace"] },
  { japanese: "リモートID", answer: "remote ID", decoys: ["visual observer", "ground speed", "night operation"] },
  { japanese: "夜間運航", answer: "night operation", decoys: ["daylight operation", "visual line of sight", "preflight inspection"] },
  { japanese: "航空交通管制", answer: "air traffic control", decoys: ["remote pilot", "visual observer", "ground control station"] },
  { japanese: "耐空性", answer: "airworthiness", decoys: ["visibility", "latitude", "loading"] },
  { japanese: "気象概況", answer: "weather briefing", decoys: ["maintenance log", "flight log", "registration"] },
  { japanese: "突風", answer: "gust", decoys: ["ceiling", "humidity", "visibility"] },
  { japanese: "風向", answer: "wind direction", decoys: ["wind speed", "ground speed", "cloud ceiling"] },
  { japanese: "風速", answer: "wind speed", decoys: ["airspeed", "visibility", "altitude"] },
  { japanese: "緯度", answer: "latitude", decoys: ["longitude", "altitude", "payload"] },
  { japanese: "経度", answer: "longitude", decoys: ["latitude", "ceiling", "airspeed"] },
  { japanese: "操縦不能リンク喪失", answer: "lost link", decoys: ["remote ID", "visual observer", "flight restriction"] },
  { japanese: "危険物", answer: "hazardous material", decoys: ["payload", "registration", "maintenance log"] },
  { japanese: "乗員資源管理", answer: "crew resource management", decoys: ["airspace authorization", "weather briefing", "preflight inspection"] }
];

const missionLength = 10;
const batteryPenalty = 20;

let questions = [];
let currentIndex = 0;
let score = 0;
let battery = 100;
let correctCount = 0;
let learnedWords = [];
let missedWords = [];
let acceptingAnswers = false;

const scoreEl = document.querySelector("#score");
const batteryEl = document.querySelector("#battery");
const missionEl = document.querySelector("#mission");
const routeFillEl = document.querySelector("#route-fill");
const droneEl = document.querySelector("#drone");
const meaningEl = document.querySelector("#meaning");
const choicesEl = document.querySelector("#choices");
const feedbackEl = document.querySelector("#feedback");
const startCard = document.querySelector("#start-card");
const resultCard = document.querySelector("#result-card");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const learnedList = document.querySelector("#learned-list");
const leadForm = document.querySelector("#lead-form");
const leadEmail = document.querySelector("#lead-email");
const leadMessage = document.querySelector("#lead-message");
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function startGame() {
  questions = shuffle(wordBank).slice(0, missionLength);
  currentIndex = 0;
  score = 0;
  battery = 100;
  correctCount = 0;
  learnedWords = [];
  missedWords = [];
  startCard.classList.add("hidden");
  resultCard.classList.add("hidden");
  updateStats();
  renderQuestion();
}

function updateStats() {
  const progress = Math.round((correctCount / missionLength) * 100);
  scoreEl.textContent = score;
  batteryEl.textContent = `${battery}%`;
  missionEl.textContent = `${Math.min(currentIndex + 1, missionLength)}/${missionLength}`;
  routeFillEl.style.width = `${progress}%`;
  droneEl.style.left = `${20 + progress * 0.68}%`;
}

function renderQuestion() {
  acceptingAnswers = true;
  const current = questions[currentIndex];
  meaningEl.textContent = current.japanese;
  feedbackEl.textContent = "正しい英語を選んでください。";
  feedbackEl.className = "feedback";
  choicesEl.innerHTML = "";

  shuffle([current.answer, ...current.decoys]).forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => answerQuestion(choice, button));
    choicesEl.append(button);
  });

  updateStats();
}

function answerQuestion(choice, selectedButton) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;

  const current = questions[currentIndex];
  const buttons = document.querySelectorAll(".choice-button");
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === current.answer) {
      button.classList.add("correct");
    }
  });

  if (choice === current.answer) {
    correctCount += 1;
    score += 100 + correctCount * 10;
    learnedWords.push(current);
    feedbackEl.textContent = `正解。ドローン前進！ ${current.japanese} = ${current.answer}`;
    feedbackEl.classList.add("good");
  } else {
    battery = Math.max(0, battery - batteryPenalty);
    missedWords.push(current);
    selectedButton.classList.add("wrong");
    feedbackEl.textContent = `不正解。バッテリー低下。正解は ${current.answer}`;
    feedbackEl.classList.add("bad");
  }

  updateStats();
  window.setTimeout(nextStep, 900);
}

function nextStep() {
  if (battery <= 0) {
    finishGame("battery");
    return;
  }

  currentIndex += 1;
  if (currentIndex >= missionLength) {
    finishGame("complete");
    return;
  }

  renderQuestion();
}

function finishGame(reason) {
  acceptingAnswers = false;
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = true;
  });

  resultTitle.textContent = reason === "battery" ? "Battery Depleted" : "Mission Complete";
  resultMessage.textContent = `スコア: ${score} / 正解 ${correctCount}/${missionLength} / 残りバッテリー ${battery}%`;
  learnedList.innerHTML = "";
  leadForm.reset();
  leadMessage.textContent = "";

  const reviewWords = learnedWords.length > 0 ? learnedWords : missedWords.slice(0, 6);
  if (reviewWords.length === 0) {
    learnedList.innerHTML = '<div class="learned-item">次は1問正解を目指しましょう。</div>';
  } else {
    reviewWords.forEach((word) => {
      const item = document.createElement("div");
      item.className = "learned-item";
      item.textContent = `${word.japanese} = ${word.answer}`;
      learnedList.append(item);
    });
  }

  resultCard.classList.remove("hidden");
}

async function submitLead(event) {
  event.preventDefault();
  const email = leadEmail.value.trim();
  if (!email) return;

  const lead = {
    email,
    score,
    correct: correctCount,
    total: missionLength,
    battery,
    result: `スコア: ${score} / 正解 ${correctCount}/${missionLength} / 残りバッテリー ${battery}%`,
    learnedWords: learnedWords.map((word) => `${word.japanese} = ${word.answer}`).join(", "),
    missedWords: missedWords.map((word) => `${word.japanese} = ${word.answer}`).join(", "),
    createdAt: new Date().toISOString(),
    source: "Drone Quest"
  };

  leadMessage.textContent = "送信中です...";

  try {
    const response = await fetch(leadForm.action, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lead)
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    leadForm.reset();

    try {
      await downloadResultPdf(email);
      leadMessage.textContent = "送信を受け付けました。結果PDFを作成しました。";
    } catch (pdfError) {
      leadMessage.textContent = "送信を受け付けました。PDF作成だけ失敗しました。";
    }
  } catch (error) {
    leadMessage.textContent = "送信できませんでした。時間をおいてもう一度お試しください。";
  }
}

async function downloadResultPdf(email) {
  if (typeof html2pdf === "undefined") {
    throw new Error("PDF library is not available");
  }

  const report = document.createElement("section");
  report.className = "pdf-report";
  report.innerHTML = `
    <div class="pdf-brand">Office 20</div>
    <h1>Drone Quest 結果レポート</h1>
    <p class="pdf-subtitle">FAA Part 107 Vocabulary RPG</p>
    <div class="pdf-score">${score} 点</div>
    <div class="pdf-grid">
      <div><strong>正解</strong><span>${correctCount}/${missionLength}</span></div>
      <div><strong>残りバッテリー</strong><span>${battery}%</span></div>
      <div><strong>メール</strong><span>${email}</span></div>
    </div>
    <h2>覚えた単語</h2>
    ${formatPdfWords(learnedWords, "今回は正解単語がありませんでした。")}
    <h2>復習したい単語</h2>
    ${formatPdfWords(missedWords, "間違えた単語はありません。")}
    <div class="pdf-footer">
      <strong>Office 20の Part107対策ご相談はこちら</strong><br>
      https://office20.org/サービス/
    </div>
  `;

  document.body.append(report);
  await html2pdf()
    .set({
      margin: 10,
      filename: `drone-quest-result-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.96 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(report)
    .save();
  report.remove();
}

function formatPdfWords(words, emptyMessage) {
  if (words.length === 0) {
    return `<p class="pdf-empty">${emptyMessage}</p>`;
  }

  return `
    <ul class="pdf-word-list">
      ${words.map((word) => `<li><span>${word.japanese}</span><strong>${word.answer}</strong></li>`).join("")}
    </ul>
  `;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
leadForm.addEventListener("submit", submitLead);
updateStats();
