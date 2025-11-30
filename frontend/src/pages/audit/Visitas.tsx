import AuditTable from '@/components/audit/AuditTable'
import { mockVisitLogs, getActionIcon, getActionColor } from '@/utils/auditUtils'

export default function VisitasPage() {
    return (
        <AuditTable
            title="Historial de Visitas"
            description="Registro completo del ciclo de vida de las visitas"
            logs={mockVisitLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
        />
    )
}
