// header.js
document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <header>
                <div class="container">
                    <div class="logo">
                        <h1>AMRQP</h1>
                        <p>Residencial Quinta dos Paricás</p>
                    </div>
                    <nav>
                        <ul>
                            <li><a href="index.html">Início</a></li>
                            <li><a href="about.html">Sobre Nós</a></li>
                            <li><a href="projetos.html">Projetos e Ações</a></li>
                            <li><a href="cursos.html">Cursos</a></li>
                            <li><a href="noticias.html">Notícias</a></li>
                            <li><a href="galeria.html">Galeria</a></li>
                            <li><a href="contato.html">Contato</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }
});