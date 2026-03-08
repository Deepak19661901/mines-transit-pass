const SETTLEE_OPTIONS = [
    {
        label: "Sri Balaji Infra Developers Pvt Ltd Wazidpur N Kare Sheikhpura",
        location: "Sri Balaji Infra Developers Pvt Ltd Wazidpur N Kare Sheikhpura",
        eCap: "586753.66 mt",
        name: "Sri Balaji Infra Developers Pvt. Ltd., Sheikhpura",
        mobile: "9234785868",
        expiry: "16 Aug 2026"
    },
    {
        label: "MSAUROSUNDARAMINTERNATIONALPVTLTD",
        location: "MSAUROSUNDARAMINTERNATIONALPVTLTD",
        eCap: "542454.32 mt",
        name: "Bhoj sons & ghat no : 11",
        mobile: "9100000000",
        expiry: "1 Aug 2029"
    }
];

const DEFAULT_CONFIG = {
    driverMobile: "9100000000",
    customerMobile: "9100000000",
    driverAddress: "NA",
    issuerName: "" // Leave blank as requested for manual entry
};

document.addEventListener('DOMContentLoaded', () => {
    setupFormDefaults();
    
    document.getElementById('challan-form').addEventListener('submit', (e) => {
        e.preventDefault();
        generateChallan();
    });

    document.getElementById('field-16').addEventListener('input', updateCft);
    updateCft();
});

function setupFormDefaults() {
    // 1. 12-Digit Unique Pass No
    const random12 = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    document.getElementById('field-1').value = random12;

    // 2. All Years Dropdown
    const yearSelect = document.getElementById('field-2');
    yearSelect.innerHTML = '';
    for (let y = 2000; y <= 2050; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === 2026) opt.selected = true;
        yearSelect.appendChild(opt);
    }

    // 3. Settlee Preset Selector
    const presetSelect = document.getElementById('preset-selector');
    
    presetSelect.innerHTML = '';
    
    // Add Predefined Options
    SETTLEE_OPTIONS.forEach((opt, index) => {
        const o = document.createElement('option');
        o.value = index;
        o.textContent = opt.label;
        presetSelect.appendChild(o);
    });

    // Add Manual Entry Option
    const manualOpt = document.createElement('option');
    manualOpt.value = "manual";
    manualOpt.textContent = "-- Manual Entry (Clear All Fields) --";
    presetSelect.appendChild(manualOpt);

    const clearSettleeFields = () => {
        document.getElementById('field-3').value = "";
        document.getElementById('field-5').value = "";
        document.getElementById('field-6').value = "";
        document.getElementById('field-7').value = "";
        document.getElementById('field-8').value = "";
    };

    const fillSettleeFields = (index) => {
        const data = SETTLEE_OPTIONS[index];
        document.getElementById('field-3').value = data.location;
        document.getElementById('field-5').value = data.eCap;
        document.getElementById('field-6').value = data.name;
        document.getElementById('field-7').value = data.mobile;
        document.getElementById('field-8').value = data.expiry;
    };

    presetSelect.addEventListener('change', () => {
        const val = presetSelect.value;
        if (val === "manual") {
            clearSettleeFields();
        } else {
            fillSettleeFields(val);
        }
    });

    // Initial State: Default to Sri Balaji (Index 0)
    presetSelect.value = "0";
    fillSettleeFields(0);

    // Clear other manual fields
    document.getElementById('field-11').value = "";
    document.getElementById('field-13').value = "";
    document.getElementById('field-16').value = "";
    document.getElementById('field-18').value = "";
    document.getElementById('field-19').value = "";
    document.getElementById('field-21').value = "";
    document.getElementById('field-22').value = "";
    document.getElementById('field-25').value = "";
    document.getElementById('field-26').value = "";
    document.getElementById('field-issuer').value = "";

    // Fixed Numbers
    document.getElementById('field-12').value = DEFAULT_CONFIG.customerMobile;
    document.getElementById('field-23').value = DEFAULT_CONFIG.driverAddress;
    document.getElementById('field-24').value = DEFAULT_CONFIG.driverMobile;

    // Date Setup
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('field-9-picker').value = localNow;
    updateExpiryDate(localNow);

    document.getElementById('field-9-picker').addEventListener('change', (e) => {
        updateExpiryDate(e.target.value);
    });
}

function updateExpiryDate(startStr) {
    if (!startStr) return;
    const startDate = new Date(startStr);
    const expiryDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    
    const fmt = (d) => {
        const day = d.getDate().toString().padStart(2, '0');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = d.getFullYear();
        let hrs = d.getHours();
        const mins = d.getMinutes().toString().padStart(2, '0');
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // 0 becomes 12
        return `${day} ${months[d.getMonth()]} ${year} ${hrs}:${mins} ${ampm}`;
    };

    document.getElementById('field-9').value = fmt(startDate);
    document.getElementById('field-10').value = fmt(expiryDate);
}

