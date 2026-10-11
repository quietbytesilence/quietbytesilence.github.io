import { CONFIG } from '../data/config.js';
import { MODULES, ALL_LESSONS } from '../data/course.js';
import { VIDEOS } from '../data/videos.js';
import { DESCRIPTIONS } from '../data/descriptions.js';
import { prepareDatabase, loginStudent, getStudent, getProgress, getNotes, getPreferences, getCourseState, setCourseState, savePreferences, toggleLesson, saveNote, renameStudent, resetProgress, deleteStudentData, createBackup, restoreBackup, validateName } from './db.js';
import { exportNotesPdf, downloadTextFile } from './export.js';

const $=sel=>document.querySelector(sel);
const icon=id=>`<svg aria-hidden="true"><use href="#i-${id}"></use></svg>`;
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fmtDate=value=>value&&!Number.isNaN(Date.parse(value))?new Date(value).toLocaleDateString('pt-BR'):'—';
const initials=name=>(name||'A').split(/\s+/).filter(Boolean).slice(0,2).map(p=>p[0]).join('').toLocaleUpperCase('pt-BR');
const firstName=name=>(name||'Estudante').split(/\s+/)[0];
const statusId=id=>ui.progress.some(p=>p.lessonId===id);
const counts=()=>({completed:ALL_LESSONS.filter(l=>statusId(l.id)).length,total:ALL_LESSONS.length});
const percentage=(done,total)=>total?Math.round(done/total*100):0;
const progressBar=(done,total)=>`<div class="progress-rail" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Progresso do curso"><div class="progress-fill" style="width:${percentage(done,total)}%"></div></div>`;
const urlIsValid=url=>{try{const u=new URL(url);return u.protocol==='https:'&&(u.hostname==='docs.google.com'&&u.pathname.startsWith('/forms/')||u.hostname==='forms.gle');}catch{return false;}};
const SESSION_KEY=`ava_session_${CONFIG.courseId}`;
const ui={student:null,progress:[],notes:[],preferences:null,courseState:null,view:'dashboard',selectedLessonId:ALL_LESSONS[0]?.id,openModules:new Set(['M01']),noteTimer:null,noteDraft:null,saving:false,toastTimer:null,initialized:false};

