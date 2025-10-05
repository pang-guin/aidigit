    const ctx = document.getElementById('myRadarChart');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['주체성', '비판력', '윤리성', '소통력', '데이터', '창의성'],
            datasets: [{
                label: '내 능력치',
                data: [8, 7, 5, 9, 6, 8], // script.js의 점수 체계와 맞춘 예시
                fill: true,
                backgroundColor: 'rgba(255, 105, 180, 0.2)',
                borderColor: 'rgba(255, 105, 180, 1)',
                pointBackgroundColor: 'rgba(255, 105, 180, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 105, 180, 1)'
            }]
        },
      options: {
    responsive: true,
    maintainAspectRatio: false, // 컨테이너 비율에 맞춰 조절
    layout: {
        padding: 15 // ✨ 차트 전체의 내부 여백을 조절하여 중심에 더 가깝게 만듭니다. (값 조정 가능)
    },
    scales: {
        r: {
            angleLines: { color: '#ddd' },
            grid: { color: '#eee' },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
                stepSize: 2,
                backdropColor: 'transparent',
                display: false // ✨ 숫자 눈금(0, 2, 4...)을 숨깁니다. (육각형 배경에 가려져 필요 없을 수 있습니다.)
            },
            pointLabels: {
                color: '#333',
                font: { size: 12 },
                padding: 10, // ✨ 라벨(주체성, 비판력 등)과 차트 중심 사이의 여백을 조절합니다.
                callback: function(value, index, values) {
                    // ✨ 라벨이 너무 길면 줄 바꿈을 할 수 있습니다.
                    if (value.includes(' ')) { // 공백이 있다면
                        return value.split(' ');
                    }
                    return value;
                }
            }
        }
    },
    plugins: {
        legend: { display: false }
    }
}

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

    // ✨ 오류 수정: 존재하는 버튼만 먼저 찾도록 수정
    const startBtn = document.getElementById('start-btn');
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const resultText = document.getElementById('result-text');
    const guidelines = document.getElementById('guidelines');
    
    // ✨ 오류 수정: 이 버튼들은 나중에 필요할 때 찾도록 하거나, HTML에 추가해야 합니다.
    // const goToQuizBtn = document.getElementById('go-to-quiz-btn');
    // const downloadBtn = document.getElementById('download-btn');
    // const completeQuizBtn = document.getElementById('complete-quiz-btn');


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
    
    // 결과 페이지에 표시될 문구 데이터
    const resultsData = {
        autonomy: { title: "주체적 의사결정능력", text: "✨ 당신은 'AI 조종사' 타입! ✨ AI라는 최첨단 비행기를 자유자재로 조종하지만, 가끔은 자동항법에 너무 의존하는 경향이 있네요. 목적지를 잊지 않도록 직접 조종간을 잡는 연습이 필요해요!", guide: "<h3>🚀 주체성 UP 가이드</h3><p>1. AI에게 질문하기 전, '나는 무엇을 얻고 싶은가?' 스스로에게 먼저 질문해보세요.<br>2. AI의 답변은 참고자료일 뿐, 최종 결정은 나의 생각과 판단으로 내리는 연습을 하세요.</p>" },
        critical: { title: "비판적 사고력", text: "✨ 당신은 '순수한 믿음'의 소유자! ✨ AI가 하는 말이라면 팥으로 메주를 쑨다 해도 믿어줄 것 같은 당신! 하지만 AI는 가끔 거짓말도 한답니다. 🕵️‍♂️ 모든 정보를 의심하는 명탐정이 되어보세요!", guide: "<h3>🕵️‍♂️ 비판력 UP 가이드</h3><p>1. AI가 알려준 정보는 다른 뉴스나 책을 통해 꼭 교차 확인하세요.<br>2. AI에게 '그 정보의 출처가 어디야?'라고 되물어보는 습관을 들이세요.</p>" },
        ethics: { title: "윤리적 판단력", text: "✨ 당신은 '자유로운 영혼' 타입! ✨ 재미와 효율을 중시하는 당신! 하지만 당신의 AI 활용이 누군가에게 상처를 줄 수도 있어요. 행동하기 전 '이래도 괜찮을까?'하고 멈칫하는 브레이크를 장착해 보세요!", guide: "<h3>🚦 윤리성 UP 가이드</h3><p>1. AI로 만든 창작물을 사용하기 전, 저작권이나 초상권을 침해하지 않는지 확인하세요.<br>2. 다른 사람과 관련된 정보를 AI에 입력하기 전, 반드시 상대방의 동의를 구하세요.</p>" },
        comms: { title: "AI 소통능력", text: "✨ 당신은 '마음으로 말해요' 타입! ✨ AI에게 툭 던지듯 말해도 찰떡같이 알아주길 바라는군요! 하지만 AI는 아직 당신의 마음을 읽지 못해요. 원하는 것을 구체적으로, 명확하게 지시하는 AI 조련사가 되어보세요!", guide: "<h3>🗣️ 소통력 UP 가이드</h3><p>1. AI에게 역할을 부여해보세요. (예: '너는 이제부터 최고의 카피라이터야.')<br>2. 원하는 결과물의 예시를 함께 제시하면 AI가 더 정확하게 이해합니다.</p>" },
        data: { title: "데이터 통제력", text: "✨ 당신은 '쿨한 신뢰'의 소유자! ✨ '설마 무슨 일 있겠어?' 하는 쿨함으로 모든 데이터 제공에 동의하는 당신! 당신의 개인정보는 무엇보다 소중한 자산이에요. 깐깐한 금고지기가 되어 정보를 지켜주세요!", guide: "<h3>🔒 데이터 통제력 UP 가이드</h3><p>1. 앱이나 서비스 가입 시, 개인정보 처리방침을 읽어보는 습관을 들이세요.<br>2. 꼭 필요하지 않은 정보는 '선택' 항목이라면 제공하지 않아도 괜찮아요.</p>" },
        creative: { title: "창의적 활용 능력", text: "✨ 당신은 'AI 비서' 활용 타입! ✨ AI를 편리한 비서처럼 활용하는 당신! 하지만 AI는 당신의 창의력을 폭발시켜 줄 최고의 파트너가 될 수도 있답니다. AI를 도구가 아닌, 함께 그림을 그리는 동료로 만들어보세요!", guide: "<h3>🎨 창의성 UP 가이드</h3><p>1. 전혀 다른 두 가지 키워드를 조합해서 AI에게 새로운 아이디어를 생성시켜 보세요.<br>2. AI의 결과물을 그대로 쓰지 말고, 그것을 바탕으로 나만의 아이디어를 더해 발전시켜 보세요.</p>" },
        perfect: { text: "✨ 당신은 이미 '육각형 인간'! ✨ AI를 다루는 당신의 능력은 완벽에 가깝군요! AI는 당신의 손에서 최고의 파트너가 될 것입니다. 지금처럼 꾸준히 AI를 현명하게 활용하며 멋진 미래를 만들어나가세요!", guide: "<h3>🏆 완벽 가이드</h3><p>축하합니다! 당신은 이미 모든 영역에서 뛰어난 능력을 보여주고 있습니다. 꾸준히 새로운 AI 기술에 관심을 가지고, 주변 친구들에게도 좋은 AI 활용법을 알려주는 리더가 되어주세요!</p>" }
    };
    
   // 결과 페이지를 표시하는 새로운 함수
    function showResults() {
        // 가장 낮은 점수의 영역 찾기
        let lowestScore = Infinity;
        let lowestKey = '';

        for (const key in userScores) {
            if (userScores[key] < lowestScore) {
                lowestScore = userScores[key];
                lowestKey = key;
            }
        }

        // 모든 점수가 충분히 높으면 'perfect' 유형으로 처리 (예시: 최저점이 7점 이상)
        if (lowestScore >= 7) {
            resultText.innerHTML = resultsData.perfect.text;
            guidelines.innerHTML = resultsData.perfect.guide;
        } else {
            // 가장 낮은 점수 영역의 결과 문구와 가이드라인을 화면에 표시
            resultText.innerHTML = resultsData[lowestKey].text;
            guidelines.innerHTML = resultsData[lowestKey].guide;
        }

        // 서베이 페이지 숨기고 결과 페이지 보여주기
        pages.survey.style.display = 'none';
        pages.result.style.display = 'block';
    }

    // 선택지를 클릭했을 때 실행되는 함수 (수정됨)
    function selectChoice(scores) {
        // ✨ 점수 업데이트 주석 해제!
        for (const key in scores) {
            userScores[key] += scores[key];
        }
        console.log("현재 점수:", userScores); // 점수 변경 실시간 확인용

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            // ✨ 모든 질문이 끝나면 새로운 결과 표시 함수를 호출
            showResults();
        }
    }

