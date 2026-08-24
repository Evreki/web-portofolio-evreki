$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class SpidermanCompositor
{
    public static void GenerateSuit(string profilePath, string milesSrcPath, string outputPath)
    {
        using (Bitmap profile = new Bitmap(profilePath))
        using (Bitmap milesSrc = new Bitmap(milesSrcPath))
        {
            int w = profile.Width;  // 427
            int h = profile.Height; // 584

            using (Bitmap outBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            using (Graphics g = Graphics.FromImage(outBmp))
            {
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                // 1. BASE CARBON FIBER & 3D STUDIO LIGHTING
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        Color pCol = profile.GetPixel(x, y);
                        if (pCol.A > 20)
                        {
                            double dx = (x - 213.5) / 213.5;
                            double dy = (y - 280.0) / 300.0;
                            double distSq = (dx * dx) + (dy * dy);

                            int weave = ((x % 4 - 2) * (y % 4 - 2)) * 3;
                            int baseVal = Math.Max(12, Math.Min(55, (int)(36 - (distSq * 20) + weave)));

                            // Shoulder deltoid highlights
                            if (y > 300 && y < 370 && Math.Abs(x - 213.5) > 65)
                            {
                                baseVal = Math.Min(80, baseVal + 28);
                            }

                            int r = (int)(baseVal * 0.9);
                            int gVal = (int)(baseVal * 0.95);
                            int b = (int)(baseVal * 1.15);

                            outBmp.SetPixel(x, y, Color.FromArgb(pCol.A, r, gVal, b));
                        }
                    }
                }

                // 2. MILES MORALES RED SHOULDER WINGS & RACING STRIPES
                using (LinearGradientBrush redBrush = new LinearGradientBrush(
                    new Rectangle(0, 280, 427, 300),
                    Color.FromArgb(245, 255, 30, 70),
                    Color.FromArgb(235, 140, 10, 40),
                    45f))
                {
                    // Left shoulder wing
                    Point[] leftPts = new Point[] {
                        new Point(145, 305),
                        new Point(62, 340),
                        new Point(15, 360),
                        new Point(10, 400),
                        new Point(55, 385),
                        new Point(115, 350),
                        new Point(165, 335)
                    };
                    g.FillPolygon(redBrush, leftPts);

                    // Right shoulder wing
                    Point[] rightPts = new Point[] {
                        new Point(282, 305),
                        new Point(365, 340),
                        new Point(412, 360),
                        new Point(417, 400),
                        new Point(372, 385),
                        new Point(312, 350),
                        new Point(262, 335)
                    };
                    g.FillPolygon(redBrush, rightPts);

                    // Center V chest stripes
                    Point[] chestVLeft = new Point[] {
                        new Point(155, 335),
                        new Point(205, 395),
                        new Point(205, 584),
                        new Point(185, 584),
                        new Point(185, 415),
                        new Point(135, 345)
                    };
                    g.FillPolygon(redBrush, chestVLeft);

                    Point[] chestVRight = new Point[] {
                        new Point(272, 335),
                        new Point(222, 395),
                        new Point(222, 584),
                        new Point(242, 584),
                        new Point(242, 415),
                        new Point(292, 345)
                    };
                    g.FillPolygon(redBrush, chestVRight);
                }

                // 3. EXTRACT & COMPOSITE OFFICIAL 3D MILES CHEST SPIDER EMBLEM
                using (Bitmap spiderCrop = new Bitmap(130, 140))
                using (Graphics gSpider = Graphics.FromImage(spiderCrop))
                {
                    gSpider.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    Rectangle srcRect = new Rectangle(128, 190, 122, 132);
                    Rectangle destRect = new Rectangle(0, 0, 130, 140);
                    gSpider.DrawImage(milesSrc, destRect, srcRect, GraphicsUnit.Pixel);

                    for (int cy = 0; cy < 140; cy++)
                    {
                        for (int cx = 0; cx < 130; cx++)
                        {
                            Color c = spiderCrop.GetPixel(cx, cy);
                            bool isRedSpider = (c.R > 85 && (c.R - c.G) > 30);
                            if (!isRedSpider)
                            {
                                spiderCrop.SetPixel(cx, cy, Color.FromArgb(0, 0, 0, 0));
                            }
                            else
                            {
                                int newR = Math.Min(255, (int)(c.R * 1.3));
                                int newG = (int)(c.G * 0.7);
                                int newB = (int)(c.B * 0.8);
                                spiderCrop.SetPixel(cx, cy, Color.FromArgb(255, newR, newG, newB));
                            }
                        }
                    }
                    g.DrawImage(spiderCrop, 148, 400, 130, 140);
                }

                // 4. 3D HEAD MASK WITH STUDIO AMBIENT OCCLUSION
                using (GraphicsPath headPath = new GraphicsPath())
                {
                    Point[] headPoints = new Point[] {
                        new Point(213, 75),
                        new Point(135, 135),
                        new Point(130, 215),
                        new Point(155, 290),
                        new Point(213, 315),
                        new Point(272, 290),
                        new Point(297, 215),
                        new Point(292, 135)
                    };
                    headPath.AddClosedCurve(headPoints, 0.5f);

                    using (PathGradientBrush headBrush = new PathGradientBrush(headPath))
                    {
                        headBrush.CenterPoint = new PointF(213f, 175f);
                        headBrush.CenterColor = Color.FromArgb(255, 42, 52, 72);
                        headBrush.SurroundColors = new Color[] { Color.FromArgb(255, 8, 10, 15) };
                        g.FillPath(headBrush, headPath);
                    }
                }

                // 5. 3D GLOWING CRIMSON RED WEBBING (Grooved Black Base + Glowing Crimson)
                using (Pen penDark = new Pen(Color.FromArgb(220, 0, 0, 0), 2.8f))
                using (Pen penGlow = new Pen(Color.FromArgb(245, 255, 35, 75), 1.6f))
                {
                    int[][] webCoords = new int[][] {
                        new int[] { 213, 226, 213, 76 },
                        new int[] { 213, 226, 185, 80 },
                        new int[] { 213, 226, 241, 80 },
                        new int[] { 213, 226, 155, 95 },
                        new int[] { 213, 226, 271, 95 },
                        new int[] { 213, 226, 135, 135 },
                        new int[] { 213, 226, 291, 135 },
                        new int[] { 213, 226, 130, 185 },
                        new int[] { 213, 226, 296, 185 },
                        new int[] { 213, 226, 134, 235 },
                        new int[] { 213, 226, 292, 235 },
                        new int[] { 213, 226, 150, 280 },
                        new int[] { 213, 226, 276, 280 },
                        new int[] { 213, 226, 180, 305 },
                        new int[] { 213, 226, 246, 305 },
                        new int[] { 213, 226, 213, 315 }
                    };

                    foreach (var line in webCoords)
                    {
                        g.DrawLine(penDark, line[0], line[1], line[2], line[3]);
                        g.DrawLine(penGlow, line[0], line[1], line[2], line[3]);
                    }

                    int[][] arcs = new int[][] {
                        new int[] { 195, 208, 213, 198, 231, 208 },
                        new int[] { 182, 184, 213, 170, 244, 184 },
                        new int[] { 168, 156, 213, 138, 258, 156 },
                        new int[] { 150, 126, 213, 102, 276, 126 },
                        new int[] { 195, 244, 213, 254, 231, 244 },
                        new int[] { 178, 266, 213, 280, 248, 266 },
                        new int[] { 162, 288, 213, 304, 264, 288 }
                    };

                    foreach (var a in arcs)
                    {
                        Point[] pts = new Point[] {
                            new Point(a[0], a[1]),
                            new Point(a[2], a[3]),
                            new Point(a[4], a[5])
                        };
                        g.DrawCurve(penDark, pts);
                        g.DrawCurve(penGlow, pts);
                    }
                }

                // 6. REALISTIC HIGH-GLOSS MILES MORALES 3D EYE LENSES
                DrawEyeLens(g, true);
                DrawEyeLens(g, false);

                // 7. ENSURE ZERO SPILL WITH EVREKI SILHOUETTE MASK
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        if (profile.GetPixel(x, y).A < 25)
                        {
                            outBmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        }
                    }
                }

                outBmp.Save(outputPath, ImageFormat.Png);
            }
        }
    }

    private static void DrawEyeLens(Graphics g, bool isLeft)
    {
        int cx = isLeft ? 178 : 249;
        int cy = 198;

        using (GraphicsPath bevelPath = new GraphicsPath())
        using (GraphicsPath lensPath = new GraphicsPath())
        {
            if (isLeft)
            {
                bevelPath.AddClosedCurve(new Point[] {
                    new Point(148, 174),
                    new Point(176, 162),
                    new Point(207, 181),
                    new Point(209, 208),
                    new Point(193, 230),
                    new Point(154, 224),
                    new Point(143, 211),
                    new Point(141, 193)
                }, 0.3f);

                lensPath.AddClosedCurve(new Point[] {
                    new Point(155, 180),
                    new Point(175, 171),
                    new Point(201, 185),
                    new Point(202, 204),
                    new Point(189, 221),
                    new Point(160, 217),
                    new Point(152, 208),
                    new Point(151, 195)
                }, 0.3f);
            }
            else
            {
                bevelPath.AddClosedCurve(new Point[] {
                    new Point(279, 174),
                    new Point(251, 162),
                    new Point(220, 181),
                    new Point(218, 208),
                    new Point(234, 230),
                    new Point(273, 224),
                    new Point(284, 211),
                    new Point(286, 193)
                }, 0.3f);

                lensPath.AddClosedCurve(new Point[] {
                    new Point(272, 180),
                    new Point(252, 171),
                    new Point(226, 185),
                    new Point(225, 204),
                    new Point(238, 221),
                    new Point(267, 217),
                    new Point(275, 208),
                    new Point(276, 195)
                }, 0.3f);
            }

            // Drop Shadow
            using (SolidBrush shadowBrush = new SolidBrush(Color.FromArgb(240, 0, 0, 0)))
            {
                g.FillPath(shadowBrush, bevelPath);
            }

            // Crimson Red Metallic Bevel
            using (LinearGradientBrush bevelBrush = new LinearGradientBrush(
                new Rectangle(cx - 35, cy - 35, 70, 70),
                Color.FromArgb(255, 255, 50, 90),
                Color.FromArgb(255, 140, 10, 40),
                45f))
            using (Pen bevelPen = new Pen(Color.FromArgb(255, 255, 80, 120), 2f))
            {
                g.FillPath(bevelBrush, bevelPath);
                g.DrawPath(bevelPen, bevelPath);
            }

            // Reflective Chrome Glass Lens
            using (LinearGradientBrush glassBrush = new LinearGradientBrush(
                new Rectangle(cx - 30, cy - 30, 60, 60),
                Color.FromArgb(255, 255, 255, 255),
                Color.FromArgb(255, 140, 220, 255),
                70f))
            {
                g.FillPath(glassBrush, lensPath);
            }

            // Specular Glare Arc
            using (Pen glarePen = new Pen(Color.FromArgb(250, 255, 255, 255), 3f))
            {
                glarePen.StartCap = LineCap.Round;
                glarePen.EndCap = LineCap.Round;
                if (isLeft)
                {
                    g.DrawCurve(glarePen, new Point[] {
                        new Point(160, 185),
                        new Point(175, 176),
                        new Point(195, 187)
                    });
                    g.FillEllipse(Brushes.White, 163, 193, 4, 4);
                }
                else
                {
                    g.DrawCurve(glarePen, new Point[] {
                        new Point(267, 185),
                        new Point(252, 176),
                        new Point(232, 187)
                    });
                    g.FillEllipse(Brushes.White, 260, 193, 4, 4);
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing"

$prof = 'c:\laragon\www\web portofolio evreki\foto\profile-transparent.png'
$miles = 'c:\laragon\www\web portofolio evreki\foto\miles-reference.png'
$out = 'c:\laragon\www\web portofolio evreki\foto\spiderman-hero.png'

[SpidermanCompositor]::GenerateSuit($prof, $miles, $out)
Write-Host "Photorealistic Miles Morales PNG generated successfully!"
