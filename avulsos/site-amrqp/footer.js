
// footer.js
document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer>
                <div class="container">
                    <p>Associação dos Moradores do Residencial Quinta dos Paricás - AMQP</p>
                    <p>Rua dos Ipês, 123 - Residencial Quinta dos Paricás<br>Funcionamento: Seg a Sex, das 14h às 18h</p>
                    <p>📞 (XX) XXXX-XXXX | 📧 contato@quintadosparkas.org.br</p>
                    <div class="social-icons">
                        <a href="#" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                    <p style="margin-top: 2rem; font-size: 0.9rem;">&copy; 2026 AMQP. Todos os direitos reservados.</p>
                </div>
            </footer>
        `;
    }
});