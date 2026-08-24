$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class MasterMilesCompositor
{
    public static void GenerateSuit(string profilePath, string outputPath)
    {
        using (Bitmap profile = new Bitmap(profilePath))
        {
            int w = profile.Width;  // 427
            int h = profile.Height; // 584

            using (Bitmap outBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            using (Graphics g = Graphics.FromImage(outBmp))
            {
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                // ==================== 1. 3D STUDIO LIGHTING & CARBON FIBER SUIT ====================
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        Color pCol = profile.GetPixel(x, y);
                        if (pCol.A > 15)
                        {
                            // 3D Lighting dome
                            double dx = (x - 213.5) / 180.0;
                            double dy = (y - 240.0) / 280.0;
                            double distSq = (dx * dx) + (dy * dy);

                            int weave = ((x % 3 - 1) * (y % 3 - 1)) * 3;
                            int baseVal = Math.Max(12, Math.Min(60, (int)(40 - (distSq * 24) + weave)));

                            // High-rise shoulder top deltoid highlight
                            if (y > 295 && y < 365 && Math.Abs(x - 213.5) > 60)
                            {
                                baseVal = Math.Min(88, baseVal + 30);
                            }

                            // Head micro-ribs
                            if (y < 315 && y % 4 == 0)
                            {
                                baseVal = Math.Min(95, baseVal + 14);
                            }

                            int r = (int)(baseVal * 0.92);
                            int gVal = (int)(baseVal * 0.96);
                            int b = (int)(baseVal * 1.18);

                            outBmp.SetPixel(x, y, Color.FromArgb(pCol.A, r, gVal, b));
                        }
                    }
                }

                // ==================== 2. MILES MORALES RED SHOULDER WINGS & V-STRIPES ====================
                using (LinearGradientBrush redBrush = new LinearGradientBrush(
                    new Rectangle(0, 280, 427, 300),
                    Color.FromArgb(255, 255, 30, 70),
                    Color.FromArgb(245, 140, 8, 38),
                    45f))
                using (Pen redPen = new Pen(Color.FromArgb(255, 255, 70, 110), 2.5f))
                {
                    // Left shoulder wing plate (High-rise aligned with scanned shoulders)
                    Point[] leftPts = new Point[] {
                        new Point(140, 300),
                        new Point(106, 325),
                        new Point(62, 340),
                        new Point(15, 355),
                        new Point(8, 395),
                        new Point(48, 385),
                        new Point(98, 350),
                        new Point(148, 330)
                    };
                    g.FillPolygon(redBrush, leftPts);
                    g.DrawPolygon(redPen, leftPts);

                    // Right shoulder wing plate
                    Point[] rightPts = new Point[] {
                        new Point(287, 300),
                        new Point(321, 325),
                        new Point(365, 340),
                        new Point(412, 355),
                        new Point(419, 395),
                        new Point(379, 385),
                        new Point(329, 350),
                        new Point(279, 330)
                    };
                    g.FillPolygon(redBrush, rightPts);
                    g.DrawPolygon(redPen, rightPts);

                    // Center Chest V-Stripe Contour
                    Point[] chestVLeft = new Point[] {
                        new Point(148, 330),
                        new Point(203, 390),
                        new Point(203, 584),
                        new Point(183, 584),
                        new Point(183, 410),
                        new Point(135, 340)
                    };
                    g.FillPolygon(redBrush, chestVLeft);

                    Point[] chestVRight = new Point[] {
                        new Point(279, 330),
                        new Point(224, 390),
                        new Point(224, 584),
                        new Point(244, 584),
                        new Point(244, 410),
                        new Point(292, 340)
                    };
                    g.FillPolygon(redBrush, chestVRight);
                }

                // ==================== 3. EMBOSSED 3D RED WEBBING ====================
                using (Pen penDark = new Pen(Color.FromArgb(230, 0, 0, 0), 3.2f))
                using (Pen penGlow = new Pen(Color.FromArgb(245, 255, 30, 75), 1.8f))
                {
                    int[][] webCoords = new int[][] {
                        new int[] { 213, 230, 213, 50 },
                        new int[] { 213, 230, 178, 55 },
                        new int[] { 213, 230, 248, 55 },
                        new int[] { 213, 230, 142, 75 },
                        new int[] { 213, 230, 284, 75 },
                        new int[] { 213, 230, 120, 115 },
                        new int[] { 213, 230, 306, 115 },
                        new int[] { 213, 230, 118, 175 },
                        new int[] { 213, 230, 308, 175 },
                        new int[] { 213, 230, 125, 235 },
                        new int[] { 213, 230, 301, 235 },
                        new int[] { 213, 230, 145, 280 },
                        new int[] { 213, 230, 281, 280 },
                        new int[] { 213, 230, 175, 305 },
                        new int[] { 213, 230, 251, 305 },
                        new int[] { 213, 230, 213, 316 }
                    };

                    foreach (var line in webCoords)
                    {
                        g.DrawLine(penDark, line[0], line[1], line[2], line[3]);
                        g.DrawLine(penGlow, line[0], line[1], line[2], line[3]);
                    }

                    int[][] arcs = new int[][] {
                        new int[] { 195, 210, 213, 200, 231, 210 },
                        new int[] { 182, 184, 213, 170, 244, 184 },
                        new int[] { 166, 156, 213, 138, 260, 156 },
                        new int[] { 146, 124, 213, 98, 280, 124 },
                        new int[] { 130, 88, 213, 62, 296, 88 },
                        new int[] { 195, 248, 213, 258, 231, 248 },
                        new int[] { 178, 270, 213, 284, 248, 270 },
                        new int[] { 160, 292, 213, 308, 266, 292 }
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

                // ==================== 4. OFFICIAL MILES MORALES SPIDER CHEST EMBLEM ====================
                DrawMilesChestSpider(g, 213.5f, 446f, 1.4f);

                // ==================== 5. AUTHENTIC AGGRESSIVE MILES MORALES 3D CAT-EYE LENSES ====================
                DrawAuthenticSpiderEye(g, true);
                DrawAuthenticSpiderEye(g, false);

                // ==================== 6. EXACT SILHOUETTE ALPHA CLIPPING ====================
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        if (profile.GetPixel(x, y).A < 20)
                        {
                            outBmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        }
                    }
                }

                outBmp.Save(outputPath, ImageFormat.Png);
            }
        }
    }

    // Authentic Sleek Cat-Eye Spider-Man Lenses
    private static void DrawAuthenticSpiderEye(Graphics g, bool isLeft)
    {
        int cx = isLeft ? 172 : 255;
        int cy = 196;

        using (GraphicsPath bevelPath = new GraphicsPath())
        using (GraphicsPath lensPath = new GraphicsPath())
        {
            if (isLeft)
            {
                // Left Eye: Slants from top outer temple (138, 168) down to inner nose (206, 198)
                Point[] bevelPoints = new Point[] {
                    new Point(138, 168), // Sharp outer temple tip
                    new Point(165, 178), // Top edge sloping inward
                    new Point(188, 188),
                    new Point(206, 198), // Inner nose corner
                    new Point(195, 218), // Bottom edge sweeping down
                    new Point(175, 226),
                    new Point(152, 218),
                    new Point(140, 195)
                };
                bevelPath.AddClosedCurve(bevelPoints, 0.25f);

                Point[] lensPoints = new Point[] {
                    new Point(144, 173),
                    new Point(166, 182),
                    new Point(186, 191),
                    new Point(201, 199),
                    new Point(191, 214),
                    new Point(174, 220),
                    new Point(155, 214),
                    new Point(146, 195)
                };
                lensPath.AddClosedCurve(lensPoints, 0.25f);
            }
            else
            {
                // Right Eye (Mirror)
                Point[] bevelPoints = new Point[] {
                    new Point(289, 168), // Sharp outer temple tip
                    new Point(262, 178), // Top edge sloping inward
                    new Point(239, 188),
                    new Point(221, 198), // Inner nose corner
                    new Point(232, 218), // Bottom edge sweeping down
                    new Point(252, 226),
                    new Point(275, 218),
                    new Point(287, 195)
                };
                bevelPath.AddClosedCurve(bevelPoints, 0.25f);

                Point[] lensPoints = new Point[] {
                    new Point(283, 173),
                    new Point(261, 182),
                    new Point(241, 191),
                    new Point(226, 199),
                    new Point(236, 214),
                    new Point(253, 220),
                    new Point(272, 214),
                    new Point(281, 195)
                };
                lensPath.AddClosedCurve(lensPoints, 0.25f);
            }

            // 1. Drop Shadow
            using (SolidBrush shadowBrush = new SolidBrush(Color.FromArgb(240, 0, 0, 0)))
            {
                g.FillPath(shadowBrush, bevelPath);
            }

            // 2. Thick Crimson Red Metallic Bevel Frame
            using (LinearGradientBrush bevelBrush = new LinearGradientBrush(
                new Rectangle(cx - 50, cy - 50, 100, 100),
                Color.FromArgb(255, 255, 35, 75),
                Color.FromArgb(255, 140, 10, 38),
                45f))
            using (Pen bevelPen = new Pen(Color.FromArgb(255, 255, 80, 120), 2.5f))
            {
                g.FillPath(bevelBrush, bevelPath);
                g.DrawPath(bevelPen, bevelPath);
            }

            // 3. Reflective Chrome Glass Lens
            using (LinearGradientBrush glassBrush = new LinearGradientBrush(
                new Rectangle(cx - 40, cy - 40, 80, 80),
                Color.FromArgb(255, 255, 255, 255),
                Color.FromArgb(255, 140, 225, 255),
                65f))
            {
                g.FillPath(glassBrush, lensPath);
            }

            // 4. White Specular Glare Arc & Glow
            using (Pen glarePen = new Pen(Color.FromArgb(250, 255, 255, 255), 3.5f))
            {
                glarePen.StartCap = LineCap.Round;
                glarePen.EndCap = LineCap.Round;
                if (isLeft)
                {
                    g.DrawCurve(glarePen, new Point[] {
                        new Point(148, 175),
                        new Point(168, 183),
                        new Point(190, 194)
                    });
                    g.FillEllipse(Brushes.White, 150, 183, 4, 4);
                }
                else
                {
                    g.DrawCurve(glarePen, new Point[] {
                        new Point(279, 175),
                        new Point(259, 183),
                        new Point(237, 194)
                    });
                    g.FillEllipse(Brushes.White, 273, 183, 4, 4);
                }
            }
        }
    }

    // Authentic Miles Morales 8-Legged Spider
    private static void DrawMilesChestSpider(Graphics g, float cx, float cy, float scale)
    {
        using (LinearGradientBrush spiderGrad = new LinearGradientBrush(
            new RectangleF(cx - 80 * scale, cy - 80 * scale, 160 * scale, 160 * scale),
            Color.FromArgb(255, 255, 30, 75),
            Color.FromArgb(255, 150, 8, 36),
            90f))
        using (SolidBrush shadowBrush = new SolidBrush(Color.FromArgb(220, 0, 0, 0)))
        {
            // Draw 3D shadow offset
            DrawSpiderGeometric(g, shadowBrush, cx, cy + 2.5f, scale);
            // Draw Glowing Red Spider
            DrawSpiderGeometric(g, spiderGrad, cx, cy, scale);
        }
    }

    private static void DrawSpiderGeometric(Graphics g, Brush brush, float cx, float cy, float scale)
    {
        // Abdomen & Thorax
        g.FillEllipse(brush, cx - 6.5f * scale, cy - 4f * scale, 13f * scale, 32f * scale);
        g.FillEllipse(brush, cx - 5f * scale, cy - 19f * scale, 10f * scale, 13f * scale);

        // Head Pincers
        PointF[] pincerLeft = new PointF[] {
            new PointF(cx - 4.5f * scale, cy - 19f * scale),
            new PointF(cx - 1f * scale, cy - 28f * scale),
            new PointF(cx - 2f * scale, cy - 19f * scale)
        };
        g.FillPolygon(brush, pincerLeft);
        PointF[] pincerRight = new PointF[] {
            new PointF(cx + 4.5f * scale, cy - 19f * scale),
            new PointF(cx + 1f * scale, cy - 28f * scale),
            new PointF(cx + 2f * scale, cy - 19f * scale)
        };
        g.FillPolygon(brush, pincerRight);

        // 8 Long Slender Arachnid Legs (Sweeping like PS5 Miles Morales Emblem)
        // Leg 1 (Top Left)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx - 3f * scale, cy - 12f * scale),
            new PointF(cx - 28f * scale, cy - 32f * scale),
            new PointF(cx - 24f * scale, cy - 54f * scale),
            new PointF(cx - 19f * scale, cy - 48f * scale),
            new PointF(cx - 22f * scale, cy - 28f * scale),
            new PointF(cx - 2f * scale, cy - 8f * scale)
        });
        // Leg 1 (Top Right)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx + 3f * scale, cy - 12f * scale),
            new PointF(cx + 28f * scale, cy - 32f * scale),
            new PointF(cx + 24f * scale, cy - 54f * scale),
            new PointF(cx + 19f * scale, cy - 48f * scale),
            new PointF(cx + 22f * scale, cy - 28f * scale),
            new PointF(cx + 2f * scale, cy - 8f * scale)
        });

        // Leg 2 (Upper Mid Left)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx - 3f * scale, cy - 4f * scale),
            new PointF(cx - 40f * scale, cy - 16f * scale),
            new PointF(cx - 36f * scale, cy - 38f * scale),
            new PointF(cx - 30f * scale, cy - 32f * scale),
            new PointF(cx - 34f * scale, cy - 12f * scale),
            new PointF(cx - 2f * scale, cy - 1f * scale)
        });
        // Leg 2 (Upper Mid Right)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx + 3f * scale, cy - 4f * scale),
            new PointF(cx + 40f * scale, cy - 16f * scale),
            new PointF(cx + 36f * scale, cy - 38f * scale),
            new PointF(cx + 30f * scale, cy - 32f * scale),
            new PointF(cx + 34f * scale, cy - 12f * scale),
            new PointF(cx + 2f * scale, cy - 1f * scale)
        });

        // Leg 3 (Lower Mid Left)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx - 3f * scale, cy + 3f * scale),
            new PointF(cx - 48f * scale, cy + 16f * scale),
            new PointF(cx - 42f * scale, cy + 44f * scale),
            new PointF(cx - 37f * scale, cy + 38f * scale),
            new PointF(cx - 42f * scale, cy + 12f * scale),
            new PointF(cx - 2f * scale, cy + 7f * scale)
        });
        // Leg 3 (Lower Mid Right)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx + 3f * scale, cy + 3f * scale),
            new PointF(cx + 48f * scale, cy + 16f * scale),
            new PointF(cx + 42f * scale, cy + 44f * scale),
            new PointF(cx + 37f * scale, cy + 38f * scale),
            new PointF(cx + 42f * scale, cy + 12f * scale),
            new PointF(cx + 2f * scale, cy + 7f * scale)
        });

        // Leg 4 (Bottom Left)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx - 3f * scale, cy + 11f * scale),
            new PointF(cx - 34f * scale, cy + 44f * scale),
            new PointF(cx - 16f * scale, cy + 76f * scale),
            new PointF(cx - 12f * scale, cy + 70f * scale),
            new PointF(cx - 28f * scale, cy + 40f * scale),
            new PointF(cx - 2f * scale, cy + 15f * scale)
        });
        // Leg 4 (Bottom Right)
        DrawLegSegment(g, brush, new PointF[] {
            new PointF(cx + 3f * scale, cy + 11f * scale),
            new PointF(cx + 34f * scale, cy + 44f * scale),
            new PointF(cx + 16f * scale, cy + 76f * scale),
            new PointF(cx + 12f * scale, cy + 70f * scale),
            new PointF(cx + 28f * scale, cy + 40f * scale),
            new PointF(cx + 2f * scale, cy + 15f * scale)
        });
    }

    private static void DrawLegSegment(Graphics g, Brush brush, PointF[] points)
    {
        using (GraphicsPath path = new GraphicsPath())
        {
            path.AddPolygon(points);
            g.FillPath(brush, path);
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing"

$prof = 'c:\laragon\www\web portofolio evreki\foto\profile-transparent.png'
$out = 'c:\laragon\www\web portofolio evreki\foto\spiderman-hero.png'

[MasterMilesCompositor]::GenerateSuit($prof, $out)
Write-Host "Authentic Cat-Eye Miles Morales PNG regenerated with correct legs!"
