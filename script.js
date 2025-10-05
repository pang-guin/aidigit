// HTML 문서가 완전히 로드되었을 때 전체 코드가 실행
// 변수 주체성 : autonomy: 5, 비판력 : critical 윤리 : ethics: 소통력 : comms 데이터통제력: data 창의성 : creative
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
            question: "1. 조별 과제로 보고서를 써야 할 때, 너의 선택은?",
            choices: [
                { text: "일단 AI에게 \"OO 보고서 써줘\"라고 요청하고, 제출한다.", scores: { autonomy: -2, creative: -1 } },
                { text: "내가 초안을 작성한 후, AI에게 어색한 문장을 다듬어 달라고 한다.", scores: { autonomy: 1, comms: 1 } },
                { text: "AI에게는 자료 조사 아이디어나 목차 조언만 구하고, 보고서는 내 생각대로 작성한다.", scores: { autonomy: 2, critical: 1 } }
            ]
        },
        {
            question: "2. AI가 '한국의 수도는 부산'이라는 정보를 알려줬다. 너의 반응은?",
            choices: [
                { text: "\"오, 그렇구나!\" AI가 알려줬으니 정확한 정보일 것이라고 믿는다.", scores: { critical: -2 } },
                { text: "\"뭔가 이상한데?\" 다른 검색 엔진이나 책을 통해 사실을 다시 확인한다.", scores: { critical: 2, data: 1 } },
                { text: "\"AI가 틀렸네\" 하고 무시하고 넘어간다.", scores: { critical: -1 } }
            ]
        },
        {
            question: "3. 친구의 얼굴 사진으로 재미있는 AI 밈(meme)을 만들고 싶을 때, 너는?",
            choices: [
                { text: "일단 만들고 본다. 재밌으면 장땡! 친구도 웃어넘길 것이다.", scores: { ethics: -2 } },
                { text: "만들기 전에 친구에게 \"네 사진으로 AI 밈 만들어도 괜찮아?\"라고 먼저 물어본다.", scores: { ethics: 2 } },
                { text: "혹시 친구가 기분 나쁠 수도 있으니, 연예인 사진으로 밈을 만든다.", scores: { ethics: 1 } }
            ]
        },
        {
            question: "4. 코딩 숙제를 하다가 막혔을 때, AI에게 어떻게 질문할까?",
            choices: [
                { text: "그냥 \"코딩 오류 해결해 줘\"라고 막연하게 질문한다.", scores: { comms: -1 } },
                { text: "내가 사용한 프로그래밍 언어, 발생한 오류 메시지, 내가 시도해 본 방법을 구체적으로 포함하여 질문한다.", scores: { comms: 2 } },
                { text: "오류 코드를 그대로 복사해서 붙여넣기만 한다.", scores: { comms: 1 } }
            ]
        },
        {
            question: "5. 새로운 AI 앱에서 '주소록 및 사진 접근 권한'을 요구한다. 너의 행동은?",
            choices: [
                { text: "앱을 빨리 쓰고 싶으니까, 내용을 읽지 않고 '전체 동의'를 누른다.", scores: { data: -2 } },
                { text: "이 앱의 기능을 사용하는 데 정말 주소록과 사진이 필요한지 꼼꼼히 따져보고, 불필요하다면 동의하지 않는다.", scores: { data: 2 } },
                { text: "일단 동의하고, 나중에 찝찝하면 앱을 삭제한다.", scores: { data: -1 } }
            ]
        },
        {
            question: "6. 학교 축제 포스터를 만들어야 한다. AI를 어떻게 활용할까?",
            choices: [
                { text: "AI에게 \"학교 축제 포스터 만들어줘\"라고 입력하고, 나온 결과물 중 하나를 그대로 사용한다.", scores: { creative: -1 } },
                { text: "AI에게 '레트로 스타일', '우주 컨셉' 등 다양한 키워드를 조합하며 포스터 아이디어 스케치를 여러 개 생성해 본 후, 가장 마음에 드는 아이디어를 바탕으로 내가 직접 디자인을 완성한다.", scores: { comms: 2, creative: 2 } },
                { text: "포스터에 들어갈 멋진 캐치프레이즈나 문구를 AI에게 추천받는다.", scores: { creative: 1 } }
            ]
        }
        // 영역별 6가지 질문
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
