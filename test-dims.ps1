Add-Type -AssemblyName System.Drawing

$srcMiles = [System.Drawing.Bitmap]::FromFile('c:\laragon\www\web portofolio evreki\foto\miles-reference.png')
$profile = [System.Drawing.Bitmap]::FromFile('c:\laragon\www\web portofolio evreki\foto\profile-transparent.png')

$w = $profile.Width # 427
$h = $profile.Height # 584

Write-Host "Miles source dimensions: $($srcMiles.Width) x $($srcMiles.Height)"
Write-Host "Profile dimensions: $w x $h"

$srcMiles.Dispose()
$profile.Dispose()
