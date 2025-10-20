#!/bin/bash

# Script de Pruebas del Sistema de Visitas
# Este script automatiza las pruebas de todos los componentes

API_URL="http://localhost:8001/api"
REPORT_FILE="test_results.log"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        echo "✅ $2" >> $REPORT_FILE
    else
        echo -e "${RED}❌ $2${NC}"
        echo "❌ $2" >> $REPORT_FILE
    fi
}

# Función para hacer peticiones HTTP
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    if [ -z "$token" ]; then
        curl -s -X $method "$API_URL$endpoint" -H "Content-Type: application/json" -d "$data"
    else
        curl -s -X $method "$API_URL$endpoint" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "$data"
    fi
}

# Inicializar archivo de reporte
echo "=== REPORTE DE PRUEBAS DEL SISTEMA DE VISITAS ===" > $REPORT_FILE
echo "Fecha: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo -e "${YELLOW}🧪 INICIANDO PRUEBAS DEL SISTEMA DE VISITAS${NC}"
echo "================================="

# 1. PRUEBAS DE AUTENTICACIÓN
echo -e "${YELLOW}1. Pruebas de Autenticación${NC}"

# Login Admin
echo -n "  • Login Admin... "
ADMIN_RESPONSE=$(api_call "POST" "/login" '{"username":"admin","password":"password"}')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$ADMIN_TOKEN" ]; then
    print_result 0 "Login Admin exitoso"
else
    print_result 1 "Login Admin fallido"
fi

