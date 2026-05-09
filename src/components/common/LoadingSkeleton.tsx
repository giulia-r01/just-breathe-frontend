import { Placeholder } from "react-bootstrap"

interface LoadingSkeletonProps {
  lines?: number
  compact?: boolean
  className?: string
  label?: string
}

const LoadingSkeleton = ({
  lines = 3,
  compact = false,
  className = "",
  label = "Caricamento contenuti",
}: LoadingSkeletonProps) => {
  return (
    <div
      className={`jb-loading-skeleton ${compact ? "jb-loading-skeleton-compact" : ""} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="visually-hidden">{label}</span>
      <Placeholder as="div" animation="glow" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <Placeholder
            key={index}
            xs={12}
            className={index === lines - 1 ? "w-75" : ""}
          />
        ))}
      </Placeholder>
    </div>
  )
}

export default LoadingSkeleton
