import AppKit

for size in [48, 96, 128] {
    let image = NSImage(size: NSSize(width: size, height: size))
    image.lockFocus()
    NSColor(calibratedRed: 0.18, green: 0.16, blue: 0.27, alpha: 1).setFill()
    NSBezierPath(roundedRect: NSRect(x: 0, y: 0, width: size, height: size), xRadius: CGFloat(size) * 0.23, yRadius: CGFloat(size) * 0.23).fill()
    NSColor(calibratedRed: 0.82, green: 0.76, blue: 1, alpha: 1).setFill()
    NSBezierPath(ovalIn: NSRect(x: CGFloat(size) * 0.23, y: CGFloat(size) * 0.19, width: CGFloat(size) * 0.60, height: CGFloat(size) * 0.60)).fill()
    NSColor(calibratedRed: 0.18, green: 0.16, blue: 0.27, alpha: 1).setFill()
    NSBezierPath(ovalIn: NSRect(x: CGFloat(size) * 0.39, y: CGFloat(size) * 0.30, width: CGFloat(size) * 0.54, height: CGFloat(size) * 0.54)).fill()
    image.unlockFocus()
    let bitmap = NSBitmapImageRep(data: image.tiffRepresentation!)!
    try bitmap.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "extension/icon-\(size).png"))
}
