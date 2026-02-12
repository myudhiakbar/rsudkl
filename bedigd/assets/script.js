// ===== VERSI ES5 - COMPATIBLE UNTUK BROWSER LAMA =====
// Tanpa arrow function, tanpa template literal, tanpa modern syntax
var API_URL =
	"https://script.google.com/macros/s/AKfycbxPjw0kwrhTgHEQ6vQboCMuhmbBwGixA-jzUCq0SQ6LXPKDyZtAWbA-yAjB9DLUkgsO/exec";

var loading = document.getElementById("loading");
var emptyState = document.getElementById("emptyState");
var errorState = document.getElementById("errorState");
var dataContainer = document.getElementById("dataContainer");
var historyList = document.getElementById("historyList");
var totalRecords = document.getElementById("totalRecords");

// Jam & Tanggal
function updateHeaderDateTime() {
	var now = new Date();
	var hari = now.toLocaleDateString("id-ID", { weekday: "long" });
	var tanggal = now.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	var jam = now
		.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
		.replace(/\./g, ":");

	var dateTimeElement = document.getElementById("currentDateTime");
	dateTimeElement.textContent = hari + ", " + tanggal + " Jam " + jam + " WIB";
}
setInterval(updateHeaderDateTime, 1000);
updateHeaderDateTime();

// Tahun otomatis
document.getElementById("year").textContent = new Date().getFullYear();

function formatJamPeriksa(value) {
	if (!value) return "-";

	if (typeof value === "number") {
		var date = new Date(Math.round((value - 25569) * 86400 * 1000));
		return (
			date.toLocaleTimeString("id-ID", {
				hour: "2-digit",
				minute: "2-digit",
			}) + " WIB"
		);
	}

	if (!isNaN(Date.parse(value))) {
		var date = new Date(value);
		return (
			date.toLocaleTimeString("id-ID", {
				hour: "2-digit",
				minute: "2-digit",
			}) + " WIB"
		);
	}

	if (typeof value === "string" && value.indexOf(":") !== -1) {
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

// Fallback JSONP untuk browser yang tidak support fetch
function loadDataWithJSONP() {
	var script = document.createElement("script");
	var callbackName = "jsonp_callback_" + Math.round(Math.random() * 100000);

	window[callbackName] = function (result) {
		delete window[callbackName];
		document.body.removeChild(script);
		processData(result);
	};

	script.src = API_URL + "?callback=" + callbackName;
	document.body.appendChild(script);

	// Timeout fallback
	setTimeout(function () {
		if (window[callbackName]) {
			window[callbackName] = null;
			delete window[callbackName];
			document.body.removeChild(script);
			showError();
		}
	}, 10000);
}

function processData(result) {
	var data = result.data || [];
	var validPatients = [];

	// Filter valid patients (ES5 style)
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		if (item.nama_pasien && item.nama_pasien.toString().trim() !== "") {
			validPatients.push(item);
		}
	}

	loading.classList.add("hidden");
	totalRecords.innerText = validPatients.length;

	if (validPatients.length === 0) {
		emptyState.classList.remove("hidden");
		return;
	}

	// Clear history list
	historyList.innerHTML = "";

	// Loop data (ES5 style)
	for (var i = 0; i < validPatients.length; i++) {
		var item = validPatients[i];
		var triaseClass = getTriaseClass(item.triase);

		var card = document.createElement("div");
		card.className = "patient-card " + triaseClass;

		// Build HTML string without template literals
		var cardHTML =
			'<div class="card-row">' +
			'<span class="badge-no">No: ' +
			(item.no || "") +
			"</span>" +
			'<span class="badge-time hidden">' +
			formatJamPeriksa(item.jam_periksa) +
			"</span>" +
			"</div>" +
			'<h3 class="patient-name">' +
			(item.nama_pasien || "") +
			"</h3>" +
			'<p class="tindak-lanjut">' +
			(item.rencana_tindak_lanjut || "") +
			"</p>" +
			'<span class="triase-tag">' +
			(item.triase || "") +
			"</span>";

		card.innerHTML = cardHTML;
		historyList.appendChild(card);
	}

	dataContainer.classList.remove("hidden");
}

function showError() {
	loading.classList.add("hidden");
	errorState.classList.remove("hidden");
}

function loadData() {
	loading.classList.remove("hidden");
	emptyState.classList.add("hidden");
	errorState.classList.add("hidden");
	dataContainer.classList.add("hidden");
	historyList.innerHTML = "";

	// Cek apakah fetch tersedia
	if (typeof fetch !== "undefined") {
		// Gunakan fetch dengan ES5 syntax
		fetch(API_URL)
			.then(function (response) {
				return response.json();
			})
			.then(function (result) {
				processData(result);
			})
			.catch(function (err) {
				console.error("Fetch error, trying JSONP fallback:", err);
				loadDataWithJSONP();
			});
	} else {
		// Fallback ke JSONP untuk browser sangat lama
		console.log("Fetch not supported, using JSONP fallback");
		loadDataWithJSONP();
	}
}

// Load pertama
loadData();
setInterval(loadData, 10000); // refresh tiap 10 detik
