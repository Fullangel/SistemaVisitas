import AuditTable from '@/components/audit/AuditTable'
import { mockAccessLogs, getActionIcon, getActionColor } from '@/utils/auditUtils'

export default function AccesosPage() {
    return (
        <AuditTable
            title="Accesos al Sistema"
            description="Inicios de sesión exitosos y fallidos"
            logs={mockAccessLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
        />
    )
}
