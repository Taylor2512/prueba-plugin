import asyncio
import socket
import urllib.parse


async def ensure_server_available(base_url: str = "http://localhost:5174", timeout: float = 1.5) -> bool:
    """Comprobar de forma asíncrona si el host:port del `base_url` responde.

    Devuelve True si se pudo abrir una conexión TCP al host:port dentro del timeout,
    False en caso contrario. Diseñado para reutilizar en tests para evitar duplicar lógica.
    """
    parsed = urllib.parse.urlparse(base_url)
    host = parsed.hostname or "localhost"
    port = parsed.port or (443 if parsed.scheme == "https" else 80)

    loop = asyncio.get_event_loop()

    def _check() -> bool:
        try:
            with socket.create_connection((host, port), timeout):
                return True
        except Exception:
            return False

    return await loop.run_in_executor(None, _check)


async def ensure_or_report(base_url: str = "http://localhost:5174", timeout: float = 1.5) -> bool:
    """Llamar a `ensure_server_available` y, si no está disponible, imprimir una razón clara.

    Retorna True si el servidor está disponible (continuar con el test), False si debe pausarse/skippearse.
    """
    ok = await ensure_server_available(base_url, timeout)
    if not ok:
        print(f"SKIPPED: {base_url} is not reachable within {timeout}s. Skipping interactive runtime test.")
    return ok
