import { Button, type ButtonProps } from "react-bootstrap"

type JBButtonVariant =
  | "primary"
  | "outline"
  | "danger"
  | "ghost"
  | "pill"

interface JBButtonProps extends Omit<ButtonProps, "variant"> {
  variantStyle?: JBButtonVariant
}

const variantMap: Record<JBButtonVariant, string> = {
  primary: "jb-btn-primary",
  outline: "jb-btn-outline",
  danger: "jb-btn-danger",
  ghost: "jb-btn-ghost",
  pill: "jb-btn-pill",
}

const JBButton = ({
  variantStyle = "primary",
  className = "",
  ...props
}: JBButtonProps) => {
  return (
    <Button
      {...props}
      className={`${variantMap[variantStyle]} ${className}`.trim()}
    />
  )
}

export default JBButton

