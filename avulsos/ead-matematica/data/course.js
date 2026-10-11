// Identificadores de módulo e aula devem permanecer estáveis ao editar nomes/textos.
// Para acrescentar conteúdo, adicione uma aula aqui e entradas com o mesmo id em videos.js e descriptions.js.
export const MODULES = [
  { id: 'M01', title: 'Fundamentos da Matemática', subtitle: 'Os alicerces dos números e das operações', lessons: [
    { id: 'MAT-M01-A01', title: 'Conjuntos numéricos' },
    { id: 'MAT-M01-A02', title: 'Frações e operações fundamentais' },
    { id: 'MAT-M01-A03', title: 'Potenciação e radiciação' },
  ]},
  { id: 'M02', title: 'Álgebra Elementar', subtitle: 'Linguagem algébrica e resolução de equações', lessons: [
    { id: 'MAT-M02-A04', title: 'Expressões algébricas e produtos notáveis' },
    { id: 'MAT-M02-A05', title: 'Equações do primeiro grau' },
    { id: 'MAT-M02-A06', title: 'Equações do segundo grau' },
  ]},
  { id: 'M03', title: 'Funções', subtitle: 'Relações, modelos e gráficos', lessons: [
    { id: 'MAT-M03-A07', title: 'Conceito de função e representações' },
    { id: 'MAT-M03-A08', title: 'Função afim' },
    { id: 'MAT-M03-A09', title: 'Função quadrática' },
  ]},
  { id: 'M04', title: 'Geometria e Trigonometria', subtitle: 'Formas, medidas e triângulos', lessons: [
    { id: 'MAT-M04-A10', title: 'Ângulos, polígonos e áreas' },
    { id: 'MAT-M04-A11', title: 'Teorema de Pitágoras' },
    { id: 'MAT-M04-A12', title: 'Trigonometria no triângulo retângulo' },
  ]},
  { id: 'M05', title: 'Estatística e Probabilidade', subtitle: 'Ler, sintetizar e interpretar dados', lessons: [
    { id: 'MAT-M05-A13', title: 'Leitura de tabelas e gráficos' },
    { id: 'MAT-M05-A14', title: 'Média, mediana e moda' },
    { id: 'MAT-M05-A15', title: 'Introdução à probabilidade' },
  ]},
];
export const ALL_LESSONS = MODULES.flatMap((module, moduleIndex) => module.lessons.map((lesson, index) => ({...lesson, moduleId:module.id, moduleTitle:module.title, moduleIndex, number:MODULES.slice(0,moduleIndex).reduce((n,m)=>n+m.lessons.length,0)+index+1})));
