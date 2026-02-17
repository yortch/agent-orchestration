/**
 * sprites.js
 * Helper functions for drawing complex Valentine-themed shapes
 * Provides reusable shape primitives for the rendering layer
 */

/**
 * Draw a heart shape using bezier curves
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position (top of heart)
 * @param {number} size - Size of the heart
 */
export function heartShape(ctx, x, y, size) {
    const topY = y;
    const bottomY = y + size;
    
    ctx.beginPath();
    
    // Start at bottom point
    ctx.moveTo(x, bottomY);
    
    // Left side of heart
    ctx.bezierCurveTo(
        x - size * 0.5, bottomY - size * 0.5,
        x - size * 0.5, topY + size * 0.3,
        x, topY + size * 0.3
    );
    
    // Left lobe
    ctx.bezierCurveTo(
        x - size * 0.25, topY,
        x - size * 0.5, topY,
        x - size * 0.5, topY + size * 0.15
    );
    ctx.bezierCurveTo(
        x - size * 0.5, topY,
        x - size * 0.25, topY,
        x, topY + size * 0.3
    );
    
    // Right lobe
    ctx.bezierCurveTo(
        x + size * 0.25, topY,
        x + size * 0.5, topY,
        x + size * 0.5, topY + size * 0.15
    );
    ctx.bezierCurveTo(
        x + size * 0.5, topY,
        x + size * 0.25, topY,
        x, topY + size * 0.3
    );
    
    // Right side of heart
    ctx.bezierCurveTo(
        x + size * 0.5, topY + size * 0.3,
        x + size * 0.5, bottomY - size * 0.5,
        x, bottomY
    );
    
    ctx.closePath();
}

/**
 * Draw an arrow/cupid arrow shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Starting x position (arrow tip)
 * @param {number} y - Starting y position
 * @param {number} length - Length of the arrow
 * @param {number} angle - Angle in radians (0 = pointing right)
 */
export function arrowShape(ctx, x, y, length, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.beginPath();
    
    // Arrow shaft
    ctx.moveTo(0, 0);
    ctx.lineTo(-length, 0);
    
    // Arrowhead
    ctx.moveTo(0, 0);
    ctx.lineTo(-length * 0.15, -length * 0.1);
    ctx.moveTo(0, 0);
    ctx.lineTo(-length * 0.15, length * 0.1);
    
    // Fletching (feathers at back)
    ctx.moveTo(-length, -length * 0.08);
    ctx.lineTo(-length * 0.85, -length * 0.12);
    ctx.lineTo(-length * 0.85, 0);
    
    ctx.moveTo(-length, length * 0.08);
    ctx.lineTo(-length * 0.85, length * 0.12);
    ctx.lineTo(-length * 0.85, 0);
    
    ctx.restore();
}

/**
 * Draw a fluffy cloud using multiple overlapping circles
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} width - Width of the cloud
 * @param {number} height - Height of the cloud
 */
export function cloudShape(ctx, x, y, width, height) {
    const circles = [
        { offsetX: -width * 0.25, offsetY: 0, radius: height * 0.5 },
        { offsetX: width * 0.25, offsetY: 0, radius: height * 0.5 },
        { offsetX: 0, offsetY: -height * 0.15, radius: height * 0.55 },
        { offsetX: -width * 0.35, offsetY: height * 0.1, radius: height * 0.35 },
        { offsetX: width * 0.35, offsetY: height * 0.1, radius: height * 0.35 }
    ];
    
    ctx.beginPath();
    
    // Draw multiple circles to create fluffy cloud effect
    circles.forEach(circle => {
        ctx.moveTo(x + circle.offsetX + circle.radius, y + circle.offsetY);
        ctx.arc(
            x + circle.offsetX,
            y + circle.offsetY,
            circle.radius,
            0,
            Math.PI * 2
        );
    });
}

/**
 * Draw an envelope/letter shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Top-left x position
 * @param {number} y - Top-left y position
 * @param {number} width - Width of envelope
 * @param {number} height - Height of envelope
 */
export function envelopeShape(ctx, x, y, width, height) {
    // Envelope body
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    
    // Envelope flap (triangle)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y + height * 0.4);
    ctx.lineTo(x + width, y);
    ctx.closePath();
}

/**
 * Draw a sparkle/star shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} size - Size of sparkle
 * @param {number} points - Number of points (default 4)
 */
export function sparkleShape(ctx, x, y, size, points = 4) {
    ctx.beginPath();
    
    for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i;
        const radius = i % 2 === 0 ? size : size * 0.4;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    
    ctx.closePath();
}

/**
 * Draw a bow shape (for Cupid's cloud)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} size - Size of bow
 */
export function bowShape(ctx, x, y, size) {
    // Left loop
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y, size * 0.25, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    // Right loop
    ctx.beginPath();
    ctx.arc(x + size * 0.3, y, size * 0.25, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    // Center knot
    ctx.beginPath();
    ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    // Ribbon tails
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.15);
    ctx.lineTo(x - size * 0.2, y + size * 0.5);
    ctx.lineTo(x - size * 0.1, y + size * 0.45);
    ctx.lineTo(x, y + size * 0.15);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.15);
    ctx.lineTo(x + size * 0.2, y + size * 0.5);
    ctx.lineTo(x + size * 0.1, y + size * 0.45);
    ctx.lineTo(x, y + size * 0.15);
    ctx.closePath();
    ctx.fill();
}

/**
 * Draw an engagement ring shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} size - Size of ring
 */
export function ringShape(ctx, x, y, size) {
    // Ring band
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.closePath();
    
    // Inner circle (hollow ring)
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2, true);
    
    // Diamond on top (simplified as a rotated square)
    const diamondSize = size * 0.3;
    ctx.save();
    ctx.translate(x, y - size * 0.5);
    ctx.rotate(Math.PI / 4);
    ctx.rect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize);
    ctx.restore();
}

/**
 * Draw a chocolate box shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} size - Size of box
 */
export function chocolateBoxShape(ctx, x, y, size) {
    const boxWidth = size * 0.9;
    const boxHeight = size * 0.7;
    
    // Box base
    ctx.beginPath();
    ctx.rect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
    ctx.closePath();
    
    // Decorative ribbon (cross pattern)
    const ribbonWidth = size * 0.12;
    
    // Vertical ribbon
    ctx.rect(x - ribbonWidth / 2, y - boxHeight / 2, ribbonWidth, boxHeight);
    
    // Horizontal ribbon
    ctx.rect(x - boxWidth / 2, y - ribbonWidth / 2, boxWidth, ribbonWidth);
}

/**
 * Draw a love letter shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} size - Size of letter
 */
export function loveLetterShape(ctx, x, y, size) {
    const width = size * 0.8;
    const height = size * 0.6;
    const flap = height * 0.4;
    
    // Envelope base
    ctx.beginPath();
    ctx.rect(x - width / 2, y - height / 2, width, height);
    ctx.closePath();
    
    // Envelope flap (triangle)
    ctx.moveTo(x - width / 2, y - height / 2);
    ctx.lineTo(x, y - height / 2 + flap);
    ctx.lineTo(x + width / 2, y - height / 2);
    ctx.lineTo(x - width / 2, y - height / 2);
    
    // Small heart seal on flap (two circles forming a heart)
    const sealX = x;
    const sealY = y - height / 2 + flap * 0.3;
    const heartSize = size * 0.15;
    
    ctx.arc(sealX - heartSize * 0.2, sealY, heartSize * 0.15, 0, Math.PI * 2);
    ctx.arc(sealX + heartSize * 0.2, sealY, heartSize * 0.15, 0, Math.PI * 2);
}

