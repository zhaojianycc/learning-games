(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
  const CLOUD_BOARD = { url: 'https://xnydlalgelkinygfgyok.supabase.co', key: 'sb_publishable_nlwGDFitvnCRBRb55VW9rg_Uil7DTM1' };

  const LANES = [
    { id: 'air', name: '空中', icon: '☁️' },
    { id: 'land', name: '陆地', icon: '🌿' },
    { id: 'water', name: '水中', icon: '🌊' },
    { id: 'underground', name: '地下', icon: '🪨' }
  ];

  const LEVELS = [
    { title: '陆地侦察队', topicMath: '乘法口诀', topicEnglish: '看图认词', wave: ['land','land','land','land'] },
    { title: '草原小队', topicMath: '重复加法', topicEnglish: '补一个字母', wave: ['land','land','land','land','land','land'] },
    { title: '飞行突袭', topicMath: '乘法混合', topicEnglish: '选择正确拼写', wave: ['land','air','land','air','air','land'] },
    { title: '天空包围战', topicMath: '交换律', topicEnglish: '字母顺序', wave: ['air','land','air','air','land','air','land','air'] },
    { title: '深水警报', topicMath: '缺少的乘数', topicEnglish: '补两个字母', wave: ['land','water','land','water','water','land'] },
    { title: '激流追击', topicMath: '等值算式', topicEnglish: '易错拼写', wave: ['air','water','air','water','water','air','water'] },
    { title: '地下伏兵', topicMath: '分配与巧算', topicEnglish: '完整拼写', wave: ['land','air','water','burrow','land','air','water','burrow'] },
    { title: '四域混战', topicMath: '三连乘', topicEnglish: '词义与拼写', wave: ['air','water','burrow','air','water','burrow','air','water','burrow'] },
    { title: '跨域追踪', topicMath: '一位数乘两位数', topicEnglish: '句中选词', wave: ['land','air','water','burrow','cross','air','cross','water','cross'] },
    { title: '四域怪兽王', topicMath: '综合挑战', topicEnglish: '综合挑战', wave: ['land','air','water','burrow','boss'] }
  ];

  const ENEMY_INFO = {
    land: { emoji: '🐗', name: '陆地怪', hp: 2, speed: 1, lane: 'land' },
    air: { emoji: '🦇', name: '飞行怪', hp: 2, speed: 2, lane: 'air' },
    water: { emoji: '🐙', name: '水怪', hp: 2, shield: 2, speed: 2, lane: 'water' },
    burrow: { emoji: '🐛', name: '钻地怪', hp: 2, speed: 1, lane: 'underground' },
    cross: { emoji: '👻', name: '跨域怪', hp: 4, speed: 1, lane: 'air' },
    boss: { emoji: '👾', name: '四域怪兽王', hp: 4, speed: 1, lane: 'air' }
  };

  const DOMAIN_DECOR = {
    air: ['☁️','🪶','✨','🪁','🌤️','🎈'],
    land: ['🌱','🌼','🌳','🍄','🪵','🪨'],
    water: ['🫧','🐚','🪸','🌿','🐟','⚓'],
    underground: ['💎','🪨','🦴','🕯️','⛏️','🟣']
  };
  const CASTLE_THEMES = {
    air: { icon:'🏰', badge:'☁️', title:'天空城堡' },
    land: { icon:'🏯', badge:'🌿', title:'森林城堡' },
    water: { icon:'🕌', badge:'🫧', title:'珊瑚城堡' },
    underground: { icon:'🏰', badge:'💎', title:'水晶城堡' }
  };
  const THREAT_LEVEL = { land:0, air:1, water:2, burrow:2, cross:3, boss:4 };

  const ENGLISH_WORDS = [
    { word:'apple', zh:'苹果', wrong:['aple','appel','abble'], sentence:'I eat an ___.' },
    { word:'banana', zh:'香蕉', wrong:['bananna','bnana','bananae'], sentence:'The ___ is yellow.' },
    { word:'rabbit', zh:'兔子', wrong:['rabit','rabibt','rabbti'], sentence:'The ___ can jump.' },
    { word:'tiger', zh:'老虎', wrong:['tigre','tigar','tigr'], sentence:'A ___ has stripes.' },
    { word:'pencil', zh:'铅笔', wrong:['pensil','pencel','pecnil'], sentence:'Write with a ___.' },
    { word:'school', zh:'学校', wrong:['schol','schooI','shcool'], sentence:'I go to ___.' },
    { word:'teacher', zh:'老师', wrong:['techer','teachar','taecher'], sentence:'My ___ helps me learn.' },
    { word:'mother', zh:'妈妈', wrong:['mather','mothre','motther'], sentence:'My ___ is kind.' },
    { word:'brother', zh:'兄弟', wrong:['broter','brothre','broather'], sentence:'He is my ___.' },
    { word:'window', zh:'窗户', wrong:['windou','widnow','windo'], sentence:'Open the ___, please.' },
    { word:'yellow', zh:'黄色', wrong:['yello','yelow','yelloww'], sentence:'The sun is ___.' },
    { word:'purple', zh:'紫色', wrong:['purpel','puple','purpple'], sentence:'The flower is ___.' },
    { word:'water', zh:'水', wrong:['watre','woter','watter'], sentence:'I drink ___.' },
    { word:'bread', zh:'面包', wrong:['bred','braed','breand'], sentence:'I have ___ for breakfast.' },
    { word:'happy', zh:'开心的', wrong:['hapy','happi','hpapy'], sentence:'I am ___ today.' },
    { word:'sunny', zh:'晴朗的', wrong:['suny','sunney','snuny'], sentence:'It is ___ today.' },
    { word:'cloudy', zh:'多云的', wrong:['clowdy','cloudly','cluody'], sentence:'It is ___ outside.' },
    { word:'running', zh:'跑步', wrong:['runing','runnig','runinng'], sentence:'The boy is ___.' },
    { word:'swimming', zh:'游泳', wrong:['swiming','swimmng','swimmming'], sentence:'She is ___ in the pool.' },
    { word:'elephant', zh:'大象', wrong:['elefant','elphant','elephent'], sentence:'The ___ has a long nose.' }
  ];

  const state = {
    mode: 'math', player: '小勇士', level: 1, hp: 5, energy: 20, diamonds: 0,
    totalTurns: 0, correct: 0, answered: 0, streak: 0, bestStreak: 0,
    enemies: [], queue: [], question: null, hintUsed: false, selectedWeapon: null,
    enemyId: 0, locked: false, finished: false, startedAt: 0, wrongAnswers: [], reportGenerated: false, reportSession: null, finishReason: ""
  };

  function makeOptions(answer, candidates) {
    const unique = [...new Set(candidates.filter((x) => String(x) !== String(answer)))];
    while (unique.length < 3) {
      const base = Number(answer);
      const value = Number.isFinite(base) ? Math.max(0, base + pick([-9,-7,-5,-3,-2,-1,1,2,3,4,6,8])) : `字母${unique.length + 1}`;
      if (String(value) !== String(answer) && !unique.some((x) => String(x) === String(value))) unique.push(value);
    }
    return shuffle([answer, ...unique.slice(0, 3)]);
  }

  function difficultyForLevel(level) {
    if (level <= 3) return 'basic';
    if (level <= 7) return 'intermediate';
    return 'challenge';
  }

  function mathQuestion(level) {
    const difficulty = difficultyForLevel(level);
    const mult = () => [Math.floor(Math.random()*8)+2, Math.floor(Math.random()*8)+2];
    let prompt, answer, candidates, explanation, hint, topic;
    if (level === 1) {
      const [a,b] = mult(); answer = a*b; prompt = `${a} × ${b} = ?`; candidates=[answer+a,answer-a,answer+b,answer+1]; topic='乘法口诀'; hint=`想一想“${a}的${b}倍”，也可以把${a}连续加${b}次。`; explanation=`${a} × ${b} = ${answer}`;
    } else if (level === 2) {
      const a=Math.floor(Math.random()*5)+2,b=Math.floor(Math.random()*4)+2; answer=Array(b).fill(a).join(' + '); prompt=`${a} × ${b} 可以写成哪一个连加算式？`; candidates=[Array(a).fill(b).join(' + '),Array(b+1).fill(a).join(' + '),Array(Math.max(2,b-1)).fill(a).join(' + ')]; topic='重复加法'; hint=`第一个数${a}是每一份的数量，第二个数${b}是份数。`; explanation=`${b}个${a}相加，就是 ${answer}。`;
    } else if (level === 3) {
      const [a,b]=mult();answer=a*b;prompt=`小火箭每组有 ${a} 枚，${b} 组一共有多少枚？`;candidates=[answer+a,answer-b,a+b,answer+2];topic='乘法应用';hint=`用“每组数量 × 组数”列式。`;explanation=`${a} × ${b} = ${answer}（枚）`;
    } else if (level === 4) {
      let [a,b]=mult(); if(a===b)b=b===9?8:b+1;answer=`${b} × ${a}`;prompt=`与 ${a} × ${b} 结果相同的是哪一个？`;candidates=[`${a} + ${b}`,`${a} × ${a}`,`${b} × ${b}`,`${a+b} × 1`];topic='乘法交换律';hint=`交换两个乘数的位置，积不会改变。`;explanation=`${a} × ${b} = ${b} × ${a}`;
    } else if (level === 5) {
      const a=Math.floor(Math.random()*7)+3,b=Math.floor(Math.random()*7)+3;answer=b;prompt=`${a} × □ = ${a*b}，□里填几？`;candidates=[a,b+1,Math.max(1,b-1),a*b];topic='缺少的乘数';hint=`想一想${a}的乘法口诀，哪个数与${a}相乘得到${a*b}？`;explanation=`${a} × ${b} = ${a*b}`;
    } else if (level === 6) {
      const a=Math.floor(Math.random()*5)+2,b=Math.floor(Math.random()*5)+2;const repeated=Array(b).fill(a).join(' + ');const centered=b===3?`${a-1} + ${a} + ${a+1}`:repeated;answer=Math.random()<.5?repeated:centered;prompt=`下面哪个算式与 ${a} × ${b} 的结果相同？`;candidates=[`${a*b-1} + 2`,`${a*b+2} - 3`,`${a*b+3} - 1`];topic='等值算式';hint=`先算出 ${a} × ${b} 的积，再逐个比较。`;explanation=`两边算出的结果都是 ${a*b}。`;
    } else if (level === 7) {
      const a=Math.floor(Math.random()*6)+2,b=Math.floor(Math.random()*4)+2,c=Math.floor(Math.random()*3)+1;answer=a*(b+c);prompt=`${a} × (${b} + ${c}) = ?`;candidates=[a*b+c,a*b+a*c,answer+a,(a+b)*c];topic='分配与巧算';hint=`前面的${a}要分别乘括号里的${b}和${c}。`;explanation=`${a}×${b} + ${a}×${c} = ${a*b} + ${a*c} = ${answer}`;
    } else if (level === 8) {
      let a,b,c,total;do{a=Math.floor(Math.random()*4)+2;b=Math.floor(Math.random()*4)+2;c=Math.floor(Math.random()*4)+2;total=a*b*c;}while(total>100);answer=total;prompt=`${a} × ${b} × ${c} = ?`;candidates=[a*(b+c),total+a,total-b,a+b+c];topic='三连乘';hint=`从左到右，先算 ${a} × ${b}，再乘 ${c}。`;explanation=`${a} × ${b} = ${a*b}，${a*b} × ${c} = ${answer}`;
    } else if (level === 9) {
      const a=Math.floor(Math.random()*8)+2,b=(Math.floor(Math.random()*8)+2)*10;answer=a*b;prompt=`${a} × ${b} = ?`;candidates=[a*(b/10),answer+10,answer-a,a+b];topic='一位数乘整十数';hint=`先算 ${a} × ${b/10}，再在结果后添一个0。`;explanation=`${a} × ${b/10} = ${answer/10}，所以 ${a} × ${b} = ${answer}`;
    } else {
      const kind=Math.floor(Math.random()*4);
      if(kind===0){const [a,b]=mult();answer=a*b;prompt=`${a} × ${b} = ?`;candidates=[answer+a,answer-b,a+b,answer+2];topic='综合：口诀';hint='回忆对应的乘法口诀。';explanation=`${a} × ${b} = ${answer}`;}
      else if(kind===1){const a=Math.floor(Math.random()*7)+2,b=Math.floor(Math.random()*4)+2,c=Math.floor(Math.random()*3)+1;answer=a*(b+c);prompt=`${a} × (${b} + ${c}) = ?`;candidates=[a*b+c,answer+a,(a+b)*c,a+b+c];topic='综合：巧算';hint='先算括号，也可以使用分配的方法。';explanation=`${a} × ${b+c} = ${answer}`;}
      else if(kind===2){let a=pick([2,3,4]),b=pick([2,3,4]),c=pick([2,3,4]);answer=a*b*c;prompt=`${a} × ${b} × ${c} = ?`;candidates=[a*(b+c),answer+a,answer-b,a+b+c];topic='综合：三连乘';hint='按顺序分两次乘。';explanation=`${a} × ${b} × ${c} = ${answer}`;}
      else{const a=Math.floor(Math.random()*8)+2,b=pick([20,30,40,50,60,70,80,90]);answer=a*b;prompt=`${a} × ${b} = ?`;candidates=[a*(b/10),answer+10,answer-a,a+b];topic='综合：拓展乘法';hint='先忽略末尾的0，算口诀，再把0添回来。';explanation=`${a} × ${b/10} = ${answer/10}，所以答案是${answer}。`;}
    }
    return { prompt, answer:String(answer), options:makeOptions(String(answer),(candidates||[]).map(String)), explanation, hint, topic, difficulty };
  }

  function maskWord(word, count) {
    const indexes = shuffle([...Array(word.length).keys()].filter((i) => i > 0 && i < word.length-1)).slice(0,count).sort((a,b)=>a-b);
    return { masked:[...word].map((ch,i)=>indexes.includes(i)?'_':ch).join(' '), letters:indexes.map((i)=>word[i]).join('') };
  }

  function englishQuestion(level) {
    const item=pick(ENGLISH_WORDS); const difficulty=difficultyForLevel(level);
    let prompt,answer,candidates,topic,hint,explanation;
    if(level===1){answer=item.word;prompt=`“${item.zh}”的英文是哪一个？`;candidates=shuffle(ENGLISH_WORDS.filter(x=>x.word!==item.word)).slice(0,3).map(x=>x.word);topic='看中文认单词';hint=`它以字母 ${item.word[0].toUpperCase()} 开头，共有 ${item.word.length} 个字母。`;}
    else if(level===2){const m=maskWord(item.word,1);answer=m.letters;prompt=`补全单词：${m.masked}（${item.zh}）`;candidates=shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(x=>x!==answer)).slice(0,3);topic='补一个字母';hint=`完整单词读作 ${item.word}。`;}
    else if(level===3||level===4||level===6){answer=item.word;prompt=level===4?`哪一个单词的字母顺序正确？（${item.zh}）`:`选出“${item.zh}”的正确拼写。`;candidates=item.wrong;topic=level===4?'字母顺序':'易错拼写';hint=`注意它有 ${item.word.length} 个字母，开头是 ${item.word.slice(0,2)}。`;}
    else if(level===5){const m=maskWord(item.word,2);answer=m.letters;prompt=`依次填入两个字母：${m.masked}（${item.zh}）`;candidates=[answer.split('').reverse().join(''),answer[0]+pick('aeiou'.split('')),pick('bcdfg'.split(''))+answer.slice(-1)];topic='补两个字母';hint=`完整单词是 ${item.word}，慢慢按顺序检查。`;}
    else if(level===7){answer=item.word;prompt=`根据中文写法，选出完整正确的单词：${item.zh}`;candidates=item.wrong;topic='完整拼写';hint=`逐个字母比较，不要漏掉或颠倒字母。`;}
    else if(level===8){if(Math.random()<.5){answer=item.zh;prompt=`“${item.word}”是什么意思？`;candidates=shuffle(ENGLISH_WORDS.filter(x=>x.zh!==item.zh)).slice(0,3).map(x=>x.zh);topic='词义判断';hint='先读一遍单词，再回忆它出现过的图片或句子。';}else{answer=item.word;prompt=`找出完全正确的拼写：${item.zh}`;candidates=item.wrong;topic='拼写辨析';hint=`从第一个字母开始，一个一个对照。`;}}
    else if(level===9){answer=item.word;prompt=`选择合适的词填空：${item.sentence}`;candidates=shuffle(ENGLISH_WORDS.filter(x=>x.word!==item.word)).slice(0,3).map(x=>x.word);topic='句中选词';hint=`整句话需要表达“${item.zh}”。`;}
    else {const type=Math.floor(Math.random()*3);if(type===0){answer=item.word;prompt=`选出“${item.zh}”的正确拼写。`;candidates=item.wrong;topic='综合：拼写';hint=`注意单词长度是 ${item.word.length}。`;}else if(type===1){answer=item.word;prompt=`选择合适的词填空：${item.sentence}`;candidates=shuffle(ENGLISH_WORDS.filter(x=>x.word!==item.word)).slice(0,3).map(x=>x.word);topic='综合：句中选词';hint=`句中需要表达“${item.zh}”。`;}else{answer=item.zh;prompt=`“${item.word}”是什么意思？`;candidates=shuffle(ENGLISH_WORDS.filter(x=>x.zh!==item.zh)).slice(0,3).map(x=>x.zh);topic='综合：词义';hint='回忆这个单词对应的图片。';}}
    explanation=`正确答案是 ${answer}${answer===item.word?`（${item.zh}）`:''}。`;
    return {prompt,answer:String(answer),options:makeOptions(String(answer),candidates.map(String)),topic,hint,explanation,difficulty};
  }

  async function resetGame(mode) {
    try { await window.LearningBanks?.ready; } catch {}
    Object.assign(state,{mode,player:($('#player-name').value.trim()||'小勇士').slice(0,10),level:1,hp:5,energy:20,diamonds:0,totalTurns:0,correct:0,answered:0,streak:0,bestStreak:0,enemies:[],queue:[],question:null,hintUsed:false,selectedWeapon:null,enemyId:0,locked:false,finished:false,startedAt:Date.now(),wrongAnswers:[],reportGenerated:false,reportSession:null,finishReason:""});
    showScreen('game-screen');
    buildBattlefield();
    startLevel();
  }

  function showScreen(id) {
    $$('.screen').forEach((el)=>el.classList.toggle('active',el.id===id));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function buildBattlefield() {
    const field=$('#battlefield'); field.innerHTML='';
    LANES.forEach((lane)=>{
      const node=$('#lane-template').content.firstElementChild.cloneNode(true);
      node.dataset.lane=lane.id; node.classList.add(lane.id);
      node.querySelector('.lane-icon').textContent=lane.icon;
      node.querySelector('.lane-name').textContent=lane.name;
      const theme=CASTLE_THEMES[lane.id],castle=node.querySelector('.castle');
      castle.title=theme.title; castle.innerHTML=`<span class="castle-main">${theme.icon}</span><span class="castle-theme">${theme.badge}</span>`;
      const track=node.querySelector('.lane-track');
      for(let tile=1;tile<9;tile++){
        if(Math.random()>.76)continue;
        const item=document.createElement('span'); item.className=`scenery${tile%2?' alt':''}`; item.textContent=pick(DOMAIN_DECOR[lane.id]); item.setAttribute('aria-hidden','true');
        item.style.left=`${tile*10+5}%`; item.style.top=lane.id==='land'?`${62+Math.random()*22}%`:`${25+Math.random()*52}%`; track.appendChild(item);
      }
      field.appendChild(node);
    });
  }

  function startLevel() {
    const config=LEVELS[state.level-1];
    state.energy=20; state.queue=[...config.wave]; state.enemies=[]; state.selectedWeapon=null;
    $('#level-title').textContent=config.title;
    $('#level-label').textContent=`${state.level} / 10`;
    $('#level-progress').style.width=`${state.level*10}%`;
    battleMessage(`第${state.level}关：${config.title}`);
    spawnEnemy(state.level===1?1:state.level<5?3:4);
    updateHud(); renderEnemies(); beginQuestion(); updateWeapons();
  }

  function createEnemy(kind) {
    const info=ENEMY_INFO[kind];
    const enemy={id:++state.enemyId,kind,name:info.name,emoji:info.emoji,hp:info.hp,maxHp:info.hp,shield:info.shield||0,speed:info.speed,lane:info.lane,position:9,justSpawned:true,burrowTick:0,buried:kind==='burrow',phase:0};
    if(kind==='cross') enemy.lane=pick(LANES.map(x=>x.id));
    return enemy;
  }

  function activeEnemyLimit() {
    if(state.level===1)return 2;
    if(state.level<5)return 4;
    return 5;
  }

  function spawnEnemy(count=1) {
    const arrivals=[],limit=activeEnemyLimit();
    for(let i=0;i<count&&state.queue.length&&state.enemies.length<limit;i++){
      const kind=state.queue.shift(),enemy=createEnemy(kind);state.enemies.push(enemy);arrivals.push(enemy);
    }
    if(arrivals.length)battleMessage(`${arrivals.map(enemy=>enemy.name).join('、')}同时进入战场！`);
  }

  function renderEnemies() {
    const liveIds=new Set(state.enemies.map(enemy=>String(enemy.id))),slots=new Map();
    state.enemies.forEach(enemy=>{const key=`${enemy.lane}:${enemy.position}`;if(!slots.has(key))slots.set(key,[]);slots.get(key).push(enemy);});
    $$('.enemy').forEach((el)=>{if(!liveIds.has(el.dataset.enemyId)){el.classList.add('dead');setTimeout(()=>el.remove(),360);}});
    state.enemies.forEach((enemy)=>{
      const track=$(`.lane[data-lane="${enemy.lane}"] .lane-track`); if(!track)return;
      const group=slots.get(`${enemy.lane}:${enemy.position}`)||[enemy],stackIndex=group.findIndex(item=>item.id===enemy.id),spread=group.length===2?4.2:group.length>=3?4.8:0,offset=(stackIndex-(group.length-1)/2)*spread;
      let button=$(`.enemy[data-enemy-id="${enemy.id}"]`),created=false;
      if(!button){
        created=true; button=document.createElement('button'); button.className=`enemy ${enemy.kind} entering`; button.dataset.enemyId=enemy.id; button.dataset.position='10.2'; button.style.left='102%';
        button.addEventListener('click',()=>attackTarget(Number(button.dataset.enemyId))); track.appendChild(button);
      }else if(button.parentElement!==track){
        button.classList.add('warping'); track.appendChild(button); setTimeout(()=>button.classList.remove('warping'),560);
      }
      button.classList.toggle('buried',enemy.buried); button.classList.toggle('boss',enemy.kind==='boss'); button.classList.toggle('cross',enemy.kind==='cross');button.classList.toggle('stacked',group.length>1);
      const phase=enemy.kind==='boss'?` · ${LANES.find(x=>x.id===enemy.lane).name}形态`:'';
      const shield=enemy.shield>0?` 🛡${enemy.shield}`:''; const buried=enemy.buried?'（潜伏）':''; const threat='✦'.repeat(THREAT_LEVEL[enemy.kind]||0);const packBadge=group.length>1&&stackIndex===0?`<span class="pack-badge">${group.length}只</span>`:'';
      button.innerHTML=`${packBadge}<span class="sprite">${enemy.buried?'🕳️':enemy.emoji}</span><span class="enemy-hp">${enemy.name}${buried}${phase} <span class="threat">${threat}</span><br>❤${enemy.hp}${shield}</span>`;
      const nextLeft=clamp(enemy.position*10+offset,6,95),oldPosition=Number(button.dataset.position),top=50+(stackIndex-(group.length-1)/2)*(group.length>1?13:0);
      button.dataset.position=String(enemy.position);button.style.top=`${top}%`;button.style.zIndex=String(7+stackIndex);
      const move=()=>{if(Math.abs(oldPosition-enemy.position)>.05){button.classList.add('moving');setTimeout(()=>button.classList.remove('moving'),760);}button.style.left=`${nextLeft}%`;};
      if(created)requestAnimationFrame(()=>requestAnimationFrame(move));else move();
      if(created)setTimeout(()=>button.classList.remove('entering'),680);
    });
    markTargets();
  }

  function beginQuestion() {
    if(state.finished)return;
    state.locked=false; state.selectedWeapon=null; state.hintUsed=false;
    state.question=state.mode==='math'?mathQuestion(state.level):englishQuestion(state.level);
    const q=state.question;
    $('#question-panel').hidden=false; $('#action-panel').hidden=true; $('#hint-box').hidden=true;
    $('#question-text').textContent=q.prompt; $('#question-topic').textContent=q.topic;
    const badge=$('#difficulty-badge'); badge.className=`difficulty ${q.difficulty}`; badge.textContent={basic:'基础',intermediate:'进阶',challenge:'挑战'}[q.difficulty];
    const reward=rewardForQuestion(); $('#question-reward').textContent=`答对 +${reward} ⚡`;
    const grid=$('#answer-grid'); grid.innerHTML='';
    q.options.forEach((option,index)=>{
      const btn=document.createElement('button'); btn.className='answer-button'; btn.dataset.option=String(option); btn.textContent=`${String.fromCharCode(65+index)}. ${option}`;
      btn.addEventListener('click',()=>answerQuestion(option,btn)); grid.appendChild(btn);
    });
    $('#turn-label').textContent=`第 ${state.totalTurns+1} 回合`;
  }

  function rewardForQuestion() {
    const base={basic:12,intermediate:16,challenge:20}[state.question?.difficulty||difficultyForLevel(state.level)];
    const hinted={basic:8,intermediate:12,challenge:15}[state.question?.difficulty||difficultyForLevel(state.level)];
    return state.hintUsed?hinted:base;
  }

  function useHint() {
    if(state.locked||state.hintUsed)return;
    state.hintUsed=true; $('#hint-box').hidden=false; $('#hint-box').textContent=state.question.hint;
    $('#question-reward').textContent=`答对 +${rewardForQuestion()} ⚡（提示后）`;
  }

  function answerQuestion(option,button) {
    if(state.locked)return; state.locked=true; state.answered++;
    const isCorrect=String(option)===String(state.question.answer);
    $$('.answer-button').forEach((btn)=>{btn.disabled=true;if(btn.dataset.option===String(state.question.answer))btn.classList.add('correct');});
    if(isCorrect){
      button.classList.add('correct'); state.correct++; state.streak++; state.bestStreak=Math.max(state.bestStreak,state.streak);
      const reward=rewardForQuestion(); state.energy=clamp(state.energy+reward,0,60);
      const diamond=comboDiamond(state.streak); if(diamond){state.diamonds=clamp(state.diamonds+diamond,0,12);battleMessage(`回答正确！+${reward}能量，连击奖励 +${diamond}钻石！`);}else battleMessage(`回答正确！获得 ${reward} 点能量。`);
    }else{
      state.wrongAnswers.push({timestamp:new Date().toISOString(),mode:state.mode,player:state.player,level:state.level,turn:state.totalTurns+1,topic:state.question.topic,difficulty:state.question.difficulty,prompt:state.question.prompt,selected:String(option),answer:String(state.question.answer),explanation:state.question.explanation||"",hint:state.question.hint||""});
      button.classList.add('wrong'); state.streak=0; battleMessage(`这题答案是“${state.question.answer}”。连击归零，但仍可行动。`); $('#question-panel').classList.add('shake'); setTimeout(()=>$('#question-panel').classList.remove('shake'),400);
    }
    updateHud(); setTimeout(()=>{ $('#question-panel').hidden=true; $('#action-panel').hidden=false; state.locked=false; updateWeapons(); },650);
  }

  function comboDiamond(streak) {
    if(streak===2||streak===4)return 1;
    if(streak===6||streak===8)return 2;
    if(streak>8&&streak%4===0)return 1;
    return 0;
  }

  function weaponAvailable(weapon) {
    if(weapon==='normal')return state.energy>=10;
    if(weapon==='scatter')return state.level>=3&&state.diamonds>=2;
    if(weapon==='water')return state.level>=5&&state.diamonds>=4;
    if(weapon==='burrow')return state.level>=7&&state.diamonds>=3;
    if(weapon==='tracker')return state.level>=9&&state.diamonds>=4;
    return false;
  }

  function updateWeapons() {
    const unlock={normal:1,scatter:3,water:5,burrow:7,tracker:9};
    $$('.ammo-button[data-weapon]').forEach((button)=>{
      const w=button.dataset.weapon; button.disabled=state.locked||!weaponAvailable(w); button.classList.toggle('selected',state.selectedWeapon===w);
      button.title=state.level<unlock[w]?`第${unlock[w]}关解锁`:'';
    });
    $('#end-turn').disabled=state.locked;
  }

  function playAttackEffect(weapon,targetIds,onImpact) {
    const targetEls=targetIds.map(id=>$(`.enemy[data-enemy-id="${id}"]`)).filter(Boolean); if(!targetEls.length){onImpact();return;}
    state.locked=true; state.selectedWeapon=null; updateWeapons(); markTargets();
    const settings={normal:{icon:'🔥',impact:'💥',duration:480},scatter:{icon:'✦',impact:'✨',duration:560},water:{icon:'⚓',impact:'🌊',duration:760},burrow:{icon:'🧨',impact:'💥',duration:820},tracker:{icon:'🎯',impact:'⚡',duration:800}}[weapon];
    let remaining=targetEls.length;
    targetEls.forEach((target,index)=>{
      const lane=target.closest('.lane'),origin=lane.querySelector('.castle').getBoundingClientRect(),end=target.getBoundingClientRect();
      const projectile=document.createElement('span'); projectile.className=`projectile ${weapon}`; projectile.textContent=settings.icon;
      const sx=origin.left+origin.width/2-17,sy=origin.top+origin.height/2-17,tx=end.left+end.width/2-17,ty=end.top+end.height/2-17,duration=settings.duration+index*80;
      projectile.style.setProperty('--sx',`${sx}px`);projectile.style.setProperty('--sy',`${sy}px`);projectile.style.setProperty('--tx',`${tx}px`);projectile.style.setProperty('--ty',`${ty}px`);projectile.style.setProperty('--duration',`${duration}ms`);projectile.style.setProperty('--end-scale',weapon==='normal'?'1.1':'1.65');
      $('#fx-layer').appendChild(projectile);
      setTimeout(()=>{
        projectile.remove(); target.classList.add('hit'); setTimeout(()=>target.classList.remove('hit'),360);
        const impact=document.createElement('span'); impact.className=`impact ${weapon}`; impact.dataset.icon=settings.impact; impact.style.left=`${end.left+end.width/2}px`;impact.style.top=`${end.top+end.height/2}px`;$('#fx-layer').appendChild(impact);setTimeout(()=>impact.remove(),620);
        const field=$('#battlefield'),strong=['water','burrow','tracker'].includes(weapon);field.classList.add(strong?'rumble-strong':'rumble');setTimeout(()=>field.classList.remove('rumble','rumble-strong'),strong?570:370);
        remaining--;if(remaining===0)setTimeout(onImpact,140);
      },duration);
    });
  }

  function chooseWeapon(weapon) {
    if(state.locked||!weaponAvailable(weapon))return;
    if(weapon==='scatter') {
      const targets=state.enemies.filter(e=>e.lane==='air').slice(0,3);
      if(!targets.length){battleMessage('空中没有可攻击的目标。');return;}
      battleMessage('空中散射弹升空，锁定多个目标！');
      playAttackEffect('scatter',targets.map(e=>e.id),()=>{state.diamonds-=2;targets.forEach(e=>damageEnemy(e,2,true));battleMessage(`散射弹同时命中 ${targets.length} 个空中目标！`);finishAttack(520);}); return;
    }
    state.selectedWeapon=weapon; updateWeapons(); markTargets();
    const labels={normal:'普通弹',water:'深水必杀弹',burrow:'钻地必杀弹',tracker:'跨域追踪弹'};
    if(state.enemies.length===1){
      const onlyEnemy=state.enemies[0];
      if(validTarget(onlyEnemy,weapon)){battleMessage(`场上只有${onlyEnemy.name}，${labels[weapon]}自动锁定！`);attackTarget(onlyEnemy.id);return;}
      battleMessage(`${labels[weapon]}无法命中当前唯一目标，请更换攻击方式。`);return;
    }
    $('#target-tip').textContent=`已选择${labels[weapon]}，请点击一个发光的目标。`;
  }

  function validTarget(enemy,weapon) {
    if(weapon==='normal')return !(enemy.kind==='burrow'&&enemy.buried) && !(enemy.kind==='boss'&&enemy.lane==='underground'&&enemy.buried);
    if(weapon==='water')return enemy.kind==='water'||(enemy.kind==='boss'&&enemy.lane==='water');
    if(weapon==='burrow')return enemy.kind==='burrow'||(enemy.kind==='boss'&&enemy.lane==='underground');
    if(weapon==='tracker')return enemy.kind==='cross'||enemy.kind==='boss';
    return false;
  }

  function markTargets() {
    $$('.enemy').forEach((el)=>{
      const enemy=state.enemies.find(e=>e.id===Number(el.dataset.enemyId));
      el.classList.toggle('targetable',Boolean(state.selectedWeapon&&enemy&&validTarget(enemy,state.selectedWeapon)));
    });
  }

  function attackTarget(id) {
    if(state.locked||!state.selectedWeapon)return;
    const enemy=state.enemies.find(e=>e.id===id); if(!enemy)return;
    const weapon=state.selectedWeapon;
    if(!validTarget(enemy,weapon)){battleMessage('这种炮弹不能攻击这个目标，请换一个。');return;}
    const launchText={normal:'普通炮弹发射！',water:'深水重炮蓄能发射！',burrow:'钻地爆破弹钻入地层！',tracker:'跨域追踪弹锁定目标！'};
    battleMessage(launchText[weapon]);
    playAttackEffect(weapon,[id],()=>{
      if(weapon==='normal'){
        state.energy-=10; let damage=2;if(enemy.kind==='air'||(enemy.kind==='boss'&&enemy.lane==='air'))damage=1;
        damageEnemy(enemy,damage,false); battleMessage(`普通弹命中${enemy.name}，造成${damage}点伤害！`);
      }else if(weapon==='water'){
        state.diamonds-=4; killOrPhase(enemy); battleMessage('深水重炮穿透护盾，一击击破！');
      }else if(weapon==='burrow'){
        state.diamonds-=3; killOrPhase(enemy); battleMessage('地层爆破！钻地目标被一击击破！');
      }else if(weapon==='tracker'){
        state.diamonds-=4; damageEnemy(enemy,4,true); battleMessage('追踪弹跨越战线，猛烈轰击4点！');
      }
      finishAttack(['normal'].includes(weapon)?430:570);
    });
  }

  function damageEnemy(enemy,damage,ignoreShield) {
    if(enemy.shield>0&&!ignoreShield){enemy.shield=Math.max(0,enemy.shield-damage);return;}
    enemy.hp-=damage; if(enemy.hp<=0)killOrPhase(enemy);
  }

  function killOrPhase(enemy) {
    if(enemy.kind==='boss'&&enemy.phase<3){
      enemy.phase++; const next=LANES[enemy.phase].id; enemy.lane=next; enemy.hp=4; enemy.maxHp=4; enemy.shield=next==='water'?2:0; enemy.buried=next==='underground'; enemy.position=Math.max(enemy.position,5);
      battleMessage(`怪兽王切换为${LANES[enemy.phase].name}形态！`);
    }else{
      state.enemies=state.enemies.filter(e=>e.id!==enemy.id);
    }
  }

  function finishAttack(delay=500) {
    state.selectedWeapon=null; state.locked=true; updateHud(); renderEnemies(); updateWeapons();
    setTimeout(resolveTurn,delay);
  }

  function resolveTurn() {
    if(state.finished)return; state.totalTurns++;
    const leaked=[];
    state.enemies.forEach((enemy)=>{
      if(enemy.justSpawned){enemy.justSpawned=false;return;}
      if(enemy.kind==='burrow'||(enemy.kind==='boss'&&enemy.lane==='underground')){
        enemy.burrowTick=(enemy.burrowTick+1)%3; enemy.buried=enemy.burrowTick!==2;
      }
      if(enemy.kind==='cross'){
        const current=LANES.findIndex(x=>x.id===enemy.lane); const choices=[current-1,current+1].filter(i=>i>=0&&i<LANES.length); enemy.lane=LANES[pick(choices)].id;
      }
      enemy.position-=enemy.speed;
      if(enemy.position<=0)leaked.push(enemy);
    });
    leaked.forEach((enemy)=>{state.hp-=enemy.kind==='boss'?2:1;state.enemies=state.enemies.filter(e=>e.id!==enemy.id);});
    if(leaked.length)battleMessage(`${leaked.map(x=>x.name).join('、')}突破战线，失去 ${leaked.reduce((n,e)=>n+(e.kind==='boss'?2:1),0)} 点生命！`);
    if(state.hp<=0){updateHud();renderEnemies();finishGame(false);return;}
    spawnEnemy(state.level===1?1:activeEnemyLimit()); updateHud(); renderEnemies();
    if(!state.enemies.length&&!state.queue.length){completeLevel();return;}
    beginQuestion();
  }

  function endTurn() {
    if(state.locked)return; state.locked=true; state.selectedWeapon=null; battleMessage('保存资源，怪物开始行动。'); updateWeapons(); setTimeout(resolveTurn,350);
  }

  function completeLevel() {
    if(state.level>=10){finishGame(true);return;}
    const done=state.level; state.level++;
    battleMessage(`第${done}关通过！下一关能量恢复到20。`);
    setTimeout(startLevel,900);
  }

  function renderMonsterPool() {
    const list=$('#monster-pool-list'),count=$('#pool-count');if(!list||!count)return;
    count.textContent=state.queue.length;
    if(!state.queue.length){list.innerHTML='<div class="pool-empty">✅ 全部怪物<br>已经登场</div>';return;}
    list.innerHTML=state.queue.map((kind,index)=>{
      const info=ENEMY_INFO[kind],label={land:'陆地',air:'空中',water:'水中',burrow:'地下',cross:'跨域',boss:'首领'}[kind];
      return `<div class="pool-monster ${kind}" title="第${index+1}个出场：${info.name}"><span class="pool-sprite">${info.emoji}</span><span class="pool-name">${info.name}<br>${label}${'✦'.repeat(THREAT_LEVEL[kind]||0)}</span><span class="pool-order">${index+1}</span></div>`;
    }).join('');
  }

  function updateHud() {
    $('#hp-value').textContent=state.hp; $('#energy-value').textContent=state.energy; $('#diamond-value').textContent=state.diamonds;
    $('#combo-label').textContent=`连击 ${state.streak}`;
    const wave=$('#wave-label');if(wave)wave.textContent=`待出场 ${state.queue.length} 波 · 场上 ${state.enemies.length}`;
    renderMonsterPool();
  }

  function battleMessage(text) { $('#battle-message').textContent=text; }

  function leaderboardKey(mode){return `four-realms-leaderboard-${mode}-v1`;}
  function cloudPrefix(mode){return mode==='math'?'TDM-':'TDE-';}
  function newCertificate(mode){return `${cloudPrefix(mode)}${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`.slice(0,40);}
  function getScores(mode){try{return JSON.parse(localStorage.getItem(leaderboardKey(mode))||'[]');}catch{return [];}}
  function sortScores(scores){return scores.sort((a,b)=>a.turns-b.turns||b.accuracy-a.accuracy||b.hp-a.hp||a.duration-b.duration||new Date(a.date)-new Date(b.date));}
  function saveScore(score,mode){const before=sortScores(getScores(mode));const best=before[0];score.certificate=score.certificate||newCertificate(mode);score.id=score.certificate;const after=sortScores([...before.filter(x=>x.certificate!==score.certificate),score]).slice(0,20);localStorage.setItem(leaderboardKey(mode),JSON.stringify(after));return{rank:after.findIndex(x=>x.id===score.id)+1,isRecord:!best||score.turns<best.turns||(score.turns===best.turns&&score.accuracy>best.accuracy)};}

  async function cloudRequest(path,options={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
    try{const response=await fetch(`${CLOUD_BOARD.url}/rest/v1/${path}`,{...options,signal:controller.signal,headers:{apikey:CLOUD_BOARD.key,'Content-Type':'application/json',...(options.headers||{})}});if(!response.ok)throw new Error(`云端榜单请求失败：${response.status}`);return response.status===204?null:response.json();}
    finally{clearTimeout(timer);}
  }
  function cloudRow(score,mode){return{player_name:String(score.name||'小勇士').slice(0,20),duration_ms:Math.max(1000,Math.round(score.turns)*1000),accuracy:clamp(Math.round(score.accuracy),90,100),correct_count:clamp(Math.round(score.hp),0,5),wrong_count:Math.max(0,Math.round((score.duration||0)/1000)),best_streak:Math.max(0,Math.round(score.combo||0)),certificate:String(score.certificate||newCertificate(mode)).slice(0,40)};}
  function scoreFromCloud(row){return{name:row.player_name,turns:Math.round(Number(row.duration_ms)/1000),accuracy:Number(row.accuracy),hp:Number(row.correct_count)||0,combo:Number(row.best_streak)||0,duration:(Number(row.wrong_count)||0)*1000,date:row.created_at,id:row.certificate,certificate:row.certificate};}
  async function fetchCloudScores(mode){const prefix=cloudPrefix(mode);const rows=await cloudRequest(`leaderboard_entries?select=player_name,duration_ms,accuracy,correct_count,wrong_count,best_streak,created_at,certificate&certificate=like.${prefix}*&order=duration_ms.asc,accuracy.desc,correct_count.desc,wrong_count.asc,created_at.asc&limit=20`);return rows.map(scoreFromCloud);}
  async function submitCloudScores(scores,mode){if(!scores.length)return;await cloudRequest('leaderboard_entries?on_conflict=certificate',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(scores.map(score=>cloudRow(score,mode)))});}
  async function syncLocalScoresToCloud(mode){const scores=getScores(mode).filter(score=>Number(score.accuracy)>=90);scores.forEach((score,index)=>{if(!score.certificate){score.certificate=`${cloudPrefix(mode)}L-${Date.now().toString(36)}-${index}`.slice(0,40);score.id=score.certificate;}});if(scores.length){localStorage.setItem(leaderboardKey(mode),JSON.stringify(scores));await submitCloudScores(scores,mode);}}
  async function registerCloudResult(score,mode){const before=await fetchCloudScores(mode);await submitCloudScores([score],mode);const after=await fetchCloudScores(mode);const rank=after.findIndex(item=>item.certificate===score.certificate)+1;const isRecord=before.length>0&&rank===1&&before[0].certificate!==score.certificate;return{rank,isRecord};}

  const MISTAKE_SESSIONS_KEY_PREFIX='learning-games-mistakes-';
  function mistakeStorageKey(mode=state.mode){return MISTAKE_SESSIONS_KEY_PREFIX + (mode||'math') + '-v1';}
  let reportFolderHandle=null;
  function reportStatus(text,kind=''){const node=$('#report-status'),panel=node?.closest('.report-panel');if(node)node.textContent=text;if(panel)panel.className=`report-panel ${kind}`;}
  function openReportDb(){return new Promise((resolve)=>{if(!window.indexedDB){resolve(null);return;}const request=indexedDB.open('four-realms-report-settings',1);request.onupgradeneeded=()=>request.result.createObjectStore('settings');request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve(null);});}
  async function loadReportFolder(){try{const db=await openReportDb();if(!db)return;const handle=await new Promise(resolve=>{const req=db.transaction('settings','readonly').objectStore('settings').get('folder');req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null);});db.close();if(handle){reportFolderHandle=handle;const status=$('#folder-bind-status');if(status){status.textContent=`📁 已绑定：${handle.name||'错题集文件夹'}`;status.classList.add('bound');}}}catch{}}
  async function saveReportFolder(handle){const db=await openReportDb();if(!db)return false;return new Promise(resolve=>{const tx=db.transaction('settings','readwrite');tx.objectStore('settings').put(handle,'folder');tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();resolve(false)};});}
  async function bindReportFolder(){if(!window.showDirectoryPicker){reportStatus('当前浏览器不支持直接绑定文件夹；结束后会自动下载两个报告文件。','warning');return;}try{const handle=await window.showDirectoryPicker({id:'four-realms-mistakes',mode:'readwrite'});const permission=await handle.requestPermission({mode:'readwrite'});if(permission!=='granted')throw new Error('permission denied');reportFolderHandle=handle;await saveReportFolder(handle);const status=$('#folder-bind-status');if(status){status.textContent=`📁 已绑定：${handle.name||'错题集文件夹'}`;status.classList.add('bound');}alert('绑定成功。以后结束游戏或点击投降，报告会自动写入这个文件夹。');}catch(error){if(error?.name!=='AbortError')alert('没有完成文件夹绑定；游戏结束时会改为下载报告。');}}
  function loadMistakeSessions(){try{const value=JSON.parse(localStorage.getItem(mistakeStorageKey())||'[]');return Array.isArray(value)?value:[];}catch{return[];}}
  function mistakeReason(reason){return{victory:'通关',defeat:'生命耗尽',surrender:'主动投降'}[reason]||'本次结束';}
  function collectMistakeSession(reason){if(state.reportSession)return{session:state.reportSession,sessions:loadMistakeSessions()};const session={id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,date:new Date().toISOString(),player:state.player,mode:state.mode,reason,reasonLabel:mistakeReason(reason),level:state.level,turns:state.totalTurns,answered:state.answered,correct:state.correct,mistakes:state.wrongAnswers.map(item=>({...item}))};const sessions=[...loadMistakeSessions(),session];localStorage.setItem(mistakeStorageKey(state.mode),JSON.stringify(sessions));state.reportSession=session;state.reportGenerated=true;return{session,sessions};}
  function mdSafe(value){return String(value??'').replace(/\\/g,'\\\\').replace(/\\|/g,'\\|').replace(/\r?\n/g,' ');}
  function buildMistakeMarkdown(sessions){const total=sessions.reduce((sum,s)=>sum+(s.mistakes?.length||0),0),lines=['# 四域守护战错题集','',`> 最后更新：${new Date().toLocaleString('zh-CN')}`,`> 累计游戏次数：${sessions.length} 次　累计错题：${total} 道`,'','---',''];sessions.forEach((session,index)=>{lines.push(`## ${index+1}. ${mdSafe(session.date)} · ${session.mode==='math'?'数学':'英语'} · ${mdSafe(session.player)}`);lines.push(`- 结束方式：${mdSafe(session.reasonLabel)}；结束关卡：第${session.level}关；回合：${session.turns}；正确率：${session.answered?Math.round(session.correct/session.answered*100):0}%`);if(!session.mistakes?.length){lines.push('- 本次没有答错题。','');return;}session.mistakes.forEach((item,itemIndex)=>{lines.push(`### 错题 ${itemIndex+1} · 第${item.level}关 · ${mdSafe(item.topic)}`,'',`- 题目：${mdSafe(item.prompt)}`,`- 我的答案：**${mdSafe(item.selected)}**`,`- 正确答案：**${mdSafe(item.answer)}**`,`- 解析：${mdSafe(item.explanation)}`,`- 提示：${mdSafe(item.hint)}`,'');});});return lines.join('\n');}
  function downloadBlob(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  async function writeBoundFile(name,data,type){if(!reportFolderHandle)return false;try{const permission=await reportFolderHandle.queryPermission({mode:'readwrite'});if(permission!=='granted')return false;const file=await reportFolderHandle.getFileHandle(name,{create:true}),writer=await file.createWritable();await writer.write(type?new Blob([data],{type}):data);await writer.close();return true;}catch{return false;}}
  function wrapCanvas(ctx,text,maxWidth){const lines=[];String(text).split('\n').forEach(part=>{let line='';for(const ch of [...part]){const test=line+ch;if(line&&ctx.measureText(test).width>maxWidth){lines.push(line);line=ch;}else line=test;}lines.push(line||' ');});return lines;}
  function makeReportCanvases(session){const pages=[];let canvas,ctx,y;const newPage=()=>{canvas=document.createElement('canvas');canvas.width=1240;canvas.height=1754;ctx=canvas.getContext('2d');ctx.fillStyle='#fffdf6';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#173b57';ctx.fillRect(0,0,canvas.width,25);y=85;pages.push(canvas);};const write=(text,size=28,bold=false,color='#243b53',gap=13)=>{ctx.font=`${bold?'700':'400'} ${size}px "Microsoft YaHei", "PingFang SC", sans-serif`;ctx.fillStyle=color;const lines=wrapCanvas(ctx,text,1080);const lineHeight=Math.round(size*1.52);if(y+lines.length*lineHeight>1630)newPage();for(const line of lines){ctx.fillText(line,80,y);y+=lineHeight;}y+=gap;};newPage();write('四域守护战 · 当次错题报告',42,true,'#173b57',18);write(`守护者：${session.player}　科目：${session.mode==='math'?'数学':'英语'}`,25,true,'#2584c4',5);write(`结束方式：${session.reasonLabel}　结束日期：${new Date(session.date).toLocaleString('zh-CN')}`,23,false,'#526d7e',8);write(`第${session.level}关　总回合 ${session.turns}　正确率 ${session.answered?Math.round(session.correct/session.answered*100):0}%　错题 ${session.mistakes?.length||0} 道`,25,true,'#a04427',20);if(!session.mistakes?.length){write('本次没有答错题，继续保持！',34,true,'#258451',30);}else session.mistakes.forEach((item,index)=>{write(`错题 ${index+1} · 第${item.level}关 · ${item.topic}`,29,true,'#173b57',4);write(`题目：${item.prompt}`,25,false,'#243b53',2);write(`我的答案：${item.selected}`,24,false,'#b04444',2);write(`正确答案：${item.answer}`,24,true,'#23804e',2);write(`解析：${item.explanation}`,22,false,'#526d7e',2);write(`提示：${item.hint}`,21,false,'#855b00',14);});pages.forEach((page,index)=>{const pageCtx=page.getContext('2d');pageCtx.font='20px "Microsoft YaHei", sans-serif';pageCtx.fillStyle='#8293a2';pageCtx.fillText(`四域守护战　${index+1} / ${pages.length}`,80,1695);});return pages;}
  function textBytes(value){return new TextEncoder().encode(value);}
  function concatBytes(parts){const length=parts.reduce((sum,part)=>sum+part.length,0),result=new Uint8Array(length);let offset=0;parts.forEach(part=>{result.set(part,offset);offset+=part.length;});return result;}
  async function makePdfBlob(canvases){const images=[];for(const canvas of canvases){const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('canvas export failed')),'image/jpeg',.9));images.push(new Uint8Array(await blob.arrayBuffer()));}const objects=[null,textBytes('<< /Type /Catalog /Pages 2 0 R >>')];const pageIds=canvases.map((_,i)=>3+i*3);objects.push(textBytes(`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`));canvases.forEach((_,i)=>{const pageId=3+i*3,imageId=4+i*3,contentId=5+i*3;objects[pageId]=textBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);objects[imageId]=concatBytes([textBytes(`<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${images[i].length} >>\nstream\n`),images[i],textBytes('\nendstream')]);const content='q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ\n';objects[contentId]=concatBytes([textBytes(`<< /Length ${textBytes(content).length} >>\nstream\n`),textBytes(content),textBytes('endstream')]);});const chunks=[textBytes('%PDF-1.4\n')],offsets=new Array(objects.length).fill(0);let total=chunks[0].length;for(let id=1;id<objects.length;id++){const prefix=textBytes(`${id} 0 obj\n`),suffix=textBytes('\nendobj\n');offsets[id]=total;chunks.push(prefix,objects[id],suffix);total+=prefix.length+objects[id].length+suffix.length;}const xrefOffset=total;let xref=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let id=1;id<objects.length;id++)xref+=`${String(offsets[id]).padStart(10,'0')} 00000 n \n`;xref+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;chunks.push(textBytes(xref));return new Blob(chunks,{type:'application/pdf'});}
  async function generateAndSaveReports(){const collected=collectMistakeSession(state.finishReason||'defeat'),session=collected.session,sessions=collected.sessions;reportStatus('正在生成错题集与当次 PDF……');const markdown=buildMistakeMarkdown(sessions),pdf=await makePdfBlob(makeReportCanvases(session)),date=new Date(session.date).toISOString().replace(/[:.]/g,'-'),subject=session.mode==='math'?'数学':'英语',pdfName=`${date}_${subject}_当次错题报告.pdf`;const mdSaved=await writeBoundFile(`${subject}错题集.md`,markdown,'text/markdown;charset=utf-8'),pdfSaved=await writeBoundFile(pdfName,pdf,'application/pdf');if(!mdSaved)downloadBlob(new Blob([markdown],{type:'text/markdown;charset=utf-8'}),`${subject}错题集.md`);if(!pdfSaved)downloadBlob(pdf,pdfName);if(mdSaved&&pdfSaved){reportStatus(`${subject}错题集.md + ${pdfName}`,'success');}else{reportStatus(`已下载：${subject}错题集.md + ${pdfName}`,'warning');}}
  function finishGame(won,reason) {
    if(state.finished)return;
    state.finished=true;state.finishReason=reason||(won?'victory':'defeat');const accuracy=state.answered?Math.round(state.correct/state.answered*100):0;
    const eligible=won&&accuracy>=90;let recordInfo={rank:0,isRecord:false},score=null;
    if(eligible){score={name:state.player,turns:state.totalTurns,accuracy,hp:state.hp,combo:state.bestStreak,date:new Date().toISOString(),duration:Date.now()-state.startedAt,certificate:newCertificate(state.mode)};recordInfo=saveScore(score,state.mode);}
    const surrendered=state.finishReason==='surrender';$('#result-icon').textContent=won?'🏆':surrendered?'🏳️':'💔';$('#result-kicker').textContent=won?'守护成功':surrendered?'主动投降':'挑战失败';
    $('#result-title').textContent=won?'四域恢复和平！':surrendered?'本次挑战已结束':'怪物突破了防线';
    $('#result-copy').textContent=won?`${state.player}击败了四域怪兽王，完成全部10关。`:surrendered?`${state.player}在第${state.level}关选择投降，本次已答题内容仍会整理进错题集。`:'生命已经用完，整理好乘法口诀或单词拼写，再来挑战吧！';
    $('#result-turns').textContent=state.totalTurns;$('#result-accuracy').textContent=`${accuracy}%`;$('#result-hp').textContent=Math.max(0,state.hp);$('#result-combo').textContent=state.bestStreak;
    $('#record-banner').hidden=!recordInfo.isRecord;
    if(eligible)$('#rank-note').textContent='成绩符合资格，正在同步全平台榜单……';else if(won)$('#rank-note').textContent=`正确率需达到90%才能进入榜单，本次为${accuracy}%。`;else $('#rank-note').textContent=surrendered?'投降成绩不进入通关榜，但错题报告已保留。':'完成全部10关后才有资格进入榜单。';
    showScreen('result-screen');
    generateAndSaveReports().catch(()=>reportStatus('报告生成失败，请点击“重新生成错题文件”重试。','warning'));
    if(eligible)registerCloudResult(score,state.mode).then((cloud)=>{$('#record-banner').hidden=!cloud.isRecord;if(cloud.rank>0)$('#rank-note').textContent=`成绩已进入全平台${state.mode==='math'?'数学':'英语'}榜，目前第 ${cloud.rank} 名。`;else $('#rank-note').textContent='成绩符合资格，但暂未进入全平台前20名。';}).catch(()=>{if(recordInfo.rank>0)$('#rank-note').textContent=`当前离线，成绩已保存在本机${state.mode==='math'?'数学':'英语'}榜第 ${recordInfo.rank} 名，联网查看榜单时会自动同步。`;else $('#rank-note').textContent='当前离线，成绩已保存在本机。';});
  }
  function showRules() {
    $('#modal-title').textContent='玩法说明';
    $('#modal-body').innerHTML=`
      <p><strong>每回合固定三步：</strong>答1道四选一题 → 选择1次攻击或结束回合 → 所有怪物行动1次。不能在同一回合反复答题。</p>
      <div class="rule-grid">
        <div class="rule-item"><strong>❤️ 生命 5</strong><br>普通怪突破扣1，怪兽王扣2；不能修复。</div>
        <div class="rule-item"><strong>⚡ 能量</strong><br>答对获得8～20点；上限60；每关重置为20。</div>
        <div class="rule-item"><strong>💎 钻石</strong><br>连续答对获得；跨关保留；上限12。</div>
        <div class="rule-item"><strong>🏆 榜单</strong><br>通关且正确率≥90%才入榜；总回合越少越强。</div>
      </div>
      <h3>四类怪物</h3>
      <p>🦇 飞行怪移动快，普通弹伤害减半；🐗 陆地怪最基础；🐙 水怪移动快且有护盾；🐛 钻地怪潜伏时普通弹打不到。后期的👻跨域怪会换战线。</p>
      <h3>专用炮弹</h3>
      <p>第3关解锁空中散射弹，第5关解锁深水弹，第7关解锁钻地弹，第9关解锁跨域追踪弹。专用弹能节省回合，但所有敌人都能通过普通弹或等待其暴露来击败。</p>`;
    $('#modal').showModal();
  }

  function showLeaderboard(mode=state.mode||'math') {
    $('#modal-title').textContent='🏆 最少回合榜'; let current=mode;
    const render=(selected,scores,source)=>{
      current=selected;
      $('#modal-body').innerHTML=`<div class="leader-tabs"><button class="leader-tab ${selected==='math'?'active':''}" data-tab="math">数学榜</button><button class="leader-tab ${selected==='english'?'active':''}" data-tab="english">英语榜</button></div>${scores.length?`<table class="leader-table"><thead><tr><th>名次</th><th>守护者</th><th>回合</th><th>正确率</th><th>生命</th><th>日期</th></tr></thead><tbody>${scores.map((s,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(s.name)}</td><td><strong>${s.turns}</strong></td><td>${s.accuracy}%</td><td>${s.hp}</td><td>${new Date(s.date).toLocaleDateString('zh-CN')}</td></tr>`).join('')}</tbody></table>`:'<div class="leader-empty">还没有符合条件的通关记录，等你来占领榜首！</div>'}<p style="font-size:12px;color:#66788a">仅记录通关且正确率≥90%的前20名；同回合依次比较正确率、剩余生命、用时和完成日期。<br><strong>${source}</strong></p>`;
      $$('.leader-tab').forEach(btn=>btn.addEventListener('click',()=>load(btn.dataset.tab)));
    };
    const load=async(selected)=>{render(selected,getScores(selected),'正在连接云端……');try{await syncLocalScoresToCloud(selected);const cloud=await fetchCloudScores(selected);if(current===selected)render(selected,cloud,'已连接云端 · Windows、Android 和 iPad 共享');}catch{if(current===selected)render(selected,getScores(selected),'当前离线 · 暂时显示本机记录');}};
    $('#modal').showModal(); load(mode);
  }

  function escapeHtml(value){const d=document.createElement('div');d.textContent=value;return d.innerHTML;}

  $$('.mode-card').forEach(btn=>btn.addEventListener('click',()=>resetGame(btn.dataset.mode)));
  $$('.ammo-button[data-weapon]').forEach(btn=>btn.addEventListener('click',()=>chooseWeapon(btn.dataset.weapon)));
  $('#hint-button').addEventListener('click',useHint); $('#end-turn').addEventListener('click',endTurn);
  $('#show-rules').addEventListener('click',showRules); $('#show-leaderboard').addEventListener('click',()=>showLeaderboard('math')); $('#bind-report-folder').addEventListener('click',bindReportFolder);
  $('#result-leaderboard').addEventListener('click',()=>showLeaderboard(state.mode)); $('#close-modal').addEventListener('click',()=>$('#modal').close());
  $('#quit-game').addEventListener('click',()=>{if(confirm('现在投降并生成本次错题报告吗？'))finishGame(false,'surrender');});
  $('#play-again').addEventListener('click',()=>resetGame(state.mode)); $('#download-reports').addEventListener('click',()=>{if(state.reportSession)generateAndSaveReports().catch(()=>reportStatus('报告生成失败，请重试。','warning'));else reportStatus('本局尚未结束，结束后才能生成报告。','warning');});
  $('#modal').addEventListener('click',(event)=>{if(event.target===$('#modal'))$('#modal').close();});
  loadReportFolder();

  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();





