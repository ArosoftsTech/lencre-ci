<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'journaliste@lencre.ci';
$user = User::where('email', $email)->first();

if (!$user) {
    User::create([
        'name' => 'Journaliste LEncre',
        'email' => $email,
        'password' => Hash::make('password'),
        'role' => 'journaliste',
        'bio' => 'Compte de test journaliste.'
    ]);
    echo "User $email created successfully.\n";
} else {
    $user->update(['password' => Hash::make('password'), 'role' => 'journaliste']);
    echo "User $email updated successfully.\n";
}
