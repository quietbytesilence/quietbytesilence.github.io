document.addEventListener('DOMContentLoaded', function () {
  var botao = document.querySelector('.nav__alterna');
  var caixa = document.querySelector('.nav__caixa');
  if (!botao || !caixa) return;
  botao.addEventListener('click', function () {
    var aberto = caixa.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
});
