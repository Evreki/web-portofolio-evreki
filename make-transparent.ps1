Add-Type -AssemblyName System.Drawing

$src = 'c:\laragon\www\web portofolio evreki\foto\spider-reference.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = $bmp.Width
$h = $bmp.Height

$whiteBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$blackBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Red background: high R (e.g. > 150), lower G/B (e.g. < 80)
        # Black spider: low R, G, B (e.g. < 70)
        $diff = $c.R - [Math]::Max($c.G, $c.B)
        $brightness = ($c.R + $c.G + $c.B) / 3

        if ($diff -gt 40 -or $brightness -gt 90) {
            # Background -> transparent
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $blackBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Spider -> sharp opaque
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            $blackBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 0, 0, 0))
        }
    }
}

$whiteBmp.Save('c:\laragon\www\web portofolio evreki\foto\spider-emblem-white.png', [System.Drawing.Imaging.ImageFormat]::Png)
$blackBmp.Save('c:\laragon\www\web portofolio evreki\foto\spider-emblem-black.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$whiteBmp.Dispose()
$blackBmp.Dispose()

Write-Host "Created transparent spider emblems successfully!"
