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
        
        $diffRG = [Math]::Abs($r - $g)
        $diffGB = [Math]::Abs($g - $b)
        $diffRB = [Math]::Abs($r - $b)
        
        # Check if pixel is background:
        # 1. Fake checkerboard white/grey: bright neutral grey/white
        $isNeutralGreyWhite = ($r -gt 150 -and $g -gt 150 -and $b -gt 150 -and $diffRG -lt 25 -and $diffGB -lt 25 -and $diffRB -lt 25)
        # 2. Black strip on left edge:
        $isLeftBlack = ($x -lt 25 -and $r -lt 40 -and $g -lt 40 -and $b -lt 40)
        # 3. Top edge black strip:
        $isTopBlack = ($y -lt 15 -and $r -lt 40 -and $g -lt 40 -and $b -lt 40)
        
        # Spider-Man's suit is either distinct RED (R > G+35, R > B+35) or distinct BLUE (B > R+20, B > G+20) or dark black lines in suit
        $isRedSuit = ($r -gt 70 -and ($r - $g) -gt 28 -and ($r - $b) -gt 28)
        $isBlueSuit = ($b -gt 60 -and ($b - $r) -gt 15)
        $isEyeWhite = ($r -gt 200 -and $g -gt 200 -and $b -gt 200 -and $x -gt ($w * 0.3) -and $x -lt ($w * 0.75) -and $y -lt ($h * 0.35))
        
        if ($isEyeWhite -or $isRedSuit -or $isBlueSuit) {
            $outBmp.SetPixel($x, $y, $c)
        } elseif ($isNeutralGreyWhite -or $isLeftBlack -or $isTopBlack) {
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Check proximity to center or suit
            if ($x -gt ($w * 0.15) -and $x -lt ($w * 0.85) -and $y -gt ($h * 0.05)) {
                $outBmp.SetPixel($x, $y, $c)
            } else {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }
}

$outBmp.Save('c:\laragon\www\web portofolio evreki\foto\spiderman-hero.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$outBmp.Dispose()
Write-Host "Created transparent foto\spiderman-hero.png successfully!"
