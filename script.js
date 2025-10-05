const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  // 인트로 페이지 숨기고 설문 페이지 보여주기
  document.getElementById('intro-page').style.display = 'none';
  document.getElementById('survey-page').style.display = 'block';
  loadQuestion(0); // 첫 번째 질문 로드
});
