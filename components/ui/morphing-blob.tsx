interface MorphingBlobProps {
  className?: string
  color1?: string
  color2?: string
  size?: string
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay?: string
}

export function MorphingBlob({
  className = "",
  color1 = "from-primary/30",
  color2 = "to-secondary/30",
  size = "w-72 h-72",
  top,
  left,
  right,
  bottom,
  delay = "0s",
}: MorphingBlobProps) {
  const positionStyles = {
    top,
    left,
    right,
    bottom,
    animationDelay: delay,
  }

  return (
    <div
      className={`morph-blob ${size} bg-gradient-to-r ${color1} ${color2} ${className}`}
      style={positionStyles}
    ></div>
  )
}
