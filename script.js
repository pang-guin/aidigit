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
  { question: `10. 인터넷에서 유명 연예인이 논란이 될 만한 발언을 하는 영상을 보았다. 당신의 행동은?`,   choices: [ 
        { text: "영상이니 사실일 것이다. 즉시 친구들에게 공유한다.", scores: { critical: -2, ethics: -2 } }, 
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
    { question: `17. 대회에 제출할 시를 쓰려고 한다. 이때 나는?`, choices: [ { text: " AI가 나보다 낫다! AI가 써준 시를 그대로 제출한다.", scores: { creative: -2, autonomy: -1 } }, { text: "AI가 제안한 몇 가지 표현을 참고하여, 나만의 시를 새로쓴다.", scores: { creative: 2, autonomy: 1 } }, { text: "AI에게 좋아하는 작가 시를 주고 비슷하게 만들어달라고 해서 제출한다.", scores: { creative: -1 } } ] },
    { question: `18. AI 작곡 도구를 이용해 짧은 배경음악을 만들었다. 이 음악을 어떻게 활용할까?`, choices: [ { text: "AI가 만든 음악의 코드 진행을 바탕으로, 나만의 새로운 멜로디를 입혀 곡을 완성한다.", scores: { creative: 2 } }, { text: "만들어진 음악을 내 유튜브 영상 배경음악으로 바로 사용한다.", scores: { creative: -1 } }, { text: "여러 번 생성해서 가장 듣기 좋은 것 하나를 저장해두고 감상용으로만 듣는다.", scores: { creative: 1 } } ] }
];


   const resultsData = {
        autonomy: { title: "주체적 의사결정능력", text: "✨ 당신은 'AI 조종사' 타입! ✨ AI라는 최첨단 비행기를 즐기지만 가끔 자동항법에 너무 의존하는 편. 직접 판단하는 연습이 필요해요!", guide: "<h3>🚀 주체성 UP 가이드</h3><p>1. AI에게 묻기 전, '나는 무엇을 얻고 싶은가?' 스스로에게 먼저 질문하기<br>2. AI의 답변은 참고자료일 뿐, 최종 결정은 나의 생각과 판단으로 내리는 연습하기</p>" },
        critical: { title: "비판적 사고력", text: "✨ 당신은 '순수한 믿음'의 소유자! ✨ AI가 하는 말이라면 팥으로 메주를 쑨다 해도 믿어줄 것 같은 당신! 하지만 AI는 가끔 거짓말도 한답니다. 🕵️‍♂️ 모든 정보를 의심하는 명탐정이 되어보세요!", guide: "<h3>🕵️‍♂️ 비판력 UP 가이드</h3><p>1. AI가 알려준 정보는 다른 뉴스나 책을 통해 꼭 교차 확인하기<br>2. AI에게 '그 정보의 출처가 어디야?'라고 되물어보는 습관을 들이세요.</p>" },
        ethics: { title: "윤리적 판단력", text: "✨ 당신은 '자유로운 영혼' 타입! ✨ 재미와 효율을 중시하는 당신! 하지만 당신의 AI 활용이 누군가에게 상처를 줄 수도 있어요. 행동하기 전 '이래도 괜찮을까?'하고 멈칫하는 브레이크를 장착해 보세요!", guide: "<h3>🚦 윤리성 UP 가이드</h3><p>1. AI로 만든 창작물을 사용하기 전, 저작권이나 초상권을 침해하지 않는지 확인하기<br>2. 다른 사람과 관련된 정보를 AI에 입력하기 전, 반드시 상대방의 동의를 구하기</p>" },
        comms: { title: "AI 소통능력", text: "✨ 당신은 '마음으로 말해요' 타입! ✨ AI에게 툭 던지듯 말해도 찰떡같이 알아주길 바라는군요! 하지만 AI는 아직 당신의 마음을 읽지 못해요. 원하는 것을 구체적으로, 명확하게 지시하는 AI 조련사가 되어보세요!", guide: "<h3>🗣️ 소통력 UP 가이드</h3><p>1. AI에게 역할을 부여해보기 (예: '너는 이제부터 최고의 카피라이터야.')<br>2. 원하는 결과물의 예시를 함께 제시하면 AI가 더 정확하게 이해합니다!</p>" },
        data: { title: "데이터 통제력", text: "✨ 당신은 '쿨한 신뢰'의 소유자! ✨ '설마 무슨 일 있겠어?' 하는 쿨함으로 모든 데이터 제공에 동의하는 당신! 당신의 개인정보는 무엇보다 소중한 자산이에요. 깐깐한 금고지기가 되어 정보를 지켜주세요!", guide: "<h3>🔒 데이터 통제력 UP 가이드</h3><p>1. 앱이나 서비스 가입 시, 개인정보 처리방침을 꼭 읽어보기<br>2. 꼭 필요하지 않은 정보는 '선택' 항목이라면 제공하지 않아도 괜찮아요!</p>" },
        creative: { title: "창의적 활용 능력", text: "✨ 당신은 'AI 비서' 활용 타입! ✨ AI를 편리한 비서처럼 활용하는 당신! 하지만 AI는 당신의 창의력을 폭발시켜 줄 최고의 파트너가 될 수도 있답니다. AI를 도구가 아닌, 함께 그림을 그리는 동료로 만들어보세요!", guide: "<h3>🎨 창의성 UP 가이드</h3><p>1. 전혀 다른 두 가지 키워드를 조합해서 AI에게 새로운 아이디어를 생성시켜 보기.<br>2. AI의 결과물을 그대로 쓰지 말고, 그것을 바탕으로 나만의 아이디어를 더해 발전시키기</p>" },
        perfect: { text: "✨ 당신은 이미 '육각형 인간'! ✨ AI를 다루는 당신의 능력은 완벽에 가깝군요! 지금처럼 꾸준히 AI를 현명하게 활용하며 멋진 미래를 만들어나가세요!", guide: "<h3>🏆 완벽 가이드</h3><p>축하합니다! 당신은 이미 모든 영역에서 뛰어난 능력자! 꾸준히 새로운 AI 기술에 관심을 가지고, 친구들에게도 좋은 AI 활용법을 알려주는 리더가 되어주세요!</p>" }
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
            text: "<strong>윤리적 판단력!</strong></br> AI를 활용할 때는 기술을 사용하는 커뮤니티의 규칙과 법적 규제(저작권 등)를 이해하고 지키는 것이 중요합니다. 정정당당하게 AI를 활용하는 태도가 필요해요."
        }
    },
    { 
        question: "구체적으로 원하는 이미지를 생성하기 위해 AI에게 (...)라고 지시했다.", 
        choices: ["'슬픈 표정으로 앉아 있는 주황색 고양이를 수채화 스타일로 그려줘'", "'고양이'", "'슬픈 고양이'"], 
        answer: "'슬픈 표정으로 앉아 있는 주황색 고양이를 수채화 스타일로 그려줘'",
        explanation: {
            text: "<strong>AI 소통능력!</strong></br> AI에게 원하는 결과를 얻으려면 명확하고 구체적으로 지시해야 해요. 배경, 대상, 스타일, 형식 등 구체적인 맥락을 제공할수록 AI는 내 의도를 더 정확하게 파악합니다."
        }
    },
    { 
        question: "코딩 문제 해결을 위해, (...) 라고 질문했다.", 
        choices: ["'코드가 동작이 안돼.'", "'81번째 줄에서 오류가 났어. 이 파이썬 코드를 보고 list의 중복 항목을 제거하는 코드를 알려줘'", "'오류 나는데?'"], 
        answer: "'81번째 줄에서 오류가 났어. 이 파이썬 코드를 보고 list의 중복 항목을 제거하는 코드를 알려줘'",
        explanation: {
            text: "<strong>AI 소통능력!</strong></br> 막연한 질문보다는 문제 상황, 내가 시도해 본 것, 원하는 결과 등을 구체적으로 설명해야 AI가 효과적인 해결책을 제시할 수 있어요. 좋은 질문이 좋은 답변을 만듭니다."
        }
    },
    { 
        question: "회원가입 시 (...)", 
        choices: ["모든 약관에 전체 동의하지않고 불필요한 '선택' 항목은 동의하지 않았다.", "확인하지 않고 전체 동의를 눌렀다.", "혜택을 더 받을 수 있을 것 같아서 전체 동의를 눌렀다."], 
        answer: "모든 약관에 전체 동의하지않고 불필요한 '선택' 항목은 동의하지 않았다.",
        explanation: {
            text: "<strong>데이터 통제력!</strong></br></br>서비스 이용에 꼭 필요하지 않은 개인정보 '선택' 항목까지 무심코 동의하면 내 정보가 원치 않는 곳에 활용될 수 있어요. 내 정보의 주권은 나에게 있음을 기억해야 합니다."
        }
    },
    { 
        question: "출처가 불분명한 앱을 설치할 때 (...) '주소록 접근 권한' 요구는 거부했다.", 
        choices: ["개인정보 유출의 위험성이 있으므로", "저장 공간이 부족해서", "앱 아이콘이 마음에 안 들어서"], 
        answer: "개인정보 유출의 위험성이 있으므로",
        explanation: {
            text: "<strong>데이터 통제력!</strong> </br>스마트폰의 주소록, 사진첩 등은 매우 민감한 개인정보예요. 앱이 어떤 권한을 요구하는지, 그 권한이 앱의 기능에 꼭 필요한지 꼼꼼히 따져보고 결정하는 것이 안전합니다."
        }
    },
    { 
        question: "AI가 만든 음악 코드를 (...) 멜로디와 가사를 더해 곡을 만들었다.", 
        choices: ["그대로 사용하여 과제물로 제출하지 않고, 직접", "그대로 사용하고 AI가 자동으로 만들어 준", "사용하고, 유명 가수의 목소리를 학습한 목소리에 "], 
        answer: "그대로 사용하여 과제물로 제출하지 않고, 직접",
        explanation: {
            text: "<strong>창의적 활용 능력!</br></strong> AI의 제안을 출발점으로 삼아 나만의 아이디어를 결합할 때 진정한 '창작'이 이루어집니다. AI는 창작의 재료를 제공하는 훌륭한 파트너가 될 수 있어요."
        }
    },
    { 
        question: "AI가 생성한 여러 디자인 시안 중에서 (...) 요소를 조합하여 최종 로고를 완성했다.", 
        choices: ["내 의도와 어울리는 것을 검토한 뒤 가장 마음에 드는", "유명 로고와 헷갈리도록 가장 잘 따라한", "AI가 가장 먼저 추천한"], 
        answer: "내 의도와 어울리는 것을 검토한 뒤 가장 마음에 드는",
        explanation: {
            text: "<strong>주체적 의사결정능력!</br></strong> AI는 다양한 선택지를 제공할 수 있지만, 최종적으로 어떤 결과물이 나의 의도와 목표에 가장 부합하는지 판단하고 선택하는 것은 사용자의 몫입니다. AI는 도구일 뿐, 결정의 주체는 나 자신입니다."
        }
    }
];
  
  
    let currentQuestionIndex = 0;
    let userScores = { autonomy: 5, critical: 5, ethics: 5, comms: 5, data: 5, creative: 5 };
    let answerHistory = []; 
    let currentQuizIndex = 0;
  

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
            button.onclick = () => selectChoice(choice.scores);
            choicesContainer.appendChild(button);
        });
        // 첫 질문 빼고 '이전 질문' 버튼 모이게
        if (currentQuestionIndex > 0) {
        backBtn.style.display = 'block';
        } else {
        backBtn.style.display = 'none';
        }
    }    

    // 차트를 그리는 함수
    function drawChart(canvasElement, scoreData, isIntroChart = false) {
        if (!canvasElement) return;

        // 기존 차트 인스턴스가 있다면 파괴
        let chartInstance = isIntroChart ? introChartInstance : resultChartInstance;
        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = canvasElement.getContext('2d');
        const chartConfig = {
            type: 'radar',
            data: {
                labels: ['주체성', '비판력', '윤리성', '소통력', '데이터 통제력', '창의성'],
                datasets: [{
                    label: isIntroChart ? 'AI 활용 능력' : '내 능력치', // 인트로 차트 라벨 변경
                    data: scoreData,
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
                maintainAspectRatio: false,
                layout: {
                    padding: 15 // 차트 전체의 내부 여백을 조절
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
                            display: false // 숫자 눈금 숨김
                        },
                        pointLabels: {
                            color: '#333',
                            font: { size: 17 },
                            padding: 10,
                            callback: function(value, index, values) {
                                if (value.includes(' ')) {
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
        };

        if (isIntroChart) {
            introChartInstance = new Chart(ctx, chartConfig);
        } else {
            resultChartInstance = new Chart(ctx, chartConfig);
        }
    }
    
    
   // 결과 페이지를 표시하는 새로운 함수
    function showResults() {
        let lowestScore = Infinity;
        let lowestKey = '';
        for (const key in userScores) {
            if (userScores[key] < lowestScore) {
                lowestScore = userScores[key];
                lowestKey = key;
            }
        }

        if (lowestScore >= 7) {
            resultText.innerHTML = resultsData.perfect.text;
            guidelines.innerHTML = resultsData.perfect.guide;
        } else {
            resultText.innerHTML = resultsData[lowestKey].text;
            guidelines.innerHTML = resultsData[lowestKey].guide;
        }

        drawChart(resultChartCanvas, Object.values(userScores), false);
        
        pages.survey.style.display = 'none';
        pages.result.style.display = 'flex';
    }

    function selectChoice(scores) {
        answerHistory.push(scores); //점수 기록
        
        for (const key in scores) {
            userScores[key] += scores[key];
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }
  
  function goBack() {
    // 1. 히스토리에서 마지막 답변의 점수를 가져오고 배열에서 제거.
    const lastScores = answerHistory.pop();

    // 2. 마지막에 더했던 점수를 다시 빼서 점수를 원상 복구
    for (const key in lastScores) {
        userScores[key] -= lastScores[key];
    }

    // 3. 질문 번호를 하나 뒤로 돌립니다.
    currentQuestionIndex--;

    // 4. 이전 질문을 다시 화면에 로드합니다.
    loadQuestion();
    }  
  
     function startQuiz() {
        currentQuizIndex = 0;
        completeQuizBtn.style.display = 'none';
        loadQuizQuestion();
    }

    function loadQuizQuestion() {
        // 진행바 업데이트
        const progress = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        const quiz = quizQuestions[currentQuizIndex];
        // 문장의 일부를 (...) 기준으로 분리하여 괄호 안에 선택지가 들어갈 것을 암시
        quizQuestionText.innerHTML = quiz.question.replace('(...)', '<span style="color: #007BFF; font-weight: bold;">( ________ )</span>');
        quizChoicesContainer.innerHTML = '';
        
        quiz.choices.forEach(choiceText => {
            const button = document.createElement('button');
            button.innerText = choiceText;
            button.onclick = () => selectQuizAnswer(button, choiceText, quiz.answer);
            quizChoicesContainer.appendChild(button);
        });
    }

    function selectQuizAnswer(button, selectedAnswer, correctAnswer) {
        // 모든 버튼 비활성화 (중복 클릭 방지)
        Array.from(quizChoicesContainer.children).forEach(btn => btn.disabled = true);
        
        if (selectedAnswer === correctAnswer) {
            // 정답일 경우
            button.style.backgroundColor = '#28a745'; // 초록색
            button.style.color = 'white';
            button.style.borderColor = '#28a745';

            setTimeout(() => {
            // 문제 해설 보여주기
            showExplanation(); 
        }, 800); 
          
        } else {
            // 오답일 경우
            button.classList.add('shake');
            button.style.backgroundColor = '#dc3545'; // 빨간색
            button.style.color = 'white';
            button.style.borderColor = '#dc3545';

            setTimeout(() => {
                button.classList.remove('shake');
                // 모든 버튼 다시 활성화
                Array.from(quizChoicesContainer.children).forEach(btn => {
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                });
            }, 600); // 0.6초 후 효과 제거
        }
    }
    
  
// 해설 페이지를 보여주는 함수
function showExplanation() {
    const quiz = quizQuestions[currentQuizIndex];

    // 1. 해설 데이터 설정
    // explanationImage.src = quiz.explanation.image;
    explanationText.innerHTML = quiz.explanation.text;

    // 2. ✨ '다음 문제로' 버튼을 먼저 숨깁니다.
    nextQuizBtn.style.display = 'none';

    // 3. 퀴즈 페이지를 숨기고 해설 페이지를 보여줍니다.
    pages.quiz.style.display = 'none';
    explanationPage.style.display = 'flex';

    // 4. 2초(2000ms) 후에 버튼을 나타나게.
    setTimeout(() => {
        nextQuizBtn.style.display = 'block';
    }, 2000); 
}
  
  // 다음 문제로 넘어가는 함수
function loadNextQuiz() {
    currentQuizIndex++; // 다음 문제로 인덱스 증가

    // 1. 해설 페이지 숨기고 퀴즈 페이지 보이기
    explanationPage.style.display = 'none';
    pages.quiz.style.display = 'flex';

    if (currentQuizIndex < quizQuestions.length) {
        loadQuizQuestion(); // 다음 문제가 있으면 로드
    } else {
        // 모든 퀴즈 완료
        quizQuestionText.innerText = "모든 퀴즈를 완료했습니다!";
        quizChoicesContainer.innerHTML = "";
        completeQuizBtn.style.display = 'block';
    }
}
    
// 페이지 로드 시 인트로 차트 그리기 (애니메이션 효과)
const initialData = [7, 7, 7, 7, 7, 7]; // 시작할 때 보일 초기 데이터
if (introChartCanvas) {
    drawChart(introChartCanvas, initialData, true); // 먼저 차트를 한번 그림

    // 0.5초마다 차트 데이터를 랜덤하게 변경하여 업데이트
    introAnimationInterval = setInterval(() => {
        const randomData = [];
        for (let i = 0; i < 6; i++) {
            // 5에서 10 사이의 랜덤 숫자 생성
            const randomNumber = Math.random() * 6 + 4; 
            randomData.push(randomNumber);
        }
        
        // introChartInstance가 생성된 후에만 데이터 업데이트
        if (introChartInstance) {
            introChartInstance.data.datasets[0].data = randomData;
            introChartInstance.update(); // 부드럽게 차트를 다시 그림
        }
    }, 1000); // 500ms = 0.5초
}

  // 이벤트 리스너 연결
    // [시작하기] (인트로 -> 설문)
    startBtn.addEventListener('click', () => {
        pages.intro.style.display = 'none';
        pages.survey.style.display = 'flex';  //
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
