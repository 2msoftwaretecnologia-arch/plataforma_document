import streamlit as st
from controllers.actions import adicionar_campo,remover_campo
from components.campos import render_page



def render_formulario():

    st.set_page_config(page_title="Formulário Dinâmico", layout="wide")

    st.title("🧩 Criador de Formulário Dinâmico")

    # Inicializa o estado
    if "campos" not in st.session_state:
        st.session_state.campos = []


    render_page()

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

        if st.button("✅ Enviar Respostas"):
            st.success("Respostas registradas com sucesso!")
            st.json(respostas)
