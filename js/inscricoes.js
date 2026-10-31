
"use strict";

/* =========================================================
   RUN & SAMBA 2026
   SISTEMA DE INSCRIÇÕES
   SUPABASE + IZY + EMBAIXADORES
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const SUPABASE_URL =
    "https://tqezxxobxsipjjuyydvc.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_Yt-DyfGqRqfbPN6aPgLM5w_K2RIneDd";

const IZY_PAYMENT_URL =
    "https://eventos.izypass.com.br/share/run-and-samba-2-edicao_luziania_20-11-2026";

const CHAVE_EMBAIXADOR =
    "runSambaCodigoEmbaixador";


/* =========================================================
   INICIALIZAR SUPABASE
========================================================= */

let db = null;

if (window.supabase?.createClient) {

    db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

} else {

    console.error(
        "Supabase não foi carregado. Verifique o CDN no HTML."
    );

}


/* =========================================================
   RASTREAMENTO DE EMBAIXADORES
========================================================= */

/*
   Exemplo de link:

   inscricoes.html?embaixador=SARAH01

   O código fica salvo na sessão do navegador.
*/

function capturarCodigoEmbaixador() {

    try {

        const parametros = new URLSearchParams(
            window.location.search
        );

        const codigoURL = (
            parametros.get("embaixador") || ""
        ).trim().toUpperCase();

        if (!codigoURL) {
            return;
        }

        if (!/^[A-Z0-9_-]{3,30}$/.test(codigoURL)) {

            console.warn(
                "Código de embaixador com formato inválido."
            );

            return;
        }

        sessionStorage.setItem(
            CHAVE_EMBAIXADOR,
            codigoURL
        );

        console.log(
            "Código de indicação identificado:",
            codigoURL
        );

    } catch (erro) {

        console.error(
            "Não foi possível guardar o código de indicação:",
            erro
        );

    }
}


function obterCodigoEmbaixador() {

    try {

        return (
            sessionStorage.getItem(CHAVE_EMBAIXADOR) || ""
        ).trim().toUpperCase();

    } catch (erro) {

        console.error(
            "Erro ao recuperar código de indicação:",
            erro
        );

        return "";

    }

}


function limparCodigoEmbaixador() {

    try {

        sessionStorage.removeItem(
            CHAVE_EMBAIXADOR
        );

    } catch (erro) {

        console.error(
            "Erro ao limpar código de indicação:",
            erro
        );

    }

}


/* Capturar o código assim que o arquivo carregar */
capturarCodigoEmbaixador();


