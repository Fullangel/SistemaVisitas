<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Region;

class RegionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regions = [
            ['name' => 'Región Norte', 'code' => 'RN'],
            ['name' => 'Región Centro', 'code' => 'RC'],
            ['name' => 'Región Sur', 'code' => 'RS'],
            ['name' => 'Región Este', 'code' => 'RE'],
            ['name' => 'Región Oeste', 'code' => 'RO'],
        ];

        foreach ($regions as $region) {
            Region::create($region);
        }
    }
}
