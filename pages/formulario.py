import streamlit as st
from components.campos import render_campo
from controllers.actions import adicionar_campo



def render_formulario():

    st.set_page_config(page_title="Formulário Dinâmico", layout="wide")

    st.title("🧩 Criador de Formulário Dinâmico")

    # Inicializa o estado
    if "campos" not in st.session_state:
        st.session_state.campos = []


    render_editor_campos()

def render_editor_campos():
    # Editor de campos (antes era render_page em components/campos.py)
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

    # Mostra o formulário para preenchimento
    if st.session_state.campos:
        st.divider()
        st.subheader("📋 Preencha o Formulário")
        respostas = {}

        for campo in st.session_state.campos:
            if campo["tipo"] == "Texto":
                respostas[campo["nome"]] = st.text_input(campo["nome"])
            elif campo["tipo"] == "Número":
                respostas[campo["nome"]] = st.number_input(campo["nome"], step=1)
            elif campo["tipo"] == "Área de texto":
                respostas[campo["nome"]] = st.text_area(campo["nome"])
            elif campo["tipo"] == "Lista":
                if campo.get("multi", False):
                    respostas[campo["nome"]] = st.multiselect(
                        campo["nome"],
                        campo["opcoes"],
                        default=campo["opcoes"]
                    )
                else:
                    if campo["opcoes"]:
                        respostas[campo["nome"]] = st.selectbox(
                            campo["nome"],
                            campo["opcoes"]
                        )
                    else:
                        st.warning(f"O campo '{campo['nome']}' não tem opções.")
                        respostas[campo["nome"]] = None

        if st.button("✅ Enviar Respostas"):
            st.success("Respostas registradas com sucesso!")
            st.json(respostas)
