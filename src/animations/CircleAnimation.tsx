import { motion } from "framer-motion"
import "./CircleAnimation.css"

interface CircleAnimationProps {
  fase: "inspira" | "trattieni" | "espira" | "fermo"
  durataInspira: number
  durataTrattieni: number // <-- lo lasci nell'interfaccia se vuoi tenerlo documentato
  durataEspira: number
  className?: string
}

const CircleAnimation = ({
  fase,
  durataInspira,
  durataEspira,
  className = "",
}: Omit<CircleAnimationProps, "durataTrattieni"> & {
  durataTrattieni?: number
}) => {
  let animateProps = {}
  let transitionProps = {}

  switch (fase) {
    case "inspira":
      animateProps = { scale: 1.8 }
      transitionProps = { duration: durataInspira, ease: "easeInOut" }
      break
    case "espira":
      animateProps = { scale: 0.6 }
      transitionProps = { duration: durataEspira, ease: "easeInOut" }
      break
    case "trattieni":
      animateProps = { scale: 1.8 } // nessuna animazione
      transitionProps = {}
      break
    default:
      animateProps = { scale: 1 }
      transitionProps = {}
  }

  return (
    <motion.div
      className={`cerchio ${className}`}
      animate={animateProps}
      transition={transitionProps}
      aria-hidden="true"
    />
  )
}

export default CircleAnimation
