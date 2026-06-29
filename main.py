from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()
security = HTTPBearer()

TOKEN_VALIDO = "mi-token-secreto"

def verificar_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != TOKEN_VALIDO:
        raise HTTPException(status_code=401, detail="Token inválido")
    return credentials.credentials

ventas = [
    {"id": 1, "producto": "Consulta", "precio": 500},
    {"id": 2, "producto": "Limpieza", "precio": 850},
]

@app.get("/")
def inicio():
    return {"mensaje": "API funcionando"}

@app.get("/ventas")
def get_ventas(token: str = Depends(verificar_token)):
    return ventas

@app.post("/ventas")
def crear_venta(venta: dict, token: str = Depends(verificar_token)):
    venta["id"] = len(ventas) + 1
    ventas.append(venta)
    return {"mensaje": "Venta creada", "id": venta["id"]}