// --- 4. 이벤트 리스너 연결 ---
   // [시작하기] 버튼 클릭 이벤트 (인트로 -> 설문)
    startBtn.addEventListener('click', () => {
        pages.intro.style.display = 'none';
        pages.survey.style.display = 'block';
        loadQuestion();
    });

    // ✨ [실전 퀴즈 풀러가기] 버튼은 아직 기능 연결 전이므로 전체 주석 처리
    /*
    const goToQuizBtn = document.getElementById('go-to-quiz-btn');
    goToQuizBtn.addEventListener('click', () => {
        pages.result.style.display = 'none';
        pages.quiz.style.display = 'block';
    });
    */

    // ✨ [퀴즈 완료] 버튼도 아직 기능 연결 전이므로 전체 주석 처리
    /*
    const completeQuizBtn = document.getElementById('complete-quiz-btn');
    completeQuizBtn.addEventListener('click', () => {
        pages.quiz.style.display = 'none';
        pages.final.style.display = 'block';
    });
    */

    // ✨ [나의 결과 다운로드하기] 버튼도 아직 기능 연결 전이므로 전체 주석 처리
    /*
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', () => {
        alert("다운로드 기능은 'html2canvas' 라이브러리를 추가해야 구현할 수 있습니다.");
    });
    */

});