function updateCft() {
    const mt = parseFloat(document.getElementById('field-16').value) || 0;
    const cft = (mt * 20).toFixed(2);
    document.getElementById('field-17').value = cft;
}

function generateChallan() {
    const challanNo = document.getElementById('field-1').value;
    const userId = Math.floor(100000 + Math.random() * 900000); 
    const refNo = "2024" + Date.now().toString().slice(-6) + userId; 
    const printDate = new Date().toLocaleString();

    const mineral = document.querySelector('input[name="mineral-type"]:checked').value;
    const mineralPretty = mineral === "STONE-STONE(CHIPS)-40 MM" ? "STONE (STONE(CHIPS)-40 MM)" : mineral;

    const params = new URLSearchParams();
    params.set('verify', 'true');
    params.set('cno', challanNo);
    params.set('uid', refNo.slice(-10));
    params.set('vno', document.getElementById('field-21').value.split('/')[0]);
    params.set('mname', mineralPretty);
    params.set('weight', document.getElementById('field-16').value);
    params.set('date', document.getElementById('field-9').value);
    params.set('valid', document.getElementById('field-10').value);
    params.set('consigner', document.getElementById('field-6').value);
    params.set('location', document.getElementById('field-3').value);
    params.set('dest', document.getElementById('field-13').value);

    const verifyUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    // Make QR clickable
    document.getElementById('qr-link').href = verifyUrl;

    // Fill UI
    document.getElementById('view-print-date').textContent = printDate;
    document.getElementById('view-ref-no').textContent = refNo;
    document.getElementById('view-1').textContent = challanNo;
    document.getElementById('view-2').textContent = document.getElementById('field-2').value;
    document.getElementById('view-3').textContent = document.getElementById('field-3').value;
    document.getElementById('view-5').textContent = document.getElementById('field-5').value;
    document.getElementById('view-6').textContent = document.getElementById('field-6').value;
    document.getElementById('view-7').textContent = document.getElementById('field-7').value;
    document.getElementById('view-8').textContent = document.getElementById('field-8').value;
    document.getElementById('view-9').textContent = document.getElementById('field-9').value;
    document.getElementById('view-10').textContent = document.getElementById('field-10').value;
    document.getElementById('view-11').textContent = document.getElementById('field-11').value;
    document.getElementById('view-12').textContent = document.getElementById('field-12').value;
    document.getElementById('view-13').textContent = document.getElementById('field-13').value;
    document.getElementById('view-14').textContent = mineralPretty;
    document.getElementById('view-16').textContent = document.getElementById('field-16').value + " Mt.";
    document.getElementById('view-17').textContent = document.getElementById('field-17').value + " Cft.";
    document.getElementById('view-18').textContent = document.getElementById('field-18').value;
    document.getElementById('view-19').textContent = document.getElementById('field-19').value;
    document.getElementById('view-21').textContent = document.getElementById('field-21').value;
    document.getElementById('view-22').textContent = document.getElementById('field-22').value;
    document.getElementById('view-24').textContent = document.getElementById('field-24').value;
    document.getElementById('view-25').textContent = document.getElementById('field-25').value;
    document.getElementById('view-26').textContent = document.getElementById('field-26').value;

    // Barcode
    JsBarcode("#barcode-canvas", refNo, {
        format: "CODE128",
        displayValue: false,
        height: 32,
        margin: 0
    });

    // QR Code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: verifyUrl,
        width: 55,
        height: 55,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('preview-overlay').style.display = 'block';
}

function closePreview() {
    document.getElementById('preview-overlay').style.display = 'none';
}

// Verification logic
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('verify')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.app-container').style.display = 'none';
        document.getElementById('verify-view').style.display = 'block';

        const body = document.getElementById('verify-body');
        const rows = [
            ["Challan No. / चालान नंबर", urlParams.get('cno'), true],
            ["UID No. / यूआईडी नंबर", urlParams.get('uid')],
            ["Challan Date / चालान की तिथि", urlParams.get('date')],
            ["Challan Validity / चालान की वैधता", urlParams.get('valid'), true],
            ["Consigner Name / कंसाइनर का नाम", urlParams.get('consigner')],
            ["Challan Generate from / चालान से उत्पन्न", "Web"],
            ["Location / स्थान", urlParams.get('location')],
            ["Destination / गंतव्य", urlParams.get('dest')],
            ["Vehicle Type / वाहन का प्रकार", "Truck"],
            ["Vehicle No. / वाहन नंबर", urlParams.get('vno'), true],
            ["Mineral Name / खनिज का नाम", urlParams.get('mname')],
            ["Quantity / मात्रा (in MT)", urlParams.get('weight')]
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="v-lbl">${row[0]}</td>
                <td class="v-s">:</td>
                <td class="v-val ${row[2] ? 'red-bold' : ''}">${row[1]}</td>
            `;
            body.appendChild(tr);
        });
    });
}
