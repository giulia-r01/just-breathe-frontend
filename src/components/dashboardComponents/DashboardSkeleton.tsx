import { Placeholder } from "react-bootstrap"
import DashboardCard from "./DashboardCard"

interface DashboardSkeletonProps {
  title: string
  iconClassName?: string
  lines?: number
}

const DashboardSkeleton = ({
  title,
  iconClassName,
  lines = 3,
}: DashboardSkeletonProps) => {
  return (
    <DashboardCard
      title={title}
      iconClassName={iconClassName}
      subtitle="Caricamento contenuti"
      className="dashboard-skeleton-card"
    >
      <Placeholder as="p" animation="glow" aria-hidden="true" className="mb-0">
        {Array.from({ length: lines }).map((_, index) => (
          <Placeholder key={index} xs={12} className={index === lines - 1 ? "w-75" : ""} />
        ))}
      </Placeholder>
    </DashboardCard>
  )
}

export default DashboardSkeleton
