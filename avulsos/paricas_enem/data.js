
// ============================================
// Pré-Enem Quinta dos Paricás - Dados do Curso
// ============================================
// Estrutura: Array de cursos, cada um com aulas e arquivos
// Tipos aceitos: "PDF", "Vídeo", "Site", "Imagem"

const cursos = [
    {
        titulo: "Matemática Básica",
        aulas: [
            {
                titulo: "Aula 1: Propriedades de Potência - 11/04/2026",
                arquivos: [
                    { tipo: "PDF", link: "https://d23vy2bv3rsfba.cloudfront.net/biblioteca/768392_e6bc65d78d4ae557b39d88d54b6fb7f6_potenciacao.pdf" },
                    { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=WNG0UkUSoWY" },
                    { tipo: "Site", link: "https://www.todamateria.com.br/propriedades-da-potenciacao/" }
                ]
            },
            {
                titulo: "Aula 2: Teoria dos Conjuntos - 18/04/2026",
                arquivos: [
                    { tipo: "Site", link: "https://www.todamateria.com.br/teoria-dos-conjuntos/" },
                    { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=fYgpWCyE74k" },
                    { tipo: "PDF", link: "https://docs.ufpr.br/~eidam/2016/1/MA11/MA11%20-%20N%C3%BAmeros%20e%20Fun%C3%A7%C3%B5es%20Reais.pdf" }
                ]
            },
            {
                titulo: "Aula 3: Operações com Conjuntos - 25/04/2026",
                arquivos: [
                    {tipo:"Site", link: "https://www.todamateria.com.br/operacoes-com-conjuntos/"},
                    { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=zMtWXhNl324" },
                    { tipo: "PDF", link: "https://vali.qconcursos.com/odin/topics/25959b86-bb89-440a-96f0-b889b0f4c666.pdf" }
                ]
            },
            ,

        


// FIM DO ARRAY CURSO MATEMÁTICA BÁSICA
        ]
    },

    {
            titulo: "Funções e Equações",
            aulas: [
                {
                titulo: "Aula 4: Funções - 02/05/2026",
                arquivos: [
                    {tipo:"Site", link: "https://www.todamateria.com.br/funcao/"},
                    { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=KbvcwmMnv7c" },
                    { tipo: "PDF", link: "https://dee.ufs.br/uploads/page_attach/path/6048/Material_Did_tico_de_Apoio_-_Fun__es.pdf" }
                 ]
                },
                {
                    titulo: "Aula 4: Função Afim - 16/05/2026",
                    arquivos: [
                        {tipo:"Site", link: "https://www.todamateria.com.br/funcao-afim/"},
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=eTf2g3Sx8cE" },
                        { tipo: "PDF", link: "https://pat.educacao.ba.gov.br/storage/conteudos/conteudos-digitais/download/20868.85853.pdf" }
                  ]
                },
                {
                    titulo: "Aula 5: Relação e Função - 16/05/2026",
                    arquivos: [
                        {tipo:"Site", link: "https://www.todamateria.com.br/funcao/"},
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=295AGZeVA6E" },
                        { tipo: "PDF", link: "https://www.ifmg.edu.br/conselheirolafaiete/noticias/anexos-noticias/alexandre-1-ano-nocoes-basicas-sobre-funcoes.pdf" }
                  ]
                },
                {
                    titulo: "Aula 7: Função Quadrática - 23/05/2026",
                    arquivos: [
                        {tipo:"Site", link: "https://www.todamateria.com.br/funcao-quadratica/"},
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=mX3Xeq4QEyQ" },
                        { tipo: "PDF", link: "https://www.ufs.br/uploads/page_attach/path/8506/Fun__o_de_2__grau.pdf" }
                  ]
                },
                {
                    titulo: "Aula 8: Relações de Girard e Funções Exponenciais - 30/05/2026",
                    arquivos: [
                        {tipo:"Site", link: "https://cursinhoparamedicina.com.br/blog/matematica/relacoes-de-girard/"},
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=PiKwsSRwtxs" },
                        { tipo: "PDF", link: "https://www.ufs.br/uploads/page_attach/path/8506/Fun__o_de_2__grau.pdf" },
                        {tipo:"Site", link: "https://www.todamateria.com.br/funcao-exponencial/"},//
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=9F53vF_TV78" },
                        { tipo: "PDF", link: "https://docs.ufpr.br/~fernando.avila/sem2-2016/lista-exp.pdf" }
                  ]
                },
                {
                    titulo: "Aula 9 Parte 1: Revisão Propriedades de Potência - 06/06/2026",
                    arquivos: [
                        { tipo: "PDF", link: "https://d23vy2bv3rsfba.cloudfront.net/biblioteca/768392_e6bc65d78d4ae557b39d88d54b6fb7f6_potenciacao.pdf" },
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=WNG0UkUSoWY" },
                        { tipo: "Site", link: "https://www.todamateria.com.br/propriedades-da-potenciacao/" }
                  ]
                },
                {
                    titulo: "Aula 9 Parte 2: Equações Exponenciais - 06/06/2026",
                    arquivos: [
                        {tipo:"Site", link: "https://www.todamateria.com.br/equacao-exponencial/"},
                        { tipo: "Vídeo", link: "https://www.youtube.com/watch?v=jbdsry6XjMM" },
                        { tipo: "Site", link: "https://pt.khanacademy.org/math/2-serie-em-mat-sp/x308dd140681488ca:1-bimestre-2026/x308dd140681488ca:equacoes-exponenciais/e/resolva-as-equacoes-exponenciais" }
                  ]
                },

// FIM DO ARRAY FUNÇÕES E EQUAÇÕES                
            ]
        },

    
// FIM DO ARRAY GERAL    
];
/*
{
        titulo: "Matemática Básica",
        aulas: [
            {
                titulo: "Aula 1: Conjuntos Numéricos",
                arquivos: [
                    { tipo: "PDF", link: "https://exemplo.com/conjuntos.pdf" },
                    { tipo: "Vídeo", link: "https://youtube.com/watch?v=conjuntos123" },
                    { tipo: "Site", link: "https://brasilescola.uol.com.br/matematica/conjuntos-numericos.htm" }
                ]
            },
            {
                titulo: "Aula 2: Operações Fundamentais",
                arquivos: [
                    { tipo: "PDF", link: "https://exemplo.com/operacoes.pdf" },
                    { tipo: "Imagem", link: "https://exemplo.com/tabela-operacoes.png" }
                ]
            }
        ]
    },
*/