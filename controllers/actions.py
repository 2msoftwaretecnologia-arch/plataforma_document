import streamlit as st


def adicionar_campo():
        """Adiciona um novo campo ao formulário."""
        st.session_state.campos.append({
            "nome": f"Campo {len(st.session_state.campos)+1}",
            "tipo": "Texto",
            "opcoes": [],
            "multi": False,
            "min_chars": 0,
            "max_chars": 200
        })
        st.rerun()

def remover_campo(i: int):
        """Remove o campo indicado pelo índice."""
        st.session_state.campos.pop(i)
        st.rerun()