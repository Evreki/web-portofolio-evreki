Add-Type -AssemblyName System.Drawing

$profile = [System.Drawing.Bitmap]::FromFile('c:\laragon\www\web portofolio evreki\foto\profile-transparent.png')
$milesSrc = [System.Drawing.Bitmap]::FromFile('c:\laragon\www\web portofolio evreki\foto\miles-reference.png')

$w = $profile.Width  # 427
$h = $profile.Height # 584

$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# ==================== STEP 1: BASE CARBON FIBER SUIT WITH LIGHTING ====================
# Fill the full body silhouette with realistic deep carbon fiber and 3D lighting
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $alpha = $profile.GetPixel($x, $y).A
        if ($alpha -gt 20) {
            # 3D Lighting gradient based on distance from chest center (213.5, 300)
            $dx = ($x - 213.5) / 213.5
            $dy = ($y - 280) / 300
            $distSq = ($dx * $dx) + ($dy * $dy)
            
            # Carbon weave micro pattern
            $weave = (($x % 4 - 2) * ($y % 4 - 2)) * 3
            
            # Base dark suit color
            $baseVal = [Math]::Max(10, [Math]::Min(50, [int](32 - ($distSq * 18) + $weave)))
            
            # Deltoid / shoulder top rim highlight
            if ($y -gt 300 -and $y -lt 360 -and ([Math]::Abs($x - 213.5) -gt 70)) {
                $baseVal = [Math]::Min(75, $baseVal + 25)
            }
            
            $r = [int]($baseVal * 0.9)
            $g = [int]($baseVal * 0.95)
            $b = [int]($baseVal * 1.15)
            
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
        }
    }
}

# ==================== STEP 2: DRAW MILES MORALES RED SHOULDER STRIPES ====================
# Signature Miles Morales diagonal crimson racing stripes
$penRed = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 280, 427, 300)),
    [System.Drawing.Color]::FromArgb(240, 255, 30, 70),
    [System.Drawing.Color]::FromArgb(230, 140, 10, 40),
    45
)

# Left shoulder wing plate
$leftPts = @(
    (New-Object System.Drawing.Point(145, 305)),
    (New-Object System.Drawing.Point(62, 340)),
    (New-Object System.Drawing.Point(15, 360)),
    (New-Object System.Drawing.Point(10, 400)),
    (New-Object System.Drawing.Point(55, 385)),
    (New-Object System.Drawing.Point(115, 350)),
    (New-Object System.Drawing.Point(165, 335))
)
$g.FillPolygon($penRed, $leftPts)

# Right shoulder wing plate
$rightPts = @(
    (New-Object System.Drawing.Point(282, 305)),
    (New-Object System.Drawing.Point(365, 340)),
    (New-Object System.Drawing.Point(412, 360)),
    (New-Object System.Drawing.Point(417, 400)),
    (New-Object System.Drawing.Point(372, 385)),
    (New-Object System.Drawing.Point(312, 350)),
    (New-Object System.Drawing.Point(262, 335))
)
$g.FillPolygon($penRed, $rightPts)

# Center V chest stripes
$chestVLeft = @(
    (New-Object System.Drawing.Point(155, 335)),
    (New-Object System.Drawing.Point(205, 395)),
    (New-Object System.Drawing.Point(205, 584)),
    (New-Object System.Drawing.Point(185, 584)),
    (New-Object System.Drawing.Point(185, 415)),
    (New-Object System.Drawing.Point(135, 345))
)
$g.FillPolygon($penRed, $chestVLeft)

$chestVRight = @(
    (New-Object System.Drawing.Point(272, 335)),
    (New-Object System.Drawing.Point(222, 395)),
    (New-Object System.Drawing.Point(222, 584)),
    (New-Object System.Drawing.Point(242, 584)),
    (New-Object System.Drawing.Point(242, 415)),
    (New-Object System.Drawing.Point(292, 345))
)
$g.FillPolygon($penRed, $chestVRight)


