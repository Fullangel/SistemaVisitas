import AuditTable from '@/components/audit/AuditTable'
import { mockActivityLogs, getActionIcon, getActionColor } from '@/utils/auditUtils'

export default function ActividadesPage() {
    return (
        <AuditTable
            title="Registro de Actividades"
            description="Todas las acciones realizadas en el sistema"
            logs={mockActivityLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
        />
    )
}
