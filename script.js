const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  // 인트로 페이지 숨기고 설문 페이지 보여주기
  document.getElementById('intro-page').style.display = 'none';
  document.getElementById('survey-page').style.display = 'block';
  loadQuestion(0); // 첫 번째 질문 로드
});

let currentQuestionIndex = 0;
let userScores = { autonomy: 0, critical: 0, ethics: 0, comms: 0, data: 0, creative: 0 };

// 육각형 차트 초기화 (Chart.js 예시)
const ctx = document.getElementById('hexagon-chart');
const myChart = new Chart(ctx, {
  type: 'radar', // 레이더 차트가 육각형 모양에 적합
  data: {
    labels: ['주체성', '비판력', '윤리성', '소통력', '통제력', '창의성'],
    datasets: [{
      label: '나의 AI 능력치',
      data: Object.values(userScores),
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
    }]
  },
  options: { scales: { r: { beginAtZero: true, max: 10 } } }
});

function loadQuestion(index) {
  const q = questions[index];
  document.getElementById('question-text').innerText = q.question;
  const choicesContainer = document.getElementById('choices-container');
  choicesContainer.innerHTML = ''; // 이전 선택지 삭제

  q.choices.forEach(choice => {
    const button = document.createElement('button');
    button.innerText = choice.text;
    button.onclick = () => selectChoice(choice.scores);
    choicesContainer.appendChild(button);
  });
}

function selectChoice(scores) {
  // 점수 업데이트
  for (const key in scores) {
    userScores[key] += scores[key];
  }

  // 차트 업데이트
  myChart.data.datasets[0].data = Object.values(userScores);
  myChart.update();

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion(currentQuestionIndex);
  } else {
    showResults(); // 모든 질문 완료 시 결과 페이지로 이동
  }
}

function showResults() {
  document.getElementById('survey-page').style.display = 'none';
  document.getElementById('result-page').style.display = 'block';

  // 최종 차트 다시 그리기 (혹은 기존 차트 재활용)
  // ... 차트 그리는 코드 ...

  // 점수가 가장 낮은 영역 찾기
  const lowestScoreKey = Object.keys(userScores).reduce((a, b) => userScores[a] < userScores[b] ? a : b);

  // 해당 영역의 결과 텍스트와 가이드라인 보여주기
  document.getElementById('result-text').innerHTML = resultsText[lowestScoreKey].low;
  document.getElementById('guidelines').innerHTML = `<h3>${lowestScoreKey} UP! 맞춤 가이드라인</h3>...`; 
}

// HTML5 Drag and Drop API 사용
const scenarios = document.querySelectorAll('.scenario-item');
const concepts = document.querySelectorAll('.concept-item');

scenarios.forEach(scenario => {
  scenario.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', scenario.dataset.answer);
  });
});

concepts.forEach(concept => {
  concept.addEventListener('dragover', e => e.preventDefault());
  concept.addEventListener('drop', e => {
    e.preventDefault();
    const droppedAnswer = e.dataTransfer.getData('text/plain');
    if (concept.dataset.match === droppedAnswer) {
      concept.classList.add('correct');
      // 정답 처리 로직
    }
  });
});

// 결과 다운로드 기능 (html2canvas 라이브러리 활용 예시)
// <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script> 추가 필요

document.getElementById('download-btn').addEventListener('click', () => {
  // 다운로드할 영역(결과 페이지)을 선택
  const resultPage = document.getElementById('result-page');

  html2canvas(resultPage).then(canvas => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'My_AI_Hexagon.png';
    link.click();
  });
});
