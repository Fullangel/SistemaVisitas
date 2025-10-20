<?php
// Script de prueba para verificar conexión MySQL
try {
    $host = '127.0.0.1';
    $dbname = 'sistema_visitas';
    $username = 'test_user';
    $password = 'test_password';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    echo "✅ Conexión MySQL exitosa!\n";
    
    // Verificar usuarios
    $stmt = $pdo->query("SELECT id, first_name, last_name, email, username FROM users LIMIT 5");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Usuarios encontrados:\n";
    foreach ($users as $user) {
        echo "ID: {$user['id']}, Nombre: {$user['first_name']} {$user['last_name']}, Email: {$user['email']}, Username: {$user['username']}\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error de conexión MySQL: " . $e->getMessage() . "\n";
}

// Verificar configuración de Laravel
echo "\nConfiguración Laravel:\n";
echo "DB_CONNECTION: " . env('DB_CONNECTION', 'no definido') . "\n";
echo "DB_HOST: " . env('DB_HOST', 'no definido') . "\n";
echo "DB_DATABASE: " . env('DB_DATABASE', 'no definido') . "\n";
echo "DB_USERNAME: " . env('DB_USERNAME', 'no definido') . "\n";