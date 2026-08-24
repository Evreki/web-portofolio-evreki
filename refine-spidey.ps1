Add-Type -AssemblyName System.Drawing

$src = 'c:\laragon\www\web portofolio evreki\foto\spiderman-raw.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = $bmp.Width
$h = $bmp.Height

$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        $r = [int]$c.R
        $g = [int]$c.G
        $b = [int]$c.B
        $brightness = ($r + $g + $b) / 3
        
        # Spider eyes: inside head area (between x=0.52 and x=0.74, y=0.08 to 0.22)
        $isLeftEye = ($x -gt ($w * 0.52) -and $x -lt ($w * 0.63) -and $y -gt ($h * 0.10) -and $y -lt ($h * 0.23) -and $brightness -gt 170)
        $isRightEye = ($x -gt ($w * 0.66) -and $x -lt ($w * 0.77) -and $y -gt ($h * 0.15) -and $y -lt ($h * 0.24) -and $brightness -gt 170)
        
        # Spider red suit
        $isRedSuit = ($r -gt 70 -and ($r - $g) -gt 22 -and ($r - $b) -gt 22)
        # Spider blue suit
        $isBlueSuit = ($b -gt 55 -and ($b - $r) -gt 10)
        # Dark suit lines / webbing
        $isHeadSuit = ($x -ge ($w * 0.49) -and $x -le ($w * 0.82) -and $y -ge ($h * 0.005) -and $y -le ($h * 0.36))
        $isBodySuit = ($x -ge ($w * 0.14) -and $x -le ($w * 0.90) -and $y -gt ($h * 0.35))
        
        $isSuitWebbing = (($isHeadSuit -or $isBodySuit) -and $brightness -lt 65)
        
        # Left side of head / upper shoulder background filter
        if ($x -lt ($w * 0.49) -and $y -lt ($h * 0.35)) {
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            continue
        }
        # Right side of head background filter
        if ($x -gt ($w * 0.82) -and $y -lt ($h * 0.36)) {
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            continue
        }

        if ($isLeftEye -or $isRightEye -or $isRedSuit -or $isBlueSuit -or $isSuitWebbing) {
            $outBmp.SetPixel($x, $y, $c)
        } else {
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$outBmp.Save('c:\laragon\www\web portofolio evreki\foto\spiderman-hero.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$outBmp.Dispose()
Write-Host "Perfected spiderman-hero.png successfully!"
