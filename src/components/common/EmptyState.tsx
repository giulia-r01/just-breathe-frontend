import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description?: ReactNode
  iconClassName?: string
  className?: string
  compact?: boolean
}

const EmptyState = ({
  title,
  description,
  iconClassName = "bi bi-inbox",
  className = "",
  compact = false,
}: EmptyStateProps) => {
  return (
    <div
      className={`jb-empty-state ${compact ? "jb-empty-state-compact" : ""} ${className}`.trim()}
    >
      <div className="jb-empty-state-icon" aria-hidden="true">
        <i className={iconClassName} />
      </div>
      <h3 className="jb-empty-state-title">{title}</h3>
      {description ? (
        <p className="jb-empty-state-text mb-0">{description}</p>
      ) : null}
    </div>
  )
}

export default EmptyState
