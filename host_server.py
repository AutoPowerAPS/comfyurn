"""Local preview server for comfyurn-site/ that tells the browser never to cache.

Plain `python3 -m http.server` lets the browser keep old copies of CSS and JS, so after an edit a page can mix a
new stylesheet with an old script (for example a shop card button that floats loose on the page). This server sends
Cache-Control: no-store on every file, so a normal reload always gets the files as they are on disk.

    python3 host_server.py            # http://localhost:8000, this Mac only
    python3 host_server.py 8080       # another port
    python3 host_server.py --lan      # also reachable from a phone on the same Wi-Fi (anyone on that network can open it)
"""
import functools
import http.server
import pathlib
import sys
import urllib.parse

SITE = pathlib.Path(__file__).resolve().parent / "comfyurn-site"


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        # no hidden files or folders (.DS_Store, .git), whatever the path
        path = urllib.parse.unquote(self.path.split("?")[0].split("#")[0])   # decode first, so %2e counts as a dot
        if any(part.startswith(".") for part in path.split("/")):
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        # a folder without an index.html is not listed
        self.send_error(404)
        return None


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--lan"]
    lan = "--lan" in sys.argv[1:]
    port = int(args[0]) if args else 8000
    handler = functools.partial(NoCache, directory=str(SITE))
    host = "" if lan else "127.0.0.1"   # localhost only unless asked, so a cafe or office network cannot reach it
    with http.server.ThreadingHTTPServer((host, port), handler) as httpd:
        where = "every network interface" if lan else "this Mac only"
        print(f"Comfyurn at http://localhost:{port}  ({where}, no caching, Ctrl+C to stop)")
        httpd.serve_forever()
