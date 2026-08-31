window.LearningBanks={math:[],english:[],ready:null};
window.LearningBanks.ready=Promise.all([
 fetch('../question-banks/math-grade1-2/math-grade1-2.json').then(r=>r.json()).then(x=>window.LearningBanks.math=x.questions||[]),
 fetch('../question-banks/english-grade2-shanghai/english-grade2-shanghai.json').then(r=>r.json()).then(x=>window.LearningBanks.english=x.questions||[])
]).catch(()=>[]);