function toast(message,error=false){const node=$('#toast');node.textContent=message;node.classList.toggle('error',error);node.classList.add('show');clearTimeout(ui.toastTimer);ui.toastTimer=setTimeout(()=>node.classList.remove('show'),3900);}
function theme(value){const t=value==='light'?'light':'dark';document.body.dataset.theme=t;$('#theme-toggle use')?.setAttribute('href',t==='light'?'#i-moon':'#i-sun');}
function showWelcome(){
  $('#app-shell').hidden=true;$('#welcome-screen').hidden=false;$('#login-name').value='';$('#login-error').textContent='';
  document.body.dataset.theme='dark';setTimeout(()=>$('#login-name')?.focus(),100);
}
async function refresh(){
  [ui.progress,ui.notes,ui.preferences,ui.courseState]=await Promise.all([getProgress(ui.student.id),getNotes(ui.student.id),getPreferences(ui.student.id),getCourseState(ui.student.id)]);
  if(!ALL_LESSONS.some(l=>l.id===ui.selectedLessonId))ui.selectedLessonId=ALL_LESSONS[0]?.id;
  theme(ui.preferences.theme);
}
async function activateStudent(student){
  ui.student=student;ui.view='dashboard';await refresh();
  if(ALL_LESSONS.some(l=>l.id===ui.preferences.lastLessonId))ui.selectedLessonId=ui.preferences.lastLessonId;
  ui.openModules=new Set([ALL_LESSONS.find(l=>l.id===ui.selectedLessonId)?.moduleId||'M01']);
  try{localStorage.setItem(SESSION_KEY,student.id);}catch{}
  $('#welcome-screen').hidden=true;$('#app-shell').hidden=false;render();
}
function renderSidebar(){
  const c=counts();$('#sidebar-count').textContent=`${c.completed}/${c.total}`;
  $('#sidebar-student-name').textContent=ui.student.name;
  $('#student-avatar').textContent=initials(ui.student.name);
  $('#profile-shortcut').textContent=initials(ui.student.name);
  document.querySelectorAll('.nav-link[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===ui.view));
  $('#module-list').innerHTML=MODULES.map((module,idx)=>{
    const done=module.lessons.filter(l=>statusId(l.id)).length;
    return `<section class="module-box ${ui.openModules.has(module.id)?'open':''}"><button class="module-toggle" type="button" data-module="${module.id}" aria-expanded="${ui.openModules.has(module.id)}"><span class="module-num">${String(idx+1).padStart(2,'0')}</span><span class="module-label">${esc(module.title)}<br><span class="muted-small">${done}/${module.lessons.length} aulas</span></span>${done===module.lessons.length?`<span class="module-check">${icon('checkcircle')}</span>`:''}${icon('chevron')}</button><div class="module-items">${module.lessons.map(l=>`<button class="lesson-link ${ui.view==='lesson'&&ui.selectedLessonId===l.id?'active':''}" type="button" data-lesson="${l.id}"><span class="lesson-name">${esc(l.title)}</span><span class="status-mark ${statusId(l.id)?'completed':''}">${statusId(l.id)?icon('check'):''}</span></button>`).join('')}</div></section>`;
  }).join('');
}
function render(){
  if(!ui.student)return;
  renderSidebar();const main=$('#main-content');
  const heading={dashboard:'Início / Visão geral',lesson:'Curso / Videoaula',notes:'Curso / Minhas anotações',exam:'Curso / Avaliação final',settings:'Conta / Configurações'};
  $('#breadcrumb').textContent=heading[ui.view]||heading.dashboard;
  main.innerHTML=({dashboard:renderDashboard,lesson:renderLesson,notes:renderNotes,exam:renderExam,settings:renderSettings}[ui.view]||renderDashboard)();
}
function renderDashboard(){
  const c=counts(),percent=percentage(c.completed,c.total),finishedModules=MODULES.filter(m=>m.lessons.every(l=>statusId(l.id))).length;
  const next=ALL_LESSONS.find(l=>!statusId(l.id))||ALL_LESSONS[ALL_LESSONS.length-1];
  const last=ALL_LESSONS.find(l=>l.id===ui.selectedLessonId)||next;
  return `<section class="dashboard-hero"><span class="eyebrow" style="color:#d4cafa">${icon('spark')} SEU ESPAÇO DE APRENDIZAGEM</span><h1>Olá, ${esc(firstName(ui.student.name))}!<br>Vamos continuar aprendendo?</h1><p>Estude com tranquilidade, registre suas ideias e avance no seu ritmo. Cada aula concluída aproxima você da avaliação final.</p><div class="hero-actions"><button class="btn btn-primary" type="button" data-lesson="${(c.completed===c.total?last:next).id}">${icon('play')} ${c.completed?'Continuar estudando':'Começar primeira aula'}</button><button class="btn btn-secondary" type="button" data-view="notes">${icon('pen')} Meu caderno</button></div></section>
  <div class="stats-grid"><div class="stat-card"><div class="stat-top"><span>Aulas concluídas</span><span class="stat-icon">${icon('checkcircle')}</span></div><div class="stat-number">${c.completed}<span class="muted" style="font-size:16px"> / ${c.total}</span></div><div class="stat-bottom">${c.total-c.completed} aulas restantes</div></div><div class="stat-card"><div class="stat-top"><span>Seu progresso</span><span class="stat-icon">${icon('grid')}</span></div><div class="stat-number">${percent}%</div>${progressBar(c.completed,c.total)}</div><div class="stat-card"><div class="stat-top"><span>Módulos finalizados</span><span class="stat-icon">${icon('book')}</span></div><div class="stat-number">${finishedModules}<span class="muted" style="font-size:16px"> / ${MODULES.length}</span></div><div class="stat-bottom">Inscrição local: ${fmtDate(ui.courseState.startedAt)}</div></div></div>
  <div class="section-heading"><div><span class="kicker">TRILHA FORMATIVA</span><h2 class="section-title">Explore os módulos</h2></div><span class="badge purple">${c.total} aulas disponíveis</span></div>
  <div class="module-cards">${MODULES.map((m,i)=>{const done=m.lessons.filter(l=>statusId(l.id)).length;return `<article class="module-card"><div class="module-card-top"><span class="module-card-icon">${String(i+1).padStart(2,'0')}</span><span class="badge ${done===m.lessons.length?'success':''}">${done===m.lessons.length?'Concluído':`${done}/${m.lessons.length} aulas`}</span></div><h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p>${progressBar(done,m.lessons.length)}<button type="button" data-lesson="${m.lessons[0].id}">Acessar módulo ${icon('arrow')}</button></article>`;}).join('')}</div>
  <div class="section-heading"><h2 class="section-title">Dados e anotações</h2></div><div class="card" style="display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap"><div><h3 style="margin:0 0 6px">Seu caderno de estudos</h3><p class="muted-small" style="margin:0">Exporte todas as suas anotações, organizadas por módulo, em um PDF.</p></div><button class="btn btn-secondary" data-action="download-pdf">${icon('download')} Baixar minhas anotações</button></div>`;
}
function renderLesson(){
  const l=ALL_LESSONS.find(l=>l.id===ui.selectedLessonId)||ALL_LESSONS[0];if(!l)return '<p>O curso ainda não possui aulas.</p>';
  const video=VIDEOS[l.id],desc=DESCRIPTIONS[l.id];const done=statusId(l.id);const idx=ALL_LESSONS.findIndex(item=>item.id===l.id);
  const note=ui.notes.find(n=>n.lessonId===l.id)?.text||'';
  const videoValid=/^[\w-]{11}$/.test(video?.youtubeId||'');
  return `<div class="lesson-top"><span class="eyebrow">${icon('book')} MÓDULO ${l.moduleIndex+1} · AULA ${String(l.number).padStart(2,'0')}</span><span class="badge ${done?'success':''}">${done?`${icon('check')} Concluída`:'Pendente'}</span></div><h1 class="lesson-title">${esc(l.title)}</h1><p class="muted-small">${esc(l.moduleTitle)} · Aula ${l.number} de ${ALL_LESSONS.length}</p>
  <div class="lesson-main-grid"><div><div class="video-card">${videoValid?`<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0" title="Videoaula: ${esc(l.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`:`<div style="aspect-ratio:16/9;display:grid;place-items:center">Vídeo ainda não configurado</div>`}<div class="video-bottom"><div class="video-source">VIDEOAULA · <strong>${esc(video?.author||'Autor não informado')}</strong><br>${esc(video?.sourceTitle||'')}</div>${videoValid?`<a href="https://www.youtube.com/watch?v=${video.youtubeId}" target="_blank" rel="noopener noreferrer">Abrir no YouTube ↗</a>`:''}</div></div>
  <article class="card lesson-text"><span class="kicker">MATERIAL DE APOIO</span><h3>Sobre esta aula</h3><p>${esc(desc?.summary||'O texto desta aula ainda não foi cadastrado.')}</p><h4>Objetivos de aprendizagem</h4><ul class="objectives">${(desc?.objectives||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul><h4>Conteúdo explicado</h4>${(desc?.content||[]).map(item=>`<p>${esc(item)}</p>`).join('')}<h4>Para praticar</h4><div class="activity-box">${esc(desc?.activity||'')}</div></article>
  <section class="card notes-editor-card"><div class="notes-editor-head"><div><span class="kicker">CADERNO PESSOAL</span><h3 style="margin:3px 0 0;font-size:17px">Minhas anotações desta aula</h3></div><span id="save-status" class="badge">Salvo localmente</span></div><label class="muted-small" for="lesson-notes">Registre dúvidas, exemplos e ideias que deseja revisar.</label><textarea id="lesson-notes" class="notes-textarea" maxlength="20000" placeholder="Escreva aqui suas anotações...">${esc(note)}</textarea><div class="editor-actions"><span class="muted-small">Salvamento automático · até 20.000 caracteres</span><button class="btn btn-secondary btn-small" type="button" data-action="download-pdf">${icon('download')} Baixar minhas anotações</button></div></section>
  <div class="lesson-pager"><button class="btn btn-secondary" type="button" data-lesson="${ALL_LESSONS[Math.max(idx-1,0)].id}" ${idx===0?'disabled':''}>${icon('back')} Aula anterior</button><button class="btn btn-primary" type="button" data-lesson="${ALL_LESSONS[Math.min(idx+1,ALL_LESSONS.length-1)].id}" ${idx===ALL_LESSONS.length-1?'disabled':''}>Próxima aula ${icon('arrow')}</button></div></div>
  <aside class="card side-task"><span class="kicker">ACOMPANHAMENTO</span><h3>Seu progresso nesta aula</h3><p>${done?'Você registrou esta aula como concluída. Pode desfazer a marcação quando quiser.':'Depois de estudar o vídeo e o texto, clique para registrar a conclusão.'}</p><div class="detail-row">${icon('checkcircle')} ${done?'Aula concluída':'Status: pendente'}</div><div class="stack"><button class="btn ${done?'btn-success':'btn-primary'}" type="button" data-action="toggle-complete">${done?icon('checkcircle'):icon('check')} ${done?'Desmarcar conclusão':'Marcar como concluída'}</button><button class="btn btn-secondary" type="button" data-action="download-pdf">${icon('download')} Baixar minhas anotações</button></div><hr class="divider"><h3>Detalhes do curso</h3><div class="detail-row">${icon('book')} ${ALL_LESSONS.length} videoaulas no total</div><div class="detail-row">${icon('clock')} Estude em seu próprio ritmo</div><div class="detail-row">${icon('lock')} Dados salvos apenas neste navegador</div></aside></div>`;
}
function renderNotes(){
  const lessonNotes=ALL_LESSONS.map(l=>({...l,note:ui.notes.find(n=>n.lessonId===l.id)?.text?.trim()||''})).filter(l=>l.note);
  return `<span class="eyebrow">${icon('pen')} SEU MATERIAL PESSOAL</span><h1 class="page-title">Minhas anotações</h1><p class="page-lede">Todas as suas anotações em um só lugar. Você pode reabrir a aula correspondente, baixar um PDF ou salvar um backup completo de seus dados.</p>
  <div class="notes-tools print-hide"><button class="btn btn-primary" type="button" data-action="download-pdf">${icon('download')} Baixar minhas anotações (PDF)</button><button class="btn btn-secondary" type="button" data-action="print-notes">${icon('book')} Imprimir caderno</button><button class="btn btn-secondary" type="button" data-action="backup">${icon('download')} Backup completo (JSON)</button></div>
  <div class="card" style="display:flex;align-items:center;gap:13px;margin-bottom:20px"><span class="stat-icon">${icon('pen')}</span><div><strong>${lessonNotes.length} ${lessonNotes.length===1?'aula com anotações':'aulas com anotações'}</strong><div class="muted-small">Seu nome: ${esc(ui.student.name)} · Curso: ${esc(CONFIG.courseName)}</div></div></div>
  ${lessonNotes.length?`<div class="note-list">${lessonNotes.map(l=>`<article class="card note-card"><span class="mini-label">MÓDULO ${l.moduleIndex+1} · AULA ${l.number}</span><h3>${esc(l.title)}</h3><p>${esc(l.note)}</p><button class="btn btn-secondary btn-small print-hide" type="button" data-lesson="${l.id}">${icon('pen')} Editar na aula</button></article>`).join('')}</div>`:`<div class="card empty-state"><span class="empty-icon">${icon('pen')}</span><h2>Seu caderno ainda está em branco</h2><p>Entre em qualquer aula e escreva na área de anotações. Tudo aparecerá aqui automaticamente.</p><button class="btn btn-primary" data-view="lesson">${icon('book')} Abrir minhas aulas</button></div>`}`;
}
function renderExam(){
  const c=counts(),ready=c.completed===c.total&&c.total>0,configured=urlIsValid(CONFIG.examUrl);
  return `<span class="eyebrow">${icon('cap')} ETAPA FINAL</span><h1 class="page-title">Avaliação final</h1><p class="page-lede">Ao concluir sua trilha de estudos, você poderá acessar a prova de conhecimentos no Google Formulários.</p>
  <article class="card"><div class="exam-hero"><div class="exam-icon">${icon('cap')}</div><div><span class="badge ${ready?'success':''}">${ready?'Trilha concluída':'Aguardando conclusão das aulas'}</span><h2 style="margin:12px 0 8px;font-size:23px">${esc(CONFIG.examTitle)}</h2><p class="muted">Conclua os 5 módulos antes de iniciar a avaliação. A correção e eventual emissão de certificado serão realizadas pela equipe responsável.</p></div></div><div class="exam-requirements"><div class="requirement">${icon('checkcircle')} ${c.completed} de ${c.total} aulas concluídas</div><div class="requirement ${ready?'':'pending'}">${ready?icon('checkcircle'):icon('clock')} ${ready?'Requisito de participação cumprido':'Complete as aulas pendentes para liberar a prova'}</div><div class="requirement ${configured?'':'pending'}">${configured?icon('checkcircle'):icon('info')} ${configured?'Formulário de avaliação configurado':'Link da prova ainda não definido pela equipe'}</div></div>${progressBar(c.completed,c.total)}
  ${ready&&configured?`<a class="btn btn-primary exam-btn" href="${esc(CONFIG.examUrl)}" target="_blank" rel="noopener noreferrer">${icon('arrow')} Abrir avaliação no Google Formulários</a>`:`<button class="btn btn-primary exam-btn" disabled>${icon('lock')} ${!ready?'Conclua as aulas para liberar':'Avaliação ainda não configurada'}</button>`}</article>
  <div class="notice-box" style="margin-top:18px"><strong>Importante:</strong> a marcação de conclusão é declarada pelo aluno e fica salva somente neste navegador. A aprovação na prova, a conferência de identidade e a emissão de certificado são processos externos a esta demonstração. Se a equipe ainda não inseriu o link do formulário, configure <code>examUrl</code> em <code>data/config.js</code>.</div>`;
}
function renderSettings(){
  return `<span class="eyebrow">${icon('settings')} SEU ESPAÇO</span><h1 class="page-title">Configurações</h1><p class="page-lede">Gerencie seu perfil, altere a aparência da plataforma e mantenha uma cópia de segurança dos seus estudos.</p>
  <div class="settings-layout"><section class="card settings-card"><span class="kicker">IDENTIFICAÇÃO</span><h3>Dados do estudante</h3><p>O nome exibido é um cadastro local, sem autenticação por senha.</p><form id="name-form"><label for="new-name">Nome completo</label><div class="input-row"><input type="text" id="new-name" value="${esc(ui.student.name)}" required maxlength="100"><button class="btn btn-primary" type="submit">Salvar nome</button></div></form><div class="detail-row">${icon('clock')} Primeiro acesso: ${fmtDate(ui.student.createdAt)}</div><button class="btn btn-secondary btn-small" type="button" data-action="logout">${icon('user')} Trocar de aluno</button></section>
  <section class="card settings-card"><span class="kicker">APARÊNCIA</span><h3>Tema da plataforma</h3><p>Escolha o contraste visual mais confortável para seus estudos.</p><div class="setting-actions"><button type="button" class="btn ${ui.preferences.theme==='dark'?'btn-primary':'btn-secondary'}" data-theme-choice="dark">${icon('moon')} Escuro</button><button type="button" class="btn ${ui.preferences.theme==='light'?'btn-primary':'btn-secondary'}" data-theme-choice="light">${icon('sun')} Claro</button></div><hr class="divider"><p>Esta preferência também fica registrada no IndexedDB.</p></section>
  <section class="card settings-card"><span class="kicker">PORTABILIDADE</span><h3>Exportar e restaurar dados</h3><p>Baixe suas anotações em PDF ou gere um JSON contendo nome, anotações, progresso e configurações para recuperar os dados neste ou em outro navegador.</p><div class="setting-actions"><button class="btn btn-primary btn-small" data-action="download-pdf">${icon('download')} Anotações em PDF</button><button class="btn btn-secondary btn-small" data-action="backup">${icon('download')} Backup JSON</button><button class="btn btn-secondary btn-small" data-action="restore">${icon('upload')} Restaurar backup</button></div><input type="file" id="restore-input" accept="application/json,.json" hidden><p style="margin-top:18px">A restauração substitui o progresso e as anotações deste perfil local.</p></section>
  <section class="card settings-card danger-zone"><span class="kicker" style="color:var(--red)">ZONA DE ATENÇÃO</span><h3>Reiniciar meus estudos</h3><p>Você pode zerar apenas as aulas concluídas, sem apagar as anotações, ou eliminar completamente este perfil e seus registros.</p><div class="setting-actions"><button class="btn btn-secondary btn-small" type="button" data-action="reset-progress">${icon('clock')} Zerar progresso</button><button class="btn btn-danger btn-small" type="button" data-action="delete-account">${icon('trash')} Apagar meus dados</button></div></section></div>
  <div class="notice-box" style="margin-top:22px"><strong>Privacidade:</strong> esta prova de conceito não envia seu nome ou suas anotações a um servidor próprio. O conteúdo dos vídeos vem do YouTube, que poderá tratar dados conforme suas políticas ao carregar o player. Apagar dados do site no navegador pode remover seu progresso.</div>`;
}
async function savePendingNotes(){
  if(ui.noteTimer){clearTimeout(ui.noteTimer);ui.noteTimer=null;}
  if(!ui.noteDraft)return;
  const draft=ui.noteDraft;ui.noteDraft=null;ui.saving=true;
  try{
    await saveNote(ui.student.id,draft.lessonId,draft.text);
    const found=ui.notes.findIndex(n=>n.lessonId===draft.lessonId);
    const record={studentId:ui.student.id,lessonId:draft.lessonId,text:draft.text,updatedAt:new Date().toISOString()};
    if(found>=0)ui.notes[found]=record;else ui.notes.push(record);
    const status=$('#save-status');if(status&&ui.selectedLessonId===draft.lessonId)status.textContent='Salvo localmente';
  }catch(error){ui.noteDraft=draft;toast('Erro ao salvar anotação: '+error.message,true);throw error;}
  finally{ui.saving=false;}
}
async function changeView(view){
  if(!['dashboard','lesson','notes','exam','settings'].includes(view))return;
  try{await savePendingNotes();}catch{return;}
  ui.view=view;if(view==='lesson')ui.openModules.add(ALL_LESSONS.find(l=>l.id===ui.selectedLessonId)?.moduleId);
  closeMobile();render();window.scrollTo({top:0,behavior:'auto'});
}
async function openLesson(id){
  const lesson=ALL_LESSONS.find(l=>l.id===id);if(!lesson)return;
  try{await savePendingNotes();}catch{return;}
  ui.selectedLessonId=id;ui.view='lesson';ui.preferences.lastLessonId=id;ui.openModules.add(lesson.moduleId);
  savePreferences(ui.preferences).catch(err=>toast(err.message,true));
  closeMobile();render();window.scrollTo({top:0,behavior:'auto'});
}
async function completeLesson(){
  const id=ui.selectedLessonId,done=statusId(id);
  try{
    await savePendingNotes();await toggleLesson(ui.student.id,id,done);
    ui.progress=await getProgress(ui.student.id);
    const c=counts();if(c.completed===c.total&&!ui.courseState.completedAt){ui.courseState.completedAt=new Date().toISOString();}
    else if(c.completed<c.total)ui.courseState.completedAt=null;
    await setCourseState(ui.courseState);
    render();toast(done?'Aula marcada como pendente.':'Aula concluída! Progresso atualizado.');
  }catch(err){toast(err.message,true);}
}
async function downloadPdf(){try{await savePendingNotes();const n=exportNotesPdf(ui.student,ui.notes);toast(`PDF gerado com ${n} ${n===1?'aula anotada':'aulas anotadas'}.`);}catch(err){toast('Não foi possível gerar o PDF: '+err.message,true);}}
async function backup(){try{await savePendingNotes();const data=await createBackup(ui.student);downloadTextFile(`backup-matematica-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(data,null,2));toast('Backup JSON baixado. Guarde-o em local seguro.');}catch(err){toast(err.message,true);}}
async function confirmAction(title,message,button='Confirmar'){
  const dlg=$('#confirm-dialog');$('#confirm-title').textContent=title;$('#confirm-description').textContent=message;$('#confirm-accept').textContent=button;
  return new Promise(resolve=>{dlg.addEventListener('close',()=>resolve(dlg.returnValue==='confirm'),{once:true});dlg.showModal();});
}
async function doAction(action){
  if(action==='toggle-complete')return completeLesson();
  if(action==='download-pdf')return downloadPdf();
  if(action==='print-notes'){try{await savePendingNotes();window.print();}catch{}return;}
  if(action==='backup')return backup();
  if(action==='restore'){$('#restore-input')?.click();return;}
  if(action==='logout'){
    try{await savePendingNotes();}catch{return;}
    try{localStorage.removeItem(SESSION_KEY);}catch{}
    ui.student=null;ui.view='dashboard';closeMobile();showWelcome();return;
  }
  if(action==='reset-progress'){
    if(!await confirmAction('Zerar progresso?','Todas as aulas voltarão ao estado pendente. Suas anotações serão preservadas.','Zerar progresso'))return;
    try{await savePendingNotes();await resetProgress(ui.student.id);await refresh();render();toast('Progresso reiniciado. Suas anotações continuam salvas.');}catch(err){toast(err.message,true);}return;
  }
  if(action==='delete-account'){
    if(!await confirmAction('Excluir todos os dados?','O perfil atual, as anotações, o progresso e as preferências serão apagados deste navegador. Esta ação não pode ser desfeita sem um backup.','Excluir dados'))return;
    try{await savePendingNotes();await deleteStudentData(ui.student.id);try{localStorage.removeItem(SESSION_KEY);}catch{}ui.student=null;showWelcome();toast('Dados locais excluídos.');}catch(err){toast(err.message,true);}return;
  }
}
function closeMobile(){$('#sidebar').classList.remove('show');$('#mobile-scrim').classList.remove('show');}
async function onClick(event){
  const themeButton=event.target.closest('#theme-toggle');if(themeButton){if(ui.preferences){ui.preferences.theme=ui.preferences.theme==='dark'?'light':'dark';theme(ui.preferences.theme);savePreferences(ui.preferences).then(render).catch(err=>toast(err.message,true));}return;}
  if(event.target.closest('#profile-shortcut')){await changeView('settings');return;}
  if(event.target.closest('#menu-toggle')){$('#sidebar').classList.toggle('show');$('#mobile-scrim').classList.toggle('show');return;}
  if(event.target.closest('#mobile-scrim')){closeMobile();return;}
  const moduleBtn=event.target.closest('[data-module]');if(moduleBtn){const id=moduleBtn.dataset.module;ui.openModules.has(id)?ui.openModules.delete(id):ui.openModules.add(id);renderSidebar();return;}
  const lessonBtn=event.target.closest('[data-lesson]');if(lessonBtn&&!lessonBtn.disabled){await openLesson(lessonBtn.dataset.lesson);return;}
  const viewBtn=event.target.closest('[data-view]');if(viewBtn){await changeView(viewBtn.dataset.view);return;}
  const actionBtn=event.target.closest('[data-action]');if(actionBtn&&!actionBtn.disabled){await doAction(actionBtn.dataset.action);return;}
  const themeChoice=event.target.closest('[data-theme-choice]');if(themeChoice){ui.preferences.theme=themeChoice.dataset.themeChoice;theme(ui.preferences.theme);try{await savePreferences(ui.preferences);render();}catch(err){toast(err.message,true);}return;}
}
async function onSubmit(event){
  if(event.target.id==='login-form'){
    event.preventDefault();const btn=event.target.querySelector('button[type=submit]');btn.disabled=true;$('#login-error').textContent='';
    try{const student=await loginStudent($('#login-name').value);await activateStudent(student);toast('Boas-vindas ao seu ambiente de estudos!');}
    catch(err){$('#login-error').textContent=err.message||'Falha no cadastro local.';}finally{btn.disabled=false;}
    return;
  }
  if(event.target.id==='name-form'){
    event.preventDefault();try{const name=validateName($('#new-name').value);ui.student=await renameStudent(ui.student,name);render();toast('Nome atualizado com sucesso.');}catch(err){toast(err.message,true);}
  }
}
async function onInput(event){
  if(event.target.id==='lesson-notes'){
    const text=event.target.value,lessonId=ui.selectedLessonId;
    ui.noteDraft={lessonId,text};$('#save-status').textContent='Salvando…';clearTimeout(ui.noteTimer);
    ui.noteTimer=setTimeout(()=>{savePendingNotes().catch(()=>{});},700);
  }
}
async function onFile(event){
  if(event.target.id!=='restore-input')return;
  const input=event.target,file=input.files?.[0];if(!file)return;
  try{
    if(file.size>2*1024*1024)throw new Error('Backup excede 2 MB.');
    const backup=JSON.parse(await file.text());
    if(!await confirmAction('Restaurar backup?','As anotações e o progresso atuais serão substituídos pelos dados do arquivo. O nome do perfil local continuará o mesmo.','Restaurar dados'))return;
    await savePendingNotes();await restoreBackup(ui.student,backup);await refresh();ui.selectedLessonId=ui.preferences.lastLessonId||ALL_LESSONS[0].id;ui.view='dashboard';render();toast('Backup restaurado com sucesso.');
  }catch(err){toast('Erro ao restaurar: '+err.message,true);}finally{input.value='';}
}
async function boot(){
  document.addEventListener('click',e=>{onClick(e).catch(err=>toast(err.message,true));});
  document.addEventListener('submit',e=>{onSubmit(e).catch(err=>toast(err.message,true));});
  document.addEventListener('input',onInput);
  document.addEventListener('change',e=>{onFile(e).catch(err=>toast(err.message,true));});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&ui.noteDraft)savePendingNotes().catch(()=>{});});
  try{
    await prepareDatabase();let id;try{id=localStorage.getItem(SESSION_KEY);}catch{}
    const student=id?await getStudent(id):null;
    if(student)await activateStudent(student);else showWelcome();
  }catch(err){showWelcome();$('#login-error').textContent='Não foi possível preparar o armazenamento local: '+err.message;}
}
boot();
