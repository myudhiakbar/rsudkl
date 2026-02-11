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

function updateInfoDate(val) {
	const d = new Date(val);
	infoDate.textContent = d.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

const WEB_APP_URL =
	"https://script.google.com/macros/s/AKfycbwnsxv605i4E3R7OOF7EdZCcX97o_MyIyB_us5cgEmm_FhUVM6txENGUxMa1UkDd-Qq/exec";

/* ================= GLOBAL ELEMENTS ================= */
const loanForm = document.getElementById("loanForm");
const transactionDate = document.getElementById("transactionDate");
const patientName = document.getElementById("patientName");
const staffName = document.getElementById("staffName");
const unitSelect = document.getElementById("selectedUnit");
// const selectedUnit = document.getElementById("selectedUnit");
const packageSelect = document.getElementById("packageSelect");
const resetFormBtn = document.getElementById("resetForm");

const infoDate = document.getElementById("infoDate");
const infoPatient = document.getElementById("infoPatient");
const infoUnit = document.getElementById("infoUnit");
const infoAlkes = document.getElementById("infoAlkes");

/* ================= UNIT ALKES ================= */
// Pilihan unit
// const unitOptions = document.querySelectorAll(".unit-option");
// unitOptions.forEach((option) => {
// 	option.addEventListener("click", function () {
// 		unitOptions.forEach((opt) => {
// 			opt.classList.remove("selected-unit", "border-blue-500");
// 			opt.classList.add("border-gray-200");
// 		});
// 		this.classList.add("selected-unit", "border-blue-500");
// 		this.classList.remove("border-gray-200");

// 		const selected = this.getAttribute("data-unit");
// 		selectedUnit.value = selected;
// 		infoUnit.textContent = selected;
// 	});
// });

/* ================= PACKAGE ALKES ================= */
packageSelect.addEventListener("change", function () {
	if (!this.value) return;

	const packageMap = {
		"infus-dewasa": "infus dewasa",
		"infus-anak": "infus anak",
		"injeksi-lambung": "injeksi lambung",
		"jahit-luka": "jahit luka",
	};
	addPackageItems(packageMap[this.value]);
});

function addPackageItems(packageType) {
	const container = document.getElementById("alkesContainer");
	container.innerHTML = "";

	let items = [];

	if (packageType === "infus dewasa") {
		items = [
			{ name: "Abbocath 22", qty: 1 },
			{ name: "Abbocath 20", qty: 1 },
			{ name: "Macro Set", qty: 1 },
			{ name: "NaCl 0,9% 500 ml", qty: 1 },
		];
	} else if (packageType === "infus anak") {
		items = [
			{ name: "Abbocath 24", qty: 1 },
			{ name: "Abbocath 26", qty: 1 },
			{ name: "Macro Set", qty: 1 },
			{ name: "Spalk Anak", qty: 1 },
			{ name: "Kaen 3B 500 ml", qty: 1 },
		];
	} else if (packageType === "injeksi lambung") {
		items = [
			{ name: "Abbocath 22", qty: 1 },
			{ name: "Macro Set", qty: 1 },
			{ name: "Omeprazole 40 mg IV", qty: 1 },
			{ name: "Ondansentron 4 mg IV", qty: 1 },
			{ name: "Spuit 5 ml", qty: 1 },
			{ name: "Spuit 3 ml", qty: 1 },
		];
	} else if (packageType === "inhalasi-dewasa") {
		items = [
			{ name: "Nebulizer Mask Dewasa", qty: 1 },
			{ name: "Spuit 5 ml", qty: 1 },
			{ name: "Meprovent", qty: 1 },
			{ name: "Pulmicort", qty: 1 },
		];
	} else if (packageType === "inhalasi-anak") {
		items = [
			{ name: "Nebulizer Mask Anak", qty: 1 },
			{ name: "Spuit 5 ml", qty: 1 },
			{ name: "Meprovent", qty: 1 },
			{ name: "Pulmicort", qty: 1 },
		];
	} else if (packageType === "jahit luka") {
		items = [
			{ name: "Lidocain IV", qty: 2 },
			{ name: "Spuit 3 ml", qty: 1 },
			{ name: "Polypropilen 3/0 TS 27", qty: 1 },
			{ name: "Underpad", qty: 1 },
			{ name: "Daryantul", qty: 1 },
			{ name: "NaCl 0,9% 500 ml", qty: 1 },
		];
	}

	items.forEach((item) => addAlkesField(item.name, item.qty));
	updateAlkesInfo();
}

/* ================= TAMBAH ALKES ================= */
document
	.getElementById("addAlkes")
	.addEventListener("click", () => addAlkesField());

function addAlkesField(name = "", qty = 1) {
	const container = document.getElementById("alkesContainer");
	const id = Date.now();

	const html = `
    <div class="dynamic-field mb-4 p-4 bg-white border rounded-lg shadow-sm" id="alkes-${id}">
        <div class="flex flex-col md:flex-row gap-4">
            <div class="md:w-2/3">
                <label class="block text-sm mb-1">Nama Alkes</label>
                <input type="text" name="alkesName[]" value="${name}" class="alkes-name-input w-full p-3 border rounded-lg" required>
            </div>
            <div class="md:w-1/4">
                <label class="block text-sm mb-1">Jumlah</label>
                <div class="flex">
                    <button type="button" class="decrease-qty p-3 bg-gray-200 rounded-l">-</button>
                    <input type="number" name="alkesQty[]" value="${qty}" min="1" class="alkes-qty-input w-full text-center border-t border-b">
                    <button type="button" class="increase-qty p-3 bg-gray-200 rounded-r">+</button>
                </div>
            </div>
            <div class="md:w-1/12 flex items-end">
                <button type="button" class="remove-alkes p-3 bg-red-500 text-white rounded-lg">🗑</button>
            </div>
        </div>
    </div>`;

	container.insertAdjacentHTML("afterbegin", html);
	const field = document.getElementById(`alkes-${id}`);

	field.querySelector(".remove-alkes").onclick = () => {
		field.remove();
		updateRemoveButtons();
		updateAlkesInfo();
	};

	field.querySelector(".increase-qty").onclick = () => {
		const input = field.querySelector(".alkes-qty-input");
		input.value = parseInt(input.value) + 1;
		updateAlkesInfo();
	};

	field.querySelector(".decrease-qty").onclick = () => {
		const input = field.querySelector(".alkes-qty-input");
		if (input.value > 1) input.value--;
		updateAlkesInfo();
	};

	field.querySelector(".alkes-name-input").oninput = updateAlkesInfo;
	field.querySelector(".alkes-qty-input").oninput = updateAlkesInfo;

	updateRemoveButtons();
	updateAlkesInfo();
}

function updateRemoveButtons() {
	const fields = document.querySelectorAll(".dynamic-field");
	document.querySelectorAll(".remove-alkes").forEach((btn) => {
		btn.disabled = fields.length === 1;
		btn.classList.toggle("opacity-50", fields.length === 1);
	});
}

/* ================= INFO PANEL ================= */
function updateAlkesInfo() {
	const list = infoAlkes;
	const names = document.querySelectorAll(".alkes-name-input");
	const qtys = document.querySelectorAll(".alkes-qty-input");

	list.innerHTML = "";
	names.forEach((n, i) => {
		if (!n.value.trim()) return;
		list.innerHTML += `<li class="flex justify-between bg-white p-2 rounded border">
            <span>${n.value}</span>
            <span class="px-2 bg-blue-100 rounded">${qtys[i].value}</span>
        </li>`;
	});

	if (!list.innerHTML)
		list.innerHTML = '<li class="italic text-gray-500">Belum ada data</li>';
}

/* ================= RESET ================= */
function performFormReset() {
	loanForm.reset();

	const today = new Date().toISOString().split("T")[0];
	transactionDate.value = today;
	updateInfoDate(today);

	unitSelect.value = "";
	infoUnit.textContent = "-";

	// ✅ Reset TOTAL isi alkesContainer
	document.getElementById("alkesContainer").innerHTML = "";
	addAlkesField();
	updateAlkesInfo();
}

resetFormBtn.onclick = () => {
	Swal.fire({
		title: "Reset Form?",
		text: "Apakah Anda yakin ingin mereset form? Semua data akan hilang.",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#ef4444",
		confirmButtonText: "Ya, Reset!",
		cancelButtonText: "Batal",
		reverseButtons: true,
		allowOutsideClick: false,
		allowEscapeKey: false,
	}).then((result) => {
		if (result.isConfirmed) {
			performFormReset();
			Swal.fire({
				title: "Berhasil!",
				text: "Form telah direset",
				icon: "success",
				timer: 1200,
				showConfirmButton: false,
				// confirmButtonText: "OK",
				// confirmButtonColor: "#3b82f6",
			});
		}
	});
};

/* ================= CREATE ================= */
loanForm.onsubmit = (e) => {
	e.preventDefault();

	const alkes = [];
	document.querySelectorAll(".alkes-name-input").forEach((el, i) => {
		const name = el.value.trim();
		const qty = document.querySelectorAll(".alkes-qty-input")[i].value;
		if (name) alkes.push({ name, qty });
	});

	if (
		!patientName.value ||
		!selectedUnit.value ||
		!staffName.value ||
		!alkes.length
	) {
		Swal.fire("Data belum lengkap", "", "warning");
		return;
	}

	Swal.fire({
		title: "Simpan Transaksi?",
		text: "Data akan disimpan di Google Sheets",
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "Ya, Simpan",
		cancelButtonText: "Batal",
		reverseButtons: true,
		confirmButtonColor: "#3b82f6",
		showLoaderOnConfirm: true,
		allowEscapeKey: false,
		allowOutsideClick: () => !Swal.isLoading(),

		preConfirm: () => {
			return fetch(WEB_APP_URL, {
				method: "POST",
				body: JSON.stringify({
					action: "create",
					tanggal: transactionDate.value,
					namaPasien: patientName.value,
					unit: selectedUnit.value,
					petugas: staffName.value,
					alkes,
				}),
			})
				.then((response) => {
					if (!response.ok) throw new Error("Gagal menyimpan");
					return response.json();
				})
				.catch((error) => {
					Swal.showValidationMessage(`Error: ${error}`);
				});
		},
	}).then((result) => {
		if (!result.isConfirmed) return;

		const res = result.value;

		if (res.status === "success") {
			Swal.fire({
				icon: "success",
				title: "Berhasil",
				text: "Jangan lupa resepin di Khanza ya!",
				confirmButtonText: "OK",
			}).then(() => {
				window.location.reload(); // reload setelah klik OK
			});
		} else {
			Swal.fire("Error", res.message || "Gagal menyimpan data", "error");
		}
	});
};

/* ================= EDIT ================= */
function editData(id) {
	Swal.fire({
		title: "Tandai Sudah Terinput?",
		text: "Status verifikasi akan diubah menjadi Sudah Terinput",
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "Ya, Tandai",
		cancelButtonText: "Batal",
		confirmButtonColor: "#16a34a",
		reverseButtons: true,
		showLoaderOnConfirm: true,
		allowOutsideClick: () => !Swal.isLoading(),

		preConfirm: async () => {
			try {
				const response = await fetch(WEB_APP_URL, {
					method: "POST",
					body: JSON.stringify({
						action: "updateVerifikasi",
						id: id,
						verifikasi: "Sudah", // ✅ HANYA FIELD INI YANG DIKIRIM
					}),
				});

				if (!response.ok) throw new Error("Gagal menghubungi server");

				const result = await response.json();
				if (result.status !== "success") {
					throw new Error(result.message || "Update gagal");
				}

				return result;
			} catch (err) {
				Swal.showValidationMessage(`Error: ${err.message}`);
			}
		},
	}).then((result) => {
		if (!result.isConfirmed) return;

		Swal.fire({
			icon: "success",
			title: "Berhasil",
			text: "Status berubah menjadi Sudah Terinput",
			timer: 1200,
			showConfirmButton: false,
		});

		loadHistory(); // 🔄 Refresh agar badge langsung hijau
	});
}

/* ================= DELETE ================= */
function deleteData(id) {
	Swal.fire({
		title: "Hapus data?",
		text: "Data yang dihapus tidak dapat dikembalikan",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Ya, Hapus",
		cancelButtonText: "Batal",
		reverseButtons: true,
		confirmButtonColor: "#ef4444",
		allowEscapeKey: false,
		showLoaderOnConfirm: true,
		allowOutsideClick: () => !Swal.isLoading(),

		preConfirm: () => {
			return fetch(WEB_APP_URL, {
				method: "POST",
				body: JSON.stringify({ action: "delete", id }),
			})
				.then((res) => {
					if (!res.ok) throw new Error("Gagal menghapus");
					return res.json();
				})
				.catch((err) => {
					Swal.showValidationMessage(`Error: ${err.message}`);
				});
		},
	}).then((result) => {
		if (!result.isConfirmed) return;

		const res = result.value;

		if (res.status === "success") {
			Swal.fire({
				icon: "success",
				title: "Terhapus",
				text: "Data berhasil dihapus",
				confirmButtonText: "OK",
			});
			loadHistory();
		} else {
			Swal.fire("Error", res.message || "Gagal menghapus data", "error");
		}
	});
}

/* ================= READ ================= */
function formatTanggalIndonesia(tanggalString) {
	const date = new Date(tanggalString);
	if (isNaN(date)) return tanggalString; // fallback jika format tidak dikenali

	return date.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function loadHistory() {
	fetch(WEB_APP_URL, {
		method: "POST",
		body: JSON.stringify({ action: "read" }),
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.status !== "success") return;

			const historyList = document.getElementById("historyList");
			historyList.innerHTML = "";

			res.data.forEach((trx) => {
				const div = document.createElement("div");
				div.className = "pl-10 p-3 bg-white rounded border";

				const sudah = (trx.verifikasi || "").toString().toLowerCase() === "sudah";
				div.className = sudah
					? "pl-10 p-3 rounded border bg-green-50 border-green-200 transition"
					: "pl-10 p-3 rounded border bg-white border-gray-200 transition";

				div.classList.add("duration-300", "ease-in-out");

				const tanggalFormatted = formatTanggalIndonesia(trx.tanggal || "");

				/* ===== JAM DARI TIMESTAMP ===== */
				let jamFormatted = "";
				if (trx.timestamp) {
					const d = new Date(trx.timestamp);
					if (!isNaN(d.getTime())) {
						jamFormatted = d.toLocaleTimeString("id-ID", {
							hour: "2-digit",
							minute: "2-digit",
						});
					}
				}

				/* ===== STATUS VERIFIKASI ===== */
				const verifikasiStatus = (trx.verifikasi || "").toString().toLowerCase();
				const verifikasiBadge =
					trx.verifikasi === "Sudah"
						? `<span onclick="editData('${trx.id}')" class="cursor-pointer text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Sudah Terinput</span>`
						: `<span onclick="editData('${trx.id}')" class="cursor-pointer text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Belum Terinput</span>`;

				/* ===== DATA ALKES ===== */
				let alkesHTML = '<ul class="list-disc ml-5 text-sm mt-2">';
				if (Array.isArray(trx.alkes) && trx.alkes.length) {
					trx.alkes.forEach((item) => {
						alkesHTML += `<li>${item.name} <span class="font-semibold">= ${item.qty} pcs</span></li>`;
					});
				} else {
					alkesHTML += '<li class="italic text-gray-500">Tidak ada data alkes</li>';
				}
				alkesHTML += "</ul>";

				div.innerHTML = `
                <div class="text-sm text-gray-500">
                    ${tanggalFormatted}${jamFormatted ? " , jam " + jamFormatted : ""}
                </div>

                <b>Nama Pasien : ${trx.namaPasien || "-"}</b><br>
                Petugas : ${trx.petugas || "-"} - ${trx.unit || "-"}<br>

                <div class="mt-2">
                    <span class="font-medium text-gray-700">Alkes Dipinjam:</span>
                    ${alkesHTML}
                </div>

                <div class="mt-2 text-right">${verifikasiBadge}</div>

                <div class="mt-2">
                    <button onclick="editData('${trx.id}')" class="text-blue-600 hidden">Edit</button>
                    <button onclick="deleteData('${trx.id}')" class="text-red-600 ml-2 hidden">Hapus</button>
                </div>
            `;

				historyList.appendChild(div);
			});
		})
		.catch((err) => {
			console.error("Load history error:", err);
		});
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
	loadComponent("nav-placeholder", "./components/nav.html");
	loadComponent("footer-placeholder", "./components/footer.html", setFooterYear);

	const today = new Date().toISOString().split("T")[0];
	transactionDate.value = today;
	updateInfoDate(today);

	addAlkesField();
	loadHistory();
	updateNowDateTime();
	setInterval(updateNowDateTime, 1000);

	patientName.oninput = (e) => (infoPatient.textContent = e.target.value || "-");
	unitSelect.onchange = (e) => (infoUnit.textContent = e.target.value || "-");
});
