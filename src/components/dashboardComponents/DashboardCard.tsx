import { Card } from "react-bootstrap"
import type { PropsWithChildren, ReactNode } from "react"

interface DashboardCardProps extends PropsWithChildren {
  title: string
  iconClassName?: string
  subtitle?: string
  footer?: ReactNode
  className?: string
}

const DashboardCard = ({
  title,
  iconClassName,
  subtitle,
  footer,
  className = "",
  children,
}: DashboardCardProps) => {
  return (
    <Card className={`dashboard-card ${className}`}>
      <Card.Body className="d-flex flex-column h-100">
        <Card.Title as="h3" className="dashboard-card-title">
          {iconClassName ? (
            <i className={`${iconClassName} dashboard-card-icon`} aria-hidden="true" />
          ) : null}
          <span>{title}</span>
        </Card.Title>
        {subtitle ? <p className="dashboard-card-subtitle">{subtitle}</p> : null}
        <div className="flex-grow-1">{children}</div>
        {footer ? <div className="pt-3">{footer}</div> : null}
      </Card.Body>
    </Card>
  )
}

export default DashboardCard
