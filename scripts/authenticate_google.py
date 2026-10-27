"""Script de autorizacion para Google Search Console y Google Analytics 4 MCP.
Ejecuta el flujo OAuth 2.0 en el navegador y guarda las credenciales en:
- C:\\Users\\santgodev\\AppData\\Local\\mcp-gsc\\mcp-gsc\\token.json (Search Console)
- C:\\Users\\santgodev\\.config\\ga4-mcp\\credentials.json (Google Analytics 4)
"""
import os
import sys
import json
from google_auth_oauthlib.flow import InstalledAppFlow

CLIENT_SECRET_FILE = r"C:\Users\santgodev\Documents\Desarrollo\Evertrip-nueva-version-astra-redesign\client_secret_817642842697-pjeamtelap0hu2ddgqq67gl3ro7baisk.apps.googleusercontent.com.json"

SCOPES = [
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/analytics.readonly",
]

def main():
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"Error: No se encontro el archivo de credenciales en {CLIENT_SECRET_FILE}", file=sys.stderr, flush=True)
        sys.exit(1)

    print("Iniciando flujo de autorizacion OAuth para Search Console y Analytics...", flush=True)
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    
    print("Abriendo navegador para iniciar sesion y autorizar...", flush=True)
    creds = flow.run_local_server(port=0, prompt='consent', access_type='offline', open_browser=True)

    # 1. Guardar para Google Search Console MCP
    gsc_config_dir = os.path.expandvars(r"%LOCALAPPDATA%\mcp-gsc\mcp-gsc")
    os.makedirs(gsc_config_dir, exist_ok=True)
    gsc_token_file = os.path.join(gsc_config_dir, "token.json")
    with open(gsc_token_file, "w", encoding="utf-8") as f:
        f.write(creds.to_json())
    print(f"[OK] Token de Search Console guardado en: {gsc_token_file}", flush=True)

    # 2. Guardar para Google Analytics 4 MCP (formato ADC authorized_user)
    with open(CLIENT_SECRET_FILE, "r", encoding="utf-8") as f:
        client_data = json.load(f).get("installed", {})

    ga4_config_dir = os.path.expandvars(r"%USERPROFILE%\.config\ga4-mcp")
    os.makedirs(ga4_config_dir, exist_ok=True)
    ga4_creds_file = os.path.join(ga4_config_dir, "credentials.json")

    adc_data = {
        "type": "authorized_user",
        "client_id": client_data.get("client_id", creds.client_id),
        "client_secret": client_data.get("client_secret", creds.client_secret),
        "refresh_token": creds.refresh_token,
        "universe_domain": "googleapis.com"
    }
    with open(ga4_creds_file, "w", encoding="utf-8") as f:
        json.dump(adc_data, f, indent=2)
    print(f"[OK] Credenciales de Google Analytics 4 guardadas en: {ga4_creds_file}", flush=True)

    print("\n¡Autorizacion completada con exito para ambos servicios!", flush=True)

if __name__ == "__main__":
    main()