/* =========================================================
   INICIALIZAÇÃO DA PÁGINA
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Run & Samba — sistema de inscrições carregado."
    );


    /* =====================================================
       ELEMENTOS DO FORMULÁRIO
    ===================================================== */

    const form =
        document.getElementById("form-inscricao");

    const nome =
        document.getElementById("nome");

    const cpf =
        document.getElementById("cpf");

    const nascimento =
        document.getElementById("nascimento");

    const email =
        document.getElementById("email");

    const telefone =
        document.getElementById("telefone");

    const sexo =
        document.getElementById("sexo");

    const aceiteTermo =
        document.getElementById("aceiteTermo");

    const mensagem =
        document.getElementById("mensagem-formulario");

    const botao =
        document.getElementById("btnContinuar");


    /* =====================================================
       VERIFICAR FORMULÁRIO
    ===================================================== */

    if (!form) {

        console.error(
            "Formulário #form-inscricao não encontrado."
        );

        return;

    }


    /* =====================================================
       MENSAGENS
    ===================================================== */

    function mostrarMensagem(
        texto,
        tipo = "erro"
    ) {

        if (!mensagem) {

            alert(texto);

            return;

        }

        mensagem.textContent = texto;

        mensagem.className =
            `mensagem-formulario ${tipo}`;

        mensagem.style.display = "block";

    }


    function limparMensagem() {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = "";

        mensagem.className =
            "mensagem-formulario";

        mensagem.style.display = "none";

    }


    /* =====================================================
       SOMENTE NÚMEROS
    ===================================================== */

    function somenteNumeros(valor) {

        return String(valor || "")
            .replace(/\D/g, "");

    }


    /* =====================================================
       CONTAGEM REGRESSIVA
       EVENTO: 20/11/2026
    ===================================================== */

    const dataEvento = new Date(
        2026,
        10,
        20,
        0,
        0,
        0
    ).getTime();

    const elementoDias =
        document.getElementById("countdownDays");

    const elementoHoras =
        document.getElementById("countdownHours");

    const elementoMinutos =
        document.getElementById("countdownMinutes");

    const elementoSegundos =
        document.getElementById("countdownSeconds");


    function atualizarContagem() {

        const diferenca =
            dataEvento - Date.now();

        if (diferenca <= 0) {

            if (elementoDias) {
                elementoDias.textContent = "000";
            }

            if (elementoHoras) {
                elementoHoras.textContent = "00";
            }

            if (elementoMinutos) {
                elementoMinutos.textContent = "00";
            }

            if (elementoSegundos) {
                elementoSegundos.textContent = "00";
            }

            return;

        }

        const dias = Math.floor(
            diferenca / (1000 * 60 * 60 * 24)
        );

        const horas = Math.floor(
            (diferenca / (1000 * 60 * 60)) % 24
        );

        const minutos = Math.floor(
            (diferenca / (1000 * 60)) % 60
        );

        const segundos = Math.floor(
            (diferenca / 1000) % 60
        );

        if (elementoDias) {
            elementoDias.textContent =
                String(dias).padStart(3, "0");
        }

        if (elementoHoras) {
            elementoHoras.textContent =
                String(horas).padStart(2, "0");
        }

        if (elementoMinutos) {
            elementoMinutos.textContent =
                String(minutos).padStart(2, "0");
        }

        if (elementoSegundos) {
            elementoSegundos.textContent =
                String(segundos).padStart(2, "0");
        }

    }


    atualizarContagem();

    setInterval(
        atualizarContagem,
        1000
    );


    /* =====================================================
       ESTILO DOS CAMPOS
       FUNDO ESCURO + TEXTO BRANCO
    ===================================================== */

    const camposTexto = document.querySelectorAll(
        "#form-inscricao input:not([type='radio']):not([type='checkbox']):not([type='submit']):not([type='button']), " +
        "#form-inscricao textarea, " +
        "#form-inscricao select"
    );


    function aplicarEstiloCampos() {

        camposTexto.forEach((campo) => {

            campo.style.setProperty(
                "background-color",
                "#171717",
                "important"
            );

            campo.style.setProperty(
                "color",
                "#ffffff",
                "important"
            );

            campo.style.setProperty(
                "-webkit-text-fill-color",
                "#ffffff",
                "important"
            );

            campo.style.setProperty(
                "caret-color",
                "#ffffff",
                "important"
            );

            campo.style.setProperty(
                "border-color",
                "#444444",
                "important"
            );

            campo.style.setProperty(
                "color-scheme",
                "dark"
            );

        });

    }


    aplicarEstiloCampos();


    camposTexto.forEach((campo) => {

        campo.addEventListener(
            "input",
            aplicarEstiloCampos
        );

        campo.addEventListener(
            "focus",
            () => {

                campo.style.setProperty(
                    "background-color",
                    "#171717",
                    "important"
                );

                campo.style.setProperty(
                    "color",
                    "#ffffff",
                    "important"
                );

                campo.style.setProperty(
                    "-webkit-text-fill-color",
                    "#ffffff",
                    "important"
                );

            }
        );

    });


    /* =====================================================
       RESUMO DA INSCRIÇÃO
    ===================================================== */

    const resumoNome =
        document.getElementById("resumo-nome");

    const resumoPercurso =
        document.getElementById("resumo-percurso");

    const resumoCamiseta =
        document.getElementById("resumo-camiseta");

    const resumoValor =
        document.getElementById("resumo-valor");


    /* =====================================================
       CPF — MÁSCARA
    ===================================================== */

    cpf?.addEventListener("input", () => {

        let valor = somenteNumeros(cpf.value)
            .substring(0, 11);

        if (valor.length > 9) {

            valor = valor.replace(
                /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
                "$1.$2.$3-$4"
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /^(\d{3})(\d{3})(\d{1,3})$/,
                "$1.$2.$3"
            );

        } else if (valor.length > 3) {

            valor = valor.replace(
                /^(\d{3})(\d{1,3})$/,
                "$1.$2"
            );

        }

        cpf.value = valor;

        limparMensagem();

    });


    /* =====================================================
       NASCIMENTO — MÁSCARA
    ===================================================== */

    nascimento?.addEventListener("input", () => {

        let valor = somenteNumeros(nascimento.value)
            .substring(0, 8);

        if (valor.length > 4) {

            valor = valor.replace(
                /^(\d{2})(\d{2})(\d{1,4})$/,
                "$1/$2/$3"
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /^(\d{2})(\d{1,2})$/,
                "$1/$2"
            );

        }

        nascimento.value = valor;

    });


    /* =====================================================
       TELEFONE — MÁSCARA
    ===================================================== */

    telefone?.addEventListener("input", () => {

        let valor = somenteNumeros(telefone.value)
            .substring(0, 11);

        if (valor.length > 10) {

            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{1,4})$/,
                "($1) $2-$3"
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{1,4})$/,
                "($1) $2-$3"
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /^(\d{2})(\d{1,5})$/,
                "($1) $2"
            );

        }

        telefone.value = valor;

    });


    /* =====================================================
       CPF — VALIDAÇÃO
    ===================================================== */

    function cpfValido(valor) {

        const numero = somenteNumeros(valor);

        if (numero.length !== 11) {
            return false;
        }

        if (/^(\d)\1{10}$/.test(numero)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {

            soma +=
                Number(numero[i]) * (10 - i);

        }

        let resto = soma % 11;

        const digito1 =
            resto < 2 ? 0 : 11 - resto;

        if (digito1 !== Number(numero[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {

            soma +=
                Number(numero[i]) * (11 - i);

        }

        resto = soma % 11;

        const digito2 =
            resto < 2 ? 0 : 11 - resto;

        return (
            digito2 === Number(numero[10])
        );

    }


    /* =====================================================
       NASCIMENTO — VALIDAÇÃO
    ===================================================== */

    function dataValida(data) {

        const partes = data.split("/");

        if (partes.length !== 3) {
            return false;
        }

        const dia = Number(partes[0]);

        const mes = Number(partes[1]);

        const ano = Number(partes[2]);

        if (
            !dia ||
            !mes ||
            !ano ||
            ano < 1900 ||
            mes < 1 ||
            mes > 12
        ) {

            return false;

        }

        const dataObj = new Date(
            ano,
            mes - 1,
            dia
        );

        const dataCorreta = (
            dataObj.getFullYear() === ano &&
            dataObj.getMonth() === mes - 1 &&
            dataObj.getDate() === dia
        );

        if (!dataCorreta) {
            return false;
        }

        return dataObj <= new Date();

    }


    /* =====================================================
       NASCIMENTO — CONVERSÃO PARA SUPABASE
    ===================================================== */

    function converterData(data) {

        const partes = data.split("/");

        if (partes.length !== 3) {
            return null;
        }

        const dia = partes[0];

        const mes = partes[1];

        const ano = partes[2];

        return `${ano}-${mes}-${dia}`;

    }


    /* =====================================================
       PERCURSO
    ===================================================== */

    function obterPercurso() {

        return document.querySelector(
            'input[name="percurso"]:checked'
        );

    }


    /* =====================================================
       CAMISETA
    ===================================================== */

    function obterCamiseta() {

        return document.querySelector(
            'input[name="camiseta"]:checked'
        );

    }


    /* =====================================================
       VALOR DO PERCURSO
    ===================================================== */

    function obterValorPercurso(percurso) {

        if (!percurso) {
            return 0;
        }

        const valor = percurso.dataset.valor;

        if (!valor) {
            return 0;
        }

        const numero = Number(
            String(valor)
                .replace("R$", "")
                .replace(/\s/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
        );

        return Number.isFinite(numero)
            ? numero
            : 0;

    }


    /* =====================================================
       FORMATAR VALOR
    ===================================================== */

    function formatarValor(valor) {

        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    /* =====================================================
       ATUALIZAR RESUMO
    ===================================================== */

    function atualizarResumo() {

        const percurso = obterPercurso();

        const camiseta = obterCamiseta();


        if (resumoNome) {

            resumoNome.textContent =
                nome?.value.trim() || "—";

        }


        if (resumoPercurso) {

            resumoPercurso.textContent =
                percurso?.value || "—";

        }


        if (resumoCamiseta) {

            resumoCamiseta.textContent =
                camiseta?.value || "—";

        }


        if (resumoValor) {

            if (!percurso) {

                resumoValor.textContent = "R$ —";

            } else {

                resumoValor.textContent =
                    formatarValor(
                        obterValorPercurso(percurso)
                    );

            }

        }

    }


    /* =====================================================
       EVENTOS DO RESUMO
    ===================================================== */

    nome?.addEventListener(
        "input",
        atualizarResumo
    );


    document
        .querySelectorAll('input[name="percurso"]')
        .forEach((item) => {

            item.addEventListener(
                "change",
                atualizarResumo
            );

        });


    document
        .querySelectorAll('input[name="camiseta"]')
        .forEach((item) => {

            item.addEventListener(
                "change",
                atualizarResumo
            );

        });


    /* =====================================================
       MODAL DO TERMO
    ===================================================== */

    const abrirTermo =
        document.getElementById("abrirTermo");

    const modalTermo =
        document.getElementById("modalTermo");

    const fecharTermo =
        document.getElementById("fecharTermo");

    const fecharTermoBtn =
        document.getElementById("fecharTermoBtn");

    const overlay =
        document.querySelector(".modal-termo-overlay");


    function abrirModalTermo() {

        if (!modalTermo) {
            return;
        }

        modalTermo.classList.add("ativo");

        modalTermo.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

        document.body.style.overflow =
            "hidden";

    }


    function fecharModalTermo() {

        if (!modalTermo) {
            return;
        }

        modalTermo.classList.remove("ativo");

        modalTermo.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        document.body.style.overflow = "";

    }


    abrirTermo?.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            abrirModalTermo();

        }
    );


    fecharTermo?.addEventListener(
        "click",
        fecharModalTermo
    );


    fecharTermoBtn?.addEventListener(
        "click",
        fecharModalTermo
    );


    overlay?.addEventListener(
        "click",
        fecharModalTermo
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modalTermo?.classList.contains("ativo")
            ) {

                fecharModalTermo();

            }

        }
    );


    /* =====================================================
       VERIFICAR CPF NO SUPABASE
    ===================================================== */

    async function verificarCPF(cpfInformado) {

        if (!db) {
            throw new Error("Supabase não inicializado.");
        }

        const cpfLimpo =
            somenteNumeros(cpfInformado);

        const resposta = await db
            .from("inscricoes")
            .select("id")
            .eq("cpf", cpfLimpo)
            .limit(1);

        if (resposta.error) {

            console.error(
                "Erro ao consultar CPF:",
                resposta.error
            );

            throw resposta.error;

        }

        return Boolean(
            resposta.data &&
            resposta.data.length > 0
        );

    }


    /* =====================================================
       VALIDAR CÓDIGO DO EMBAIXADOR
    ===================================================== */

    async function validarCodigoEmbaixador(codigo) {

        if (!codigo) {
            return false;
        }

        if (!db) {
            throw new Error("Supabase não inicializado.");
        }

        const resposta = await db.rpc(
            "validar_codigo_embaixador",
            {
                p_codigo: codigo
            }
        );

        if (resposta.error) {

            console.error(
                "Erro ao validar embaixador:",
                resposta.error
            );

            throw resposta.error;

        }

        return resposta.data === true;

    }


    /* =====================================================
       SALVAR DADOS PARA A PÁGINA OBRIGADO
    ===================================================== */

    function salvarDadosInscricao(
        valor,
        percursoSelecionado,
        nomeParticipante
    ) {

        const valorFormatado =
            formatarValor(valor);


        localStorage.setItem(
            "valorInscricao",
            valorFormatado
        );


        localStorage.setItem(
            "valorInscricaoNumerico",
            String(valor)
        );


        localStorage.setItem(
            "percursoInscricao",
            percursoSelecionado
        );


        localStorage.setItem(
            "nomeInscricao",
            nomeParticipante
        );


        localStorage.setItem(
            "izyPaymentUrl",
            IZY_PAYMENT_URL
        );

        console.log(
            "Dados da inscrição preparados para a página de confirmação."
        );

    }


    /* =====================================================
       CONTROLE DO BOTÃO
    ===================================================== */

    function liberarBotao() {

        if (botao) {
            botao.disabled = false;
        }

        const spanBotao =
            botao?.querySelector("span");

        if (spanBotao) {

            spanBotao.textContent =
                "CONTINUAR INSCRIÇÃO";

        }

    }


    /* =====================================================
       ENVIO DO FORMULÁRIO
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            limparMensagem();


            /* ---------------------------------------------
               VALIDAR SUPABASE
            --------------------------------------------- */

            if (!db) {

                mostrarMensagem(
                    "Sistema temporariamente indisponível. Tente novamente.",
                    "erro"
                );

                return;

            }


            /* ---------------------------------------------
               VALIDAÇÃO HTML
            --------------------------------------------- */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            /* ---------------------------------------------
               VALIDAR CPF
            --------------------------------------------- */

            const cpfLimpo =
                somenteNumeros(cpf.value);

            if (!cpfValido(cpfLimpo)) {

                mostrarMensagem(
                    "Digite um CPF válido.",
                    "erro"
                );

                cpf.focus();

                return;

            }


            /* ---------------------------------------------
               VALIDAR NASCIMENTO
            --------------------------------------------- */

            if (!dataValida(nascimento.value)) {

                mostrarMensagem(
                    "Digite uma data de nascimento válida.",
                    "erro"
                );

                nascimento.focus();

                return;

            }


            /* ---------------------------------------------
               VALIDAR PERCURSO
            --------------------------------------------- */

            const percurso = obterPercurso();

            if (!percurso) {

                mostrarMensagem(
                    "Selecione um percurso.",
                    "erro"
                );

                return;

            }


            /* ---------------------------------------------
               VALIDAR CAMISETA
            --------------------------------------------- */

            const camiseta = obterCamiseta();

            if (!camiseta) {

                mostrarMensagem(
                    "Selecione o tamanho da camiseta.",
                    "erro"
                );

                return;

            }


            /* ---------------------------------------------
               VALIDAR TERMO
            --------------------------------------------- */

            if (
                !aceiteTermo ||
                !aceiteTermo.checked
            ) {

                mostrarMensagem(
                    "Você precisa aceitar o Termo de Responsabilidade.",
                    "erro"
                );

                return;

            }


            /* ---------------------------------------------
               VALIDAR VALOR
            --------------------------------------------- */

            const valor =
                obterValorPercurso(percurso);

            if (!valor || valor <= 0) {

                mostrarMensagem(
                    "Não foi possível identificar o valor do percurso.",
                    "erro"
                );

                console.error(
                    "Percurso sem valor:",
                    percurso
                );

                return;

            }


            /* =================================================
               PROCESSAMENTO
            ================================================= */

            try {

                if (botao) {
                    botao.disabled = true;
                }

                const spanBotao =
                    botao?.querySelector("span");


                /* ---------------------------------------------
                   VERIFICAR CPF
                --------------------------------------------- */

                if (spanBotao) {

                    spanBotao.textContent =
                        "VERIFICANDO CPF...";

                }

                const existe =
                    await verificarCPF(cpfLimpo);

                if (existe) {

                    mostrarMensagem(
                        "⚠️ CPF já cadastrado! Já existe uma inscrição registrada para este CPF.",
                        "erro"
                    );

                    cpf.focus();

                    liberarBotao();

                    return;

                }


                /* ---------------------------------------------
                   VALIDAR EMBAIXADOR
                --------------------------------------------- */

                const codigoEmbaixador =
                    obterCodigoEmbaixador();

                let codigoEmbaixadorValidado = null;

                if (codigoEmbaixador) {

                    if (spanBotao) {

                        spanBotao.textContent =
                            "VALIDANDO INDICAÇÃO...";

                    }

                    const codigoAtivo =
                        await validarCodigoEmbaixador(
                            codigoEmbaixador
                        );

                    if (codigoAtivo) {

                        codigoEmbaixadorValidado =
                            codigoEmbaixador;

                        console.log(
                            "Indicação validada:",
                            codigoEmbaixadorValidado
                        );

                    } else {

                        console.warn(
                            "Código de embaixador inválido ou inativo."
                        );

                        mostrarMensagem(
                            "O link de indicação não está mais ativo. Sua inscrição continuará como inscrição geral.",
                            "aviso"
                        );

                    }

                }


                /* ---------------------------------------------
                   PREPARAR CADASTRO
                --------------------------------------------- */

                if (spanBotao) {

                    spanBotao.textContent =
                        "CADASTRANDO...";

                }


                const dadosInscricao = {

                    nome:
                        nome.value.trim(),

                    cpf:
                        cpfLimpo,

                    nascimento:
                        converterData(nascimento.value),

                    email:
                        email.value.trim().toLowerCase(),

                    telefone:
                        somenteNumeros(telefone.value),

                    sexo:
                        sexo.value,

                    camiseta:
                        camiseta.value,

                    percurso:
                        percurso.value,

                    valor:
                        valor,

                    status:
                        "pendente",

                    status_pagamento:
                        "pendente",

                    codigo_embaixador:
                        codigoEmbaixadorValidado

                };


                console.log(
                    "Registrando inscrição no Supabase.",
                    {
                        percurso: dadosInscricao.percurso,
                        valor: dadosInscricao.valor,
                        possuiIndicacao: Boolean(
                            dadosInscricao.codigo_embaixador
                        )
                    }
                );


                /* ---------------------------------------------
                   INSERT SUPABASE
                --------------------------------------------- */

                const resultado = await db
                    .from("inscricoes")
                    .insert([
                        dadosInscricao
                    ])
                    .select()
                    .single();


                /* ---------------------------------------------
                   TRATAR ERRO SUPABASE
                --------------------------------------------- */

                if (resultado.error) {

                    console.error(
                        "Erro Supabase:",
                        resultado.error
                    );

                    if (
                        resultado.error.code === "23505"
                    ) {

                        mostrarMensagem(
                            "⚠️ CPF já cadastrado! Já existe uma inscrição registrada para este CPF.",
                            "erro"
                        );

                        cpf.focus();

                        liberarBotao();

                        return;

                    }

                    throw resultado.error;

                }


                /* =================================================
                   INSCRIÇÃO REGISTRADA
                ================================================= */

                console.log(
                    "Inscrição registrada com sucesso:",
                    resultado.data?.id
                );


                /* ---------------------------------------------
                   LIMPAR CÓDIGO DA SESSÃO
                   Somente após o cadastro bem-sucedido
                --------------------------------------------- */

                limparCodigoEmbaixador();


                /* ---------------------------------------------
                   SALVAR DADOS PARA OBRIGADO
                --------------------------------------------- */

                salvarDadosInscricao(
                    valor,
                    percurso.value,
                    nome.value.trim()
                );


                /* ---------------------------------------------
                   REDIRECIONAR
                --------------------------------------------- */

                console.log(
                    "Redirecionando para confirmação..."
                );

                window.location.href =
                    "obrigado-inscricoes.html";

            }


            /* =================================================
               ERRO GERAL
            ================================================= */

            catch (erro) {

                console.error(
                    "Erro ao registrar inscrição:",
                    erro
                );

                let texto =
                    "Não foi possível registrar sua inscrição. Tente novamente.";

                if (erro?.code === "23505") {

                    texto =
                        "⚠️ CPF já cadastrado! Já existe uma inscrição registrada para este CPF.";

                } else if (erro?.code === "42501") {

                    texto =
                        "O Supabase bloqueou o cadastro. Verifique as políticas RLS da tabela inscricoes.";

                } else if (
                    erro?.message === "Supabase não inicializado."
                ) {

                    texto =
                        "Não foi possível conectar ao sistema. Atualize a página e tente novamente.";

                } else if (
                    obterCodigoEmbaixador()
                ) {

                    texto =
                        "Não foi possível validar o código de indicação. Tente novamente para não perder a identificação do embaixador.";

                }

                mostrarMensagem(
                    texto,
                    "erro"
                );

                liberarBotao();

            }

        }

    );


    /* =====================================================
       INICIALIZAR RESUMO
    ===================================================== */

    atualizarResumo();

});
