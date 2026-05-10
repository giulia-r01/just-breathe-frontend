import { Card, type CardProps } from "react-bootstrap"

type JBCardVariant = "surface" | "elevated" | "flat"

interface JBCardProps extends CardProps {
  variantStyle?: JBCardVariant
}

const variantMap: Record<JBCardVariant, string> = {
  surface: "jb-card-surface",
  elevated: "jb-card-elevated",
  flat: "jb-card-flat",
}

const JBCard = ({
  variantStyle = "surface",
  className = "",
  ...props
}: JBCardProps) => {
  return (
    <Card
      {...props}
      className={`${variantMap[variantStyle]} ${className}`.trim()}
    />
  )
}

export default JBCard

