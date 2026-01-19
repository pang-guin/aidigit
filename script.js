document.addEventListener('DOMContentLoaded', () => {
    // --- 0. 배경 입자 효과 ---
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = Math.random() * 2 + 3 + 's';
            particlesContainer.appendChild(particle);
        }
    }
    // --- 1. DOM 요소 가져오기 ---
    const pages = {
        intro: document.getElementById('intro-page'),
        survey: document.getElementById('survey-page'),
        loading: document.getElementById('loading-page'),
        result: document.getElementById('result-page'),
        puzzle: document.getElementById('puzzle-page'),
        quiz: document.getElementById('quiz-page'),
        final: document.getElementById('final-page')
    };
    // 버튼 요소
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');
    const goToPuzzleBtn = document.getElementById('go-to-puzzle-btn'); // 결과 -> 퍼즐 이동 버튼
    const puzzleCompleteBtn = document.getElementById('puzzle-complete-btn'); // 퍼즐 -> 퀴즈 이동 버튼
    const nextQuizBtn = document.getElementById('next-quiz-btn');
    const completeQuizBtn = document.getElementById('complete-quiz-btn');
    // 화면 요소
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const surveyProgressBar = document.getElementById('survey-progress-bar');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizChoicesContainer = document.getElementById('quiz-choices-container');
    const progressBar = document.getElementById('progress-bar');
    const explanationPage = document.getElementById('explanation-page');
    const explanationText = document.getElementById('explanation-text');
    // 차트 관련
    const introChartCanvas = document.getElementById('introRadarChart');
    const resultChartCanvas = document.getElementById('resultRadarChart');
    let introChartInstance = null;
    let resultChartInstance = null;
    let introAnimationInterval = null;
    // --- 2. 데이터 (설문) ---
    const questions = [
        { question: `1. 과제로 보고서 쓰는 중! 나의 선택은?`, choices: [ 
          { text: "내가 초안을 작성한 후, AI에게 어색한 문장을 다듬어 달라고 한다.", scores: { autonomy: 1, comms: 1 } }, 
          { text: "AI에게 \"보고서 써줘\"라고 요청해 나온 결과물을 과제로 제출한다.", scores: { autonomy: -2, creative: -1 } }, 
          { text: "AI에게는 자료 조사 아이디어나 목차 조언만 구하고, 보고서는 내 생각대로 작성한다.", scores: { autonomy: 2, critical: 1 } } ] },
        { question: `2. AI가 '한국의 수도는 부산'이라는 정보를 알려줬다. 나의 반응은?`, choices: [ 
          { text: "뭔가 이상한데? 다른 자료나 책에서 사실을 다시 확인한다.", scores: { critical: 2, data: 1 } }, 
          { text: "\"AI가 틀렸네.\" 하고 무시하고 넘어간다.", scores: { critical: -1 } },
          { text: "'오? 바뀌었구나!' AI가 알려줬으니 정확한 정보로 생각한다.", scores: { critical: -2 } } ] },
        { question: "3. 친구의 얼굴 사진으로 재미있는 AI 밈(meme)을 만들고 싶을 때, 나는?", choices: [ 
          { text: "만들기 전에 친구에게 \"네 사진으로 AI 밈 만들어도 괜찮아?\"라고 먼저 물어본다.", scores: { ethics: 2 } },
          { text: "일단 만들자! 재밌으면 친구도 웃어넘길 것이다.", scores: { ethics: -2, data: -1 } },
          { text: "친구가 기분 나쁠 수도 있으니, 연예인 사진으로 밈을 만든다.", scores: { ethics: -2 } } ] },
        { question: "4. 코딩 숙제를 하다가 막혔을 때, AI에게 어떻게 질문할까?", choices: [ 
          { text: "오류 코드를 그대로 복사해서 붙여넣기만 한다.", scores: { comms: 1 } },
          { text: "\"코딩 오류 해결해 줘\"라고 질문한다.", scores: { comms: -1 } }, 
          { text: "내가 사용한 프로그래밍 언어, 발생한 오류 메시지, 내가 시도해 본 방법을 구체적으로 포함하여 질문한다.", scores: { comms: 2 } } ] },
        { question: "5. 새로운 AI 앱에서 '주소록 및 사진 접근 권한'을 요구한다. 나의 행동은?", choices: [ 
          { text: "이 앱의 기능을 사용하는 데 정말 주소록과 사진이 필요한지 따져보고, 불필요하면 동의하지 않는다.", scores: { data: 2 } }, 
          { text: "일단 동의하고, 나중에 찝찝하면 앱을 삭제한다.", scores: { data: -1 } }, 
          { text: "앱을 빨리 쓰기 위해 내용을 읽지 않고 '전체 동의'를 누른다.", scores: { data: -2 } } ] },
        { question: "6. 학교 축제 포스터를 만들어야 한다. AI를 어떻게 활용할까?", choices: [ 
          { text: "AI에게 \"학교 축제 포스터 만들어줘\"라고 입력하고, 나온 결과물 중 하나를 그대로 사용한다.", scores: { creative: -1,  autonomy: -1 } }, 
          { text: "AI에게 축제 주제, 주요 컨셉, 참여 대상 등을 구체적으로 설명해서 그림을 생성하고 마음에 드는 것을 활용하여 최종 디자인을 완성한다.", scores: { comms: 2, creative: 2 } },
          { text: "포스터에 들어갈 멋진 캐치프레이즈나 문구를 AI에게 추천받는다.", scores: { creative: 1 } } ] },    
        { question: `7. AI 영화 추천 서비스가 내가 싫어하는 영화를 연달아 추천했다. 이때 나는?`, choices: [ 
          { text: "나의 취향을 예시를 들어 추가 설명하고, 다시 추천해달라고 한다.", scores: { autonomy: 2, comms: 2 } },
          { text: "AI가 추천했으니 반드시 재미있을 거야. 일단 본다.", scores: { autonomy: -1 } }, 
          { text: "AI에게 추천한 이유를 물어 그 기준을 확인해본다.", scores: { autonomy: 2, comms: 2 } } ] },
        { question: `8. AI가 내일 중요한 시험에 나올 것이라며 예상 문제 목록을 만들어줬다.`, choices: [ 
          { text: "이 문제들만 집중적으로 공부한다.", scores: { autonomy: -2, critical: -1 } }, 
          { text: "AI가 만든 문제는 참고하면서 교과서 전체 범위를 내 계획대로 공부한다.", scores: { autonomy: 2, critical: 1 } }, 
          { text: "AI가 알려준 문제 위주로 공부하고 시간이 남으면 다른 문제를 본다.", scores: { autonomy: -1 } } ] },
        { question: `9. AI가 '바나나가 모든 병을 치료한다'는 놀라운 정보를 알려주었다.`, choices: [ 
          { text: "오, 신기하다! 가족에게 바로 공유한다.", scores: { critical: -2, ethics: -1 } }, 
          { text: "흠.. 바나나에 어떤 성분이 있는지 추가로 조사해본다.", scores: { critical: 2, autonomy: 1 } }, 
          { text: "아냐! 의학적으로 검증된 것인지 뉴스를 찾아 추가로 확인한다.", scores: { critical: 2, data: 1 } } ] },
        { question: `10. 인터넷에서 유명 연예인이 논란이 될 발언을 하는 영상을 보았다. 나의 행동은?`,   choices: [ 
          { text: "요즘 AI로 만든 영상이 많으니, 가짜일 수도 있겠다고 생각한다.", scores: { critical: 1 } }, 
          { text: "영상으로 찍혔으니 사실일 것이다. 바로 친구들에게 공유한다.", scores: { critical: -2, ethics: -2 } }, 
          { text: "확인해봐야겠다. 해당 연예인의 공식 입장이나 관련 기사를 찾아본다.", scores: { critical: 2, autonomy: 1} } ] },
        { question: `11. AI 챗봇과 대화하며 고민을 털어놓고 싶을 때, 어떻게 해야 할까?`, choices: [ 
          { text: "내 이름, 학교, 친구 관계 등 모든 것을 구체적으로 설명한다.", scores: { data: -2, ethics: -1 } }, 
          { text: "이름, 주소 등 개인적인 정보는 제외하고, 고민 상황만 입력한다.", scores: { data: 2 } },
          { text: "다른 친구의 개인정보를 대신 입력해서 답변을 들어본다.", scores: { data: -2, ethics: -2 } } ] },
        { question: `12. 좋아하는 가수의 목소리를 학습한 AI 커버 노래를 발견했다. 이때 나는?`, choices: [ 
          { text: "신기하고 재밌으니, 다른 가수 목소리로도 만들어달라고 요청한다.", scores: { ethics: -2 } }, 
          { text: "공식 음원이 아니니, 개인적으로만 즐긴다.", scores: { ethics: 1 } },
          { text: "원곡 가수와 작곡가가 동의를 했는지 어떤 데이터로 만들었는지 곡 설명을 찾아본다.", scores: { ethics: 2 } } ] },
        { question: `13. AI에게 '강아지'를 그려달라고 했는데, 마음에 드는 그림이 나오지 않는다.`, choices: [ 
          { text: "'강아지'라는 단어를 계속 반복해서 입력한다.", scores: { comms: -2 } }, 
          { text: "'골든 리트리버 강아지가 공원에서 공을 물고 웃고 있는 모습을 따뜻한 색감의 디지털 아트로 그려줘'라고 구체적으로 요청한다.", scores: { comms: 2, creative: 1 } }, 
          { text: "다른 키워드를 써볼까? '고양이'를 입력해본다.", scores: { comms: -2 } } ] },
        { question: `14. 저녁 메뉴 추천을 AI에게 부탁할 때, 어떻게 질문을 할까?`, choices: [ 
          { text: "\"저녁 뭐 먹지?\"", scores: { comms: -1 } }, 
          { text: "\"집에 김치랑 계란, 양파로 30분 안에 만드는 메뉴 3가지를 추천해줘.\"", scores: { comms: 2 } }, 
          { text: "\"빨리 맛있는 거.\"", scores: { comms: -2 } } ] },
        { question: `15. 얼굴을 분석해 미래를 예측한다는 AI 웹사이트가 내 SNS 계정 연동을 요구한다.`, choices: [ 
          { text: "내 미래!! 궁금하니 바로 계정을 연동한다.", scores: { data: -2 } }, 
          { text: "내 게시물, 친구목록까지 요구하는 것은 과도한 것 같다. 사이트 이용을 포기한다.", scores: { data: 2 } }, 
          { text: "일단 연동하고, 결과를 본 다음에 연동을 해지한다.", scores: { data: -1 } } ] }
    ];
    // --- 3. 데이터 (결과) ---
    const resultsData = {
        autonomy: { 
            title: "✨ 당신은 'AI 조종사' 타입! ✨", 
            text: "⚠️주체적 의사결정능력⚠️을 높여봐요!<br> AI라는 최첨단 비행기를 즐기나 가끔 자율주행에 너무 의존하는 편!<br> 판단은 내가 직접 내려야해요!", 
            cards: [
                { icon: "🎯", title: "목표 정하기", description: "AI 사용 전! 내가 진짜 원하는 것이 무엇인지 명확히 정의해요." },
                { icon: "🤔", title: "검토하기", description: "아무리 멋진 AI의 답변이라도 그것이 내 상황에 맞는지 꼭 검토해요." },
                { icon: "✍️", title: "스스로 선택하기", description: "추천 알고리즘에 의존하지 말고 최종 결정은 나의 가치관과 목표에 따라 직접 내려요." },
                { icon: "🚀", title: "책임감 가지기", description: "내가 AI를 통해 내린 선택은 AI가 아닌 나의 책임이라는 것! 잊지말아요." }
            ]
        },
        critical: { 
            title: "✨ 당신은 '순수한 믿음'의 소유자! ✨", 
            text: "⚠️비판적 사고력⚠️을 높여봐요!<br> AI의 말이라면 한국의 수도가 부산이라 해도 믿는 편!<br> 하지만 AI의 답변에는 오류가 있을 수 있어요!",
            cards: [
                { icon: "🔍", title: "다른 출처와 비교하기", description: "AI가 제공한 정보를 신뢰할 수 있는 다른 출처와 비교해서 검증해요." },
                { icon: "❓", title: "질문과 근거 함께 묻기", description: "AI에게 정보의 근거나 출처를 함께 요청해서, 그것이 믿을 만한지 확인해요." },
                { icon: "⚖️", title: "다양한 관점 보기", description: "한 가지 답변보다 여러 AI나 사람에게 물어보고 다른 시각을 함께 살펴요." },
                { icon: "🕵️‍♂️", title: "논리적으로 검토하기", description: "자연스럽고 그럴싸한 답변이라도 흐름이나 구조에 어색한 점은 없는지 확인해요." }
            ]
        },
        ethics: { 
            title: "✨ 당신은 '자유로운 영혼' 타입! ✨", 
            text: "⚠️윤리적 판단력⚠️을 높여봐요!<br> 재미와 효율이 중요한 당신!<br> 하지만 나의 AI 활용이 누군가에게 상처를 줄 수 있어요.<br> 행동하기 전 '이래도 괜찮을까?' 생각해봐요!", 
            cards: [
                { icon: "©️", title: "저작권 존중하기", description: "AI로 만든 콘텐츠가 다른 사람의 저작권, 초상권을 침해하지 않는지 확인해요." },
                { icon: "🤝", title: "동의 구하기", description: "친구 얼굴 합성이나 간단한 장난이라해도 반드시 본인의 동의를 받아요." },
                { icon: "💭", title: "영향 고려하기", description: "내 행동이 다른 사람에게 미칠 영향을 먼저 생각하고 윤리적으로 판단해요." },
                { icon: "🚀", title: "책임감 가지기", description: "내가 AI를 통해 내린 선택은 AI가 아닌 나의 책임이라는 것! 잊지말아요." }
            ]
        },
        comms: { 
            title: "✨ 당신은 '마음으로 말해요' 타입! ✨", 
            text: "⚠️AI 소통능력⚠️을 높여봐요!<br> 툭 던지듯 말해도 AI가 찰떡같이 알아주길 바라는군요!<br> 하지만 AI는 아직 당신의 마음을 읽지 못해요!", 
            cards: [
                { icon: "🎭", title: "역할 부여하기", description: "AI에게 '맞춤법을 교정하는 편집자', '단계별로 힌트를 주는 수학 선생님' 등 구체적인 역할을 추가해요." },
                { icon: "📝", title: "구체적으로 요청하기", description: "'고등학생이 이해하도록','3줄로 요약해',같이 대상, 분량, 형식을 구체적으로 적어 명령하기." },
                { icon: "🔄", title: "피드백하기", description: "AI 답변이 부족하다면 '예시를 더 보여줘', '두 번째 설명에서'등 어떤 부분을 부족한지, 무엇을 더 원하는지 피드백해요." },
                { icon: "🗣️", title: "끈기 있게 대화하기", description: "단답형 질문보다는 반복적으로 질문을 정교화하며 내가 원하는 최상의 결과물 얻어요."}
            ]
        },
        data: { 
            title: "✨ 당신은 '쿨한 신뢰'의 소유자! ✨", 
            text: "⚠️데이터 통제력⚠️을 높여봐요!<br> '무슨 일 있겠어?'라며 데이터를 제공하는 쿨한 성격!<br> 하지만 당신의 개인정보는 무엇보다 소중합니다!", 
            cards: [
                { icon: "📋", title: "필수와 선택 구분하기", description: "회원가입 할 때 습관적인 '전체 동의'는 그만! 필요하지 않다면 '선택' 항목은 체크를 해제하세요." },
                { icon: "🚫", title: "접근 권한 확인하기", description: "지도 앱도 아닌데 '위치 정보'를 요구한다고? 필요한 권한일지 의심하고 꼭 필요한 권한만 제공해요." },
                { icon: "🗑️", title: "디지털 흔적 지우기", description: "더 이상 쓰지 않는 앱이나 서비스는 탈퇴해서 내 데이터가 떠돌아 다니지 않도록 주기적으로 정리해요." },
                { icon: "🔒", title: "내 정보 철벽방어하기", description: "나와 친구의 사진, 연락처 등 개인정보를 함부로 AI나 앱에 입력하지 않아요." }
            ]
        },
        creative: { 
            title: "✨ 당신은 'AI 비서' 활용 타입! ✨", 
            text: "⚠️창의적 활용 능력⚠️을 높여봐요!<br> 문제를 해결할 때 AI를 즐겨 활용하는 당신!<br> 하지만 AI는 당신의 창의력 또한 폭발시켜 줄 최고의 파트너입니다!", 
            cards: [
                { icon: "🌈", title: "새로운 조합 시도하기", description: "'조선시대'와 '사이버펑크'처럼 전혀 안 어울릴 것 같은 키워드를 섞어 신선한 아이디어를 요청해보세요." },
                { icon: "✨", title: "나만의 터치 더하기", description: "AI가 만든 결과물에 나만의 문체, 경험을 더해 나만의 스타일로 발전시켜요." },
                { icon: "🎪", title: "다른 시각을 불러오기", description: "AI와 대화하며 평소 나라면 생각하지 못했을 것 같은 새로운 시각으로 해결방법을 찾아봐요." },
                { icon: "🎨", title: "장르 바꾸기", description: "소설을 뉴스 기사로, 교과서 내용을 랩으로 내 고민을 그림으로! 새로운 장르로 변주해봐요." }
            ]
        },
        perfect: { 
            title: "✨당신은 이미 '육각형 인간'!✨",
            text: "AI를 다루는 당신의 능력은 완벽에 가깝습니다!", 
            cards: [
                { icon: "🗓️", title: "나만의 AI 루틴 세우기", description: "복잡한 시험 일정 관리, 여행 계획, 노트 정리 등 반복되는 일상에서 AI를 적극 활용해봐요." },
                { icon: "🤝", title: "AI 꿀팁 전수하기", description: "AI 사용을 어려워하는 친구, 가족에게 나만의 유용한 프롬프트 작성 팁이나 유용한 툴을 전수해주세요!" },
                { icon: "🌍", title: "모두를 위한 AI 만들기", description: "학교나 동아리, 지역사회의 문제를 해결하는 아이디어를 AI와 함께 구상해보고 선한 영향력을 발휘해요." },
                { icon: "🏆", title: "AI 리더로 앞장서기", description: "AI를 비판적이고 윤리적으로 활용하는 모습을 통해 AI가 가진 멋지고 새로운 영향력을 보여주세요!" }
            ]
        }
    };
    // --- 4. 데이터 (퀴즈) ---
    const quizQuestions = [
        {
            question: "1. AI가 추천해 준 여행 계획을 검토 없이 그대로 따르기보다, (...) 나의 상황에 맞게 수정하여 최종 계획을 세웠다.",
            choices: ["나의 취향과 예산을 고려하여", "친구가 좋다고 해서", "가장 저렴한 옵션이라서"],
            answer: "나의 취향과 예산을 고려하여",
            explanation: { text: "<center><span class='keyword-badge'>주체적 의사결정능력!</span></center><br> AI는 훌륭한 조언자이지만, 최종 결정은 나만의 기준과 가치관에 따라야 해요. AI의 제안을 비판적으로 검토하고 내 상황에 맞게 수정하는 것이 중요합니다." }
        },
        {
            question: "2. AI에게 보고서 초안을 부탁한 뒤, (...) 완성했다.",
            choices: ["내가 조사한 내용과 의견을 추가하여", "디자인만 살짝 바꿔서"],
            answer: "내가 조사한 내용과 의견을 추가하여",
            explanation: { text: "<center><span class='keyword-badge'>창의적 활용 능력!</span></center><br>AI가 만든 결과물을 그대로 사용하는 것은 창의적인 활용이 아니에요. AI를 아이디어를 발전시키는 파트너로 삼고, 나만의 생각과 노력을 더해 결과물을 완성해야 합니다." }
        },
        {
            question: "3. AI가 만든 뉴스 기사를 읽을 때 (...) 다른 기사와 교차 확인했다.",
            choices: ["제목이 자극적이라서", "내용이 흥미로워서", "정보의 출처를 명확히 알 수 없어서"],
            answer: "정보의 출처를 명확히 알 수 없어서",
            explanation: { text: "<center><span class='keyword-badge'>비판적 사고력!</span></center><br>AI도 때로 틀리거나 편향된 정보를 생성할 수 있으니 비판적으로 검토해요!" }
        },
        {
            question: "4. AI 챗봇이 '모든 버섯은 식용 가능하다'고 하자, (...) 전문가의 의견이나 신뢰할 수 있는 자료를 찾아봤다.",
            choices: ["그 말을 곧이곧대로 믿지 않고,", "신기한 정보라고 생각하고,", "친구들에게 바로 전달하고,"],
            answer: "그 말을 곧이곧대로 믿지 않고,",
            explanation: { text: "<center><span class='keyword-badge'>비판적 사고력!</span></center><br>AI의 답변을 맹신해서는 안 돼요! 생명이나 건강에 영향을 줄 수 있는 정보는 반드시! 전문가나 신뢰할 수 있는 출처를 통해 재확인해야 합니다." }
        },
        {
            question: "5. 친구의 사진을 AI 필터에 넣기 전에, (...) 먼저 친구의 허락을 구했다.",
            choices: ["재미있는 결과가 나올 것 같아서", "내 마음대로 해도 된다고 생각해서", "개인의 초상권을 존중해야 하므로"],
            answer: "개인의 초상권을 존중해야 하므로",
            explanation: { text: "<center><span class='keyword-badge'>윤리적 판단력!</span></center><br><br>다른 사람의 사진이나 개인정보를 AI에 활용할 때는 반드시 당사자의 동의를 구해야 해요. 이는 개인의 초상권과 프라이버시를 존중하는 기본적인 AI 윤리입니다." }
        },
        {
            question: "6. AI로 만든 음악을 공모전에 제출할 때, (...) AI 사용 규정을 꼼꼼히 확인하고 준수했다.",
            choices: ["아무도 모를 것이라고 생각하고", "저작권 및 공모전의 윤리 규정을 지키기 위해", "수상 확률을 높이기 위해"],
            answer: "저작권 및 공모전의 윤리 규정을 지키기 위해",
            explanation: { text: "<center><span class='keyword-badge'>윤리적 판단력!</span></center><br><br>AI를 활용할 때는 기술을 사용하는 커뮤니티의 규칙과 법적 규제(저작권 등)를 이해하고 지키는 것이 중요합니다. 정정당당하게 AI를 활용하는 태도가 필요해요." }
        },
        {
            question: "7. 구체적으로 원하는 이미지를 생성하기 위해 AI에게 (...)라고 지시했다.",
            choices: ["'슬픈 표정으로 앉아 있는 주황색 고양이를 수채화 스타일로 그려줘'", "'고양이'", "'슬픈 고양이'"],
            answer: "'슬픈 표정으로 앉아 있는 주황색 고양이를 수채화 스타일로 그려줘'",
            explanation: { text: "<center><span class='keyword-badge'>AI 소통능력!</span></center><br><br>AI에게 원하는 결과를 얻으려면 명확하고 구체적으로 지시해야 해요. 배경, 대상, 스타일, 형식 등 구체적인 맥락을 제공할수록 AI는 내 의도를 더 정확하게 파악합니다." }
        },
        {
            question: "8. 코딩 문제 해결을 위해, (...) 라고 질문했다.",
            choices: ["'81번째 줄에서 오류가 났어. 이 파이썬 코드를 보고 list의 중복 항목을 제거하는 코드를 알려줘'", "'오류 나는데?'"],
            answer: "'81번째 줄에서 오류가 났어. 이 파이썬 코드를 보고 list의 중복 항목을 제거하는 코드를 알려줘'",
            explanation: { text: "<center><span class='keyword-badge'>AI 소통능력!</span></center><br><br>막연한 질문보다는 문제 상황, 내가 시도해 본 것, 원하는 결과 등을 구체적으로 설명해야 AI가 효과적인 해결책을 제시할 수 있어요. 좋은 질문이 좋은 답변을 만듭니다." }
        },
        {
            question: "9. 회원가입을 할 때  (...)",
            choices: ["모든 약관에 전체 동의하지않고 불필요한 '선택' 항목은 동의하지 않았다.", "바로 전체 동의를 눌렀다.", "혜택을 더 받을 것 같아 전체 동의를 눌렀다."],
            answer: "모든 약관에 전체 동의하지않고 불필요한 '선택' 항목은 동의하지 않았다.",
            explanation: { text: "<center><span class='keyword-badge'>데이터 통제력!</span></center><br><br>서비스 이용에 꼭 필요하지 않은 개인정보 '선택' 항목까지 무심코 동의하면 내 정보가 원치 않는 곳에 활용될 수 있어요. 내 정보의 주권은 나에게 있음을 기억해야 합니다." }
        },
        {
            question: "10. AI가 만든 음악 코드를 (...) 멜로디와 가사를 더해 곡을 만들었다.",
            choices: ["그대로 사용하여 과제물로 제출하지 않고, 직접", "그대로 사용하고 AI가 자동으로 만들어 준", "사용하고, 유명 가수의 목소리를 학습한 목소리에 "],
            answer: "그대로 사용하여 과제물로 제출하지 않고, 직접",
            explanation: { text: "<center><span class='keyword-badge'>창의적 활용 능력!</span></center><br> AI의 제안을 출발점으로 삼아 나만의 아이디어를 결합할 때 진정한 '창작'이 이루어집니다. AI는 창작의 재료를 제공하는 훌륭한 파트너가 될 수 있어요." }
        },
        {
            question: "11. 출처가 불분명한 앱을 설치할 때 (...) '주소록 접근 권한' 요구는 거부했다.",
            choices: ["개인정보 유출 위험이 있으므로", "저장 공간이 부족해서", "앱 아이콘이 마음에 안 들어서"],
            answer: "개인정보 유출 위험이 있으므로",
            explanation: { text: "<center><span class='keyword-badge'>데이터 통제력!</span></center><br><br>스마트폰의 주소록, 사진첩 등은 매우 민감한 개인정보예요. 앱이 어떤 권한을 요구하는지, 그 권한이 앱의 기능에 꼭 필요한지 꼼꼼히 따져보고 결정하는 것이 안전합니다." }
        }, 
        {
            question: "12. AI가 생성한 여러 디자인 시안 중에서 (...) 요소를 조합하여 최종 로고를 완성했다.",
            choices: ["내 의도와 어울리는 것을 검토한 뒤 마음에 드는", "유명 로고와 헷갈리도록 가장 잘 따라한", "AI가 가장 먼저 추천한"],
            answer: "내 의도와 어울리는 것을 검토한 뒤 마음에 드는",
            explanation: { text: "<center><span class='keyword-badge'>주체적 의사결정능력!</span></center><br> AI는 다양한 선택지를 제공할 수 있지만, 최종적으로 어떤 결과물이 나의 의도와 목표에 가장 부합하는지 판단하는 것은 나의 몫입니다. AI는 도구일 뿐! 결정의 주체는 나 자신입니다." }
        }
    ];
    // --- 5. 상태 변수 ---
    let currentQuestionIndex = 0;
    let userScores = { autonomy: 5, critical: 5, ethics: 5, comms: 5, data: 5, creative: 5 };
    let answerHistory = []; 
    let currentQuizIndex = 0;
    // 퍼즐용 변수
    let currentPuzzleData = [];
    let completedCount = 0;
    let draggedElement = null;
    let touchClone = null;
    // --- 6. 함수 정의 ---
    function createCardSparkles(element) {
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'card-sparkle';
            // 랜덤 위치 및 방향 계산
            const angle = Math.random() * Math.PI * 2;
            const velocity = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            sparkle.style.setProperty('--tx', `${tx}px`);
            sparkle.style.setProperty('--ty', `${ty}px`);
            element.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 600);
        }
    }
    // 설문 로드
    function loadQuestion() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        surveyProgressBar.style.width = `${progress}%`;
        const currentQuestion = questions[currentQuestionIndex];
        questionText.innerText = currentQuestion.question;
        choicesContainer.innerHTML = '';
        currentQuestion.choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.onclick = () => selectChoice(choice.scores);
            choicesContainer.appendChild(button);
        });
        if (currentQuestionIndex > 0) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
    }    
    function selectChoice(scores) {
        choicesContainer.style.pointerEvents = 'none';
        answerHistory.push(scores);
        
        for (const key in scores) {
            userScores[key] += scores[key];
            // 0점 미만 방지
            if (userScores[key] < 0) userScores[key] = 0;
            // 10점 초과 방지
            if (userScores[key] > 10) userScores[key] = 10;
        }

        questionText.classList.add('fade-out');
        choicesContainer.classList.add('fade-out');
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion(); 
                setTimeout(() => {
                    questionText.classList.remove('fade-out');
                    choicesContainer.classList.remove('fade-out');
                    choicesContainer.style.pointerEvents = 'auto';
                }, 50);
            } else {
                pages.survey.style.display = 'none';
                pages.loading.style.display = 'flex';
                setTimeout(() => {
                    pages.loading.style.display = 'none';
                    showResults();
                }, 2000);
            }
        }, 300); 
    }
    function goBack() {
        if (currentQuestionIndex > 0) {
            const lastScores = answerHistory.pop();
            for (const key in lastScores) {
                userScores[key] -= lastScores[key];
            }
            currentQuestionIndex--;
            loadQuestion();
        }
    }  
    // 결과 및 차트
    function showResults() {
        let lowestScore = Infinity;
        let lowestKey = '';
        for (const key in userScores) {
            if (userScores[key] < lowestScore) {
                lowestScore = userScores[key];
                lowestKey = key;
            }
        }
        let dataKey = (lowestScore >= 7) ? 'perfect' : lowestKey;
        const data = resultsData[dataKey];
        resultTitle.innerHTML = data.title;
        resultText.innerHTML = data.text;
        drawChart(resultChartCanvas, Object.values(userScores), false);
        // 퍼즐에 사용할 데이터 저장
        currentPuzzleData = data.cards;
        pages.result.style.display = 'flex';
    }
    function drawChart(canvasElement, scoreData, isIntro) {
        if (!canvasElement) return;
        const ctx = canvasElement.getContext('2d');
        const config = {
            type: 'radar',
            data: {
                labels: ['주체성', '비판력', '윤리성', '소통력', '데이터', '창의성'],
                datasets: [{
                    label: '능력치',
                    data: scoreData,
                    backgroundColor: 'rgba(255, 105, 180, 0.2)',
                    borderColor: 'rgba(255, 105, 180, 1)',
                    pointBackgroundColor: 'rgba(255, 105, 180, 1)',
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { r: { suggestedMin: 0, suggestedMax: 10, ticks: { display: false }, pointLabels: { font: { size: 14 } } } },
                plugins: { legend: { display: false } }
            }
        };
        if (isIntro) {
             if (introChartInstance) introChartInstance.destroy();
             introChartInstance = new Chart(ctx, config);
        } else {
             if (resultChartInstance) resultChartInstance.destroy();
             resultChartInstance = new Chart(ctx, config);
        }
    }
    // --- 퍼즐 게임 로직 ---
    function initGame() {
        const bubblesContainer = document.getElementById('bubbles-container');
        const categoriesContainer = document.getElementById('categories-container');
        const progressText = document.getElementById('puzzle-progress-text');
        // [안전장치 추가] 요소가 없으면 중단
        if (!bubblesContainer || !categoriesContainer) return;
        bubblesContainer.innerHTML = '';
        categoriesContainer.innerHTML = '';
        completedCount = 0;
        if (progressText) progressText.textContent = `0/${currentPuzzleData.length}`;
        const puzzleBtn = document.getElementById('puzzle-complete-btn');
        if (puzzleBtn) puzzleBtn.style.display = 'none';
        // 1. 카테고리 박스 생성
        currentPuzzleData.forEach(item => {
            const box = document.createElement('div');
            box.className = 'category-box';
            box.dataset.category = item.title; 
            box.innerHTML = `
                <div class="category-icon">${item.icon}</div>
                <div class="category-title">${item.title}</div>
            `;
            // 드래그 이벤트 (Drop Zone)
            box.addEventListener('dragover', (e) => {
                e.preventDefault();
                box.classList.add('drag-over');
            });
            box.addEventListener('dragleave', () => box.classList.remove('drag-over'));
            box.addEventListener('drop', (e) => {
                e.preventDefault();
                box.classList.remove('drag-over');
                handleDrop(box);
            });
            categoriesContainer.appendChild(box);
        });
        // 2. 말풍선 생성 (랜덤 섞기)
        const shuffledData = [...currentPuzzleData].sort(() => Math.random() - 0.5);
        shuffledData.forEach((item) => {
            const bubble = document.createElement('div');
            bubble.className = 'puzzle-bubble';
            bubble.draggable = true;
            bubble.dataset.category = item.title; 
            bubble.innerHTML = item.description;
            // 드래그 시작 이벤트
            bubble.addEventListener('dragstart', (e) => {
                draggedElement = e.target;
                e.target.classList.add('dragging');
            });
            bubble.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                draggedElement = null;
            });
            // 모바일 터치 지원
            bubble.addEventListener('touchstart', handleTouchStart, { passive: false });
            bubble.addEventListener('touchmove', handleTouchMove, { passive: false });
            bubble.addEventListener('touchend', handleTouchEnd);
            bubblesContainer.appendChild(bubble);
        });
    }
    // 드롭 처리 로직
    function handleDrop(categoryBox) {
        if (!draggedElement) return;
        const targetCategory = categoryBox.dataset.category;
        const bubbleCategory = draggedElement.dataset.category;
        // 이미 완료된 박스는 무시
        if (categoryBox.classList.contains('completed')) return;
        if (targetCategory === bubbleCategory) {
            // 정답
            categoryBox.classList.add('completed');
            createCardSparkles(categoryBox);
            // 성공 메시지 표시
            const successMsg = document.createElement('div');
            successMsg.className = 'success-msg';
            successMsg.textContent = "✓실천행동 체크!";
            categoryBox.appendChild(successMsg);
            // 말풍선 제거
            draggedElement.remove();
            // 진행도 업데이트
            completedCount++;
            const progressText = document.getElementById('puzzle-progress-text');
            if (progressText) progressText.textContent = `${completedCount}/${currentPuzzleData.length}`;
            if (completedCount === currentPuzzleData.length) {
                setTimeout(() => {
                    const btn = document.getElementById('puzzle-complete-btn');
                    if(btn) {
                        btn.style.display = 'block';
                        btn.classList.add('pulse-animation');
                    }
                }, 500);
            }
        } else {
            // 오답: 흔들림 효과
            draggedElement.classList.add('shake-return');
            setTimeout(() => {
                draggedElement.classList.remove('shake-return');
            }, 400);
        }
    }
    // --- 모바일 터치 핸들러 ---
    function handleTouchStart(e) {
        e.preventDefault(); 
        draggedElement = e.target;
        const touch = e.touches[0];
        touchClone = draggedElement.cloneNode(true);
        touchClone.style.position = 'fixed';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.zIndex = '1000';
        touchClone.style.opacity = '0.8';
        touchClone.style.width = draggedElement.offsetWidth + 'px';
        moveClone(touch.clientX, touch.clientY);
        document.body.appendChild(touchClone);
        draggedElement.style.opacity = '0.3'; 
    }
    function handleTouchMove(e) {
        e.preventDefault();
        if (!touchClone) return;
        const touch = e.touches[0];
        moveClone(touch.clientX, touch.clientY);
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const box = target ? target.closest('.category-box') : null;
        document.querySelectorAll('.category-box').forEach(b => b.classList.remove('drag-over'));
        if (box && !box.classList.contains('completed')) {
            box.classList.add('drag-over');
        }
    }
    function handleTouchEnd(e) {
        if (!draggedElement || !touchClone) return;
        const touch = e.changedTouches[0];
        touchClone.remove();
        touchClone = null;
        draggedElement.style.opacity = '1';
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const box = target ? target.closest('.category-box') : null;
        document.querySelectorAll('.category-box').forEach(b => b.classList.remove('drag-over'));
        if (box) {
            handleDrop(box);
        }
        draggedElement = null;
    }
    function moveClone(x, y) {
        if (touchClone) {
            touchClone.style.left = (x - touchClone.offsetWidth / 2) + 'px';
            touchClone.style.top = (y - touchClone.offsetHeight / 2) + 'px';
        }
    }
    // --- 퀴즈 관련 함수 ---
    function startQuiz() {
        currentQuizIndex = 0;
        if(completeQuizBtn) completeQuizBtn.style.display = 'none';
        loadQuizQuestion();
    }
    function loadQuizQuestion() {
        const progress = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        const quiz = quizQuestions[currentQuizIndex];
        quizQuestionText.innerHTML = quiz.question.replace('(...)', '<span style="color: #007BFF; font-weight: bold;">( ________ )</span>');
        quizChoicesContainer.innerHTML = '';
        quiz.choices.forEach(txt => {
            const btn = document.createElement('button');
            btn.innerText = txt;
            btn.onclick = () => checkQuizAnswer(btn, txt, quiz.answer);
            quizChoicesContainer.appendChild(btn);
        });
    }
    function checkQuizAnswer(btn, selected, correct) {
        Array.from(quizChoicesContainer.children).forEach(b => b.disabled = true);
        if (selected === correct) {
            btn.style.backgroundColor = '#28a745'; btn.style.color='white';
            setTimeout(() => {
                explanationText.innerHTML = quizQuestions[currentQuizIndex].explanation.text;
                pages.quiz.style.display = 'none';
                explanationPage.style.display = 'flex';
            }, 800);
        } else {
            btn.classList.add('shake'); btn.style.backgroundColor='#dc3545'; btn.style.color='white';
            setTimeout(() => {
                btn.classList.remove('shake');
                Array.from(quizChoicesContainer.children).forEach(b => {
                    b.disabled = false; b.style.backgroundColor=''; b.style.color='';
                });
            }, 600);
        }
    }
    // --- 이벤트 리스너 ---
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if(introAnimationInterval) clearInterval(introAnimationInterval);
            pages.intro.style.display = 'none';
            pages.survey.style.display = 'flex';
            loadQuestion();
        });
    }
    if (backBtn) backBtn.addEventListener('click', goBack);
    // [추가] 퍼즐로 이동
    if (goToPuzzleBtn) {
        goToPuzzleBtn.addEventListener('click', () => {
            pages.result.style.display = 'none';
            pages.puzzle.style.display = 'flex';
            initGame();
        });
    }
    // [추가] 퍼즐 완료 후 퀴즈로
    if (puzzleCompleteBtn) {
        puzzleCompleteBtn.addEventListener('click', () => {
            pages.puzzle.style.display = 'none';
            pages.quiz.style.display = 'flex';
            startQuiz();
        });
    }
    if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', () => {
            currentQuizIndex++;
            explanationPage.style.display = 'none';
            if (currentQuizIndex < quizQuestions.length) {
                pages.quiz.style.display = 'flex';
                loadQuizQuestion();
            } else {
                pages.quiz.style.display = 'flex';
                quizQuestionText.innerText = "모든 퀴즈 완료!";
                quizChoicesContainer.innerHTML = "";
                completeQuizBtn.style.display = 'block';
            }
        });
    }
    if (completeQuizBtn) {
        completeQuizBtn.addEventListener('click', () => {
            pages.quiz.style.display = 'none';
            pages.final.style.display = 'flex';
            document.body.classList.add('final-page-active');
        });
    }
    // 인트로 애니메이션
    if (introChartCanvas) {
        drawChart(introChartCanvas, [5,5,5,5,5,5], true);
        introAnimationInterval = setInterval(() => {
            const randomData = Array(6).fill(0).map(() => Math.random()*6+4);
            if(introChartInstance) {
                introChartInstance.data.datasets[0].data = randomData;
                introChartInstance.update();
            }
        }, 1000);
    }
});
