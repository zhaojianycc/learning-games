"use strict";

const LEVELS = [
  { name: "草地哨兵", emoji: "🌱", topic: "2 和 5 的口诀", types: ["basic25"] },
  { name: "蘑菇怪", emoji: "🍄", topic: "乘法与连加", types: ["basic34", "equivalent"] },
  { name: "石头兽", emoji: "🗿", topic: "6 和 7 的口诀", types: ["basic67"] },
  { name: "泥潭怪", emoji: "🐊", topic: "8 和 9 的口诀", types: ["basic89"] },
  { name: "幽灵守卫", emoji: "👻", topic: "混合与等值算式", types: ["mixed", "equivalent"] },
  { name: "火焰兽", emoji: "🔥", topic: "找出神秘乘数", types: ["missing", "equivalent"] },
  { name: "冰霜怪", emoji: "❄️", topic: "交换位置", types: ["commute"] },
  { name: "暗影骑士", emoji: "🥷", topic: "分组计算", types: ["distribute"] },
  { name: "城堡将军", emoji: "🦹", topic: "比较与辨错", types: ["compare", "truecalc"] },
  { name: "乘法怪兽 Boss", emoji: "👾", topic: "终极综合挑战", types: ["mixed", "equivalent", "commute"] }
];

const $ = id => document.getElementById(id);
const screens = [...document.querySelectorAll(".screen")];
const state = { player: "", level: 0, unlocked: 0, lives: 3, score: 0, totalCorrect: 0, totalWrong: 0, streak: 0, bestStreak: 0, startedAt: 0, elapsedBefore: 0, levelStart: 0, qIndex: 0, levelCorrect: 0, questions: [], answered: false, muted: false, certificate: "", leaderboardRank: null, newRecord: false };
const BOARD_KEY = "chickRescueLeaderboard";
const CLOUD_BOARD = { url: "https://xnydlalgelkinygfgyok.supabase.co", key: "sb_publishable_nlwGDFitvnCRBRb55VW9rg_Uil7DTM1" };

