const API_URL =
	"https://script.google.com/macros/s/AKfycbxPjw0kwrhTgHEQ6vQboCMuhmbBwGixA-jzUCq0SQ6LXPKDyZtAWbA-yAjB9DLUkgsO/exec";

const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");
const dataContainer = document.getElementById("dataContainer");
const historyList = document.getElementById("historyList");
const totalRecords = document.getElementById("totalRecords");

// Jam & Tanggal (diperbesar font via CSS header p)
function updateHeaderDateTime() {
	const now = new Date();
	const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
	const tanggal = now.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	const jam = now
		.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
		.replace(/\./g, ":");

	document.getElementById("currentDateTime").textContent =
		`${hari}, ${tanggal} Jam ${jam} WIB`;
}
setInterval(updateHeaderDateTime, 1000);
updateHeaderDateTime();

document.getElementById("year").textContent = new Date().getFullYear();

function formatJamPeriksa(value) {
	if (!value) return "-";
	if (typeof value === "number") {
		const date = new Date(Math.round((value - 25569) * 86400 * 1000));
		return (
			date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
			" WIB"
		);
	}
	if (!isNaN(Date.parse(value))) {
		const date = new Date(value);
		return (
			date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
			" WIB"
		);
	}
	if (typeof value === "string" && value.includes(":")) {
		return value.substring(0, 5) + " WIB";
	}
	return value;
}

function getTriaseClass(triase) {
	switch (triase) {
		case "Tidak Gawat dan Tidak Darurat":
			return "triase-green";
		case "Gawat Tapi Tidak Darurat":
			return "triase-yellow";
		case "Gawat Darurat":
			return "triase-red";
		case "Non Emergency":
			return "triase-gray";
		default:
			return "triase-default";
	}
}

function loadData() {
	loading.classList.remove("hidden");
	emptyState.classList.add("hidden");
	errorState.classList.add("hidden");
	dataContainer.classList.add("hidden");
	historyList.innerHTML = "";

	fetch(API_URL)
		.then((res) => res.json())
		.then((result) => {
			const data = result.data || [];
			loading.classList.add("hidden");
			totalRecords.innerText = data.length;

			if (data.length === 0) {
				emptyState.classList.remove("hidden");
				return;
			}

			data.forEach((item) => {
				const triaseClass = getTriaseClass(item.triase);
				const card = document.createElement("div");
				card.className = `patient-card ${triaseClass}`;
				card.innerHTML = `
                            <div class="card-row">
                                <span class="badge-no">No: ${item.no || "-"}</span>
                                <span class="badge-time hidden">${formatJamPeriksa(item.jam_periksa)}</span>
                            </div>
                            <h3 class="patient-name">${item.nama_pasien || "-"}</h3>
                            <p class="tindak-lanjut">${item.rencana_tindak_lanjut || "-"}</p>
                            <span class="triase-tag">${item.triase || "-"}</span>
                        `;
				historyList.appendChild(card);
			});

			dataContainer.classList.remove("hidden");
		})
		.catch((err) => {
			loading.classList.add("hidden");
			errorState.classList.remove("hidden");
			console.error(err);
		});
}

loadData();