# ==================== STEP 3: COMPOSITE REAL 3D MILES CHEST SPIDER EMBLEM ====================
# Extract the official red spray spider from miles-reference.png (x: 130 to 250, y: 190 to 320)
$spiderCrop = New-Object System.Drawing.Bitmap(125, 135)
$gSpider = [System.Drawing.Graphics]::FromImage($spiderCrop)
$gSpider.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$srcRect = New-Object System.Drawing.Rectangle(130, 192, 120, 130)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 125, 135)
$gSpider.DrawImage($milesSrc, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Make dark background of cropped spider transparent while keeping vivid red spider legs
for ($cy = 0; $cy -lt 135; $cy++) {
    for ($cx = 0; $cx -lt 125; $cx++) {
        $c = $spiderCrop.GetPixel($cx, $cy)
        # Red spider has strong R, lower G/B
        $isRedSpider = ($c.R -gt 90 -and ($c.R - $c.G) -gt 35)
        if (-not $isRedSpider) {
            $spiderCrop.SetPixel($cx, $cy, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Enhance vivid crimson red
            $newR = [Math]::Min(255, [int]($c.R * 1.25))
            $newG = [int]($c.G * 0.7)
            $newB = [int]($c.B * 0.8)
            $spiderCrop.SetPixel($cx, $cy, [System.Drawing.Color]::FromArgb(255, $newR, $newG, $newB))
        }
    }
}

# Draw official Miles Spider Emblem centered over Evreki's chest (x: 153 to 273, y: 400 to 535)
$g.DrawImage($spiderCrop, 151, 405, 125, 135)
$spiderCrop.Dispose()
$gSpider.Dispose()


# ==================== STEP 4: REALISTIC 3D MASK & 3D WEBBING ====================
# Draw 3D head sphere with realistic shading
$headBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush(@(
    (New-Object System.Drawing.Point(213, 75)),
    (New-Object System.Drawing.Point(135, 135)),
    (New-Object System.Drawing.Point(130, 215)),
    (New-Object System.Drawing.Point(155, 290)),
    (New-Object System.Drawing.Point(213, 315)),
    (New-Object System.Drawing.Point(272, 290)),
    (New-Object System.Drawing.Point(297, 215)),
    (New-Object System.Drawing.Point(292, 135))
))
$headBrush.CenterColor = [System.Drawing.Color]::FromArgb(255, 38, 48, 68)
$headBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(255, 8, 10, 14))

$headPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$headPath.AddClosedCurve(@(
    (New-Object System.Drawing.Point(213, 75)),
    (New-Object System.Drawing.Point(135, 135)),
    (New-Object System.Drawing.Point(130, 215)),
    (New-Object System.Drawing.Point(155, 290)),
    (New-Object System.Drawing.Point(213, 315)),
    (New-Object System.Drawing.Point(272, 290)),
    (New-Object System.Drawing.Point(297, 215)),
    (New-Object System.Drawing.Point(292, 135))
))
$g.FillPath($headBrush, $headPath)

# 3D Glowing Red Web Lines on Mask (radiating from nose center 213, 226)
$webPenDark = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 0, 0, 0), 2.8)
$webPenGlow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 255, 35, 75), 1.6)

# Web lines
$webCoords = @(
    @(213, 226, 213, 76),
    @(213, 226, 185, 80),
    @(213, 226, 241, 80),
    @(213, 226, 155, 95),
    @(213, 226, 271, 95),
    @(213, 226, 135, 135),
    @(213, 226, 291, 135),
    @(213, 226, 130, 185),
    @(213, 226, 296, 185),
    @(213, 226, 134, 235),
    @(213, 226, 292, 235),
    @(213, 226, 150, 280),
    @(213, 226, 276, 280),
    @(213, 226, 180, 305),
    @(213, 226, 246, 305),
    @(213, 226, 213, 315)
)

foreach ($line in $webCoords) {
    $g.DrawLine($webPenDark, $line[0], $line[1], $line[2], $line[3])
    $g.DrawLine($webPenGlow, $line[0], $line[1], $line[2], $line[3])
}

# Web concentric arcs
$arcs = @(
    @(195, 208, 213, 198, 231, 208),
    @(182, 184, 213, 170, 244, 184),
    @(168, 156, 213, 138, 258, 156),
    @(150, 126, 213, 102, 276, 126),
    @(195, 244, 213, 254, 231, 244),
    @(178, 266, 213, 280, 248, 266),
    @(162, 288, 213, 304, 264, 288)
)

foreach ($arc in $arcs) {
    $g.DrawCurve($webPenDark, @(
        (New-Object System.Drawing.Point($arc[0], $arc[1])),
        (New-Object System.Drawing.Point($arc[2], $arc[3])),
        (New-Object System.Drawing.Point($arc[4], $arc[5]))
    ))
    $g.DrawCurve($webPenGlow, @(
        (New-Object System.Drawing.Point($arc[0], $arc[1])),
        (New-Object System.Drawing.Point($arc[2], $arc[3])),
        (New-Object System.Drawing.Point($arc[4], $arc[5]))
    ))
}