function showScreen(id) { screens.forEach(s => s.classList.toggle("active", s.id === id)); window.scrollTo({ top: 0, behavior: "smooth" }); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = rand(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function optionsFor(correct, extras = []) { const set = new Set([correct, ...extras]); const offsets = shuffle([-10, -9, -8, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 8, 9, 10]); while (set.size < 4) { const v = correct + offsets.pop(); if (v >= 0) set.add(v); } return shuffle([...set].slice(0, 4)); }
function calculation(a, b, tag = "口诀挑战") { const answer = a * b; const teachingHint = b <= 5 ? `${a} × ${b} 就是 ${Array(b).fill(a).join(" + ")}` : `把 ${b} 拆成 5 + ${b - 5}：${a} × ${b} = ${a} × 5 + ${a} × ${b - 5}`; return { text: `${a} × ${b} = ？`, answer: String(answer), options: optionsFor(answer, [a + b, answer - a, answer + b]), tag, teachingHint } }

function makeQuestion(type) {
  let a, b, c, answer, expressions;
  if (type === "basic25") return calculation(pick([2, 5]), rand(1, 9), "口诀热身");
  if (type === "basic34") return calculation(pick([3, 4]), rand(1, 9), "口诀加油站");
  if (type === "basic67") return calculation(pick([6, 7]), rand(1, 9), "口诀大步走");
  if (type === "basic89") return calculation(pick([8, 9]), rand(1, 9), "口诀冲刺");
  if (type === "mixed") return calculation(rand(2, 9), rand(2, 9), "混合口诀");
  if (type === "missing") { a = rand(2, 9); b = rand(2, 9); return { text: `${a} × ？ = ${a * b}`, answer: String(b), options: optionsFor(b, [a, b + 1, Math.max(1, b - 1)]), tag: "寻找神秘数" }; }
  if (type === "equivalent") { a = pick([2, 3, 3, 4, 5]); b = 3; const balanced = `${a - 1} + ${a} + ${a + 1}`, repeated = `${a} + ${a} + ${a}`; answer = Math.random() < .5 ? repeated : balanced; expressions = [answer, `${a} + ${a} + ${a} + ${a}`, `${a - 1} + ${a} + ${a}`, `${a} + ${a + 1} + ${a + 2}`]; return { text: `${a} × ${b} 和哪个加法算式结果相同？`, answer, options: shuffle(expressions), tag: "乘法变变变", teachingHint: `${a} × 3 表示把 3 个数合起来；这些数的总和要等于 ${a * 3}` }; }
  if (type === "commute") { a = rand(2, 9); do { b = rand(2, 9); } while (b === a); answer = `${b} × ${a}`; const changedB = b === 9 ? 8 : b + 1; expressions = [answer, `${a} + ${b}`, `${b} × ${a - 1}`, `${a} × ${changedB}`]; return { text: `${a} × ${b} 和哪个算式结果相同？`, answer, options: shuffle(expressions), tag: "换位置小魔法" }; }
  if (type === "distribute") { a = rand(2, 5); b = rand(1, 4); c = rand(1, 4); answer = a * (b + c); return { text: `${a} ×（${b} + ${c}）= ？`, answer: String(answer), options: optionsFor(answer, [a * b + c, a + b + c, a * b * c]), tag: "分组计算" }; }
  if (type === "compare") { expressions = []; while (expressions.length < 4) { a = rand(2, 9); b = rand(2, 9); const label = `${a} × ${b}`; if (!expressions.some(x => x.label === label || x.value === a * b)) expressions.push({ label, value: a * b }); } const max = Math.max(...expressions.map(x => x.value)); answer = expressions.find(x => x.value === max).label; return { text: "哪个算式的结果最大？", answer, options: shuffle(expressions.map(x => x.label)), tag: "火眼金睛" }; }
  do { a = rand(2, 9); b = rand(2, 9); } while (a === 2 && b === 2); answer = a * b; expressions = [`${a} × ${b} = ${answer}`, `${a} × ${b} = ${answer + pick([-2, -1, 1, 2])}`, `${b} × ${a} = ${answer + 3}`, `${a} + ${b} = ${answer}`]; return { text: "下面哪个算式是正确的？", answer: expressions[0], options: shuffle(expressions), tag: "真假算式" };
}

function createLevelQuestions(level) { const types = LEVELS[level].types; return Array.from({ length: 3 }, (_, i) => { const q = makeQuestion(types[i % types.length]); if (level < 3 && q.teachingHint) q.hint = `💡 ${q.teachingHint}`; delete q.teachingHint; return q; }); }
function hearts(n) { return "❤️".repeat(n) + "🤍".repeat(3 - n); }
function save() { localStorage.setItem("chickRescueSave", JSON.stringify({ ...state, questions: [], answered: false, elapsedBefore: elapsedNow() })); }
function elapsedNow() { return state.startedAt ? state.elapsedBefore + Date.now() - state.startedAt : state.elapsedBefore; }
function loadSave() { try { return JSON.parse(localStorage.getItem("chickRescueSave")); } catch { return null; } }
function loadBoard() { try { const board = JSON.parse(localStorage.getItem(BOARD_KEY)); return Array.isArray(board) ? board : []; } catch { return []; } }
function boardDate(iso) { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function sortBoard(board) { return board.sort((a,b) => a.time - b.time || String(a.createdAt).localeCompare(String(b.createdAt))); }
function saveLocalResult(accuracy) {
  const oldBoard = sortBoard(loadBoard()), now = new Date().toISOString();
  const entry = { player: state.player, time: state.elapsedBefore, accuracy, date: now, createdAt: now, certificate: state.certificate };
  const board = sortBoard([...oldBoard.filter(x => x.certificate !== state.certificate), entry]).slice(0,20);
  localStorage.setItem(BOARD_KEY, JSON.stringify(board)); return board;
}
async function cloudRequest(path, options = {}) {
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(`${CLOUD_BOARD.url}/rest/v1/${path}`, { ...options, signal: controller.signal, headers: { apikey: CLOUD_BOARD.key, "Content-Type": "application/json", ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`云端榜单请求失败：${response.status}`);
    return response.status === 204 ? null : response.json();
  } finally { clearTimeout(timer); }
}
async function fetchCloudBoard() {
  const rows = await cloudRequest("leaderboard_entries?select=player_name,duration_ms,accuracy,created_at,certificate&order=duration_ms.asc,created_at.asc&limit=20");
  return rows.map(row => ({ player: row.player_name, time: row.duration_ms, accuracy: row.accuracy, date: row.created_at, createdAt: row.created_at, certificate: row.certificate }));
}
async function submitCloudResult(accuracy) {
  return cloudRequest("leaderboard_entries?on_conflict=certificate", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ player_name: state.player, duration_ms: Math.round(state.elapsedBefore), accuracy, correct_count: state.totalCorrect, wrong_count: state.totalWrong, best_streak: state.bestStreak, certificate: state.certificate }) });
}
async function registerLeaderboard(accuracy) {
  state.leaderboardRank = null; state.newRecord = false;
  if (accuracy < 90) return;
  const localBoard = saveLocalResult(accuracy);
  try {
    const before = await fetchCloudBoard(); state.newRecord = before.length > 0 && state.elapsedBefore < before[0].time;
    await submitCloudResult(accuracy); const board = await fetchCloudBoard();
    const index = board.findIndex(x => x.certificate === state.certificate); if (index >= 0) state.leaderboardRank = index + 1;
    state.leaderboardMode = "cloud";
  } catch (error) {
    console.warn(error); const index = localBoard.findIndex(x => x.certificate === state.certificate);
    if (index >= 0) state.leaderboardRank = index + 1; state.newRecord = localBoard.length > 1 && index === 0; state.leaderboardMode = "local";
  }
}
function escapeHtml(value) { const div=document.createElement("div"); div.textContent=String(value); return div.innerHTML; }
function paintLeaderboard(board) {
  $("emptyBoard").hidden = board.length > 0; $("podium").hidden = board.length === 0; document.querySelector(".rank-table-wrap").hidden = board.length === 0;
  const classes = ["first","second","third"], medals = ["🥇","🥈","🥉"];
  $("podium").innerHTML = board.slice(0,3).map((e,i)=>`<div class="podium-place ${classes[i]}"><span>${medals[i]}</span><b>${escapeHtml(e.player)}</b><small>${formatTime(e.time)} · ${e.accuracy}%</small></div>`).join("");
  $("leaderboardBody").innerHTML = board.map((e,i)=>`<tr class="${e.certificate === state.certificate ? "highlight" : ""}"><td class="rank-medal">${medals[i] || i+1}</td><td>${escapeHtml(e.player)}</td><td><b>${formatTime(e.time)}</b></td><td>${e.accuracy}%</td><td>${boardDate(e.date)}</td></tr>`).join("");
}
async function renderLeaderboard() {
  paintLeaderboard(sortBoard(loadBoard())); $("leaderboardSource").textContent = "正在连接云端…";
  try { paintLeaderboard(await fetchCloudBoard()); $("leaderboardSource").textContent = "已连接云端 · Windows、Android 和 iPad 共享"; }
  catch { $("leaderboardSource").textContent = "当前离线 · 暂时显示本机记录"; }
}
function openLeaderboard() { showScreen("leaderboardScreen"); renderLeaderboard(); }

function begin(newGame) {
  const name = $("playerName").value.trim() || "小勇者";
  if (newGame) Object.assign(state, { player: name, level: 0, unlocked: 0, lives: 3, score: 0, totalCorrect: 0, totalWrong: 0, streak: 0, bestStreak: 0, startedAt: Date.now(), elapsedBefore: 0, certificate: "", leaderboardRank: null, newRecord: false });
  renderMap(); showScreen("mapScreen"); save(); tone(520, .09);
}

function continueGame() {
  const saved = loadSave(); if (!saved) return;
  Object.assign(state, saved, { startedAt: Date.now(), questions: [], answered: false });
  $("playerName").value = state.player; renderMap(); showScreen("mapScreen");
}

function renderMap() {
  $("mapPlayer").textContent = `🧒 ${state.player}`; $("mapLives").textContent = hearts(state.lives); $("mapScore").textContent = state.score;
  $("levelGrid").innerHTML = LEVELS.map((l, i) => { const completed = i < state.unlocked, current = i === state.unlocked; const cls = completed ? "completed unlocked" : current ? "current unlocked" : "locked"; return `<button class="level-node ${cls}" data-level="${i}" ${i > state.unlocked ? "disabled" : ""}><span class="node-number">${i + 1}</span>${completed ? '<span class="check">✅</span>' : ""}<span class="monster">${l.emoji}</span><b>${l.name}</b><small>${l.topic}</small></button>`; }).join("");
  document.querySelectorAll(".level-node.unlocked").forEach(btn => btn.onclick = () => startLevel(Number(btn.dataset.level)));
  $("mapTip").textContent = state.unlocked >= 9 ? "最后一战：打败 Boss，救出小鸡！" : `下一站：第 ${state.unlocked + 1} 关 ${LEVELS[state.unlocked].name}`;
}

function startLevel(level) {
  state.level = level; state.lives = 3; state.qIndex = 0; state.levelCorrect = 0; state.questions = createLevelQuestions(level); state.levelStart = Date.now(); state.answered = false;
  const info = LEVELS[level]; $("levelNumber").textContent = `第 ${level + 1} 关`; $("levelName").textContent = info.name; $("enemyName").textContent = info.name; $("enemyEmoji").textContent = info.emoji;
  updateQuizStats(); renderQuestion(); showScreen("quizScreen"); tone(390, .1);
}

function updateQuizStats() { $("quizLives").textContent = hearts(state.lives); $("quizScore").textContent = state.score; $("heroHp").style.width = `${state.lives / 3 * 100}%`; $("enemyHp").style.width = `${(3 - state.qIndex) / 3 * 100}%`; $("questionProgress").textContent = `第 ${state.qIndex + 1} / 3 题`; $("streakText").textContent = `连续答对 ${state.streak}`; $("progressBar").style.width = `${state.qIndex / 3 * 100}%`; }
function renderQuestion() {
  state.answered = false; const q = state.questions[state.qIndex]; $("questionTag").textContent = q.tag; $("questionText").textContent = q.text; $("feedback").textContent = "";
  $("visualHelp").hidden = !q.hint; $("visualHelp").textContent = q.hint || "";
  $("answers").innerHTML = q.options.map((o, i) => `<button class="answer" data-value="${String(o).replace(/"/g, "&quot;")}"><span>${["A", "B", "C", "D"][i]}.</span> ${o}</button>`).join("");
  document.querySelectorAll(".answer").forEach(btn => btn.onclick = () => answerQuestion(btn)); updateQuizStats();
}

function answerQuestion(btn) {
  if (state.answered) return; state.answered = true; const q = state.questions[state.qIndex]; const correct = btn.dataset.value === q.answer;
  document.querySelectorAll(".answer").forEach(b => { b.disabled = true; if (b.dataset.value === q.answer) b.classList.add("correct"); });
  if (correct) { state.totalCorrect++; state.levelCorrect++; state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak); state.score += 100 + Math.min(state.streak, 5) * 10; btn.classList.add("correct"); $("feedback").textContent = pick(["太棒了，攻击成功！", "答对啦，口诀真熟练！", "漂亮！继续前进！"]); $("feedback").style.color = "#17864d"; $("hitEffect").textContent = "💥"; $("hitEffect").classList.add("show"); tone(660, .12); setTimeout(() => tone(880, .12), 100); }
  else { state.totalWrong++; state.streak = 0; state.lives--; btn.classList.add("wrong"); $("feedback").textContent = `正确答案是 ${q.answer}，记住它再出发！`; $("feedback").style.color = "#c33a4c"; $("app").classList.add("shake"); tone(190, .25); }
  updateQuizStats(); save(); setTimeout(() => { $("hitEffect").classList.remove("show"); $("app").classList.remove("shake"); if (state.lives <= 0) showScreen("failScreen"); else if (state.qIndex >= 2) completeLevel(); else { state.qIndex++; renderQuestion(); } }, correct ? 1150 : 1700);
}

