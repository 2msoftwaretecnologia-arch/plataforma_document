from pathlib import Path
import shutil
import sys
# como usar : python .\clean_pycache.py
def limpar_pycache(raiz: Path):
    removidos_dirs = 0
    removidos_pycs = 0

    for p in raiz.rglob("__pycache__"):
        if p.is_dir():
            try:
                shutil.rmtree(p)
                removidos_dirs += 1
                print(f"Removido diretório: {p}")
            except Exception as e:
                print(f"Erro ao remover {p}: {e}")

    for pyc in raiz.rglob("*.pyc"):
        try:
            pyc.unlink()
            removidos_pycs += 1
            print(f"Removido arquivo: {pyc}")
        except Exception as e:
            print(f"Erro ao remover {pyc}: {e}")

    print(f"Concluído: {removidos_dirs} '__pycache__' e {removidos_pycs} '.pyc' removidos.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        raiz = Path(sys.argv[1]).resolve()
    else:
        raiz = Path(__file__).resolve().parent

    if not raiz.exists():
        print(f"Caminho não existe: {raiz}")
        sys.exit(1)

    limpar_pycache(raiz)