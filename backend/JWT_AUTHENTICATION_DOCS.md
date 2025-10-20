# JWT Authentication API Documentation

## Overview

This document describes the JWT (JSON Web Token) authentication system implemented in the Sistema de Visitas Nacional. The system uses the `tymon/jwt-auth` package for secure token-based authentication.

## Features

- **Dual Login Support**: Users can authenticate using either email or username
- **Secure Token Generation**: Uses HS256 algorithm with secret key
- **Token Expiration**: Access tokens expire in 30 minutes, refresh tokens in 24 hours
- **Role-based Access Control**: Integrated with role-based permissions
- **Custom Claims**: Enhanced security with user-specific claims
- **Comprehensive Error Handling**: Detailed error responses for different scenarios

## Authentication Flow

```
1. User Login (email/username + password) → JWT Token
2. Use Bearer token in Authorization header for protected routes
3. Token expires after 30 minutes → Refresh token
4. Refresh token expires after 24 hours → Re-authenticate
```

## API Endpoints

### 1. User Registration

**Endpoint**: `POST /api/register`

**Request Body**:
```json
{
    "first_name": "string|required|max:50",
    "last_name": "string|required|max:50",
    "email": "string|required|email|max:191|unique",
    "username": "string|required|max:191|unique",
    "password": "string|required|min:8|confirmed",
    "phone": "string|nullable|max:50",
    "address": "string|nullable|max:512"
}
```

**Success Response** (201):
```json
{
    "success": true,
    "message": "Usuario registrado exitosamente",
    "data": {
        "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "username": "johndoe",
            "phone": "+1234567890",
            "address": "123 Main St",
            "status": "active",
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z"
        },
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "token_type": "bearer",
        "expires_in": 1800
    }
}
```

**Error Responses**:
- `422`: Validation errors
- `500`: Server error

### 2. User Login

**Endpoint**: `POST /api/login`

**Request Body**:
```json
{
    "login": "string|required|max:191", // Can be email or username
    "password": "string|required|min:8|max:255"
}
```

**Success Response** (200):
```json
{
    "success": true,
    "message": "Login exitoso",
    "data": {
        "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "username": "johndoe",
            "phone": "+1234567890",
            "address": "123 Main St",
            "status": "active",
            "role": {
                "id": 1,
                "name": "admin",
                "display_name": "Administrator",
                "description": "Full system access"
            },
            "last_login_at": "2024-01-01T12:00:00.000000Z"
        },
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "token_type": "bearer",
        "expires_in": 1800,
        "issued_at": "2024-01-01T12:00:00.000000Z",
        "expires_at": "2024-01-01T12:30:00.000000Z"
    }
}
```

**Error Responses**:
- `404`: User not found
- `403`: User inactive
- `401`: Invalid credentials
- `422`: Validation errors
- `500`: Server error

### 3. User Logout

**Endpoint**: `POST /api/logout`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Success Response** (200):
```json
{
    "success": true,
    "message": "Logout exitoso"
}
```

**Error Responses**:
- `401`: Invalid token
- `500`: Server error

### 4. Refresh Token

**Endpoint**: `POST /api/refresh-token`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Success Response** (200):
```json
{
    "success": true,
    "message": "Token refrescado exitosamente",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "token_type": "Bearer"
    }
}
```

**Error Responses**:
- `401`: Token expired or invalid
- `500`: Server error

### 5. Get User Profile

**Endpoint**: `GET /api/user`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Success Response** (200):
```json
{
    "success": true,
    "message": "Perfil obtenido exitosamente",
    "data": {
        "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "username": "johndoe",
            "phone": "+1234567890",
            "address": "123 Main St",
            "status": "active",
            "role": {
                "id": 1,
                "name": "admin",
                "display_name": "Administrator",
                "description": "Full system access"
            },
            "employee": {
                "id": 1,
                "employee_code": "EMP001",
                "department": {
                    "id": 1,
                    "name": "IT Department"
                }
            },
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z"
        }
    }
}
```

**Error Responses**:
- `401`: Invalid token
- `500`: Server error

## JWT Token Structure

### Token Claims

The JWT tokens include the following claims:

```json
{
    "iss": "sistema-visitas-nacional",
    "iat": 1609453200,
    "exp": 1609455000,
    "nbf": 1609453200,
    "jti": "89d2032e-f5c6-449b-9c69-a966ac672290",
    "sub": 1,
    "prv": "23bd5cdd9f9e0cb4e863b1cfe98399f2856fe9b",
    "role": "admin",
    "role_id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "status": "active",
    "issued_at": "2024-01-01T12:00:00.000000Z",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
}
```

