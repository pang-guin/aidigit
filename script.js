// HTML 문서가 완전히 로드되었을 때 전체 코드가 실행토록 함. 물론 현재 html의 <body> 맨 아래에 <script>를 넣어놔서 스크립트가 html보다 먼저 실행되는 오류는 없음.
document.addEventListener('DOMContentLoaded', () => {
  // 변수 주체성 : autonomy: 5, 비판력 : critical 윤리 : ethics: 소통력 : comms 데이터통제력: data 창의성 : creative
  
  // --- 1. 필요한 HTML 요소들을 ID로 찾아 변수에 저장 ---
    const pages = {
        intro: document.getElementById('intro-page'),
        survey: document.getElementById('survey-page'),
        result: document.getElementById('result-page'),
        quiz: document.getElementById('quiz-page'),
        final: document.getElementById('final-page')
    };
  
    // 인트로 페이지 및 마지막 페이지 요소
    const startBtn = document.getElementById('start-btn');
    const downloadBtn = document.getElementById('download-btn');
  
    // 설문 페이지 요소
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const backBtn = document.getElementById('back-btn');
    // 결과 페이지 요소
    const resultText = document.getElementById('result-text');
    const guidelines = document.getElementById('guidelines');
    const goToQuizBtn = document.getElementById('go-to-quiz-btn');
    // 퀴즈 페이지 요소
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizChoicesContainer = document.getElementById('quiz-choices-container');
    const progressBar = document.getElementById('progress-bar');
    const completeQuizBtn = document.getElementById('complete-quiz-btn');
    const explanationPage = document.getElementById('explanation-page');
    const explanationImage = document.getElementById('explanation-image');
    const explanationText = document.getElementById('explanation-text');
    const nextQuizBtn = document.getElementById('next-quiz-btn');
    // 차트 요소
    const introChartCanvas = document.getElementById('introRadarChart');
    const resultChartCanvas = document.getElementById('resultRadarChart');
    let introChartInstance = null; // 인트로 차트 인스턴스
    let resultChartInstance = null; // 결과 차트 인스턴스
    let introAnimationInterval = null; // 인트로 애니메이션을 제어할 변수

    // --- 2. 설문 데이터 (질문, 선택지, 점수) ---
    const questions = [
        { question: `1. 과제로 보고서를 써야 할 때, 너의 선택은?`, choices: [ { text: "일단 AI에게 \"보고서 써줘\"라고 요청하고, 제출한다.", scores: { autonomy: -2, creative: -1 } }, { text: "내가 초안을 작성한 후, AI에게 어색한 문장을 다듬어 달라고 한다.", scores: { autonomy: 1, comms: 1 } }, { text: "AI에게는 자료 조사 아이디어나 목차 조언만 구하고, 보고서는 내 생각대로 작성한다.", scores: { autonomy: 2, critical: 1 } } ] },
        { question: `2. AI가 \'한국의 수도는 부산\'이라는 정보를 알려줬다. 
        너의 반응은?`, choices: [ { text: "'오, 잘못 알고 있었네!' AI가 알려줬으니 정확한 정보일 것이라고 믿는다.", scores: { critical: -2 } }, { text: "뭔가 이상한데? 다른 검색 엔진이나 책을 통해 사실을 다시 확인한다.", scores: { critical: 2, data: 1 } }, { text: "\"AI가 틀렸네.\" 하고 무시하고 넘어간다.", scores: { critical: -1 } } ] },
        { question: "3. 친구의 얼굴 사진으로 재미있는 AI 밈(meme)을 만들고 싶을 때, 너는?", choices: [ { text: "일단 만들고 본다. 재밌으면 친구도 웃어넘길 것이다.", scores: { ethics: -2 } }, { text: "만들기 전에 친구에게 \"네 사진으로 AI 밈 만들어도 괜찮아?\"라고 먼저 물어본다.", scores: { ethics: 2 } }, { text: "친구가 기분 나쁠 수도 있으니, 연예인 사진으로 밈을 만든다.", scores: { ethics: 1 } } ] },
        { question: "4. 코딩 숙제를 하다가 막혔을 때, AI에게 어떻게 질문할까?", choices: [ { text: "그냥 \"코딩 오류 해결해 줘\"라고 질문한다.", scores: { comms: -1 } }, { text: "내가 사용한 프로그래밍 언어, 발생한 오류 메시지, 내가 시도해 본 방법을 구체적으로 포함하여 질문한다.", scores: { comms: 2 } }, { text: "오류 코드를 그대로 복사해서 붙여넣기만 한다.", scores: { comms: 1 } } ] },
        { question: "5. 새로운 AI 앱에서 '주소록 및 사진 접근 권한'을 요구한다. 너의 행동은?", choices: [ { text: "앱을 빨리 쓰기 위해 내용을 읽지 않고 '전체 동의'를 누른다.", scores: { data: -2 } }, { text: "이 앱의 기능을 사용하는 데 정말 주소록과 사진이 필요한지 따져보고, 불필요하면 동의하지 않는다.", scores: { data: 2 } }, { text: "일단 동의하고, 나중에 찝찝하면 앱을 삭제한다.", scores: { data: -1 } } ] },
        { question: "6. 학교 축제 포스터를 만들어야 한다. AI를 어떻게 활용할까?", choices: [ { text: "AI에게 \"학교 축제 포스터 만들어줘\"라고 입력하고, 나온 결과물 중 하나를 그대로 사용한다.", scores: { creative: -1 } }, { text: "AI에게 '레트로 스타일', '우주 컨셉' 등 다양한 키워드를 조합하며 포스터 아이디어 스케치를 여러 개 생성해 본 후, 가장 마음에 드는 아이디어를 바탕으로 내가 직접 디자인을 완성한다.", scores: { comms: 2, creative: 2 } }, { text: "포스터에 들어갈 멋진 캐치프레이즈나 문구를 AI에게 추천받는다.", scores: { creative: 1 } } ] }, 
        { question: `7. AI 영화 추천 서비스가 내가 싫어하는 영화를 연달아 추천했다. 이때 나는?`, choices: [ { text: "AI가 추천했으니 반드시 재미있을 거야. 일단 본다.", scores: { autonomy: -1 } }, { text: "나의 취향을 더 명확히 알려주고, 다른 영화를 추천해달라고 한다.", scores: { autonomy: 1, comms: 1 } }, { text: "AI 추천은 무시하고, 내가 직접 다른 영화를 찾아본다.", scores: { autonomy: 1 } } ] },
        { question: `8. AI가 내일 중요한 시험에 나올 것이라며 예상 문제 목록을 만들어줬다.`, choices: [ { text: "AI를 믿고 이 문제들만 집중적으로 공부한다.", scores: { autonomy: -2, critical: -1 } }, { text: "AI가 만든 문제는 참고하면서 교과서 전체 범위를 내 계획대로 공부한다.", scores: { autonomy: 2, critical: 1 } }, { text: "AI가 알려준 문제들 위주로 보고, 시간이 남으면 다른 문제를 본다..", scores: { autonomy: -1 } } ] },
        { question: `9. AI가 '바나나가 모든 병을 치료한다'는 놀라운 정보를 알려주었다.`, choices: [ { text: "새로운 사실을 알게 되었다! 가족에게 바로 공유한다.", scores: { critical: -2, ethics: -1 } }, { text: "바나나에 어떤 성분이 있는지 추가로 조사해본다.", scores: { critical: 2, data: 1 } }, { text: "의학적으로 검증된 것인지 뉴스를 찾아 추가로 확인한다.", scores: { critical: 2, data: 1 } } ] },
        { question: `10. 인터넷에서 유명 연예인이 논란이 될 만한 발언을 하는 영상을 보았다. 당신의 행동은?`,   choices: [ { text: "영상이니 사실일 것이다. 즉시 친구들에게 공유한다.", scores: { critical: -2, ethics: -2 } }, 
        { text: "AI로 만든 영상이 많으니 가짜일 수도 있겠다고 생각한다.", scores: { critical: 1 } }, 
        { text: "딥페이크일 가능성이 있으니 해당 연예인의 공식 입장이나 사실 확인 기사를 찾아본다.", scores: { critical: 2, data: 1 } } ] },
    { question: `11. 과제로 제출할 그림을 AI로 생성했다. 이 그림을 제출할 때 나는?`, choices: [ { text: "AI를 사용한 사실을 밝히고, 어떤 도구와 프롬프트를 썼는지 적는다.", scores: { ethics: 2 } }, { text: "내가 쓴 프롬프트이니 직접 그린 것으로 생각하고 제출한다.", scores: { ethics: -2 } }, { text: "AI가 그렸지만, 내가 검토하고 선정했으니 내 작품으로 제출한다.", scores: { ethics: -1 } } ] },
    { question: `12. 좋아하는 가수의 목소리를 학습한 AI 커버 노래를 발견했다. 어떻게 행동할까?`, choices: [ { text: "신기하고 재밌으니, 다른 가수 목소리로도 만들어달라고 요청한다.", scores: { ethics: -1 } }, { "text": "원곡 가수와 작곡가의 저작권, 가수의 인격권을 침해할 수 있음을 인지하고 소비를 지양한다.", scores: { ethics: 2 } }, { text: "공식 음원이 아니니, 개인적으로 듣고 즐기는 것은 괜찮다고 생각한다.", scores: { ethics: 1 } } ] },

    // 소통력 (Communication)
    { question: `13. AI 이미지 생성기에게 '강아지'를 그려달라고 했는데, 마음에 드는 그림이 나오지 않는다.`, choices: [ { text: "'강아지'라는 단어를 계속 반복해서 입력한다.", scores: { comms: -2 } }, { text: "'골든 리트리버 강아지가 공원에서 공을 물고 웃고 있는 모습을 따뜻한 색감의 디지털 아트로 그려줘'라고 구체적으로 요청한다.", scores: { comms: 2, creative: 1 } }, { text: "다른 키워드를 써볼까? '고양이'를 입력해본다.", scores: { comms: -1 } } ] },
    { question: `14. 저녁 메뉴 추천을 AI에게 부탁할 때, 어떻게 질문하는 것이 가장 좋을까?`, choices: [ { text: "\"저녁 뭐 먹지?\"", scores: { comms: -1 } }, { text: "\"집에 베이컨이랑 계란, 양파가 있는데 30분 안에 만들 수 있는 저녁 메뉴 3가지를 추천해줘.\"", scores: { comms: 2 } }, { text: "\"맛있는 거.\"", scores: { comms: -2 } } ] },

    // 데이터 통제력 (Data Control)
    { question: `15. '당신의 얼굴을 분석해 미래를 예측!'하는 재미있는 AI 웹사이트가 내 SNS 계정 연동을 요구한다.`, choices: [ { text: "결과가 궁금하니, 별생각 없이 '계정 연동하여 계속하기'를 누른다.", scores: { data: -2 } }, { text: "내 게시물, 친구 목록까지 요구하는 것은 과도하다고 판단하여, 사이트 이용을 포기한다.", scores: { data: 2 } }, { text: "일단 연동하고, 나중에 계정 설정에 들어가서 연동을 해지한다.", scores: { data: -1 } } ] },
    { question: `16. AI 챗봇과 대화하며 개인적인 고민을 털어놓고 싶을 때, 어떻게 해야 할까?`, choices: [ { text: "상담사처럼 편안하게 내 이름, 학교, 친구 관계 등 모든 것을 솔직하게 이야기한다.", scores: { data: -2, ethics: -1 } }, { text: "개인정보(실명, 주소 등)는 제외하고, 고민 상황만 일반화하여 조언을 구한다.", scores: { data: 2 } }, { text: "AI가 내 정보를 기억했다가 나중에 맞춤형 답변을 해줄 테니 좋을 것이라고 생각한다.", scores: { data: -1 } } ] },

    // 창의성 (Creativity)
    { question: `17. AI가 글짓기 대회 주제에 맞춰 평범한 시의 초안을 작성해 주었다.`, choices: [ { text: "AI가 써준 시를 그대로 제출한다. 내가 쓴 것보다 낫다.", scores: { creative: -2, autonomy: -1 } }, { text: "AI가 제안한 몇 가지 시구나 표현만 참고하여, 완전히 새로운 나만의 시를 쓴다.", scores: { creative: 2, autonomy: 1 } }, { text: "AI가 써준 시의 단어 몇 개만 내가 아는 다른 단어로 바꾼다.", scores: { creative: -1 } } ] },
    { question: `18. AI 작곡 도구를 이용해 짧은 배경음악을 만들었다. 이 음악을 어떻게 활용할까?`, choices: [ { text: "AI가 만든 음악의 코드 진행을 바탕으로, 나만의 새로운 멜로디를 입혀 곡을 완성한다.", scores: { creative: 2 } }, { text: "만들어진 음악을 내 유튜브 영상 배경음악으로 바로 사용한다.", scores: { creative: -1 } }, { text: "여러 번 생성해서 가장 듣기 좋은 것 하나를 저장해두고 감상용으로만 듣는다.", scores: { creative: 1 } } ] }
];


   const resultsData = {
        autonomy: { title: "주체적 의사결정능력", text: "✨ 당신은 'AI 조종사' 타입! ✨ AI라는 최첨단 비행기를 즐기지만 가끔 자동항법에 너무 의존하는 편. 직접 판단하는 연습이 필요해요!", guide: "<h3>🚀 주체성 UP 가이드</h3><p>1. AI에게 묻기 전, '나는 무엇을 얻고 싶은가?' 스스로에게 먼저 질문하기<br>2. AI의 답변은 참고자료일 뿐, 최종 결정은 나의 생각과 판단으로 내리는 연습하기</p>" },
        critical: { title: "비판적 사고력", text: "✨ 당신은 '순수한 믿음'의 소유자! ✨ AI가 하는 말이라면 팥으로 메주를 쑨다 해도 믿어줄 것 같은 당신! 하지만 AI는 가끔 거짓말도 한답니다. 🕵️‍♂️ 모든 정보를 의심하는 명탐정이 되어보세요!", guide: "<h3>🕵️‍♂️ 비판력 UP 가이드</h3><p>1. AI가 알려준 정보는 다른 뉴스나 책을 통해 꼭 교차 확인하기<br>2. AI에게 '그 정보의 출처가 어디야?'라고 되물어보는 습관을 들이세요.</p>" },
        ethics: { title: "윤리적 판단력", text: "✨ 당신은 '자유로운 영혼' 타입! ✨ 재미와 효율을 중시하는 당신! 하지만 당신의 AI 활용이 누군가에게 상처를 줄 수도 있어요. 행동하기 전 '이래도 괜찮을까?'하고 멈칫하는 브레이크를 장착해 보세요!", guide: "<h3>🚦 윤리성 UP 가이드</h3><p>1. AI로 만든 창작물을 사용하기 전, 저작권이나 초상권을 침해하지 않는지 확인하기<br>2. 다른 사람과 관련된 정보를 AI에 입력하기 전, 반드시 상대방의 동의를 구하기</p>" },
        comms: { title: "AI 소통능력", text: "✨ 당신은 '마음으로 말해요' 타입! ✨ AI에게 툭 던지듯 말해도 찰떡같이 알아주길 바라는군요! 하지만 AI는 아직 당신의 마음을 읽지 못해요. 원하는 것을 구체적으로, 명확하게 지시하는 AI 조련사가 되어보세요!", guide: "<h3>🗣️ 소통력 UP 가이드</h3><p>1. AI에게 역할을 부여해보기 (예: '너는 이제부터 최고의 카피라이터야.')<br>2. 원하는 결과물의 예시를 함께 제시하면 AI가 더 정확하게 이해합니다!</p>" },
        data: { title: "데이터 통제력", text: "✨ 당신은 '쿨한 신뢰'의 소유자! ✨ '설마 무슨 일 있겠어?' 하는 쿨함으로 모든 데이터 제공에 동의하는 당신! 당신의 개인정보는 무엇보다 소중한 자산이에요. 깐깐한 금고지기가 되어 정보를 지켜주세요!", guide: "<h3>🔒 데이터 통제력 UP 가이드</h3><p>1. 앱이나 서비스 가입 시, 개인정보 처리방침을 꼭 읽어보기<br>2. 꼭 필요하지 않은 정보는 '선택' 항목이라면 제공하지 않아도 괜찮아요!</p>" },
        creative: { title: "창의적 활용 능력", text: "✨ 당신은 'AI 비서' 활용 타입! ✨ AI를 편리한 비서처럼 활용하는 당신! 하지만 AI는 당신의 창의력을 폭발시켜 줄 최고의 파트너가 될 수도 있답니다. AI를 도구가 아닌, 함께 그림을 그리는 동료로 만들어보세요!", guide: "<h3>🎨 창의성 UP 가이드</h3><p>1. 전혀 다른 두 가지 키워드를 조합해서 AI에게 새로운 아이디어를 생성시켜 보기.<br>2. AI의 결과물을 그대로 쓰지 말고, 그것을 바탕으로 나만의 아이디어를 더해 발전시키기</p>" },
        perfect: { text: "✨ 당신은 이미 '육각형 인간'! ✨ AI를 다루는 능력이 완벽에 가깝군요! 지금처럼 AI를 현명하게 활용하며 멋진 미래를 만들어나가세요!", guide: "<h3>🏆 완벽 가이드</h3><p>축하합니다! 당신은 이미 모든 영역에서 뛰어난 능력자! 꾸준히 새로운 AI 기술에 관심을 가지고, 친구들에게도 좋은 AI 활용법을 알려주는 리더가 되어주세요!</p>" }
    };
  
  
    // 설문조사에서 응답한 것에 해설 및 설명이 될 수 있도록 연결되는 내용으로 퀴즈 추가
const quizQuestions = [
    { 
        question: "AI가 추천해 준 여행 계획을 검토 없이 그대로 따르기보다, (...) 나의 상황에 맞게 수정하여 최종 계획을 세웠다.", 
        choices: ["나의 취향과 예산을 고려하여", "친구가 좋다고 해서", "가장 저렴한 옵션이라서"], 
        answer: "나의 취향과 예산을 고려하여",
        explanation: {
            text: "<strong>주체적 의사결정능력!</strong></br> AI는 훌륭한 조언자이지만, 최종 결정은 나만의 기준과 가치관에 따라야 해요. AI의 제안을 비판적으로 검토하고 내 상황에 맞게 수정하는 것이 중요합니다."
        }
    },
    { 
        question: "AI에게 보고서 초안을 부탁한 뒤, (...) 완성했다.", 
        choices: ["내 이름만 추가하여", "내가 조사한 내용과 의견을 추가하여", "디자인만 살짝 바꿔서,"], 
        answer: "내가 조사한 내용과 의견을 추가하여",
        explanation: {
            text: "<strong>창의적 활용 능력!</strong> </br>AI가 만든 결과물을 그대로 사용하는 것은 창의적인 활용이 아니에요. AI를 아이디어를 발전시키는 파트너로 삼고, 나만의 생각과 노력을 더해 결과물을 완성해야 합니다."
        }
    },
    { 
        question: "AI가 생성한 뉴스 기사를 읽을 때 (...) 다른 언론사 기사와 교차 확인했다.", 
        choices: ["제목이 자극적이라서", "내용이 흥미로워서", "정보의 출처를 명확히 알 수 없어서"], 
        answer: "정보의 출처를 명확히 알 수 없어서",
        explanation: {
            text: "<strong>비판적 사고력!</strong> AI는 때로 틀리거나 편향된 정보를 생성할 수 있어요. AI가 제공하는 정보가 사실인지 항상 다른 공신력 있는 자료와 비교하여 확인(교차 확인)하는 습관이 중요합니다."
        }
    },
    { 
        question: "AI 챗봇이 '모든 버섯은 식용 가능하다'고 알려줬을 때, (...) 전문가의 의견이나 신뢰할 수 있는 자료를 찾아봤다.", 
        choices: ["그 말을 곧이곧대로 믿지 않고,", "신기한 정보라고 생각하고,", "친구들에게 바로 전달하고,"], 
        answer: "그 말을 곧이곧대로 믿지 않고,",
        explanation: {
            text: "<strong>비판적 사고력!</strong></br> 특히 안전과 관련된 정보에 대해서는 AI의 답변을 맹신해서는 안 돼요. 생명이나 건강에 영향을 줄 수 있는 정보는 반드시 전문가나 신뢰할 수 있는 출처를 통해 재확인해야 합니다."
        }
    },
    { 
        question: "친구의 사진을 AI 필터에 넣기 전에, (...) 먼저 친구의 허락을 구했다.", 
        choices: ["재미있는 결과가 나올 것 같아서", "내 마음대로 해도 된다고 생각해서", "개인의 초상권을 존중해야 하므로"], 
        answer: "개인의 초상권을 존중해야 하므로",
        explanation: {
            text: "<strong>윤리적 판단력!</strong></br> 다른 사람의 사진이나 개인정보를 AI에 활용할 때는 반드시 당사자의 동의를 구해야 해요. 이는 개인의 초상권과 프라이버시를 존중하는 기본적인 AI 윤리입니다."
        }
    },
    { 
        question: "AI로 만든 음악을 공모전에 제출할 때, (...) AI 사용 규정을 꼼꼼히 확인하고 준수했다.", 
        choices: ["아무도 모를 것이라고 생각하고", "저작권 및 공모전의 윤리 규정을 지키기 위해", "수상 확률을 높이기 위해"], 
        answer: "저작권 및 공모전의 윤리 규정을 지키기 위해",
        explanation: {
            text: "<strong>윤리적 판단력!</strong></br> AI를 활용할 때는 기술을 사용하는 커뮤니티의 규칙과 법적 규제(저작권 등)를 이해하고 지키는 것이 중요합니다. 바르게 AI를 활용하는 것이 나와 우리 모두를 위한 방법입니다.
        pages.intro.style.display = 'none';
        pages.survey.style.display = 'flex';
        loadQuestion();
    });
  
    backBtn.addEventListener('click', goBack);
    
    // [실전 퀴즈 풀러가기] 
    goToQuizBtn.addEventListener('click', () => {
        pages.result.style.display = 'none';
        pages.quiz.style.display = 'flex';
        startQuiz();
    }); 
    // [다음 문제로]
     nextQuizBtn.addEventListener('click', loadNextQuiz);
   
    // [퀴즈 완료] 버튼도 아직 기능 연결 전이므로 전체 주석 처리
    completeQuizBtn.addEventListener('click', () => {
        pages.quiz.style.display = 'none';
        pages.final.style.display = 'flex';
    });
   

    // [나의 결과 다운로드하기] 버튼도 아직 기능 연결 전이므로 전체 주석 처리
    /*
    downloadBtn.addEventListener('click', () => {
        alert("다운로드 기능은 'html2canvas' 라이브러리를 추가해야 구현할 수 있습니다.");
    });
    */
  });