function completeLevel() {
  const seconds = Math.max(1, Math.round((Date.now() - state.levelStart) / 1000)); const stars = state.levelCorrect === 3 ? 3 : state.levelCorrect === 2 ? 2 : 1;
  if (state.level === state.unlocked) state.unlocked = Math.min(10, state.unlocked + 1);
  $("resultIcon").textContent = state.level === 9 ? "👑" : "🏆"; $("resultTitle").textContent = `击败${LEVELS[state.level].name}！`; $("resultMessage").textContent = state.level === 9 ? "城堡的大门打开了，小鸡自由啦！" : "离小鸡又近了一步！"; $("levelCorrect").textContent = `${state.levelCorrect}/3`; $("levelTime").textContent = `${seconds}秒`; $("levelStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars); $("nextBtn").textContent = state.level === 9 ? "去救小鸡 ➜" : "返回地图 ➜"; save(); showScreen("levelResultScreen"); tone(784, .13); setTimeout(() => tone(1046, .25), 140);
}

function finishOrMap() { if (state.level === 9) victory(); else { renderMap(); showScreen("mapScreen"); } }
function retry() { startLevel(state.level); }
function formatTime(ms) { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
function makeCertificate() { const d = new Date(); const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`; const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let code = ""; for (let i=0;i<6;i++) code += chars[rand(0,chars.length-1)]; return `MUL-${date}-${code}`; }
async function victory() {
  state.elapsedBefore = elapsedNow(); state.startedAt = 0; state.certificate ||= makeCertificate(); const total = state.totalCorrect + state.totalWrong; const accuracy = total ? Math.round(state.totalCorrect / total * 100) : 0;
  $("victoryText").textContent = `${state.player}用乘法智慧打败了大怪兽，成功救出了小鸡啾啾！`; $("finalCorrect").textContent = state.totalCorrect; $("finalAccuracy").textContent = `${accuracy}%`; $("finalStreak").textContent = state.bestStreak; $("finalTime").textContent = formatTime(state.elapsedBefore); $("certificateNo").textContent = `证书编号：${state.certificate}`;
  const notice=$("recordNotice"); notice.hidden=false; notice.className="record-notice qualified"; notice.textContent=accuracy>=90?"🌐 正在同步全平台榜单…":"正在生成通关证书…"; $("badgeBtn").disabled=true; showScreen("victoryScreen");
  await registerLeaderboard(accuracy); notice.className="record-notice"; $("badgeBtn").disabled=false;
  const platform=state.leaderboardMode==="local"?"本机":"全平台";
  if(state.newRecord){notice.textContent=`🎉 ${platform}新纪录！${formatTime(state.elapsedBefore)} 成为最快通关时间！`;$("certificateRank").textContent=`🏆 刷新${platform}最快纪录 · 榜单第 1 名`;}
  else if(state.leaderboardRank){notice.classList.add("qualified");notice.textContent=`🏅 成功进入${platform}极速榜第 ${state.leaderboardRank} 名！`;$("certificateRank").textContent=`🏅 ${platform}极速榜第 ${state.leaderboardRank} 名`;}
  else if(accuracy<90){notice.classList.add("unqualified");notice.textContent=`本次正确率为 ${accuracy}%，达到 90% 即可进入全平台榜单。`;$("certificateRank").textContent="完成十关救援挑战";}
  else{notice.classList.add("unqualified");notice.textContent="成功通过榜单资格线，继续加速就有机会进入全平台前 20 名！";$("certificateRank").textContent="通过全平台极速榜资格线";}
  localStorage.removeItem("chickRescueSave");
}

function downloadBadge() {
  const canvas = $("badgeCanvas"), ctx = canvas.getContext("2d"), total = state.totalCorrect + state.totalWrong, accuracy = total ? Math.round(state.totalCorrect / total * 100) : 0, date = new Date().toLocaleDateString("zh-CN");
  const grad = ctx.createLinearGradient(0,0,1400,1000); grad.addColorStop(0,"#eeeaff"); grad.addColorStop(.5,"#fff9df"); grad.addColorStop(1,"#dff8ed"); ctx.fillStyle=grad; ctx.fillRect(0,0,1400,1000); ctx.strokeStyle="#5b4bdb"; ctx.lineWidth=18; ctx.strokeRect(35,35,1330,930); ctx.strokeStyle="#e5b932"; ctx.lineWidth=5; ctx.strokeRect(58,58,1284,884);
  ctx.textAlign="center"; ctx.fillStyle="#5b4bdb"; ctx.font="bold 46px Microsoft YaHei"; ctx.fillText("小鸡救援队 · 荣誉证书",700,145); ctx.font="120px sans-serif"; ctx.fillText("🏅",700,285); ctx.fillStyle="#26314f"; ctx.font="bold 42px Microsoft YaHei"; ctx.fillText("授予",700,365); ctx.fillStyle="#5b4bdb"; ctx.font="bold 78px Microsoft YaHei"; ctx.fillText(state.player,700,460); ctx.fillStyle="#26314f"; ctx.font="36px Microsoft YaHei"; ctx.fillText("乘 法 小 勇 士",700,535); ctx.fillStyle="#6f7893"; ctx.font="28px Microsoft YaHei"; ctx.fillText("凭借勇气和乘法智慧，闯过十关，成功救出小鸡！",700,600);
  ctx.fillStyle="#fff"; roundRect(ctx,165,645,1070,150,24); ctx.fill(); ctx.fillStyle="#26314f"; ctx.font="bold 27px Microsoft YaHei"; ctx.fillText(`答对 ${state.totalCorrect} 题     正确率 ${accuracy}%     最高连击 ${state.bestStreak}     用时 ${formatTime(state.elapsedBefore)}`,700,695); ctx.fillStyle=state.newRecord?"#b27609":"#5b4bdb"; ctx.font="bold 25px Microsoft YaHei"; const platform=state.leaderboardMode==="local"?"本机":"全平台", rankLine=state.newRecord?`刷新${platform}最快纪录 · 极速榜第 1 名`:state.leaderboardRank?`${platform}极速榜第 ${state.leaderboardRank} 名`:accuracy>=90?"已通过全平台榜单资格线":"完成十关救援挑战"; ctx.fillText(rankLine,700,740); ctx.fillStyle="#6f7893"; ctx.font="21px Microsoft YaHei"; ctx.fillText(`完成日期：${date}     证书编号：${state.certificate}`,700,775); ctx.fillStyle="#b27609"; ctx.font="bold 30px Microsoft YaHei"; ctx.fillText("小鸡啾啾感谢勇者的救援！",700,865);
  const a=document.createElement("a"); a.download=`乘法小勇士徽章_${state.player}_${date.replaceAll("/","-")}.png`; a.href=canvas.toDataURL("image/png"); a.click();
}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
let audioCtx; function tone(freq,duration){if(state.muted)return;try{audioCtx ||= new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.06,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch{}}

$("startBtn").onclick=()=>begin(true); $("continueBtn").onclick=continueGame; $("leaderboardBtn").onclick=openLeaderboard; $("leaderboardBackBtn").onclick=()=>showScreen("homeScreen"); $("victoryBoardBtn").onclick=openLeaderboard; $("backMapBtn").onclick=()=>{renderMap();showScreen("mapScreen")}; $("nextBtn").onclick=finishOrMap; $("retryBtn").onclick=retry; $("failMapBtn").onclick=()=>{renderMap();showScreen("mapScreen")}; $("badgeBtn").onclick=downloadBadge; $("printBtn").onclick=()=>window.print(); $("restartBtn").onclick=()=>{localStorage.removeItem("chickRescueSave");location.reload()};
$("soundBtn").onclick=()=>{state.muted=!state.muted;$("soundBtn").textContent=state.muted?"🔇":"🔊";$("soundBtn").ariaLabel=state.muted?"开启音效":"关闭音效"};
$("fullscreenBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
$("playerName").addEventListener("keydown",e=>{if(e.key==="Enter")begin(true)});
const existing=loadSave(); if(existing){$("continueBtn").hidden=false;$("playerName").value=existing.player||""}