### Token Security Features

1. **Short TTL**: 30 minutes for access tokens
2. **Refresh Window**: 24 hours for refresh tokens
3. **IP Binding**: Tokens include the request IP address
4. **User Agent Binding**: Tokens include the user agent
5. **Role Information**: User role embedded in token
6. **Status Verification**: User must be active

## Error Handling

### Authentication Errors

```json
{
    "success": false,
    "message": "Error description",
    "error": "Error code",
    "timestamp": "2024-01-01T12:00:00.000000Z"
}
```

### Common Error Codes

| Error Code | Description | HTTP Status |
|------------|-------------|-------------|
| `Authorization header missing` | No Authorization header provided | 401 |
| `Bearer token missing` | No Bearer token in header | 401 |
| `Invalid token format` | Token doesn't have 3 parts | 401 |
| `TokenExpired` | Token has expired | 401 |
| `TokenInvalid` | Token is invalid | 401 |
| `User not found` | User doesn't exist | 404 |
| `User inactive` | User account is disabled | 403 |
| `Invalid credentials` | Wrong password | 401 |

## Usage Examples

### JavaScript (Axios)

```javascript
// Login
const login = async () => {
    try {
        const response = await axios.post('/api/login', {
            login: 'john@example.com',
            password: 'password123'
        });
        
        const { access_token, expires_in } = response.data.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token_expires', Date.now() + expires_in * 1000);
        
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response.data);
    }
};

// Make authenticated request
const getProfile = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await axios.get('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        if (error.response?.data?.error === 'TokenExpired') {
            // Refresh token
            await refreshToken();
            return getProfile(); // Retry
        }
        console.error('Failed to get profile:', error.response.data);
    }
};

// Refresh token
const refreshToken = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await axios.post('/api/refresh-token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const { token: newToken } = response.data.data;
        localStorage.setItem('access_token', newToken);
        
        return newToken;
    } catch (error) {
        console.error('Token refresh failed:', error.response.data);
        // Redirect to login
        window.location.href = '/login';
    }
};

// Logout
const logout = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
        await axios.post('/api/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expires');
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed:', error.response.data);
    }
};
```

### PHP (cURL)

```php
<?php
// Login
$loginData = [
    'login' => 'john@example.com',
    'password' => 'password123'
];

$ch = curl_init('http://localhost/api/login');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$accessToken = $result['data']['access_token'];

// Make authenticated request
$ch = curl_init('http://localhost/api/user');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $accessToken,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$profile = json_decode($response, true);
```

## Security Best Practices

1. **Token Storage**: Store tokens in secure storage (httpOnly cookies or secure localStorage)
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Expiration**: Implement token refresh logic before expiration
4. **Logout Handling**: Always call logout endpoint when user logs out
5. **Error Handling**: Handle all authentication errors gracefully
6. **Rate Limiting**: The system includes built-in rate limiting
7. **IP Validation**: Tokens are bound to the requesting IP address
8. **User Agent Validation**: Tokens include user agent information

## Configuration

### Environment Variables

```env
JWT_SECRET=your-secret-key-here
JWT_TTL=30 # minutes
JWT_REFRESH_TTL=1440 # minutes (24 hours)
JWT_ALGO=HS256
```

### Middleware Registration

The JWT middleware is registered in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    'jwt.auth' => \App\Http\Middleware\JwtMiddleware::class,
    'role' => \App\Http\Middleware\RoleMiddleware::class,
    'permission' => \App\Http\Middleware\PermissionMiddleware::class,
    'rate.role' => \App\Http\Middleware\RateLimitByRole::class,
];
```

## Testing

Run the JWT authentication tests:

```bash
php artisan test --filter=JwtAuthenticationTest
```

## Troubleshooting

### Common Issues

1. **"Token not provided"**: Check Authorization header format
2. **"Token expired"**: Refresh the token using `/api/refresh-token`
3. **"Invalid credentials"**: Verify username/email and password
4. **"User inactive"**: Contact administrator to activate account
5. **"Invalid token format"**: Token must have 3 parts separated by dots

### Debug Mode

For development, you can enable debug mode to see detailed error messages:

```php
// In app/Http/Middleware/JwtMiddleware.php
return response()->json([
    'success' => false,
    'message' => 'Detailed error message',
    'error' => 'ErrorCode',
    'debug' => $e->getMessage(), // Add this for debugging
    'timestamp' => now()->toISOString()
], 500);
```

**Remember to disable debug mode in production!**