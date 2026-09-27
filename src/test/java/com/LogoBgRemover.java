package com;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;

public class LogoBgRemover {
    public static void main(String[] args) {
        try {
            File inputFile = new File("C:/Users/sharm/.gemini/antigravity-ide/brain/24c2bdbf-bd73-4b63-a2bc-b14de53247df/.user_uploaded/media_1790334696901.jpg");
            BufferedImage src = ImageIO.read(inputFile);
            int width = src.getWidth();
            int height = src.getHeight();

            System.out.println("Logo dimensions: " + width + "x" + height);

            // Sample background corners to get the bg color
            int[] corners = {
                src.getRGB(5, 5), src.getRGB(width - 5, 5),
                src.getRGB(5, height - 5), src.getRGB(width - 5, height - 5)
            };
            for (int rgb : corners) {
                Color c = new Color(rgb);
                System.out.printf("Corner: R=%d G=%d B=%d%n", c.getRed(), c.getGreen(), c.getBlue());
            }

            // Sample center background reference color (near white/cream)
            int bgRef = src.getRGB(5, 5);
            Color bgColor = new Color(bgRef);
            int bgR = bgColor.getRed();
            int bgG = bgColor.getGreen();
            int bgB = bgColor.getBlue();

            BufferedImage transparent = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

            // For each pixel, compute color distance to background
            // If distance is small => transparent (background)
            // Use flood-fill style: background is near corners
            // Threshold approach: if pixel is "close enough" to background => transparent
            
            float threshold = 30f; // Euclidean RGB distance
            
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    int rgb = src.getRGB(x, y);
                    Color c = new Color(rgb);
                    int r = c.getRed();
                    int g = c.getGreen();
                    int b = c.getBlue();
                    
                    // Distance to background
                    float dist = (float) Math.sqrt(
                        (r - bgR) * (r - bgR) +
                        (g - bgG) * (g - bgG) +
                        (b - bgB) * (b - bgB)
                    );
                    
                    int alpha;
                    if (dist < threshold) {
                        // Background: fully transparent
                        alpha = 0;
                    } else if (dist < threshold + 15) {
                        // Edge: smooth transition
                        alpha = (int) ((dist - threshold) / 15f * 255f);
                    } else {
                        // Logo foreground: fully opaque
                        alpha = 255;
                    }
                    
                    int argb = (alpha << 24) | (r << 16) | (g << 8) | b;
                    transparent.setRGB(x, y, argb);
                }
            }

            File outFile = new File("c:/cafe/src/main/resources/static/images/coffeego_logo.png");
            ImageIO.write(transparent, "PNG", outFile);
            System.out.println("Transparent logo saved: " + outFile.getAbsolutePath() + " (" + outFile.length() + " bytes)");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
