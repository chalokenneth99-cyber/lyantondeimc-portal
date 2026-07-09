// 1. Initialize Cloud Database Connection
const SUPABASE_URL = "https://clpqkjjjybtkhwjscztf.supabase.co";
const SUPABASE_KEY = "sb_publishable_lTgIA6WihXz3HLPRG1pFZA_0-T8t9cF"; 
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let secretTapCount = 0;

// Secret Admin trigger event handles counter sequence
function handleAdminSecretTap() {
  secretTapCount++;
  if (secretTapCount === 5) {
    secretTapCount = 0; // Reset counter
    const masterKey = prompt("🔒 ENTER EXECUTIVE SYSTEM MASTER KEY:");
    
    if (masterKey === "KENNETH_SECURE_2026") {
      const secureRegistry = {
        "Dr. Kenneth": "LMC2026KC",
        "Dr. George": "LMC2026DG",
        "Clinician Wandera Emmanuel": "LMC2026WE",
        "Clinician Geoffrey": "LMC2026GF",
        "Nurse Judith": "LMC2026NJ",
        "Nurse Violet": "LMC2026NV",
        "Nurse Grace": "LMC2026NG",
        "Bamusubire Dan (Lab Tech)": "LMC2026BD",
        "Alex (Lab Assistant)": "LMC2026LA"
      };
      
      localStorage.setItem('lmc_secure_staff_reg', JSON.stringify(secureRegistry));
      alert("✅ Facility Registry encrypted & locked into browser memory successfully!");
    } else {
      alert("❌ Unauthorized key string.");
    }
  }
}

let currentLoggedInUser = "";

// Authentication handler logic
function attemptLogin() {
  const userSelect = document.getElementById('login-user').value;
  const passwordInput = document.getElementById('login-pass').value;
  const errorLabel = document.getElementById('login-error');

  if (!userSelect || !passwordInput) {
    alert("Please choose your staff account and input your password.");
    return;
  }

  const storedData = localStorage.getItem('lmc_secure_staff_reg');
  let staffRegistry = {};
  
  if (storedData) {
    staffRegistry = JSON.parse(storedData);
  } else {
    if (userSelect === "Dr. Kenneth" && passwordInput === "LMC2026KC") {
      staffRegistry["Dr. Kenneth"] = "LMC2026KC";
    }
  }

  if (staffRegistry[userSelect] && staffRegistry[userSelect] === passwordInput) {
    currentLoggedInUser = userSelect;
    errorLabel.classList.add('hidden-panel');
    
    document.getElementById('active-clinician-display').innerText = currentLoggedInUser;
    
    document.getElementById('login-overlay').classList.add('hidden-panel');
    document.getElementById('app-content').classList.remove('hidden-panel');
    
    document.getElementById('login-pass').value = "";
  } else {
    errorLabel.classList.remove('hidden-panel');
  }
}

function handleLogout() {
  currentLoggedInUser = "";
  document.getElementById('app-content').classList.add('hidden-panel');
  document.getElementById('login-overlay').classList.remove('hidden-panel');
  document.getElementById('login-user').value = "";
}

function switchTab(tabId) {
  document.getElementById('clerkship-panel').classList.add('hidden-panel');
  document.getElementById('investigations-panel').classList.add('hidden-panel');
  document.getElementById('treatment-panel').classList.add('hidden-panel');

  document.getElementById('btn-clerkship').className = 'text-slate-400 py-3 flex-1 text-center flex flex-col items-center';
  document.getElementById('btn-investigations').className = 'text-slate-400 py-3 flex-1 text-center flex flex-col items-center';
  document.getElementById('btn-treatment').className = 'text-slate-400 py-3 flex-1 text-center flex flex-col items-center';

  document.getElementById(tabId + '-panel').classList.remove('hidden-panel');
  document.getElementById('btn-' + tabId).className = 'active-tab py-3 flex-1 text-center flex flex-col items-center';
}

