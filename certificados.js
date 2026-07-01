window.certificados = {
    "A1B2C3D4E5": {
        nome: "Gustavo Cícero",
        curso: "Matemática Aplicada",
        carga: 40,
        data: "15/10/2020"
    },
    "484ac9381b925a55f201e3fcc035ced2": {
        nome: "Maria Silva",
        curso: "Data Science",
        carga: 60,
        data: "15/11/2025"
    }
};

window.adicionarCertificado = function(codigo, nome, curso, carga, data) {
    if (!codigo || !nome || !curso || !carga || !data) {
        return { sucesso: false, mensagem: "Todos os campos são obrigatórios." };
    }
    if (window.certificados[codigo]) {
        return { sucesso: false, mensagem: "Já existe um certificado com este código." };
    }
    window.certificados[codigo] = {
        nome: nome,
        curso: curso,
        carga: Number(carga),
        data: data
    };
    return { sucesso: true, mensagem: "Certificado adicionado com sucesso!" };
};

window.removerCertificado = function(codigo) {
    if (!window.certificados[codigo]) {
        return { sucesso: false, mensagem: "Certificado não encontrado." };
    }
    delete window.certificados[codigo];
    return { sucesso: true, mensagem: "Certificado removido com sucesso!" };
};

window.listarCertificados = function() {
    return Object.entries(window.certificados).map(function(entry) {
        return {
            codigo: entry[0],
            nome: entry[1].nome,
            curso: entry[1].curso,
            carga: entry[1].carga,
            data: entry[1].data
        };
    });
};