# ==================== STEP 5: REALISTIC HIGH-GLOSS MILES MORALES 3D EYE LENSES ====================
# Extract / composite the glossy reflective eye lenses with thick red metallic beveled frames
function DrawEyeLens($isLeft) {
    $cx = if ($isLeft) { 178 } else { 249 }
    $cy = 198
    
    # Outer Red Metallic Bevel Path
    $bevelPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    if ($isLeft) {
        $bevelPath.AddClosedCurve(@(
            (New-Object System.Drawing.Point(148, 174)),
            (New-Object System.Drawing.Point(176, 162)),
            (New-Object System.Drawing.Point(207, 181)),
            (New-Object System.Drawing.Point(209, 208)),
            (New-Object System.Drawing.Point(193, 230)),
            (New-Object System.Drawing.Point(154, 224)),
            (New-Object System.Drawing.Point(143, 211)),
            (New-Object System.Drawing.Point(141, 193))
        ), 0.3)
    } else {
        $bevelPath.AddClosedCurve(@(
            (New-Object System.Drawing.Point(279, 174)),
            (New-Object System.Drawing.Point(251, 162)),
            (New-Object System.Drawing.Point(220, 181)),
            (New-Object System.Drawing.Point(218, 208)),
            (New-Object System.Drawing.Point(234, 230)),
            (New-Object System.Drawing.Point(273, 224)),
            (New-Object System.Drawing.Point(284, 211)),
            (New-Object System.Drawing.Point(286, 193))
        ), 0.3)
    }
    
    # Draw Drop shadow
    $g.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 0, 0, 0))), $bevelPath)
    
    # Draw Thick Red Bevel
    $bevelBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Rectangle(($cx - 35), ($cy - 35), 70, 70)),
        [System.Drawing.Color]::FromArgb(255, 255, 50, 90),
        [System.Drawing.Color]::FromArgb(255, 140, 10, 40),
        45
    )
    $g.FillPath($bevelBrush, $bevelPath)
    $g.DrawPath((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 80, 120), 2)), $bevelPath)
    
    # Inner Glass Lens Path
    $lensPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    if ($isLeft) {
        $lensPath.AddClosedCurve(@(
            (New-Object System.Drawing.Point(155, 180)),
            (New-Object System.Drawing.Point(175, 171)),
            (New-Object System.Drawing.Point(201, 185)),
            (New-Object System.Drawing.Point(202, 204)),
            (New-Object System.Drawing.Point(189, 221)),
            (New-Object System.Drawing.Point(160, 217)),
            (New-Object System.Drawing.Point(152, 208)),
            (New-Object System.Drawing.Point(151, 195))
        ), 0.3)
    } else {
        $lensPath.AddClosedCurve(@(
            (New-Object System.Drawing.Point(272, 180)),
            (New-Object System.Drawing.Point(252, 171)),
            (New-Object System.Drawing.Point(226, 185)),
            (New-Object System.Drawing.Point(225, 204)),
            (New-Object System.Drawing.Point(238, 221)),
            (New-Object System.Drawing.Point(267, 217)),
            (New-Object System.Drawing.Point(275, 208)),
            (New-Object System.Drawing.Point(276, 195))
        ), 0.3)
    }
    
    # Glossy Reflective Chrome Glass Fill
    $glassBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Rectangle(($cx - 30), ($cy - 30), 60, 60)),
        [System.Drawing.Color]::FromArgb(255, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(255, 140, 220, 255),
        70
    )
    $g.FillPath($glassBrush, $lensPath)
    
    # White Specular Gloss Glare Arc
    $glarePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(250, 255, 255, 255), 3)
    $glarePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $glarePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    if ($isLeft) {
        $g.DrawCurve($glarePen, @(
            (New-Object System.Drawing.Point(160, 185)),
            (New-Object System.Drawing.Point(175, 176)),
            (New-Object System.Drawing.Point(195, 187))
        ))
        $g.FillEllipse([System.Drawing.Brushes]::White, 163, 193, 4, 4)
    } else {
        $g.DrawCurve($glarePen, @(
            (New-Object System.Drawing.Point(267, 185)),
            (New-Object System.Drawing.Point(252, 176)),
            (New-Object System.Drawing.Point(232, 187))
        ))
        $g.FillEllipse([System.Drawing.Brushes]::White, 260, 193, 4, 4)
    }
}

DrawEyeLens $true
DrawEyeLens $false


# ==================== STEP 6: APPLY EVREKI SILHOUETTE ALPHA MASK ====================
# Ensure zero spill outside Evreki's silhouette for 100% pixel perfection
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $profAlpha = $profile.GetPixel($x, $y).A
        if ($profAlpha -lt 25) {
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$outBmp.Save('c:\laragon\www\web portofolio evreki\foto\spiderman-hero.png', [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$outBmp.Dispose()
$profile.Dispose()
$milesSrc.Dispose()

Write-Host "Photorealistic Miles Morales Spider-Man PNG built successfully at foto\spiderman-hero.png!"
