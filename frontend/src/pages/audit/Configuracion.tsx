import AuditTable from '@/components/audit/AuditTable'
import { mockConfigLogs, getActionIcon, getActionColor } from '@/utils/auditUtils'

export default function ConfiguracionPage() {
    return (
        <AuditTable
            title="Cambios en Configuración"
            description="Modificaciones en departamentos, cargos, regiones y sedes"
            logs={mockConfigLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
        />
    )
}
