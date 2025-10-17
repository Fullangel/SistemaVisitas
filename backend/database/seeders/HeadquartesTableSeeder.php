<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Headquarter;
use App\Models\Region;

class HeadquartesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regiones = Region::all();
        
        $headquarters = [
            ['name' => 'Sede Central Norte', 'address' => 'Av. Principal Norte #123', 'code' => 'SCN', 'region_id' => $regiones->where('code', 'RN')->first()->id ?? $regiones->first()->id],
            ['name' => 'Sede Central Sur', 'address' => 'Av. Principal Sur #456', 'code' => 'SCS', 'region_id' => $regiones->where('code', 'RS')->first()->id ?? $regiones->first()->id],
            ['name' => 'Sede Central Este', 'address' => 'Av. Principal Este #789', 'code' => 'SCE', 'region_id' => $regiones->where('code', 'RE')->first()->id ?? $regiones->first()->id],
            ['name' => 'Sede Central Oeste', 'address' => 'Av. Principal Oeste #321', 'code' => 'SCO', 'region_id' => $regiones->where('code', 'RO')->first()->id ?? $regiones->first()->id],
            ['name' => 'Sede Central Centro', 'address' => 'Av. Principal Centro #654', 'code' => 'SCC', 'region_id' => $regiones->where('code', 'RC')->first()->id ?? $regiones->first()->id],
        ];

        foreach ($headquarters as $headquarter) {
            Headquarter::create($headquarter);
        }
    }
}
