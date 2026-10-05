Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class ChromaKey {
  public static void Run(string input, string output) {
    using (var raw = new Bitmap(input))
    using (var bmp = new Bitmap(raw.Width, raw.Height, PixelFormat.Format32bppArgb)) {
      using (var g = Graphics.FromImage(bmp)) {
        g.DrawImage(raw, 0, 0, raw.Width, raw.Height);
      }
      var rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
      var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      int bytes = Math.Abs(data.Stride) * bmp.Height;
      byte[] px = new byte[bytes];
      Marshal.Copy(data.Scan0, px, 0, bytes);
      int kr = 0, kg = 0, kb = 0, samples = 0;
      for (int cy = 0; cy < bmp.Height; cy += Math.Max(1, bmp.Height - 3)) {
        for (int cx = 0; cx < bmp.Width; cx += Math.Max(1, bmp.Width - 3)) {
          int ci = cy * data.Stride + cx * 4;
          kb += px[ci]; kg += px[ci + 1]; kr += px[ci + 2]; samples++;
        }
      }
      kr /= samples; kg /= samples; kb /= samples;
      int minX = bmp.Width, minY = bmp.Height, maxX = 0, maxY = 0;
      for (int y = 0; y < bmp.Height; y++) {
        int row = y * data.Stride;
        for (int x = 0; x < bmp.Width; x++) {
          int i = row + x * 4;
          byte b = px[i];
          byte gg = px[i + 1];
          byte r = px[i + 2];
          int dr = r - kr;
          int dg = gg - kg;
          int db = b - kb;
          int dist2 = dr * dr + dg * dg + db * db;
          bool rose = r > 155 && gg < 70 && b > 60 && (r - gg) > 90;
          byte a = 255;
          if (rose || dist2 < 55 * 55) a = 0;
          else if (dist2 < 100 * 100) a = (byte)((Math.Sqrt(dist2) - 55) * 255 / 45);
          px[i + 3] = a;
        }
      }
      byte[] edge = new byte[bmp.Width * bmp.Height];
      for (int pass = 0; pass < 3; pass++) {
        for (int y = 0; y < bmp.Height; y++) {
          int row = y * data.Stride;
          for (int x = 0; x < bmp.Width; x++) edge[y * bmp.Width + x] = px[row + x * 4 + 3];
        }
        for (int y = 1; y < bmp.Height - 1; y++) {
          int row = y * data.Stride;
          for (int x = 1; x < bmp.Width - 1; x++) {
            int i = row + x * 4;
            if (px[i + 3] == 0) continue;
            bool near = edge[(y - 1) * bmp.Width + x] < 20 || edge[(y + 1) * bmp.Width + x] < 20
              || edge[y * bmp.Width + x - 1] < 20 || edge[y * bmp.Width + x + 1] < 20;
            if (!near) continue;
            byte b = px[i];
            byte gg = px[i + 1];
            byte r = px[i + 2];
            if (r > 120 && gg < 130 && b > 60 && (r - gg) > 25 && (b - gg) > 8) px[i + 3] = 0;
          }
        }
      }
      minX = bmp.Width; minY = bmp.Height; maxX = 0; maxY = 0;
      for (int y = 0; y < bmp.Height; y++) {
        int row = y * data.Stride;
        for (int x = 0; x < bmp.Width; x++) {
          if (px[row + x * 4 + 3] > 48) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      Marshal.Copy(px, 0, data.Scan0, bytes);
      bmp.UnlockBits(data);
      int pad = 6;
      minX = Math.Max(0, minX - pad);
      minY = Math.Max(0, minY - pad);
      maxX = Math.Min(bmp.Width - 1, maxX + pad);
      maxY = Math.Min(bmp.Height - 1, maxY + pad);
      int w = Math.Max(1, maxX - minX + 1);
      int h = Math.Max(1, maxY - minY + 1);
      using (var crop = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
        using (var g2 = Graphics.FromImage(crop)) {
          g2.CompositingMode = CompositingMode.SourceCopy;
          g2.DrawImage(bmp, new Rectangle(0, 0, w, h), new Rectangle(minX, minY, w, h), GraphicsUnit.Pixel);
        }
        crop.Save(output, ImageFormat.Png);
      }
    }
  }
}
"@

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "assets-src"
if (-not (Test-Path $src)) { $src = "C:\Users\aaron\.cursor\projects\c-Users-aaron-OneDrive-Desktop-COLEGEsIMGAME\assets" }
$people = Join-Path $root "public\art\people"
$places = Join-Path $root "public\art\places"
New-Item -ItemType Directory -Force -Path $people | Out-Null
New-Item -ItemType Directory -Force -Path $places | Out-Null

1..18 | ForEach-Object {
  $n = "{0:D2}" -f $_
  $jpg = Join-Path $src "look-$n.jpg"
  $png = Join-Path $src "look-$n.png"
  $inputPath = if (Test-Path $jpg) { $jpg } elseif (Test-Path $png) { $png } else { $null }
  if (-not $inputPath) { throw "Missing look-$n" }
  $out = Join-Path $people "look-$n.png"
  [ChromaKey]::Run($inputPath, $out)
  Write-Output "keyed $n"
}

$ids = @("quad","dorm","library","lecture","dining","store","apartment","career","party","street","cafe","graduation","clinic","office","bus")
foreach ($id in $ids) {
  Copy-Item (Join-Path $src "place-$id.jpg") (Join-Path $places "$id.jpg") -Force
  Write-Output "placed $id"
}
