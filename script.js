// =====================================================
// MEU PORTFÓLIO DIGITAL
// JAVASCRIPT + SUPABASE
// =====================================================


// =====================================================
// 1. CONFIGURAÇÃO DO SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://gxfgonttozmnlbeesgvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2B81uRN-aFr5KGFqi-fwMw_6jPbtKtg";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =====================================================
// 2. LOGIN
// =====================================================

async function fazerLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const senha =
        document.getElementById("senha").value;

    const mensagem =
        document.getElementById("mensagemLogin");


    mensagem.textContent = "Entrando...";


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: senha
            });


        if (error) {

            console.error(
                "ERRO REAL DO SUPABASE:",
                error
            );

            mensagem.textContent =
                "Erro: " + error.message;

            return;
        }


        console.log(
            "Login realizado com sucesso:",
            data.user
        );


        mensagem.textContent =
            "Login realizado com sucesso!";


        window.location.href = "painel.html";


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        mensagem.textContent =
            "Ocorreu um erro ao fazer login.";

    }
}


// =====================================================
// 3. VERIFICAR SE O ADMINISTRADOR ESTÁ LOGADO
// =====================================================

async function verificarLogin() {

    try {

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();


        if (
            window.location.pathname.endsWith(
                "painel.html"
            )
        ) {

            if (!session) {

                window.location.href =
                    "login.html";

                return false;
            }


            console.log(
                "Administrador autenticado:",
                session.user.email
            );


            return true;
        }


        return true;


    } catch (erro) {

        console.error(
            "Erro ao verificar login:",
            erro
        );

        return false;
    }
}


// =====================================================
// 4. SAIR DA CONTA
// =====================================================

async function sairDaConta() {

    try {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            return;
        }


        window.location.href =
            "login.html";


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

    }
}


// =====================================================
// 5. CARREGAR LEADS
// =====================================================

async function carregarLeads() {

    const lista =
        document.getElementById("listaLeads");


    if (!lista) {
        return;
    }


    lista.innerHTML =
        "<p>Carregando contatos...</p>";


    try {

        const { data, error } =
            await supabaseClient
                .from("leads")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Erro ao carregar leads:",
                error
            );

            lista.innerHTML =
                "<p>Não foi possível carregar os contatos.</p>";

            return;
        }


        if (!data || data.length === 0) {

            lista.innerHTML =
                "<p>Nenhum contato recebido ainda.</p>";

            return;
        }


        lista.innerHTML = "";


        data.forEach(function (lead) {

            const card =
                document.createElement("article");

            card.className = "card";


            const status =
                lead.respondido
                    ? "✅ Respondido"
                    : "🟡 Aguardando resposta";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(lead.nome)}
                </h3>

                <p>
                    <strong>E-mail:</strong>
                    ${escapeHTML(lead.email)}
                </p>

                <p>
                    <strong>WhatsApp:</strong>
                    ${escapeHTML(
                lead.whatsapp || "Não informado"
            )}
                </p>

                <p>
                    <strong>Assunto:</strong>
                    ${escapeHTML(
                lead.assunto || "Não informado"
            )}
                </p>

                <p>
                    <strong>Mensagem:</strong><br>
                    ${escapeHTML(lead.mensagem)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${status}
                </p>

                ${!lead.respondido
                    ? `
                        <button
    type="button"
    class="botao"
    onclick="marcarComoRespondido('${lead.id}')"
>
                            Marcar como respondido
                        </button>
                    `
                    : ""
                }

            `;


            lista.appendChild(card);

        });


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        lista.innerHTML =
            "<p>Ocorreu um erro ao carregar os contatos.</p>";
    }
}


// =====================================================
// 6. MARCAR LEAD COMO RESPONDIDO
// =====================================================

async function marcarComoRespondido(id) {

    try {

        const { error } =
            await supabaseClient
                .from("leads")
                .update({
                    respondido: true
                })
                .eq("id", id);


        if (error) {

            console.error(
                "Erro ao atualizar lead:",
                error
            );

            alert(
                "Não foi possível atualizar o contato."
            );

            return;
        }


        await carregarLeads();


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

    }
}


// =====================================================
// 7. CARREGAR PROJETOS NO PAINEL
// =====================================================

async function carregarProjetosAdmin() {

    const lista =
        document.getElementById(
            "listaProjetos"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML =
        "<p>Carregando projetos...</p>";


    try {

        const { data, error } =
            await supabaseClient
                .from("projetos")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Erro ao carregar projetos:",
                error
            );

            lista.innerHTML =
                "<p>Não foi possível carregar os projetos.</p>";

            return;
        }


        if (!data || data.length === 0) {

            lista.innerHTML =
                "<p>Nenhum projeto cadastrado ainda.</p>";

            return;
        }


        lista.innerHTML = "";


        data.forEach(function (projeto) {

            const card =
                document.createElement("article");

            card.className = "card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(projeto.titulo)}
                </h3>

                <p>
                    ${escapeHTML(
                projeto.descricao || ""
            )}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${escapeHTML(
                projeto.categoria ||
                "Não informada"
            )}
                </p>

                ${projeto.imagem
                    ? `
                        <p>
                            <strong>Imagem:</strong>
                            ${escapeHTML(projeto.imagem)}
                        </p>
                    `
                    : ""
                }

                ${projeto.link
                    ? `
                        <p>
                            <a
                                href="${escapeHTML(projeto.link)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver projeto
                            </a>
                        </p>
                    `
                    : ""
                }

                <button
                    class="botao"
                    onclick="editarProjetoPrompt('${projeto.id}')"
                >
                    Editar
                </button>

                <button
                    class="botao"
                    onclick="excluirProjeto('${projeto.id}')"
                >
                    Excluir
                </button>

            `;


            lista.appendChild(card);

        });


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        lista.innerHTML =
            "<p>Ocorreu um erro ao carregar os projetos.</p>";

    }
}


