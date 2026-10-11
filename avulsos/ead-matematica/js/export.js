// Gerador de PDF autossuficiente, sem CDN. Usa Helvetica/WinAnsi (caracteres latinos);
// para símbolos matemáticos e emoji avançados, há também a opção de impressão do navegador.
import { CONFIG } from '../data/config.js';
import { ALL_LESSONS } from '../data/course.js';

function latin(str){
  const map={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};
  return Array.from(String(str).normalize('NFC')).map(char=>{
    const code=char.charCodeAt(0);if(code>=32&&code<=126||code>=160&&code<=255)return String.fromCharCode(code);
    if(char==='\t')return '    ';if(char==='\n')return '\n';if(char==='\r')return '';
    return String.fromCharCode(map[char]??63);
  }).join('');
}
const escPdf=s=>s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
const utfFilename=name=>name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();

export function downloadTextFile(filename,content,mime='application/json'){
  const url=URL.createObjectURL(new Blob([content],{type:mime+';charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function exportNotesPdf(student,notes){
  const lessonNotes=ALL_LESSONS.map(l=>({...l,note:notes.find(n=>n.lessonId===l.id)?.text?.trim()||''})).filter(l=>l.note);
  const W=595.28,H=841.89,M=54;
  const cmds=[];let pages=[];let y=H-M;
  function start(){pages.push([]);y=H-M;}
  function add(s){pages[pages.length-1].push(s);}
  function color(rgb){return rgb.map(v=>(v/255).toFixed(3)).join(' ');}
  function write(text,x,yPos,size=11,bold=false,rgb=[28,42,67]){
    add(`BT /${bold?'F2':'F1'} ${size} Tf ${color(rgb)} rg 1 0 0 1 ${x.toFixed(2)} ${yPos.toFixed(2)} Tm (${escPdf(latin(text))}) Tj ET`);
  }
  function line(x1,yy,x2,rgb=[219,227,236]){add(`${color(rgb)} RG 0.7 w ${x1} ${yy.toFixed(2)} m ${x2} ${yy.toFixed(2)} l S`);}
  function ensure(space){if(y-space<M+22){start();write(CONFIG.courseName,M,H-M,9,true,[100,116,139]);y-=32;}}
  function split(text,maxChars){
    const lines=[];for(const para of String(text).replace(/\r/g,'').split('\n')){
      if(!para.trim()){lines.push('');continue;}
      let current='';for(const word of para.split(/\s+/)){
        // quebras de palavras sem espaços (URLs longas)
        const parts=word.match(new RegExp(`.{1,${maxChars}}`,'g'))||[''];
        for(const part of parts){if(current.length+part.length+1>maxChars&&current){lines.push(current);current='';}current+=(current?' ':'')+part;}
      }lines.push(current);
    }return lines;
  }
  function paragraph(text,{size=10.5,gap=15,indent=0,maxChars=93}={}){
    for(const ln of split(text,maxChars)){ensure(gap);if(ln)write(ln,M+indent,y,size);y-=gap;}
  }
  start();write('CADERNO DE ANOTAÇÕES',M,y,21,true,[27,49,82]);y-=28;
  write(CONFIG.courseName+'  |  '+CONFIG.courseSubtitle,M,y,10,false,[92,110,134]);y-=22;
  line(M,y,W-M);y-=28;
  write('Estudante:',M,y,10,true);write(student.name,M+76,y,10);y-=20;
  write('Exportado em:',M,y,10,true);write(new Date().toLocaleDateString('pt-BR'),M+90,y,10);y-=20;
  write('Aulas com anotações:',M,y,10,true);write(String(lessonNotes.length),M+130,y,10);y-=35;
  if(!lessonNotes.length){paragraph('Nenhuma anotação foi registrada até o momento.');}
  let moduleId='';
  for(const l of lessonNotes){
    if(moduleId!==l.moduleId){ensure(65);moduleId=l.moduleId;line(M,y,W-M);y-=21;write(l.moduleTitle.toUpperCase(),M,y,12,true,[50,92,153]);y-=25;}
    ensure(54);write(`AULA ${String(l.number).padStart(2,'0')} - ${l.title}`,M,y,11,true,[28,42,67]);y-=24;
    paragraph(l.note,{size:10.5,gap:16,maxChars:89});y-=18;
  }
  // Footer e contagem das páginas
  const total=pages.length;pages.forEach((content,index)=>{
    content.push(`BT /F1 8 Tf 0.42 0.49 0.59 rg 1 0 0 1 ${M} 28 Tm (${escPdf(latin('Gerado localmente - '+CONFIG.courseName))}) Tj ET`);
    content.push(`BT /F1 8 Tf 0.42 0.49 0.59 rg 1 0 0 1 ${W-104} 28 Tm (${index+1} / ${total}) Tj ET`);
  });
  // Montagem PDF-1.4 com tabela xref consistente.
  const objects=[''];const addObj=body=>{objects.push(body);return objects.length-1;};
  const catalog=addObj('');const pageTree=addObj('');const font=addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');const fontB=addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const pageRefs=[];
  for(const content of pages){const stream=content.join('\n');const streamId=addObj(`<< /Length ${latin(stream).length} >>\nstream\n${stream}\nendstream`);const pageId=addObj(`<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font} 0 R /F2 ${fontB} 0 R >> >> /Contents ${streamId} 0 R >>`);pageRefs.push(pageId);}
  objects[catalog]=`<< /Type /Catalog /Pages ${pageTree} 0 R >>`;objects[pageTree]=`<< /Type /Pages /Kids [${pageRefs.map(n=>n+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;
  let raw='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n',offsets=[0];
  for(let i=1;i<objects.length;i++){offsets[i]=raw.length;raw+=`${i} 0 obj\n${latin(objects[i])}\nendobj\n`;}
  const xref=raw.length;raw+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for(let i=1;i<objects.length;i++)raw+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
  raw+=`trailer\n<< /Size ${objects.length} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes=Uint8Array.from(raw,ch=>ch.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
  const a=document.createElement('a');a.href=url;a.download=`anotacoes-${utfFilename(student.name)||'aluno'}.pdf`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  return lessonNotes.length;
}