# Login Security
echo -n "  • Login Security... "
SECURITY_RESPONSE=$(api_call "POST" "/login" '{"username":"security1","password":"password"}')
SECURITY_TOKEN=$(echo $SECURITY_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$SECURITY_TOKEN" ]; then
    print_result 0 "Login Security exitoso"
else
    print_result 1 "Login Security fallido"
fi

# Login Employee
echo -n "  • Login Employee... "
EMPLOYEE_RESPONSE=$(api_call "POST" "/login" '{"username":"employee1","password":"password"}')
EMPLOYEE_TOKEN=$(echo $EMPLOYEE_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$EMPLOYEE_TOKEN" ]; then
    print_result 0 "Login Employee exitoso"
else
    print_result 1 "Login Employee fallido"
fi

# 2. PRUEBAS DE GESTIÓN DE VISITAS
echo -e "${YELLOW}2. Pruebas de Gestión de Visitas${NC}"

# Crear visita
echo -n "  • Crear Visita... "
VISIT_RESPONSE=$(api_call "POST" "/visits" '{
    "purpose":"Reunión de prueba",
    "description":"Visita de prueba automatizada",
    "visit_date":"2024-01-20",
    "entry_time":"09:00",
    "exit_time":"11:00",
    "visitor_name":"Usuario de Prueba",
    "visitor_email":"test@ejemplo.com",
    "visitor_phone":"+56912345678",
    "visitor_identification":"12.345.678-9",
    "visitor_company":"Empresa Test",
    "has_vehicle":true,
    "vehicle_plate":"TEST123",
    "vehicle_model":"Auto Test",
    "vehicle_color":"Rojo",
    "employee_id":1,
    "department_id":1,
    "headquarter_id":1,
    "priority":"medium"
}' "$ADMIN_TOKEN")

VISIT_ID=$(echo $VISIT_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
if [ ! -z "$VISIT_ID" ]; then
    print_result 0 "Visita creada exitosamente (ID: $VISIT_ID)"
else
    print_result 1 "Error al crear visita"
fi

# Listar visitas
echo -n "  • Listar Visitas... "
LIST_RESPONSE=$(api_call "GET" "/visits" "" "$ADMIN_TOKEN")
if echo $LIST_RESPONSE | grep -q "data"; then
    print_result 0 "Listado de visitas exitoso"
else
    print_result 1 "Error al listar visitas"
fi

# Actualizar estado de visita
echo -n "  • Actualizar Estado de Visita... "
STATUS_RESPONSE=$(api_call "PATCH" "/visits/$VISIT_ID/status" '{
    "status":"approved"
}' "$ADMIN_TOKEN")
if echo $STATUS_RESPONSE | grep -q "approved"; then
    print_result 0 "Estado actualizado exitosamente"
else
    print_result 1 "Error al actualizar estado"
fi

# 3. PRUEBAS DE SISTEMA DE NOTIFICACIONES
echo -e "${YELLOW}3. Pruebas de Sistema de Notificaciones${NC}"

# Obtener notificaciones
echo -n "  • Obtener Notificaciones... "
NOTIF_RESPONSE=$(api_call "GET" "/notifications" "" "$ADMIN_TOKEN")
if echo $NOTIF_RESPONSE | grep -q "data"; then
    print_result 0 "Notificaciones obtenidas exitosamente"
else
    print_result 1 "Error al obtener notificaciones"
fi

# 4. PRUEBAS DE LOGS DE AUDITORÍA
echo -e "${YELLOW}4. Pruebas de Logs de Auditoría${NC}"

# Obtener logs de visita
echo -n "  • Obtener Logs de Visita... "
LOGS_RESPONSE=$(api_call "GET" "/visits/$VISIT_ID/logs" "" "$ADMIN_TOKEN")
if echo $LOGS_RESPONSE | grep -q "action"; then
    print_result 0 "Logs obtenidos exitosamente"
else
    print_result 1 "Error al obtener logs"
fi

# 5. PRUEBAS DE PERMISOS POR ROL
echo -e "${YELLOW}5. Pruebas de Permisos por Rol${NC}"

# Security intenta crear visita
echo -n "  • Security creando visita... "
SECURITY_VISIT=$(api_call "POST" "/visits" '{
    "purpose":"Visita Security",
    "visit_date":"2024-01-21",
    "visitor_name":"Security Test",
    "visitor_identification":"98.765.432-1",
    "employee_id":1,
    "department_id":1,
    "headquarter_id":1,
    "priority":"low"
}' "$SECURITY_TOKEN")
if echo $SECURITY_VISIT | grep -q "id"; then
    print_result 0 "Security puede crear visitas"
else
    print_result 1 "Security no puede crear visitas"
fi

# Employee intenta crear visita
echo -n "  • Employee creando visita... "
EMPLOYEE_VISIT=$(api_call "POST" "/visits" '{
    "purpose":"Visita Employee",
    "visit_date":"2024-01-21",
    "visitor_name":"Employee Test",
    "visitor_identification":"11.223.344-5",
    "employee_id":1,
    "department_id":1,
    "headquarter_id":1,
    "priority":"low"
}' "$EMPLOYEE_TOKEN")
if echo $EMPLOYEE_VISIT | grep -q "id"; then
    print_result 0 "Employee puede crear visitas"
else
    print_result 1 "Employee no puede crear visitas"
fi

# 6. PRUEBAS DE VALIDACIÓN
echo -e "${YELLOW}6. Pruebas de Validación${NC}"

# Intentar crear visita sin datos requeridos
echo -n "  • Validación de campos requeridos... "
INVALID_VISIT=$(api_call "POST" "/visits" '{
    "purpose":""
}' "$ADMIN_TOKEN")
if echo $INVALID_VISIT | grep -q "error"; then
    print_result 0 "Validación funcionando correctamente"
else
    print_result 1 "Validación no detecta errores"
fi

# RESUMEN FINAL
echo ""
echo "================================="
echo -e "${YELLOW}📊 RESUMEN DE PRUEBAS${NC}"
echo "================================="

TOTAL_TESTS=$(grep -c "✅\|❌" $REPORT_FILE)
PASSED_TESTS=$(grep -c "✅" $REPORT_FILE)
FAILED_TESTS=$(grep -c "❌" $REPORT_FILE)

echo "Total de pruebas: $TOTAL_TESTS"
echo -e "Pruebas exitosas: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Pruebas fallidas: ${RED}$FAILED_TESTS${NC}"

SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Tasa de éxito: ${YELLOW}$SUCCESS_RATE%${NC}"

echo ""
echo "📄 Reporte detallado guardado en: $REPORT_FILE"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Algunas pruebas fallaron. Revisa el reporte para más detalles.${NC}"
    exit 1
fi