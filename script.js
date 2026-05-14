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
const diagnosisMessage = document.querySelector("#diagnosis-message");
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
  diagnosisMessage.textContent = getDiagnosis();
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

function getDiagnosis() {
  if (correctCount >= 7) {
    return "診断: 受験準備OK。Part 107英語ボキャブラリーの基礎はかなり固まっています。";
  }

  if (correctCount <= 5) {
    return "診断: 要対策。Part 107頻出英語をもう一度押さえるとスコアが伸びます。";
  }

  return "診断: あと一歩。7問以上を目標に、間違えた単語を復習しましょう。";
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
  await ensurePdfLibrary();
  const canvas = createResultCanvas(email);
  const image = canvas.toDataURL("image/jpeg", 0.96);
  const PDF = window.jspdf?.jsPDF || window.jsPDF;
  const pdf = new PDF({ unit: "mm", format: "a4", orientation: "portrait" });
  pdf.addImage(image, "JPEG", 0, 0, 210, 297);
  pdf.save(`drone-quest-result-${Date.now()}.pdf`);
}

function ensurePdfLibrary() {
  if (window.jspdf?.jsPDF || window.jsPDF) {
    return Promise.resolve();
  }

  const sources = [
    "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
    "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js"
  ];

  return sources.reduce((chain, source) => {
    return chain.catch(() => loadScript(source));
  }, Promise.reject()).then(() => {
    if (!window.jspdf?.jsPDF && !window.jsPDF) {
      throw new Error("PDF library is not available");
    }
  });
}

function loadScript(source) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
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

function createResultCanvas(email) {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let y = 110;
  ctx.fillStyle = "#2563eb";
  ctx.font = "900 34px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Office 20", 90, y);

  y += 80;
  ctx.fillStyle = "#172033";
  ctx.font = "900 60px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Drone Quest 結果レポート", 90, y);

  y += 46;
  ctx.fillStyle = "#667085";
  ctx.font = "800 26px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("FAA Part 107 Vocabulary RPG", 90, y);

  y += 78;
  drawBadge(ctx, 90, y - 46, `${score} 点`, "#eef8ff", "#2563eb", 46);

  y += 54;
  y = drawWrappedText(ctx, getDiagnosis(), 90, y, 1060, 32, "#166534", "900 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif");

  y += 34;
  drawInfoBox(ctx, 90, y, "正解", `${correctCount}/${missionLength}`);
  drawInfoBox(ctx, 430, y, "残りバッテリー", `${battery}%`);
  drawInfoBox(ctx, 770, y, "メール", email);

  y += 150;
  y = drawWordSection(ctx, "覚えた単語", learnedWords, "今回は正解単語がありませんでした。", y);

  y += 24;
  y = drawWordSection(ctx, "復習したい単語", missedWords, "間違えた単語はありません。", y);

  ctx.strokeStyle = "#c7ddff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(90, 1580);
  ctx.lineTo(1150, 1580);
  ctx.stroke();

  ctx.fillStyle = "#667085";
  ctx.font = "800 26px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Office 20の Part107対策ご相談はこちら", 90, 1635);
  ctx.fillText("https://office20.org/サービス/", 90, 1680);

  return canvas;
}

function drawBadge(ctx, x, y, text, background, color, fontSize) {
  const width = ctx.measureText(text).width + 52;
  roundCanvasRect(ctx, x, y, width, 74, 16, background);
  ctx.fillStyle = color;
  ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText(text, x + 26, y + 50);
}

function drawInfoBox(ctx, x, y, label, value) {
  roundCanvasRect(ctx, x, y, 300, 102, 14, "#f8fbff", "#c7ddff");
  ctx.fillStyle = "#667085";
  ctx.font = "800 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(label, x + 22, y + 36);
  ctx.fillStyle = "#172033";
  ctx.font = "900 27px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  drawWrappedText(ctx, value, x + 22, y + 76, 252, 30, "#172033", "900 27px system-ui, -apple-system, BlinkMacSystemFont, sans-serif");
}

function drawWordSection(ctx, title, words, emptyMessage, y) {
  ctx.fillStyle = "#172033";
  ctx.font = "900 34px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(title, 90, y);
  y += 44;

  const list = words.length ? words.slice(0, 8) : [{ japanese: emptyMessage, answer: "" }];
  list.forEach((word) => {
    roundCanvasRect(ctx, 90, y, 1060, 54, 12, "#f8fbff", "#e5eefb");
    ctx.fillStyle = "#172033";
    ctx.font = "850 24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    const text = word.answer ? `${word.japanese} = ${word.answer}` : word.japanese;
    ctx.fillText(text, 112, y + 36);
    y += 66;
  });

  return y;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, color, font) {
  ctx.fillStyle = color;
  ctx.font = font;
  const words = String(text).split("");
  let line = "";

  words.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

function roundCanvasRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
leadForm.addEventListener("submit", submitLead);
updateStats();
