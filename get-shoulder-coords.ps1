Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile('c:\laragon\www\web portofolio evreki\foto\profile-transparent.png')
$w = $bmp.Width
$h = $bmp.Height

Write-Host "Image dimensions: $w x $h"

# Sample shoulder and body silhouette at Y from 250 to 580 in steps of 15
for ($y = 250; $y -lt $h; $y += 15) {
    $minX = -1
    $maxX = -1
    for ($x = 0; $x -lt $w; $x++) {
        $alpha = $bmp.GetPixel($x, $y).A
        if ($alpha -gt 50) {
            if ($minX -eq -1) { $minX = $x }
            $maxX = $x
        }
    }
    Write-Host "Y = $y : X from $minX to $maxX (Width: $($maxX - $minX))"
}

$bmp.Dispose()