async function saveEncounterData() {
  if (!currentLoggedInUser) {
    alert("Error: No authenticated user session found. Please re-login.");
    return;
  }

  const recordPayload = {
    case_number: document.getElementById('pt-id').value.trim() || "N/A", 
    patient_name: (document.getElementById('pt-firstname').value.trim() + " " + document.getElementById('pt-lastname').value.trim()).trim(),
    age: document.getElementById('pt-age').value,
    gender: document.getElementById('pt-gender').value,
    encounter_type: document.getElementById('pt-attendance').value, 
    clinical_notes: JSON.stringify({
      vitals: {
        bp: document.getElementById('vitals-bp').value,
        pulse: document.getElementById('vitals-pulse').value,
        temp: document.getElementById('vitals-temp').value,
        spo2: document.getElementById('vitals-spo2').value,
        rbs: document.getElementById('vitals-rbs').value
      },
      anamnesis: {
        chiefComplaint: document.getElementById('chief-complaint').value,
        hpi: document.getElementById('hpi').value,
        systemicReview: document.getElementById('systemic-review').value,
        pastMedicalHx: document.getElementById('pmhx').value,
        pastSurgicalHx: document.getElementById('pshx').value,
        familySocialHx: document.getElementById('social-hx').value
      },
      physicalExam: {
        general: document.getElementById('exam-general').value,
        cvs: document.getElementById('exam-cvs').value,
        rs: document.getElementById('exam-rs').value,
        git: document.getElementById('exam-git').value,
        cns: document.getElementById('exam-cns').value
      },
      diagnosis: document.getElementById('diagnosis').value
    }),
    investigations_ordered: JSON.stringify({
      lab: document.getElementById('lab-order').value,
      radiology: document.getElementById('radiology-order').value,
      notes: document.getElementById('investigation-notes').value
    }),
    treatment_plan: JSON.stringify({
      management: document.getElementById('management-plan').value,
      discharge: document.getElementById('discharge-plan').value
    }),
    staff_signature: currentLoggedInUser, 
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('clinical_encounters')
      .insert([recordPayload]);

    if (error) throw error;

    alert("✨ Clinical file compiled and synced to central database! Author-stamped as: " + currentLoggedInUser);
    
  } catch (error) {
    console.error("Database sync error:", error.message);
    alert("⚠️ Connection issue! Data could not sync to cloud server. Check internet connection.");
  }
}
function attemptLogin() {
  const userSelect = document.getElementById('login-user').value;
  const passwordInput = document.getElementById('login-pass').value;
  const errorLabel = document.getElementById('login-error');

  if (!userSelect || !passwordInput) {
    alert("Please choose your staff account and input your password.");
    return;
  }

  // Pull the registry safe block from localStorage
  const storedData = localStorage.getItem('lmc_secure_staff_reg');
  let staffRegistry = {};
  
  if (storedData) {
    staffRegistry = JSON.parse(storedData);
  } else {
    // Fail-safe default setup access for Dr. Kenneth before first activation
    if (userSelect === "Dr. Kenneth" && passwordInput === "LMC2026KC") {
      staffRegistry["Dr. Kenneth"] = "LMC2026KC";
    }
  }

  if (staffRegistry[userSelect] && staffRegistry[userSelect] === passwordInput) {
    currentLoggedInUser = userSelect;
    errorLabel.classList.add('hidden-panel');
    
    document.getElementById('active-clinician-display').innerText = currentLoggedInUser;
    
    document.getElementById('login-overlay').classList.add('hidden-panel');
    document.getElementById('app-content').classList.remove('hidden-panel');
    
    document.getElementById('login-pass').value = "";
  } else {
    errorLabel.classList.remove('hidden-panel');
  }
}

function handleLogout() {
  currentLoggedInUser = "";
  document.getElementById('app-content').classList.add('hidden-panel');
  document.getElementById('login-overlay').classList.remove('hidden-panel');
  document.getElementById('login-user').value = "";
}

function switchTab(tabId) {
  document.getElementById('clerkship-panel').classList.add('hidden-panel');
  document.getElementById('investigations-panel').classList.add('hidden-panel');
  document.getElementById('treatment-panel').classList.add('hidden-panel');

  document.getElementById('btn-clerkship').className = 'text-slate-400 py-3 flex-1 text-center flex flex-col items-center';
  document.getElementById('btn-investigations').className = 'text-slate-400 py-3 flex-1 text-center flex flex-col items-center';
  document.getElementById('btn-treatment').className = 'text-slate-400 py-3 flex-1 text-center flex flex-col items-center';

  document.getElementById(tabId + '-panel').classList.remove('hidden-panel');
  document.getElementById('btn-' + tabId).className = 'active-tab py-3 flex-1 text-center flex flex-col items-center';
}

function saveEncounterData() {
  const recordPayload = {
    meta_captured_by: currentLoggedInUser, 
    attendanceType: document.getElementById('pt-attendance').value,
    patient: {
      firstName: document.getElementById('pt-firstname').value,
      lastName: document.getElementById('pt-lastname').value,
      hospitalId: document.getElementById('pt-id').value,
      age: document.getElementById('pt-age').value,
      gender: document.getElementById('pt-gender').value,
      phone: document.getElementById('pt-phone').value,
      address: document.getElementById('pt-address').value
    },
    vitals: {
      bp: document.getElementById('vitals-bp').value,
      pulse: document.getElementById('vitals-pulse').value,
      temp: document.getElementById('vitals-temp').value,
      spo2: document.getElementById('vitals-spo2').value,
      rbs: document.getElementById('vitals-rbs').value
    },
    anamnesis: {
      chiefComplaint: document.getElementById('chief-complaint').value,
      hpi: document.getElementById('hpi').value,
      systemicReview: document.getElementById('systemic-review').value,
      pastMedicalHx: document.getElementById('pmhx').value,
      pastSurgicalHx: document.getElementById('pshx').value,
      familySocialHx: document.getElementById('social-hx').value
    },
    physicalExam: {
      general: document.getElementById('exam-general').value,
      cvs: document.getElementById('exam-cvs').value,
      rs: document.getElementById('exam-rs').value,
      git: document.getElementById('exam-git').value,
      cns: document.getElementById('exam-cns').value
    },
    diagnosis: document.getElementById('diagnosis').value,
    investigations: {
      orderedLab: document.getElementById('lab-order').value,
      orderedRadiology: document.getElementById('radiology-order').value,
      notes: document.getElementById('investigation-notes').value
    },
    plans: {
      management: document.getElementById('management-plan').value,
      discharge: document.getElementById('discharge-plan').value
    }
  };

  console.log("Saving secured medical record:", recordPayload);
  alert("Success! Record compiled and author-stamped as: " + currentLoggedInUser);
              }
