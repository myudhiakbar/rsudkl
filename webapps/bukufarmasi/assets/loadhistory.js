// ===== LOAD NAV & FOOTER =====
async function loadComponent(id, file, callback) {
	const el = document.getElementById(id);
	if (!el) return;

	const res = await fetch(file);
	el.innerHTML = await res.text();

	if (typeof callback === "function") {
		callback();
	}

	if (id === "nav-placeholder") setActiveNav();
}

function setFooterYear() {
	const y = document.getElementById("year");
	if (y) y.textContent = new Date().getFullYear();
}

function setActiveNav() {
	const links = document.querySelectorAll(".nav-link");

	// Ambil nama file halaman saat ini saja
	const currentPage = window.location.pathname.split("/").pop() || "index.html";

	links.forEach((link) => {
		// Ambil hanya nama file dari href (abaikan folder)
		const linkPage = link.getAttribute("href").split("/").pop();

		const isActive = linkPage === currentPage;

		link.classList.toggle("border-b-2", isActive);
		link.classList.toggle("border-blue-600", isActive);
		link.classList.toggle("pb-1", isActive);
	});
}

// ===== FORMAT TANGGAL =====
function formatTanggalIndonesia(tanggalString) {
	const date = new Date(tanggalString);
	if (isNaN(date)) return tanggalString;

	return date.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function updateNowDateTime() {
	const el = document.getElementById("nowDateTime");
	if (!el) return;
	const now = new Date();
	const bulan = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];
	const tgl = now.getDate();
	const bln = bulan[now.getMonth()];
	const thn = now.getFullYear();
	const jam = String(now.getHours()).padStart(2, "0");
	const menit = String(now.getMinutes()).padStart(2, "0");
	const detik = String(now.getSeconds()).padStart(2, "0");
	el.textContent = `${tgl} ${bln} ${thn}, ${jam}:${menit}:${detik} WIB`;
}

const WEB_APP_URL =
	"https://script.google.com/macros/s/AKfycbwnsxv605i4E3R7OOF7EdZCcX97o_MyIyB_us5cgEmm_FhUVM6txENGUxMa1UkDd-Qq/exec";

/* ====== LOAD HISTORY DARI GAS ====== */
function loadHistory() {
	const historyList = document.getElementById("historyList");

	historyList.innerHTML = `
        <div class="text-center py-6 text-gray-500 animate-pulse">
            Sedang mengambil data dari server...
        </div>
    `;

	fetch(WEB_APP_URL, {
		method: "POST",
		body: JSON.stringify({ action: "read" }),
	})
		.then((res) => res.json())
		.then((res) => {
			historyList.innerHTML = "";

			if (res.status !== "success" || !res.data.length) {
				historyList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-clipboard-list text-3xl mb-3"></i>
                        <p>Belum ada transaksi</p>
                        <p class="text-sm">Data otomatis ditarik dari Google Sheet</p>
                    </div>`;
				return;
			}

			res.data
				.sort(
					(a, b) =>
						new Date(b.timestamp || b.tanggal) - new Date(a.timestamp || a.tanggal),
				)
				.forEach((trx) => {
					const sudah = (trx.verifikasi || "").toLowerCase() === "sudah";

					const card = document.createElement("div");
					card.className = sudah
						? "p-4 rounded border bg-green-50 border-green-200"
						: "p-4 rounded border bg-white border-gray-200";

					const tanggalFormatted = formatTanggalIndonesia(trx.tanggal);

					let jamFormatted = "";
					if (trx.timestamp) {
						const d = new Date(trx.timestamp);
						if (!isNaN(d)) {
							jamFormatted = d.toLocaleTimeString("id-ID", {
								hour: "2-digit",
								minute: "2-digit",
							});
						}
					}

					const badge = sudah
						? `<span onclick="editData('${trx.id}','Sudah')" class="cursor-pointer text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Sudah Terinput</span>`
						: `<span onclick="editData('${trx.id}','Belum')" class="cursor-pointer text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Belum Terinput</span>`;

					let alkesHTML = '<ul class="list-disc ml-5 text-lg md:text-sm mt-2">';
					if (Array.isArray(trx.alkes) && trx.alkes.length) {
						trx.alkes.forEach((item) => {
							alkesHTML += `<li>${item.name} <span class="font-semibold">= ${item.qty} pcs</span></li>`;
						});
					} else {
						alkesHTML += '<li class="italic text-gray-500">Tidak ada data alkes</li>';
					}
					alkesHTML += "</ul>";

					card.innerHTML = `
                    <div class="text-sm text-gray-500">
                        ${tanggalFormatted}${jamFormatted ? " , jam " + jamFormatted : ""}
                    </div>

                    Nama Pasien : ${trx.namaPasien || "-"}<br>
                    ${trx.petugas || "-"} - ${trx.unit || "-"}<br>

                    <div class="mt-2">
                        <span class="text-lg text-gray-700"><strong>Alkes Dipinjam:</strong></span>
                        ${alkesHTML}
                    </div>

                    <div class="mt-2 text-right">${badge}</div>
                `;

					historyList.appendChild(card);
				});
		})
		.catch(() => {
			historyList.innerHTML = `<div class="text-center text-red-500">Gagal terhubung ke server</div>`;
		});
}

/* ================= TOGGLE VERIFIKASI ================= */
function editData(id, currentStatus = "Belum") {
	const statusBaru = currentStatus.toLowerCase() === "sudah" ? "Belum" : "Sudah";
	const teksKonfirmasi =
		statusBaru === "Sudah"
			? "Tandai data ini sebagai Sudah Terinput?"
			: "Batalkan status Sudah Terinput?";

	Swal.fire({
		title: "Ubah Status Verifikasi",
		text: teksKonfirmasi,
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "Ya",
		cancelButtonText: "Batal",
		confirmButtonColor: statusBaru === "Sudah" ? "#16a34a" : "#dc2626",
		reverseButtons: true,
		showLoaderOnConfirm: true,
		allowOutsideClick: () => !Swal.isLoading(),

		preConfirm: async () => {
			try {
				const res = await fetch(WEB_APP_URL, {
					method: "POST",
					body: JSON.stringify({
						action: "updateVerifikasi", // 🔥 KHUSUS UPDATE KOLOM H
						id: id,
						verifikasi: statusBaru,
					}),
				});

				if (!res.ok) throw new Error("Server tidak merespon");

				const data = await res.json();
				if (data.status !== "success") {
					throw new Error(data.message || "Gagal update");
				}

				return data;
			} catch (err) {
				Swal.showValidationMessage(`Error: ${err.message}`);
			}
		},
	}).then((result) => {
		if (!result.isConfirmed) return;

		Swal.fire({
			icon: "success",
			title: "Berhasil",
			text: `Status diubah menjadi ${statusBaru}`,
			timer: 1200,
			showConfirmButton: false,
		});

		loadHistory(); // 🔄 refresh tampilan
	});
}

// ==== ENTRY POINT ====
document.addEventListener("DOMContentLoaded", () => {
	loadComponent("nav-placeholder", "rsudkl/webapps/bukufarmasi/components/nav.html");
	loadComponent("footer-placeholder", "rsudkl/webapps/bukufarmasi/components/footer.html");

	loadHistory();
	updateNowDateTime();
	setInterval(updateNowDateTime, 1000);
});