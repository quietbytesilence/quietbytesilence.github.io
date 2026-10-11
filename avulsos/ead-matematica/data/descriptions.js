// Material AUTORAL demonstrativo, independente das descrições dos vídeos.
// Para editar, mantenha o ID da aula e altere summary, objectives, content e activity.
export const DESCRIPTIONS = {
  'MAT-M01-A01': {
    summary:'Os conjuntos numéricos organizam diferentes tipos de números e esclarecem quais operações fazem sentido em cada contexto.',
    objectives:['Distinguir números naturais, inteiros, racionais, irracionais e reais.','Reconhecer relações de inclusão entre conjuntos.','Classificar números apresentados como decimais, frações ou radicais.'],
    content:['Os naturais (ℕ) aparecem na contagem; os inteiros (ℤ) incluem os negativos; os racionais (ℚ) podem ser escritos como uma fração de inteiros com denominador diferente de zero.','Os irracionais apresentam expansão decimal infinita e não periódica, como √2. Racionais e irracionais formam os números reais (ℝ).','A sequência ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ajuda a interpretar que todo natural também é inteiro, racional e real.'],
    activity:'Classifique −7, 0, 3/4, √2 e 2,5 nos conjuntos a que pertencem.'
  },
  'MAT-M01-A02': {
    summary:'Frações representam partes de um todo, divisões e razões entre grandezas. Suas operações exigem atenção ao denominador.',
    objectives:['Interpretar numerador e denominador.','Somar e subtrair frações com denominadores diferentes.','Multiplicar, dividir e simplificar frações.'],
    content:['Frações equivalentes representam a mesma quantidade: 1/2 = 2/4. Para somar frações, use um denominador comum antes de adicionar os numeradores.','Na multiplicação, multiplique numeradores entre si e denominadores entre si. Na divisão, multiplique pela fração inversa do divisor, que não pode ser zero.','Simplificar consiste em dividir numerador e denominador por um mesmo divisor comum diferente de zero.'],
    activity:'Resolva 2/3 + 1/4 e 3/5 ÷ 2/7, simplificando os resultados.'
  },
  'MAT-M01-A03': {
    summary:'A potenciação sintetiza multiplicações repetidas e a radiciação permite encontrar números cujas potências resultam em valores conhecidos.',
    objectives:['Interpretar base e expoente.','Aplicar propriedades das potências.','Relacionar potências e raízes em ℝ.'],
    content:['Em aⁿ, a é a base e n é o expoente. Para expoentes inteiros positivos, aⁿ representa n fatores iguais a a. Se a ≠ 0, a⁰ = 1.','Potências com a mesma base obedecem a aᵐ · aⁿ = aᵐ⁺ⁿ e aᵐ/aⁿ = aᵐ⁻ⁿ, desde que a ≠ 0 na divisão.','√a designa a raiz quadrada principal, que é não negativa quando a ≥ 0. Por exemplo, √49 = 7, enquanto a equação x² = 49 tem duas soluções: ±7.'],
    activity:'Calcule 2⁵, 3² · 3³, √81 e a solução real de x² = 16.'
  },
  'MAT-M02-A04': {
    summary:'A álgebra representa padrões com letras e permite reorganizar expressões utilizando propriedades das operações.',
    objectives:['Reconhecer termos e variáveis algébricas.','Expandir o quadrado da soma e da diferença.','Aplicar o produto da soma pela diferença.'],
    content:['Uma expressão algébrica combina números, operações e variáveis. Produtos notáveis são identidades frequentes que facilitam cálculos e fatorações.','As identidades principais são (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b² e (a+b)(a−b) = a²−b².','Evite o erro de afirmar que (a+b)² = a²+b²: o termo 2ab faz parte do desenvolvimento.'],
    activity:'Expanda (x+4)² e fatorize x²−25.'
  },
  'MAT-M02-A05': {
    summary:'Equações do primeiro grau traduzem relações de igualdade e permitem determinar valores desconhecidos.',
    objectives:['Identificar incógnita e termos de uma equação.','Aplicar operações equivalentes nos dois membros.','Verificar a solução por substituição.'],
    content:['Uma equação do primeiro grau em x pode ser escrita como ax+b=0, com a ≠ 0. Isolar a incógnita requer preservar a igualdade.','Se somarmos, subtrairmos, multiplicarmos ou dividirmos os dois lados pelo mesmo valor (não nulo para divisão), a igualdade é preservada.','Exemplo: 3x+5=17 ⇒ 3x=12 ⇒ x=4. Verificação: 3·4+5=17.'],
    activity:'Resolva 5x−8=2x+7 e confira o valor encontrado.'
  },
  'MAT-M02-A06': {
    summary:'Equações quadráticas incluem um termo x² e podem ter duas, uma ou nenhuma raiz real.',
    objectives:['Identificar coeficientes a, b e c.','Calcular discriminante e raízes reais.','Interpretar o número de raízes conforme Δ.'],
    content:['Na forma ax²+bx+c=0, com a ≠ 0, o discriminante é Δ=b²−4ac. A fórmula de Bhaskara fornece x=(−b±√Δ)/(2a), quando Δ≥0 para raízes reais.','Se Δ>0, há duas raízes reais distintas; se Δ=0, uma raiz real dupla; se Δ<0, não há raízes reais.','Exemplo: x²−5x+6=0 tem raízes 2 e 3, que também podem ser encontradas por fatoração.'],
    activity:'Encontre as raízes reais de x²−4x−5=0.'
  },
  'MAT-M03-A07': {
    summary:'Funções descrevem correspondências: cada elemento do domínio associa-se a exatamente um elemento do contradomínio.',
    objectives:['Distinguir domínio, contradomínio e imagem.','Ler a notação f(x).','Representar funções em tabelas e pares ordenados.'],
    content:['Uma função f:A→B atribui a cada elemento x de A um único valor f(x) em B. O conjunto A é seu domínio; B é o contradomínio; a imagem contém os valores efetivamente atingidos.','Por exemplo, f(x)=2x+1 transforma a entrada 3 em saída 7. Os pares (x,f(x)) podem ser representados no plano cartesiano.','Uma mesma saída pode corresponder a entradas diferentes; o que não pode ocorrer é uma entrada possuir duas saídas distintas na mesma função.'],
    activity:'Para f(x)=x² e domínio {−2,−1,0,1,2}, escreva a imagem e os cinco pares ordenados.'
  },
  'MAT-M03-A08': {
    summary:'Funções afins modelam relações com taxa de variação constante e produzem gráficos em linha reta.',
    objectives:['Reconhecer f(x)=ax+b.','Interpretar coeficientes angular e linear.','Localizar a raiz da função e construir seu gráfico.'],
    content:['Uma função afim tem forma f(x)=ax+b. O coeficiente a representa a taxa de variação; b é a ordenada na origem. Seu gráfico é uma reta, que será horizontal se a=0.','Para a ≠ 0, a raiz da função é x=−b/a. A função é crescente se a>0 e decrescente se a<0.','Exemplo: f(x)=2x−6 possui taxa de variação 2, intercepta o eixo y em −6 e zera em x=3.'],
    activity:'Construa uma tabela de três pontos e esboce o gráfico de f(x)=−x+4.'
  },
  'MAT-M03-A09': {
    summary:'Uma função quadrática varia de maneira não linear e apresenta gráfico parabólico, com vértice e possíveis zeros.',
    objectives:['Reconhecer o formato f(x)=ax²+bx+c.','Relacionar concavidade ao sinal de a.','Interpretar vértice, raízes e intercepto no eixo y.'],
    content:['Uma função quadrática tem a forma f(x)=ax²+bx+c, com a ≠ 0. Seu gráfico é uma parábola voltada para cima quando a>0 e para baixo quando a<0.','O vértice tem abscissa xv=−b/(2a). A ordenada é yv=f(xv). As raízes reais, quando existem, são os pontos onde o gráfico cruza ou toca o eixo x.','Exemplo: f(x)=x²−4x+3 tem raízes 1 e 3 e vértice em (2,−1).'],
    activity:'Encontre o vértice e as raízes de f(x)=x²−6x+8.'
  },
  'MAT-M04-A10': {
    summary:'A geometria plana estuda figuras bidimensionais, seus lados, ângulos, perímetros e áreas.',
    objectives:['Identificar elementos de polígonos e tipos de ângulos.','Calcular perímetros somando comprimentos.','Usar fórmulas básicas de área.'],
    content:['Polígonos são figuras planas fechadas formadas por segmentos de reta. O perímetro é o comprimento total do contorno; área mede a superfície interna da região.','No retângulo, A=base·altura; no triângulo, A=base·altura/2; no trapézio, A=(base maior+base menor)·altura/2. As áreas são expressas em unidades quadradas.','O vídeo apresenta uma introdução aos polígonos; os cálculos de área são complementados especificamente por este texto didático.'],
    activity:'Calcule a área de um triângulo com base 12 cm e altura 7 cm. Diferencie área de perímetro.'
  },
  'MAT-M04-A11': {
    summary:'O teorema de Pitágoras relaciona os três lados de um triângulo retângulo.',
    objectives:['Reconhecer hipotenusa e catetos.','Aplicar a igualdade a²=b²+c².','Resolver problemas com distâncias e diagonais.'],
    content:['Em todo triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos: h²=c₁²+c₂².','A hipotenusa é sempre o lado oposto ao ângulo de 90° e o maior lado do triângulo. O trio 3, 4 e 5 é um exemplo: 3²+4²=5².','Uma diagonal de um retângulo de lados 6 cm e 8 cm mede √(36+64)=10 cm.'],
    activity:'Uma escada de 13 m apoia-se numa parede com a base a 5 m dela. A que altura ela chega?' 
  },
  'MAT-M04-A12': {
    summary:'As razões trigonométricas relacionam ângulos agudos aos comprimentos dos lados de um triângulo retângulo.',
    objectives:['Localizar cateto oposto, adjacente e hipotenusa.','Calcular seno, cosseno e tangente.','Aplicar relações trigonométricas em medidas indiretas.'],
    content:['Para um ângulo agudo θ: sen θ = cateto oposto/hipotenusa; cos θ = cateto adjacente/hipotenusa; tg θ = cateto oposto/cateto adjacente.','Essas razões dependem do ângulo considerado, por isso oposto e adjacente trocam de papel quando se troca o ângulo de referência.','Com ângulo de 30°, o seno vale 1/2. Um segmento de 10 m inclinado a 30° forma altura vertical de 5 m.'],
    activity:'Num triângulo retângulo com catetos 6 e 8 e hipotenusa 10, calcule seno e cosseno do ângulo oposto ao cateto 6.'
  },
  'MAT-M05-A13': {
    summary:'Tabelas e gráficos organizam dados e facilitam comparações, identificação de tendências e comunicação de resultados.',
    objectives:['Interpretar títulos, eixos, unidades e legendas.','Diferenciar gráficos de barras, linhas e setores.','Evitar interpretações enganosas das escalas.'],
    content:['Tabelas apresentam dados em linhas e colunas. Gráficos transformam quantidades em representações visuais, mas devem preservar escala e contexto.','Gráficos de barras favorecem comparação entre categorias; gráficos de linhas ajudam a acompanhar variações ao longo do tempo; gráficos de setores mostram partes de um total.','Antes de concluir, confirme se o eixo começa em zero, quais são as unidades, a população pesquisada e o período analisado.'],
    activity:'Escolha um gráfico para comparar vendas em cinco lojas e outro para acompanhar temperatura por hora. Justifique.'
  },
  'MAT-M05-A14': {
    summary:'Medidas de tendência central resumem os dados por meio de valores representativos.',
    objectives:['Calcular média aritmética simples.','Identificar mediana em uma lista ordenada.','Reconhecer moda e conjuntos multimodais.'],
    content:['A média é a soma dos valores dividida pelo número de observações. A mediana é o valor central de dados ordenados; com quantidade par, calcula-se a média dos dois termos centrais.','A moda é o valor de maior frequência. Um conjunto pode não ter moda única, ou ter mais de uma moda.','Em {2,3,3,6,11}, a média é 5, a mediana é 3 e a moda é 3. Um valor extremo pode afetar fortemente a média.'],
    activity:'Para {4,4,7,8,12}, calcule média, mediana e moda.'
  },
  'MAT-M05-A15': {
    summary:'Probabilidade mede a chance de ocorrer um evento em um experimento aleatório.',
    objectives:['Distinguir experimento, espaço amostral e evento.','Calcular probabilidades em espaços equiprováveis.','Converter resultados entre fração, decimal e porcentagem.'],
    content:['O espaço amostral reúne todos os resultados possíveis. Um evento é um subconjunto desses resultados. Em situações equiprováveis, P(A)=número de resultados favoráveis/número de resultados possíveis.','Ao lançar um dado honesto de seis faces, a chance de sair um número par é 3/6=1/2=50%. Para eventos impossíveis, P=0; para eventos certos, P=1.','A fórmula simples de contagem exige resultados igualmente prováveis. Caso contrário, é necessário considerar as probabilidades individuais.'],
    activity:'Uma urna contém 5 bolas vermelhas e 3 azuis, indistinguíveis ao toque. Qual é a chance de retirar uma bola azul?'
  },
};
