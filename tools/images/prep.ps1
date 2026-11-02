# Prepare event photos for the site: a 1600px JPEG and an -800.jpg copy, re-encoded
# so camera metadata (EXIF, GPS location) is dropped. Windows only (System.Drawing).
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/images/prep.ps1 `
#     -Source C:\photos\raw -Slug open-source-connect-pakistan-2026
#
# Output: images/events/<slug>/<name>.jpg and <name>-800.jpg. Prints width/height for data/events.json.
param(
  [Parameter(Mandatory)] [string] $Source,
  [Parameter(Mandatory)] [string] $Slug,
  [int] $Quality = 82
)
$ErrorActionPreference = 'Stop'
if ($Slug -notmatch '^[a-z0-9-]+$') { throw "Slug must be lowercase letters, digits and hyphens." }
Add-Type -AssemblyName System.Drawing
$out = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) "images\events\$Slug"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

function Save-Resized($img, [int]$maxWidth, [string]$path) {
  $w = [Math]::Min($maxWidth, $img.Width)
  $h = [int][Math]::Round($img.Height * $w / $img.Width)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose()
  $bmp.Save($path, $codec, $params)   # a new bitmap carries no source metadata
  $bmp.Dispose()
  return @($w, $h)
}

Get-ChildItem -LiteralPath $Source -File | Where-Object Extension -match '^\.(jpe?g|png)$' | ForEach-Object {
  $name = ($_.BaseName.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  try {
    # Apply EXIF orientation before the metadata is dropped.
    if ($img.PropertyIdList -contains 0x0112) {
      switch ($img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip('Rotate180FlipNone') }
        6 { $img.RotateFlip('Rotate90FlipNone') }
        8 { $img.RotateFlip('Rotate270FlipNone') }
      }
    }
    $size = Save-Resized $img 1600 (Join-Path $out "$name.jpg")
    Save-Resized $img 800 (Join-Path $out "$name-800.jpg") | Out-Null
    "/images/events/$Slug/$name.jpg  width $($size[0])  height $($size[1])"
  } finally { $img.Dispose() }
}
