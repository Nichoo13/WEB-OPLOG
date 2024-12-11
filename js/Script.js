document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi peta
    const platform = new H.service.Platform({
        apikey: 'rfpUHuiYg5Y1XqbJL21uo5pKiHeKpBB6OPWe4aMnh8Y'
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: { lat: -6.200000, lng: 106.816666 }
        }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Simpan rute yang ada untuk dihapus jika ada rute baru
    let currentPolyline = null;

    // Form submission logic
    const form = document.getElementById('logisticsForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const start = document.getElementById('start').value.split(',').map(Number);
        const destination = document.getElementById('destination').value.split(',').map(Number);
        const cost = parseFloat(document.getElementById('cost').value);
        const capacity = parseFloat(document.getElementById('capacity').value);
        const average_fuel = parseFloat(document.getElementById('average_fuel').value);


        const data = {
            start,
            destination,
            cost,
            capacity,
            average_fuel,
        };

        // Kirim data ke backend
        fetch('backend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                const logistics = result.logistics;

                // Tampilkan hasil optimasi logistik
                document.getElementById('result').innerHTML = `
                    <strong>Hasil Optimasi:</strong><br>
                    Total Biaya: Rp ${logistics.total_cost} <br>
                    Total Jarak: ${logistics.total_distance} km<br>
                    Biaya Marginal : Rp ${logistics.marginal_cost} <br>
                `;

                // Menghapus rute lama jika ada
                if (currentPolyline) {
                    map.removeObject(currentPolyline);
                }

                // Menambahkan rute baru ke peta
                addRouteToMap(result.route);
            })
            .catch(error => {
                document.getElementById('result').innerText = `Error: ${error.message}`;
                console.error(error);
            });
    });

    // Fungsi untuk menambahkan rute ke peta
    function addRouteToMap(route) {
        const lineString = new H.geo.LineString();
        route.forEach(point => lineString.pushPoint({ lat: point[0], lng: point[1] }));

        // Membuat polyline untuk rute baru
        currentPolyline = new H.map.Polyline(lineString, {
            style: { strokeColor: 'blue', lineWidth: 4 }
        });

        // Menambahkan polyline ke peta
        map.addObject(currentPolyline);
        map.getViewModel().setLookAtData({ bounds: currentPolyline.getBoundingBox() });
    }
});
