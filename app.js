// =============================================
//  Spell Quest — Game Logic
// =============================================

let questions = [];
let current  = 0;
let correct  = 0;
let wrong    = 0;
let answered = false;

// ----- Utilities -----

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildHint(word) {
  return word.split('').map((c, i) => i === 0 ? c.toUpperCase() : '_').join(' ');
}

// ----- Quiz Setup -----

function pickQuestions() {
  const shuffled = shuffle(words);   // words[] comes from words.js
  questions = shuffled.slice(0, 10);
}

function loadQuestion() {
  answered = false;
  const q  = questions[current];

  document.getElementById('questionNum').textContent = `Question ${current + 1} of 10`;
  document.getElementById('qNum').textContent        = `${current + 1}/10`;
  document.getElementById('wordHint').textContent    = buildHint(q.word);

  // Build shuffled options (1 correct + 3 wrong)
  const options = shuffle([q.word, ...q.wrong]);
  const grid    = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  options.forEach(opt => {
    const btn       = document.createElement('button');
    btn.className   = 'opt-btn';
    btn.textContent = opt;
    btn.onclick     = () => checkAnswer(btn, opt, q.word);
    grid.appendChild(btn);
  });

  // Reset feedback & next button
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('nextBtn').className  = 'next-btn';

  // Update progress bar
  document.getElementById('progressFill').style.width = (current / 10 * 100) + '%';
}

// ----- Answer Checking -----

function checkAnswer(btn, chosen, correctWord) {
  if (answered) return;
  answered = true;

  const allBtns = document.querySelectorAll('.opt-btn');
  allBtns.forEach(b => (b.disabled = true));

  const fb = document.getElementById('feedback');

  if (chosen === correctWord) {
    correct++;
    btn.classList.add('correct');
    fb.className = 'feedback correct-fb show';
    document.getElementById('feedbackIcon').textContent = '🎉';
    document.getElementById('feedbackText').textContent = `Bilkul sahi! "${correctWord}" correct hai!`;
    document.getElementById('scoreCorrect').textContent = correct;
  } else {
    wrong++;
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent === correctWord) b.classList.add('correct'); });
    fb.className = 'feedback wrong-fb show';
    document.getElementById('feedbackIcon').textContent = '❌';
    document.getElementById('feedbackText').textContent = `Galat! Sahi spelling hai: "${correctWord}"`;
    document.getElementById('scoreWrong').textContent = wrong;
  }

  if (current < 9) {
    document.getElementById('nextBtn').className = 'next-btn show';
  } else {
    setTimeout(showResult, 1000);
  }
}

// ----- Navigation -----

function nextQuestion() {
  current++;
  const card = document.getElementById('card');
  card.style.animation = 'none';
  void card.offsetWidth;            // force reflow to replay animation
  card.style.animation = '';
  loadQuestion();
}

// ----- Result Screen -----

function showResult() {
  document.getElementById('quizSection').style.opacity = '0';

  setTimeout(() => {
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('progressFill').style.width  = '100%';

    const rs = document.getElementById('resultSection');
    rs.className = 'result show';
    document.getElementById('finalCorrect').textContent = correct;

    const pct = correct / 10;
    const trophy      = document.getElementById('trophy');
    const resultTitle = document.getElementById('resultTitle');
    const resultMsg   = document.getElementById('resultMsg');

    if (pct === 1) {
      trophy.textContent      = '🏆';
      resultTitle.textContent = 'Perfect Score!';
      resultMsg.textContent   = 'Aap spelling champion hain! 🌟';
    } else if (pct >= 0.7) {
      trophy.textContent      = '🌟';
      resultTitle.textContent = 'Bahut Accha!';
      resultMsg.textContent   = 'Kaafi acchi spelling hai aapki!';
    } else if (pct >= 0.4) {
      trophy.textContent      = '👍';
      resultTitle.textContent = 'Theek Hai!';
      resultMsg.textContent   = 'Thodi aur practice karein!';
    } else {
      trophy.textContent      = '📚';
      resultTitle.textContent = 'Practice Karein!';
      resultMsg.textContent   = 'Roz padhne se spelling better hogi!';
    }
  }, 400);
}

// ----- Restart -----

function restartQuiz() {
  current = 0;
  correct = 0;
  wrong   = 0;

  document.getElementById('scoreCorrect').textContent = '0';
  document.getElementById('scoreWrong').textContent   = '0';
  document.getElementById('resultSection').className  = 'result';

  const qs = document.getElementById('quizSection');
  qs.style.display = '';
  qs.style.opacity = '1';

  pickQuestions();
  loadQuestion();
}

// ----- Starfield -----

function makeStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 80; i++) {
    const s    = document.createElement('div');
    s.className = 'star';
    const size  = Math.random() * 2.5 + 0.5;
    s.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `top:${Math.random() * 100}%`,
      `left:${Math.random() * 100}%`,
      `--d:${(Math.random() * 3 + 1.5).toFixed(1)}s`,
      `animation-delay:${(Math.random() * 4).toFixed(1)}s`
    ].join(';');
    container.appendChild(s);
  }
}

// ----- Init -----
makeStars();
pickQuestions();
loadQuestion();
