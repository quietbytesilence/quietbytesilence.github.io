# Matemática Essencial — AVA estático para GitHub Pages

Projeto demonstrativo de Educação a Distância, construído com **HTML, CSS, JavaScript ES Modules e IndexedDB**. **Sem backend, sem conta na nuvem e sem certificado automático.**

## Funcionalidades

- Identificação por nome completo (perfil **local, sem senha e sem autenticação real**).
- 5 módulos com 3 videoaulas cada, incorporadas pelo player oficial do YouTube.
- Textos didáticos próprios em arquivo separado dos links dos vídeos.
- Dois estados por aula: **pendente** e **concluída**; marcação manual reversível.
- Indicadores de progresso total e por módulo.
- Editor de notas por aula com salvamento automático no IndexedDB.
- Página **Minhas anotações** e botão **Baixar minhas anotações** em todas as aulas, exportando PDF diretamente, sem bibliotecas externas.
- Alternativa **Imprimir caderno**, útil para símbolos/idiomas que não sejam cobertos pelo PDF simples em Helvetica.
- Backup JSON com progresso e notas, restauração e remoção dos dados do perfil.
- Tema claro/escuro e layout adaptado ao celular.
- Avaliação final externa no Google Forms, liberada depois que todas as aulas forem marcadas concluídas.

## Publicação no GitHub Pages

1. Extraia o ZIP e envie **o conteúdo da pasta `ead-matematica`** para a raiz do repositório GitHub (ou use a pasta `docs/` se essa for sua opção de publicação).
2. No GitHub, abra **Settings → Pages → Build and deployment** e selecione **Deploy from a branch**, a branch e a pasta escolhida.
3. Aguarde a publicação e abra a URL do Pages. O aplicativo deve ser acessado via **https://** ou servidor HTTP local; `file://` não carrega módulos ES JavaScript corretamente nos navegadores.
4. Para testar localmente, no diretório do projeto execute `python3 -m http.server 8000` e abra `http://localhost:8000/`.

## Editar o curso sem alterar a interface

| Arquivo | O que alterar |
| --- | --- |
| `data/course.js` | Módulos, títulos, ordem e identificadores de aulas. |
| `data/videos.js` | ID do vídeo do YouTube, nome do canal e título original. |
| `data/descriptions.js` | Resumos autorais, objetivos, textos e proposta de exercício. |
| `data/config.js` | Nome do curso, versão, endereço da prova e contato opcional. |

**Importante:** mantenha o `id` da aula estável se quiser preservar as notas e o progresso quando editar uma aula. Cada ID do curso deve ter um registro correspondente nos arquivos de vídeos e descrições. Ao atualizar o conteúdo publicado, aumente `courseVersion` em `data/config.js` para atualizar o cache do IndexedDB.

## Google Formulários

Edite `data/config.js`, por exemplo:

```js
examUrl: 'https://docs.google.com/forms/d/e/SEU_ID_REAL/viewform',
```

Substitua o endereço pelo **link verdadeiro publicado** pela equipe. O valor inicial é vazio intencionalmente: nenhum link de prova inexistente foi inventado. O botão permanecerá indisponível até que o link seja configurado e que todas as aulas sejam concluídas.

**Não há integração automática de notas:** as respostas do Google Forms ficam no Forms/Sheets, sob gestão da equipe. Não confie na marcação local de conclusão como prova de presença ou de visualização integral do vídeo. A identidade também não é validada pelo nome digitado.

## Persistência local e privacidade

O IndexedDB é individual por **origem/site e perfil de navegador**: dispositivos, navegadores ou perfis diferentes não compartilham dados. Apagar o armazenamento do site pode apagar os registros. Recomendamos fazer um backup JSON antes de trocar de dispositivo ou limpar o navegador. O JSON contém dados pessoais e deve ser armazenado com cuidado.

O sistema permite múltiplos nomes diferentes no mesmo navegador, sem senha e sem privacidade entre pessoas com acesso a esse navegador. Para aplicação institucional real com validação de identidade, será necessária autenticação e armazenamento central confiável (o que não faz parte desta prova de conceito estática).

O carregamento do iframe do YouTube requer internet e pode estar sujeito à permissão de incorporação definida pelo dono do vídeo, bloqueios regionais ou configuração do navegador. Por isso há um link para abrir cada vídeo diretamente no YouTube. Usamos `youtube-nocookie.com` para o player incorporado, mas isso não elimina todos os tratamentos de dados pelo YouTube.

## PDF de anotações

O PDF é criado 100% em JavaScript, com paginação A4, títulos de aula, identificação do estudante e as anotações preenchidas. Utiliza Helvetica com codificação WinAnsi: letras portuguesas comuns e sinais básicos são suportados, mas alguns símbolos matemáticos/alfabetos/emojis podem aparecer como `?` no PDF. Para preservar esses símbolos, use **Minhas anotações → Imprimir caderno** e selecione **Salvar como PDF** no navegador.

## Vídeos selecionados e atribuição

A seleção inicial usa aulas públicas de **Gis com Giz Matemática**, **Professor Ferretto**, **XMath**, **Toda a Matemática** e **Curso Enem Gratuito**. Links/IDs estão integralmente editáveis em `data/videos.js`. A plataforma incorpora as aulas, não copia os arquivos de vídeo; cada criador mantém seus direitos e controles de incorporação. Antes de uso institucional definitivo, a equipe deve conferir a disponibilidade e a autorização de incorporação de cada vídeo.

## Estrutura

```
index.html
css/style.css, themes.css, print.css
js/app.js       # controle das telas, navegação e eventos
js/db.js        # IndexedDB e validações
js/export.js    # exportação direta em PDF e JSON
data/course.js  # módulos e aulas
data/videos.js  # IDs/atribuições YouTube
data/descriptions.js # textos e propostas pedagógicas
data/config.js  # curso e avaliação
assets/         # logotipo e ícone
.nojekyll
```

## Cuidados de produção

Este é um projeto **demonstrativo**. Não armazena as respostas da prova, não comprova a visualização dos vídeos, não envia dados acadêmicos à universidade e não emite certificados. Tais recursos exigem infraestrutura e regras de validação adicionais.
