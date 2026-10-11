// Camada de persistência local. O IndexedDB não sincroniza dispositivos.
import { CONFIG } from '../data/config.js';
import { ALL_LESSONS, MODULES } from '../data/course.js';
import { VIDEOS } from '../data/videos.js';
import { DESCRIPTIONS } from '../data/descriptions.js';

const DB_NAME='matematica-essencial-db';
const DB_VERSION=1;
let databasePromise;

export function normalizeName(value){return String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');}
export function cleanFullName(value){return String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ');}
export function validateName(raw){
  const name=cleanFullName(raw);
  if(name.length<5 || name.length>100 || name.split(' ').length<2)throw new Error('Informe nome e sobrenome (5 a 100 caracteres).');
  if(!/^[\p{L}\p{M}][\p{L}\p{M}\p{Zs}'’-]*$/u.test(name))throw new Error('Use apenas letras, espaços, apóstrofo ou hífen no nome.');
  return name;
}
const asPromise=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||new Error('Falha na leitura do banco local.'));});
function connection(){
  if(!databasePromise)databasePromise=new Promise((resolve,reject)=>{
    if(!('indexedDB'in window)){reject(new Error('Seu navegador não oferece IndexedDB.'));return;}
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      const students=db.createObjectStore('students',{keyPath:'id'});students.createIndex('normalizedName','normalizedName',{unique:true});
      db.createObjectStore('progress',{keyPath:['studentId','lessonId']});
      db.createObjectStore('notes',{keyPath:['studentId','lessonId']});
      db.createObjectStore('preferences',{keyPath:'studentId'});
      db.createObjectStore('courseState',{keyPath:'studentId'});
      db.createObjectStore('courseCache',{keyPath:'courseId'});
    };
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();databasePromise=undefined;};resolve(db);};
    request.onerror=()=>reject(request.error||new Error('Falha ao abrir o banco local.'));
    request.onblocked=()=>reject(new Error('Feche outras abas deste site para atualizar o banco local.'));
  });
  return databasePromise;
}
function transactionDone(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('Erro ao gravar dados.'));tx.onabort=()=>reject(tx.error||new Error('Operação interrompida.'));});}
async function readOne(storeName,key){const db=await connection();const tx=db.transaction(storeName,'readonly');return asPromise(tx.objectStore(storeName).get(key));}
async function putOne(storeName,record){const db=await connection();const tx=db.transaction(storeName,'readwrite');tx.objectStore(storeName).put(record);await transactionDone(tx);}
async function getAll(storeName){const db=await connection();const tx=db.transaction(storeName,'readonly');return asPromise(tx.objectStore(storeName).getAll());}
export async function prepareDatabase(){
  await connection();
  const cached=await readOne('courseCache',CONFIG.courseId);
  if(cached?.version!==CONFIG.courseVersion){
    await putOne('courseCache',{courseId:CONFIG.courseId,version:CONFIG.courseVersion,modules:MODULES,videos:VIDEOS,descriptions:DESCRIPTIONS,savedAt:new Date().toISOString()});
  }
}
export async function findStudentByName(raw){const db=await connection();const tx=db.transaction('students','readonly');return asPromise(tx.objectStore('students').index('normalizedName').get(normalizeName(raw)));}
export async function getStudent(id){return readOne('students',id);}
export async function loginStudent(raw){
  const name=validateName(raw);
  const existing=await findStudentByName(name);
  if(existing)return existing;
  const student={id:crypto.randomUUID(),name,normalizedName:normalizeName(name),createdAt:new Date().toISOString()};
  const db=await connection();const tx=db.transaction(['students','preferences','courseState'],'readwrite');
  tx.objectStore('students').add(student);
  tx.objectStore('preferences').put({studentId:student.id,theme:'dark',lastLessonId:ALL_LESSONS[0]?.id||null});
  tx.objectStore('courseState').put({studentId:student.id,startedAt:student.createdAt,completedAt:null});
  await transactionDone(tx);return student;
}
export async function renameStudent(student,newName){
  const name=validateName(newName);const normalizedName=normalizeName(name);
  const duplicate=await findStudentByName(name);
  if(duplicate&&duplicate.id!==student.id)throw new Error('Já existe um perfil local com esse nome.');
  const updated={...student,name,normalizedName};await putOne('students',updated);return updated;
}
export async function getPreferences(id){return await readOne('preferences',id)||{studentId:id,theme:'dark',lastLessonId:ALL_LESSONS[0]?.id||null};}
export async function savePreferences(preferences){await putOne('preferences',preferences);}
export async function getCourseState(id){return await readOne('courseState',id)||{studentId:id,startedAt:new Date().toISOString(),completedAt:null};}
export async function setCourseState(state){await putOne('courseState',state);}
export async function getProgress(studentId){return (await getAll('progress')).filter(record=>record.studentId===studentId);}
export async function toggleLesson(studentId,lessonId,currentlyDone){
  if(!ALL_LESSONS.some(l=>l.id===lessonId))throw new Error('Aula inválida.');
  const db=await connection();const tx=db.transaction('progress','readwrite');const store=tx.objectStore('progress');
  if(currentlyDone)store.delete([studentId,lessonId]);
  else store.put({studentId,lessonId,completedAt:new Date().toISOString()});
  await transactionDone(tx);
}
export async function getNotes(studentId){return (await getAll('notes')).filter(record=>record.studentId===studentId);}
export async function saveNote(studentId,lessonId,text){
  if(!ALL_LESSONS.some(l=>l.id===lessonId))throw new Error('Aula inválida.');
  if(typeof text!=='string'||text.length>20000)throw new Error('Cada anotação pode ter até 20.000 caracteres.');
  await putOne('notes',{studentId,lessonId,text,updatedAt:new Date().toISOString()});
}
export async function resetProgress(studentId){
  const db=await connection();const tx=db.transaction(['progress','courseState'],'readwrite');
  const rows=await asPromise(tx.objectStore('progress').getAll());
  for(const row of rows){if(row.studentId===studentId)tx.objectStore('progress').delete([studentId,row.lessonId]);}
  tx.objectStore('courseState').put({studentId,startedAt:new Date().toISOString(),completedAt:null});
  await transactionDone(tx);
}
export async function deleteStudentData(studentId){
  const db=await connection();const tx=db.transaction(['students','progress','notes','preferences','courseState'],'readwrite');
  for(const name of ['progress','notes']){
    const store=tx.objectStore(name);const records=await asPromise(store.getAll());
    for(const row of records)if(row.studentId===studentId)store.delete([studentId,row.lessonId]);
  }
  for(const name of ['students','preferences','courseState'])tx.objectStore(name).delete(studentId);
  await transactionDone(tx);
}
export async function createBackup(student){
  const [progress,notes,preferences,state]=await Promise.all([getProgress(student.id),getNotes(student.id),getPreferences(student.id),getCourseState(student.id)]);
  return {format:'matematica-essencial-backup',schemaVersion:1,courseId:CONFIG.courseId,exportedAt:new Date().toISOString(),student:{name:student.name,createdAt:student.createdAt},progress:progress.map(({lessonId,completedAt})=>({lessonId,completedAt})),notes:notes.map(({lessonId,text,updatedAt})=>({lessonId,text,updatedAt})),preferences:{theme:preferences.theme,lastLessonId:preferences.lastLessonId},courseState:{startedAt:state.startedAt,completedAt:state.completedAt}};
}
export async function restoreBackup(student,backup){
  if(!backup||backup.format!=='matematica-essencial-backup'||backup.schemaVersion!==1||backup.courseId!==CONFIG.courseId)throw new Error('Arquivo de backup inválido ou de outro curso.');
  if(!Array.isArray(backup.progress)||!Array.isArray(backup.notes)||backup.progress.length>ALL_LESSONS.length||backup.notes.length>ALL_LESSONS.length)throw new Error('Listas do backup inválidas.');
  const ids=new Set(ALL_LESSONS.map(l=>l.id));
  const pSet=new Set(),nSet=new Set();
  for(const p of backup.progress){if(!p||!ids.has(p.lessonId)||pSet.has(p.lessonId))throw new Error('Registro de progresso inválido no backup.');pSet.add(p.lessonId);}
  for(const n of backup.notes){if(!n||!ids.has(n.lessonId)||nSet.has(n.lessonId)||typeof n.text!=='string'||n.text.length>20000)throw new Error('Anotação inválida no backup.');nSet.add(n.lessonId);}
  const db=await connection();const tx=db.transaction(['progress','notes','preferences','courseState'],'readwrite');
  for(const name of ['progress','notes']){
    const store=tx.objectStore(name),rows=await asPromise(store.getAll());
    for(const row of rows)if(row.studentId===student.id)store.delete([student.id,row.lessonId]);
  }
  const stamp=new Date().toISOString();
  for(const row of backup.progress)tx.objectStore('progress').put({studentId:student.id,lessonId:row.lessonId,completedAt:validDate(row.completedAt,stamp)});
  for(const row of backup.notes)tx.objectStore('notes').put({studentId:student.id,lessonId:row.lessonId,text:row.text,updatedAt:validDate(row.updatedAt,stamp)});
  tx.objectStore('preferences').put({studentId:student.id,theme:backup.preferences?.theme==='light'?'light':'dark',lastLessonId:ids.has(backup.preferences?.lastLessonId)?backup.preferences.lastLessonId:ALL_LESSONS[0].id});
  tx.objectStore('courseState').put({studentId:student.id,startedAt:validDate(backup.courseState?.startedAt,stamp),completedAt:pSet.size===ALL_LESSONS.length?validDate(backup.courseState?.completedAt,stamp):null});
  await transactionDone(tx);
}
function validDate(value,fallback){return typeof value==='string'&&!Number.isNaN(Date.parse(value))?new Date(value).toISOString():fallback;}
