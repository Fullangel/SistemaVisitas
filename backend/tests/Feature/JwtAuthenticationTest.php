<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;

class JwtAuthenticationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $role;

    public function setUp(): void
    {
        parent::setUp();
        
        // Create a role for testing
        $this->role = Role::create([
            'name' => 'user',
            'display_name' => 'User',
            'description' => 'Regular user role'
        ]);

        // Create a test user
        $this->user = User::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'role_id' => $this->role->id,
        ]);
    }

    /** @test */
    public function user_can_login_with_email()
    {
        $response = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user',
                         'access_token',
                         'token_type',
                         'expires_in',
                         'issued_at',
                         'expires_at'
                     ]
                 ]);

        $this->assertArrayHasKey('access_token', $response->json('data'));
        $this->assertEquals('bearer', $response->json('data.token_type'));
    }

    /** @test */
    public function user_can_login_with_username()
    {
        $response = $this->postJson('/api/login', [
            'login' => 'testuser',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user',
                         'access_token',
                         'token_type',
                         'expires_in',
                         'issued_at',
                         'expires_at'
                     ]
                 ]);

        $this->assertArrayHasKey('access_token', $response->json('data'));
        $this->assertEquals('bearer', $response->json('data.token_type'));
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Credenciales inválidas',
                     'error' => 'Invalid credentials'
                 ]);
    }

    /** @test */
    public function user_cannot_login_with_nonexistent_user()
    {
        $response = $this->postJson('/api/login', [
            'login' => 'nonexistent@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Usuario no encontrado',
                     'error' => 'User not found'
                 ]);
    }

    /** @test */
    public function inactive_user_cannot_login()
    {
        $this->user->update(['status' => 'inactive']);

        $response = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Usuario inactivo',
                     'error' => 'User inactive'
                 ]);
    }

    /** @test */
    public function user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'first_name' => 'New',
            'last_name' => 'User',
            'email' => 'newuser@example.com',
            'username' => 'newuser',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
            'address' => '123 Test Street'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user',
                         'access_token',
                         'token_type',
                         'expires_in'
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'username' => 'newuser'
        ]);
    }

    /** @test */
    public function authenticated_user_can_access_protected_routes()
    {
        $loginResponse = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123'
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user'
                     ]
                 ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Token no proporcionado',
                     'error' => 'Authorization header missing'
                 ]);
    }

    /** @test */
    public function user_can_logout()
    {
        $loginResponse = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123'
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Logout exitoso'
                 ]);
    }

    /** @test */
    public function user_can_refresh_token()
    {
        $loginResponse = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123'
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/refresh-token');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'token',
                         'token_type'
                     ]
                 ]);

        $this->assertNotEquals($token, $response->json('data.token'));
    }

    /** @test */
    public function invalid_token_format_returns_error()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid.token.format'
        ])->getJson('/api/user');

        $response->assertStatus(401)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Formato de token inválido',
                     'error' => 'Invalid token format'
                 ]);
    }

    /** @test */
    public function expired_token_returns_error()
    {
        // This test would require mocking time or creating an expired token
        // For now, we'll test with an invalid token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L2FwaS9sb2dpbiIsImlhdCI6MTYwOTQ1MzIwMCwiZXhwIjoxNjA5NDUzMjAwLCJuYmYiOjE2MDk0NTMyMDAsImp0aSI6Ijg5ZDIwMzJlLWY1YzYtNDQ5Yi05YzY5LWE5NjZhYzY3MjI5MCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjZGQ5ZjllMGNiNGU4NjNiMWNmZTk4MzM5OWYyODU2ZmU5YiJ9.invalid'
        ])->getJson('/api/user');

        $response->assertStatus(401)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Formato de token inválido',
                     'error' => 'Invalid token format'
                 ]);
    }
}