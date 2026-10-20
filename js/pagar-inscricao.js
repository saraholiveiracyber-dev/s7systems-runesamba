
/* =========================================================
   RUN & SAMBA 2026
   CONSULTA DE INSCRIÇÃO E PAGAMENTO
   CPF + SUPABASE + IZY
========================================================= */

const SUPABASE_URL =
    "https://tqezxxobxsipjjuyydvc.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_Yt-DyfGqRqfbPN6aPgLM5w_K2RIneDd";

const IZY_PAYMENT_URL =
    "https://eventos.izypass.com.br/share/run-and-samba-2-edicao_luziania_20-11-2026";


/* =========================================================
   CONEXÃO SUPABASE
========================================================= */

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formConsulta");
    const cpf = document.getElementById("cpf");
    const btnConsultar = document.getElementById("btnConsultar");
    const mensagem = document.getElementById("mensagem");
    const resultado = document.getElementById("resultado");

    const resultadoNome = document.getElementById("resultadoNome");
    const resultadoCPF = document.getElementById("resultadoCPF");
    const resultadoPercurso = document.getElementById("resultadoPercurso");
    const resultadoCamiseta = document.getElementById("resultadoCamiseta");
    const resultadoValor = document.getElementById("resultadoValor");
    const resultadoStatus = document.getElementById("resultadoStatus");

    const btnPagamento = document.getElementById("btnPagamento");
    const statusPagamento = document.getElementById("statusPagamento");


    /* =====================================================
       VERIFICAR ELEMENTOS
    ===================================================== */

    if (!form || !cpf) {
        console.error(
            "Formulário ou campo CPF não encontrado."
        );
        return;
    }


    /* =====================================================
       CPF
    ===================================================== */

    function limparCPF(valor) {
        return String(valor || "")
            .replace(/\D/g, "")
            .substring(0, 11);
    }


    function formatarCPF(valor) {

        const numero = limparCPF(valor);

        if (numero.length <= 3) {
            return numero;
        }

        if (numero.length <= 6) {
            return numero.replace(
                /^(\d{3})(\d{1,3})$/,
                "$1.$2"
            );
        }

        if (numero.length <= 9) {
            return numero.replace(
                /^(\d{3})(\d{3})(\d{1,3})$/,
                "$1.$2.$3"
            );
        }

        return numero.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
            "$1.$2.$3-$4"
        );
    }


    /* =====================================================
       VALIDAR CPF
    ===================================================== */

    function cpfValido(valor) {

        const numero = limparCPF(valor);

        if (numero.length !== 11) {
            return false;
        }

        if (/^(\d)\1{10}$/.test(numero)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += Number(numero[i]) * (10 - i);
        }

        let resto = soma % 11;

        const digito1 = resto < 2 ? 0 : 11 - resto;

        if (digito1 !== Number(numero[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(numero[i]) * (11 - i);
        }

        resto = soma % 11;

        const digito2 = resto < 2 ? 0 : 11 - resto;

        return digito2 === Number(numero[10]);
    }


    /* =====================================================
       MENSAGENS
    ===================================================== */

    function mostrarMensagem(texto, tipo = "erro") {

        if (!mensagem) {
            alert(texto);
            return;
        }

        mensagem.textContent = texto;
        mensagem.className = "mensagem " + tipo;
        mensagem.style.display = "block";
    }


    function limparMensagem() {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = "";
        mensagem.className = "mensagem";
        mensagem.style.display = "none";
    }


    /* =====================================================
       ESCONDER RESULTADO
    ===================================================== */

    function esconderResultado() {

        if (!resultado) {
            return;
        }

        resultado.hidden = true;
        resultado.style.display = "none";
    }


    /* =====================================================
       NORMALIZAR STATUS
    ===================================================== */

    function normalizarStatus(valor) {

        return String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");
    }


    /* =====================================================
       CONSULTAR CPF E STATUS NO SUPABASE

       Coluna de pagamento: status_pagamento
    ===================================================== */

    async function consultarCPF(cpfInformado) {

        const cpfLimpo = limparCPF(cpfInformado);

        const { data, error } = await db
            .from("inscricoes")
            .select(`
                id,
                nome,
                cpf,
                percurso,
                camiseta,
                status_pagamento
            `)
            .eq("cpf", cpfLimpo)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error(
                "Erro ao consultar Supabase:",
                error
            );

            throw error;
        }

        return data || null;
    }


    /* =====================================================
       MOSTRAR INSCRIÇÃO
    ===================================================== */

    function mostrarInscricao(inscricao) {

        /*
           Lê o status da coluna correta.
        */

        const status = normalizarStatus(
            inscricao.status_pagamento
        );

        const estaPago = status === "PAGO";

        const eCortesia = [
            "CORTESIA",
            "CORTESIA_CONFIRMADA",
            "ISENTO",
            "ISENTA",
            "GRATUITO",
            "GRATUITA",
            "GRATUIDADE"
        ].includes(status);

        const estaCancelado = [
            "CANCELADO",
            "CANCELADA"
        ].includes(status);

        const estaPendente = [
            "PENDENTE",
            "AGUARDANDO_PAGAMENTO",
            "AGUARDANDO",
            "EM_ABERTO"
        ].includes(status);


        /* Determinar apresentação */

        let textoStatus;
        let textoMensagem;
        let classeStatus;

        if (estaPago) {

            textoStatus = "PAGO";
            textoMensagem = "Seu pagamento foi confirmado!";
            classeStatus = "status-pago";

        } else if (eCortesia) {

            textoStatus = "CORTESIA";
            textoMensagem = "Sua inscrição está confirmada como cortesia. Você não precisa realizar pagamento.";
            classeStatus = "status-pago";

        } else if (estaCancelado) {

            textoStatus = "CANCELADO";
            textoMensagem = "Sua inscrição está cancelada. Entre em contato com a organização.";
            classeStatus = "status-cancelado";

        } else if (estaPendente) {

            textoStatus = "AGUARDANDO PAGAMENTO";
            textoMensagem = "Sua inscrição foi encontrada. O pagamento ainda está pendente.";
            classeStatus = "status-pendente";

        } else {

            textoStatus = status || "STATUS NÃO INFORMADO";
            textoMensagem = "Inscrição encontrada, mas o status do pagamento precisa ser confirmado com a organização.";
            classeStatus = "status-pendente";
        }


        /* Nome */

        if (resultadoNome) {
            resultadoNome.textContent =
                inscricao.nome || "Participante";
        }


        /* CPF */

        if (resultadoCPF) {
            resultadoCPF.textContent = formatarCPF(
                inscricao.cpf || cpf.value
            );
        }


        /* Percurso */

        if (resultadoPercurso) {
            resultadoPercurso.textContent =
                inscricao.percurso || "—";
        }


        /* Camiseta */

        if (resultadoCamiseta) {
            resultadoCamiseta.textContent =
                inscricao.camiseta || "—";
        }


        /* Valor */

        if (resultadoValor) {
            resultadoValor.textContent =
                eCortesia ? "CORTESIA" : "R$ 89,90";
        }


        /* Status principal */

        if (resultadoStatus) {

            resultadoStatus.textContent = textoStatus;

            resultadoStatus.classList.remove(
                "status-pago",
                "status-pendente",
                "status-cancelado"
            );

            resultadoStatus.classList.add(classeStatus);
        }


        /* Mensagem complementar */

        if (statusPagamento) {

            statusPagamento.textContent = textoMensagem;

            statusPagamento.classList.remove(
                "status-pago",
                "status-pendente",
                "status-cancelado"
            );

            statusPagamento.classList.add(classeStatus);
        }


        /* Botão de pagamento */

        if (btnPagamento) {

            const podePagar =
                estaPendente;

            btnPagamento.href = IZY_PAYMENT_URL;
            btnPagamento.target = "_blank";
            btnPagamento.rel = "noopener noreferrer";

            btnPagamento.style.display =
                podePagar ? "flex" : "none";
        }


        /* Exibir resultado */

        if (resultado) {

            resultado.hidden = false;
            resultado.style.display = "block";

            resultado.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }


        /* Exibir mensagem */

        mostrarMensagem(
            textoMensagem,
            estaPago || eCortesia ? "sucesso" :
            estaCancelado ? "erro" :
            estaPendente ? "sucesso" : "erro"
        );
    }


    /* =====================================================
       MÁSCARA CPF
    ===================================================== */

    cpf.addEventListener("input", () => {

        cpf.value = formatarCPF(cpf.value);

        esconderResultado();
        limparMensagem();
    });


    /* =====================================================
       CONSULTAR INSCRIÇÃO
    ===================================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        limparMensagem();
        esconderResultado();

        const cpfLimpo = limparCPF(cpf.value);


        /* CPF incompleto */

        if (cpfLimpo.length !== 11) {

            mostrarMensagem(
                "Digite o CPF completo.",
                "erro"
            );

            cpf.focus();
            return;
        }


        /* CPF inválido */

        if (!cpfValido(cpfLimpo)) {

            mostrarMensagem(
                "Digite um CPF válido.",
                "erro"
            );

            cpf.focus();
            return;
        }


        /* Carregamento */

        if (btnConsultar) {

            btnConsultar.disabled = true;

            const span = btnConsultar.querySelector("span");

            if (span) {
                span.textContent = "CONSULTANDO...";
            }
        }


        try {

            const inscricao = await consultarCPF(cpfLimpo);

            if (!inscricao) {

                mostrarMensagem(
                    "CPF não encontrado. Verifique o número informado.",
                    "erro"
                );

                return;
            }

            mostrarInscricao(inscricao);

        } catch (erro) {

            console.error(
                "Erro ao consultar inscrição:",
                erro
            );

            mostrarMensagem(
                "Não foi possível consultar sua inscrição. Tente novamente.",
                "erro"
            );

        } finally {

            if (btnConsultar) {

                btnConsultar.disabled = false;

                const span = btnConsultar.querySelector("span");

                if (span) {
                    span.textContent = "CONSULTAR INSCRIÇÃO";
                }
            }
        }
    });


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    cpf.value = formatarCPF(cpf.value);

    esconderResultado();

    console.log(
        "Run & Samba 2026: consulta de CPF inicializada."
    );

    console.log(
        "Consulta de pagamento utiliza a coluna status_pagamento."
    );

});
