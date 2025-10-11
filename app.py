import streamlit as st
from streamlit_option_menu import option_menu
from pages.formulario import render_formulario

# ==============================
# Configuração inicial
# ==============================
st.set_page_config(page_title="Plataforma 2M", layout="wide")

# ==============================
# Sidebar com Option Menu
# ==============================
with st.sidebar:
    selected = option_menu(
        menu_title="📊 Menu Principal",
        options=[
            "Dashboard",
            "Mapeamento",
            "Criação Form",
            "Geração de Documento",
            "Histórico",
            "Gerenciar Plano",
        ],
        icons=[
            "speedometer2",
            "map",
            "ui-checks-grid",
            "file-earmark-text",
            "clock-history",
            "credit-card-2-front",
        ],
        menu_icon="menu-button-wide",
        default_index=0,
        styles={
            "container": {"background-color": "#0a0f24"},
            "icon": {"color": "white", "font-size": "18px"},
            "nav-link": {
                "color": "white",
                "font-size": "16px",
                "text-align": "left",
                "margin": "5px",
                "--hover-color": "#2b5cff",
            },
            "nav-link-selected": {"background-color": "#2b5cff"},
        },
    )

# ==============================
# Corpo das páginas
# ==============================
if selected == "Criação Form":
    render_formulario()
else:
    st.markdown(
        """
        <div style='text-align:center; padding:100px 0;'>
            <h2>🚧 Esta funcionalidade será desenvolvida em breve.</h2>
            <p style='color:gray;'>Em breve você poderá usar todos os recursos desta seção.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ==============================
# Rodapé
# ==============================
st.sidebar.markdown("---")
st.sidebar.caption("© 2025 - 2M Software | Em desenvolvimento 🚀")
