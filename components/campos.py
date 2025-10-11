import streamlit as st
from controllers.actions import adicionar_campo,remover_campo



  
def rerun():
    """Encapsula st.rerun() para legibilidade."""
    st.rerun()

# =============================
# ⚙️ 3. Renderizadores Específicos
# =============================

def render_config_texto(campo: dict, i: int):
    """Renderiza as configurações de um campo de texto."""
    col_min, col_max = st.columns(2)
    with col_min:
        campo["min_chars"] = st.number_input(
            "Mínimo de caracteres",
            min_value=0,
            max_value=1000,
            value=campo["min_chars"],
            key=f"min_{i}",
        )
    with col_max:
        campo["max_chars"] = st.number_input(
            "Máximo de caracteres",
            min_value=1,
            max_value=5000,
            value=campo["max_chars"],
            key=f"max_{i}",
        )


def render_config_lista(campo: dict, i: int):
    """Renderiza as configurações de um campo tipo lista (com opções aninhadas)."""
    st.markdown("**⚙️ Configurações da lista:**")

    nova_opcao = st.text_input("Nova opção", key=f"nova_opcao_{i}")
    if st.button("➕ Adicionar opção", key=f"add_opcao_{i}") and nova_opcao.strip():
        campo["opcoes"].append(nova_opcao.strip())
        rerun()

    if campo["opcoes"]:
        st.write("Opções atuais:")
        for j, opcao in enumerate(campo["opcoes"]):
            col_texto, col_btn = st.columns([4, 1])
            with col_texto:
                campo["opcoes"][j] = st.text_input(
                    f"Opção {j+1}",
                    opcao,
                    key=f"opcao_{i}_{j}",
                )
            with col_btn:
                if st.button("🗑️", key=f"del_opcao_{i}_{j}", help="Remover opção"):
                    campo["opcoes"].pop(j)
                    rerun()

    campo["multi"] = st.checkbox(
        "Permitir seleção múltipla",
        value=campo["multi"],
        key=f"multi_{i}",
    )


# =============================
# 🧱 4. Renderizador Principal
# =============================

def render_campo(campo: dict, i: int):
    """Renderiza um campo dinâmico completo."""
    with st.container(border=True):
        st.subheader(f"Campo {i+1}")

        col_nome, col_tipo, col_btn = st.columns([2, 2, 1])
        with col_nome:
            campo["nome"] = st.text_input(
                "Nome do campo",
                campo["nome"],
                key=f"nome_{i}",
            )

        with col_tipo:
            tipos = ["Texto", "Número", "Área de texto", "Lista"]
            campo["tipo"] = st.selectbox(
                "Tipo do campo",
                tipos,
                key=f"tipo_{i}",
                index=tipos.index(campo["tipo"]),
            )

        with col_btn:
            if st.button("🗑️", key=f"remover_{i}", help="Remover este campo"):
                remover_campo(i)

        # Renderiza configs específicas
        if campo["tipo"] == "Texto":
            render_config_texto(campo, i)
        elif campo["tipo"] == "Lista":
            render_config_lista(campo, i)

def render_page():

    for i, campo in enumerate(st.session_state.campos):
        render_campo(campo, i)

        # Exibe botão de adicionar apenas abaixo do último campo
        if i == len(st.session_state.campos) - 1:
            st.divider()
            if st.button("➕ Adicionar novo campo", key=f"add_field_{i}"):
                adicionar_campo()

    if not st.session_state.campos:
        st.info("Nenhum campo adicionado ainda. Clique abaixo para começar!")
        if st.button("➕ Adicionar primeiro campo"):
            adicionar_campo()