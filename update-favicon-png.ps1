Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap(64, 64)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Shadow
$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$g.FillRectangle($shadowBrush, 6, 6, 54, 54)

# Gradient Background (Spider Red to Web Blue)
$rect = New-Object System.Drawing.Rectangle(2, 2, 54, 54)
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(229,9,20), [System.Drawing.Color]::FromArgb(37,99,235), 45)
$g.FillRectangle($grad, $rect)

# Border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 3)
$g.DrawRectangle($borderPen, $rect)

# Web lines
$webPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 255, 255, 255), 1.2)
$g.DrawLine($webPen, 29, 2, 29, 56)
$g.DrawLine($webPen, 2, 29, 56, 29)
$g.DrawLine($webPen, 10, 10, 48, 48)
$g.DrawLine($webPen, 10, 48, 48, 10)
$g.DrawEllipse($webPen, 15, 15, 28, 28)

# Draw Spider Emblem
$spiderImg = [System.Drawing.Image]::FromFile('c:\laragon\www\web portofolio evreki\foto\spider-emblem-white.png')
$g.DrawImage($spiderImg, 10, 8, 40, 44)
$spiderImg.Dispose()

$bmp.Save('c:\laragon\www\web portofolio evreki\favicon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Host "favicon.png updated with authentic Spider-Man emblem!"
