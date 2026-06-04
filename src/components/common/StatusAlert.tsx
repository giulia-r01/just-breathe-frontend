import { Alert } from "react-bootstrap"

interface StatusAlertProps {
  message: string
  variant: "success" | "danger"
}

const StatusAlert = ({ message, variant }: StatusAlertProps) => {
  return (
    <div role="alert">
      <Alert variant={variant} className="jb-status-alert">
        {message}
      </Alert>
    </div>
  )
}

export default StatusAlert