// =====================================================
// 8. CARREGAR PROJETOS NO PORTFÓLIO PÚBLICO
// =====================================================

async function carregarProjetosPublicos() {

    const lista =
        document.getElementById(
            "listaPortfolio"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML =
        "<p>Carregando projetos...</p>";


    try {

        const { data, error } =
            await supabaseClient
                .from("projetos")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Erro ao carregar projetos públicos:",
                error
            );

            lista.innerHTML =
                "<p>Não foi possível carregar os projetos.</p>";

            return;
        }


        if (!data || data.length === 0) {

            lista.innerHTML =
                "<p>Nenhum projeto cadastrado ainda.</p>";

            return;
        }


        lista.innerHTML = "";


        data.forEach(function (projeto) {

            const card =
                document.createElement("article");

            card.className = "card";


            card.innerHTML = `

                ${projeto.imagem
                    ? `
                        <img
                            src="${escapeHTML(projeto.imagem)}"
                            alt="${escapeHTML(projeto.titulo)}"
                            class="imagem-projeto"
                        >
                    `
                    : ""
                }

                <h3>
                    ${escapeHTML(projeto.titulo)}
                </h3>

                <p>
                    ${escapeHTML(
                    projeto.descricao || ""
                )}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${escapeHTML(
                    projeto.categoria ||
                    "Não informada"
                )}
                </p>

                ${projeto.link
                    ? `
                        <a
                            href="${escapeHTML(projeto.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="botao"
                        >
                            Ver projeto
                        </a>
                    `
                    : ""
                }

            `;


            lista.appendChild(card);

        });


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        lista.innerHTML =
            "<p>Ocorreu um erro ao carregar os projetos.</p>";
    }
}


// =====================================================
// 9. ADICIONAR PROJETO
// =====================================================

async function adicionarProjeto(event) {

    event.preventDefault();


    const titulo =
        document
            .getElementById("tituloProjeto")
            .value
            .trim();


    const descricao =
        document
            .getElementById("descricaoProjeto")
            .value
            .trim();


    const categoria =
        document
            .getElementById("categoriaProjeto")
            .value
            .trim();


    const imagem =
        document
            .getElementById("imagemProjeto")
            .value
            .trim();


    const link =
        document
            .getElementById("linkProjeto")
            .value
            .trim();


    const mensagem =
        document.getElementById(
            "mensagemProjeto"
        );


    try {

        const { error } =
            await supabaseClient
                .from("projetos")
                .insert([
                    {
                        titulo: titulo,
                        descricao: descricao,
                        categoria: categoria || null,
                        imagem: imagem || null,
                        link: link || null,
                        destaque: true
                    }
                ]);


        if (error) {

            console.error(
                "Erro ao adicionar projeto:",
                error
            );

            mensagem.textContent =
                "Não foi possível adicionar o projeto.";

            return;
        }


        mensagem.textContent =
            "Projeto adicionado com sucesso!";


        document
            .getElementById("formProjeto")
            .reset();


        await carregarProjetosAdmin();


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        mensagem.textContent =
            "Ocorreu um erro.";

    }
}


// =====================================================
// 10. EDITAR PROJETO
// =====================================================

