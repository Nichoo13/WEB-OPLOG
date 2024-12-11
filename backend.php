<?php
header('Content-Type: application/json');

// Baca input dari request body
$input = json_decode(file_get_contents('php://input'), true);

if ($input) {
    $start = $input['start'];
    $destination = $input['destination'];
    $cost = $input['cost'];
    $average_fuel = $input['average_fuel'];
    $capacity = $input['capacity'];

    // Simulasi perhitungan hasil logistik
    $total_distance = 50; // Contoh nilai jarak total (km)
    $total_cost = $cost * $total_distance; // Biaya total
    $marginal_cost = $total_cost / $capacity; // Biaya marginal

    $outputs = [
        'total_cost' => $total_cost,
        'total_distance' => $total_distance,
        'marginal_cost' => $marginal_cost
    ];

    // Gabungkan input dan output untuk disimpan ke JSON
    $data_to_save = [
        'inputs' => $input,
        'outputs' => $outputs
    ];

    // Path ke file JSON
    $file_path = 'data.json';

    // Simpan data ke file JSON
    file_put_contents($file_path, json_encode($data_to_save, JSON_PRETTY_PRINT));

    // Kembalikan respons JSON ke frontend
    echo json_encode([
        'status' => 'success',
        'message' => 'Data berhasil disimpan.',
        'logistics' => $outputs,
        'route' => [
            [$start[0], $start[1]],
            [$destination[0], $destination[1]]
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid input.'
    ]);
}
?>
