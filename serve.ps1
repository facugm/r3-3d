$port = 8080
$path = "c:\Users\facug\OneDrive\Documentos\Rosario3\Prueba"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Servidor escuchando en http://localhost:$port/"
Write-Host "Presioná Ctrl+C para detenerlo."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }

        # Evitar directory traversal
        $urlPath = $urlPath.Replace("/", "\")
        $filePath = Join-Path $path $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $mimeType
            
            try {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
                $response.StatusCode = 200
                Write-Host "200 OK - $urlPath"
            } catch {
                $response.StatusCode = 500
                Write-Host "500 Error - $urlPath"
            }
        } else {
            $response.StatusCode = 404
            Write-Host "404 Not Found - $urlPath"
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
