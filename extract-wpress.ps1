param(
    [string]$WpressFile,
    [string]$OutputDir = "extracted"
)

if (-not $WpressFile) {
    Write-Host "Usage: .\extract-wpress.ps1 -WpressFile <file.wpress> [-OutputDir <dir>]"
    exit 1
}

$HEADER_SIZE = 4377
$NAME_SIZE = 255
$SIZE_SIZE = 14
$MTIME_SIZE = 12
$PATH_SIZE = 4096

function Read-NullTerminated {
    param([byte[]]$data)
    $nullIdx = [Array]::IndexOf($data, [byte]0)
    if ($nullIdx -eq 0) { return "" }
    if ($nullIdx -lt 0) { $nullIdx = $data.Length }
    return [System.Text.Encoding]::UTF8.GetString($data, 0, $nullIdx).Trim()
}

$fileInfo = Get-Item $WpressFile
$fileSize = $fileInfo.Length
Write-Host "File size: $([math]::Round($fileSize / 1MB, 2)) MB"

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$stream = [System.IO.File]::OpenRead((Resolve-Path $WpressFile).Path)
$headerBuf = New-Object byte[] $HEADER_SIZE
$fileCount = 0

try {
    while ($stream.Position + $HEADER_SIZE -le $fileSize) {
        $bytesRead = $stream.Read($headerBuf, 0, $HEADER_SIZE)
        if ($bytesRead -lt $HEADER_SIZE) {
            Write-Host "Reached end of file (incomplete header)."
            break
        }

        $nameBytes = $headerBuf[0..($NAME_SIZE - 1)]
        $sizeBytes = $headerBuf[$NAME_SIZE..($NAME_SIZE + $SIZE_SIZE - 1)]
        $mtimeBytes = $headerBuf[($NAME_SIZE + $SIZE_SIZE)..($NAME_SIZE + $SIZE_SIZE + $MTIME_SIZE - 1)]
        $pathBytes = $headerBuf[($NAME_SIZE + $SIZE_SIZE + $MTIME_SIZE)..($NAME_SIZE + $SIZE_SIZE + $MTIME_SIZE + $PATH_SIZE - 1)]

        $name = Read-NullTerminated $nameBytes
        $sizeStr = Read-NullTerminated $sizeBytes
        $filePath = Read-NullTerminated $pathBytes

        $contentSize = 0
        if ($sizeStr -and $sizeStr -match '^\d+$') {
            $contentSize = [long]$sizeStr
        }

        if (-not $name -and $contentSize -eq 0) {
            Write-Host "Reached end-of-archive marker."
            break
        }

        $fullPath = Join-Path $OutputDir (Join-Path $filePath $name)
        $dirName = Split-Path $fullPath -Parent

        if (-not (Test-Path $dirName)) {
            New-Item -ItemType Directory -Path $dirName -Force | Out-Null
        }

        if ($contentSize -gt 0) {
            $outStream = [System.IO.File]::Create($fullPath)
            try {
                $chunkSize = 1048576
                $remaining = $contentSize
                $chunk = New-Object byte[] $chunkSize
                while ($remaining -gt 0) {
                    $toRead = [math]::Min($chunkSize, $remaining)
                    $read = $stream.Read($chunk, 0, $toRead)
                    if ($read -eq 0) { break }
                    $outStream.Write($chunk, 0, $read)
                    $remaining -= $read
                }
            } finally {
                $outStream.Close()
            }
        } else {
            [System.IO.File]::Create($fullPath).Close()
        }

        $fileCount++
        if ($fileCount % 100 -eq 0) {
            $pct = [math]::Round(($stream.Position / $fileSize) * 100, 1)
            Write-Host "Extracted $fileCount files ($pct%)..."
        }
    }
} finally {
    $stream.Close()
}

Write-Host "`nDone! Extracted $fileCount files to $OutputDir/"
