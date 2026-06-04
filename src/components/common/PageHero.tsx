interface PageHeroProps {
  iconClassName: string
  title: string
  subtitle: string
  className?: string
}

const PageHero = ({
  iconClassName,
  title,
  subtitle,
  className = "",
}: PageHeroProps) => {
  return (
    <div className={`jb-page-hero ${className}`.trim()}>
      <div className="jb-page-hero-icon" aria-hidden="true">
        <i className={iconClassName} />
      </div>
      <div>
        <h2 className="jb-page-hero-title mb-1">{title}</h2>
        <p className="jb-page-hero-subtitle mb-0">{subtitle}</p>
      </div>
    </div>
  )
}

export default PageHero