async function editarProjetoPrompt(id) {

    const novoTitulo =
        prompt(
            "Digite o novo título do projeto:"
        );


    if (!novoTitulo) {
        return;
    }


    const novaDescricao =
        prompt(
            "Digite a nova descrição do projeto:"
        );


    if (!novaDescricao) {
        return;
    }


    try {

        const { error } =
            await supabaseClient
                .from("projetos")
                .update({
                    titulo: novoTitulo,
                    descricao: novaDescricao
                })
                .eq("id", id);


        if (error) {

            console.error(
                "Erro ao editar projeto:",
                error
            );

            alert(
                "Não foi possível editar o projeto."
            );

            return;
        }


        alert(
            "Projeto atualizado com sucesso!"
        );


        await carregarProjetosAdmin();


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

    }
}


// =====================================================
// 11. EXCLUIR PROJETO
// =====================================================

async function excluirProjeto(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este projeto?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const { error } =
            await supabaseClient
                .from("projetos")
                .delete()
                .eq("id", id);


        if (error) {

            console.error(
                "Erro ao excluir projeto:",
                error
            );

            alert(
                "Não foi possível excluir o projeto."
            );

            return;
        }


        alert(
            "Projeto excluído com sucesso!"
        );


        await carregarProjetosAdmin();


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

    }
}


// =====================================================
// 12. FUNÇÃO DE SEGURANÇA PARA TEXTO
// =====================================================

function escapeHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }


    const div =
        document.createElement("div");


    div.textContent = texto;


    return div.innerHTML;
}


// =====================================================
// 13. FORMULÁRIO DE CONTATO
// =====================================================

async function enviarContato(event) {

    event.preventDefault();


    const formulario =
        event.target;


    const nome =
        document
            .getElementById("nome")
            ?.value
            .trim();


    const email =
        document
            .getElementById("email")
            ?.value
            .trim();


    const whatsapp =
        document
            .getElementById("whatsapp")
            ?.value
            .trim();


    const assunto =
        document
            .getElementById("assunto")
            ?.value
            .trim();


    const mensagem =
        document
            .getElementById("mensagem")
            ?.value
            .trim();


    const consentimento =
        document
            .getElementById("consentimento")
            ?.checked;


    if (!consentimento) {

        alert(
            "É necessário aceitar o uso dos dados."
        );

        return;
    }


    if (!nome || !email || !mensagem) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;
    }


    try {

        const { error } =
            await supabaseClient
                .from("leads")
                .insert([
                    {
                        nome: nome,
                        email: email,
                        whatsapp: whatsapp || null,
                        assunto: assunto || null,
                        mensagem: mensagem,
                        respondido: false
                    }
                ]);


        if (error) {

            console.error(
                "Erro ao enviar contato:",
                error
            );

            alert(
                "Não foi possível enviar a mensagem."
            );

            return;
        }


        alert(
            "Mensagem enviada com sucesso!"
        );


        formulario.reset();


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        alert(
            "Ocorreu um erro ao enviar a mensagem."
        );

    }
}


// =====================================================
// 14. INICIALIZAÇÃO
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "🌐 Portfólio carregado."
        );


        // ---------------------------------------------
        // LOGIN
        // ---------------------------------------------

        const formLogin =
            document.getElementById(
                "formLogin"
            );


        if (formLogin) {

            formLogin.addEventListener(
                "submit",
                fazerLogin
            );

        }


        // ---------------------------------------------
        // VERIFICAR PAINEL
        // ---------------------------------------------

        const estaNoPainel =
            window.location.pathname.endsWith(
                "painel.html"
            );


        if (estaNoPainel) {

            const autorizado =
                await verificarLogin();


            if (autorizado) {

                await carregarLeads();

                await carregarProjetosAdmin();

            }

        }


        // ---------------------------------------------
        // FORMULÁRIO DE PROJETO
        // ---------------------------------------------

        const formProjeto =
            document.getElementById(
                "formProjeto"
            );


        if (formProjeto) {

            formProjeto.addEventListener(
                "submit",
                adicionarProjeto
            );

        }


        // ---------------------------------------------
        // FORMULÁRIO DE CONTATO
        // ---------------------------------------------

        const formContato =
            document.getElementById(
                "formContato"
            );


        if (formContato) {

            formContato.addEventListener(
                "submit",
                enviarContato
            );

        }


        // ---------------------------------------------
        // PORTFÓLIO PÚBLICO
        // ---------------------------------------------

        const listaPortfolio =
            document.getElementById(
                "listaPortfolio"
            );


        if (listaPortfolio) {

            await carregarProjetosPublicos();

        }


        // ---------------------------------------------
        // BOTÕES DE SAIR
        // ---------------------------------------------

        const botaoSair =
            document.getElementById(
                "botaoSair"
            );


        const botaoSair2 =
            document.getElementById(
                "botaoSair2"
            );


        if (botaoSair) {

            botaoSair.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    sairDaConta();

                }
            );

        }


        if (botaoSair2) {

            botaoSair2.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    sairDaConta();

                }
            );

        }

    }
);