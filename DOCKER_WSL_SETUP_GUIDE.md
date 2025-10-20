# 🐳 Guía de Configuración Docker Desktop con WSL2

## 📋 Requisitos Previos

✅ **Verificado:** Tienes WSL2 con Ubuntu 24.04 funcionando
✅ **Verificado:** Docker Desktop está instalado en Windows
❌ **Pendiente:** Configurar integración WSL2 en Docker Desktop

## 🔧 Pasos de Configuración

### 1. En Windows - Docker Desktop

#### Abrir Docker Desktop
- Busca "Docker Desktop" en el menú inicio de Windows
- Asegúrate de que esté ejecutándose (icono en bandeja del sistema)

#### Configurar Integración WSL2
1. **Click derecho** en el icono de Docker Desktop (bandeja del sistema)
2. Selecciona **"Settings"** o **"Configuración"**
3. Navega a: **"Resources"** → **"WSL Integration"**
4. **Activa** la opción: `"Enable integration with my default WSL distro"`
5. **Asegúrate** de que tu distribución **Ubuntu** esté habilitada/tildada
6. **Click en** `"Apply & Restart"`

![Docker Desktop WSL Integration](https://docs.docker.com/desktop/wsl/images/wsl2-enable.png)

### 2. En WSL2 - Tu Terminal

#### Cerrar y Reabrir Terminal
```bash
# Cierra completamente tu terminal WSL2
# Vuelve a abrir una nueva terminal WSL2
```

#### Verificar Instalación
```bash
# Verificar Docker
docker --version

# Verificar Docker Compose
docker-compose --version

# Probar con un contenedor
docker run hello-world
```

### 3. Verificación Completa

```bash
# En tu directorio del proyecto
cd /home/fullangel/Dpass/sistema-visitas-nacional

# Verificar configuración WSL2
./setup-docker-wsl-simple.sh
```

## 🎯 Resultado Esperado

### Docker Funcionando:
```
$ docker --version
Docker version 24.0.7, build afdd53b

$ docker run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

### Docker Compose Funcionando:
```
$ docker-compose --version
docker-compose version 2.23.3, build 3d1bb1b1
```

## 🚀 Próximos Pasos

Una vez que Docker esté funcionando:

1. **Iniciar el proyecto:**
   ```bash
   ./docker-start.sh
   ```

2. **Verificar servicios:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080
   - PhpMyAdmin: http://localhost:8081
   - Redis Commander: http://localhost:8082
   - Mailhog: http://localhost:8025

## 🔍 Solución de Problemas

### Docker Desktop no se inicia:
- Reinicia Docker Desktop
- Verifica que esté actualizado
- Revisa el log de Docker Desktop

### Integración WSL2 no funciona:
- Asegúrate de que WSL2 esté configurado como predeterminado
- Verifica en PowerShell: `wsl --list --verbose`
- Reinicia Docker Desktop después de cambiar configuración

### Permisos denegados:
- Cierra y vuelve a abrir la terminal WSL2
- Verifica que estés en el grupo docker: `groups $USER`

### Contenedores no se ejecutan:
- Verifica recursos disponibles en Docker Desktop
- Revisa el log: `docker logs [container-name]`

## 📞 Soporte

Si tienes problemas:
1. Verifica que Docker Desktop esté actualizado
2. Revisa la configuración de WSL2 en Docker Desktop
3. Reinicia ambos servicios si es necesario
4. ¡El entorno Docker del proyecto está listo para cuando termines la configuración!