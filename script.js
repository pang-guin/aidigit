// HTML 문서가 완전히 로드되었을 때 전체 코드가 실행되도록 하여 오류를 방지합니다.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 필요한 HTML 요소들을 ID로 찾아 변수에 저장 ---
    const pages = {
        intro: document.getElementById('intro-page'),
        survey: document.getElementById('survey-page'),
        result: document.getElementById('result-page'),
        quiz: document.getElementById('quiz-page'),
        final: document.getElementById('final-page')
    };

    const startBtn = document.getElementById('start-btn');
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    // (추후 다른 버튼들도 여기에 추가)

    // --- 2. 설문 데이터 (질문, 선택지, 점수) ---
    const questions = [
        {
            question: "조별 과제로 보고서를 써야 할 때, 너의 선택은?",
            choices: [
                { text: "일단 AI에게 \"OO 보고서 써줘\"라고 요청하고, 제출한다.", scores: { autonomy: -2, creative: -1 } },
                { text: "내가 초안을 작성한 후, AI에게 어색한 문장을 다듬어 달라고 한다.", scores: { autonomy: 1, comms: 1 } },
                { text: "AI에게는 자료 조사 아이디어나 목차 조언만 구하고, 보고서는 내 생각대로 작성한다.", scores: { autonomy: 2, critical: 1 } }
            ]
        },
        {
            question: "AI가 '한국의 수도는 부산'이라는 정보를 알려줬다. 너의 반응은?",
            choices: [
                { text: "\"오, 그렇구나!\" AI가 알려줬으니 정확한 정보일 것이라고 믿는다.", scores: { critical: -2 } },
                { text: "\"뭔가 이상한데?\" 다른 검색 엔진이나 책을 통해 사실을 다시 확인한다.", scores: { critical: 2, data: 1 } },
                { text: "\"AI가 틀렸네\" 하고 무시하고 넘어간다.", scores: { critical: -1 } }
            ]
        },
        // 여기에 나머지 4개 영역 질문을 추가하세요.
    ];

    let currentQuestionIndex = 0;
    let userScores = { autonomy: 5, critical: 5, ethics: 5, comms: 5, data: 5, creative: 5 }; // 기본 점수 5점에서 시작

    // --- 3. 핵심 기능 함수들 ---

    // 질문을 화면에 표시하는 함수
    function loadQuestion() {
        // 현재 질문 데이터를 가져옴
        const currentQuestion = questions[currentQuestionIndex];
        questionText.innerText = currentQuestion.question;

        // 이전 선택지들을 초기화
        choicesContainer.innerHTML = '';

        // 현재 질문의 선택지들을 버튼으로 만들어 화면에 추가
        currentQuestion.choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.onclick = () => selectChoice(choice.scores); // 버튼 클릭 시 selectChoice 함수 실행
            choicesContainer.appendChild(button);
        });
    }

    // 선택지를 클릭했을 때 실행되는 함수
    function selectChoice(scores) {
        // 점수 업데이트 (이 부분은 지금은 주석 처리, 차트 기능 추가 시 활성화)
        /*
        for (const key in scores) {
            userScores[key] += scores[key];
        }
        console.log(userScores); // 점수 변경 확인용
        */

        // 다음 질문으로 이동
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion(); // 다음 질문이 있으면 로드
        } else {
            // 모든 질문이 끝나면 결과 페이지 보여주기
            pages.survey.style.display = 'none';
            pages.result.style.display = 'block';
        }
    }

    // --- 4. 이벤트 리스너 연결 ---

    // 시작하기 버튼 클릭 이벤트
    startBtn.addEventListener('click', () => {
        pages.intro.style.display = 'none';  // 인트로 페이지 숨기기
        pages.survey.style.display = 'block'; // 설문 페이지 보여주기
        loadQuestion(); // 첫 번째 질문 로드
    });

});
