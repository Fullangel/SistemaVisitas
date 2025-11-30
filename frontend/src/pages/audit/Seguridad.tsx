import AuditTable from '@/components/audit/AuditTable'
import { mockSecurityLogs, getActionIcon, getActionColor } from '@/utils/auditUtils'

export default function SeguridadPage() {
    return (
        <AuditTable
            title="Reportes de Seguridad"
            description="Actividades sospechosas y alertas del sistema"
            logs={mockSecurityLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
        />
    )
}
