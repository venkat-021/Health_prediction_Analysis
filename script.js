function analyze() {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const arm_length = parseFloat(document.getElementById('arm_length').value);
  const leg_length = parseFloat(document.getElementById('leg_length').value);
  const arm_circumference = parseFloat(document.getElementById('arm_circumference').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const hip = parseFloat(document.getElementById('hip').value);
  const gender = document.getElementById('gender').value;

  if (isNaN(weight) || isNaN(height) || isNaN(arm_length) || isNaN(leg_length) ||
      isNaN(arm_circumference) || isNaN(waist) || isNaN(hip)) {
    alert("Please fill in all the fields correctly.");
    return;
  }

  const height_m = height / 100;
  const bmi = weight / (height_m * height_m);
  const whr = waist / hip;
  const whtr = waist / height;

  // BMI category by gender
  function bmiCategory(bmi, gender) {
    if (gender === 'Male') {
      if (bmi < 18.5) return 'Underweight';
      else if (bmi < 25) return 'Normal';
      else if (bmi < 30) return 'Overweight';
      else return 'Obese';
    } else {
      if (bmi < 18) return 'Underweight';
      else if (bmi < 24) return 'Normal';
      else if (bmi < 29) return 'Overweight';
      else return 'Obese';
    }
  }

  // WHR Risk
  function whrRisk(whr, gender) {
    if (gender === 'Male') return whr > 0.90 ? 'High Risk' : 'Low Risk';
    else return whr > 0.85 ? 'High Risk' : 'Low Risk';
  }

  // Estimate LBM
  function estimateLBM(weight, height, gender) {
    return gender === 'Male'
      ? (0.407 * weight) + (0.267 * height) - 19.2
      : (0.252 * weight) + (0.473 * height) - 48.3;
  }

  const bmi_cat = bmiCategory(bmi, gender);
  const whr_status = whrRisk(whr, gender);
  const lbm = estimateLBM(weight, height, gender);
  const fat_mass = weight - lbm;
  const bfp = (fat_mass / weight) * 100;
  const smm = lbm * 0.50;

  const limbRatios = {
    "Arm-to-Leg Ratio": arm_length / leg_length,
    "Arm-to-Height Ratio": arm_length / height,
    "Leg-to-Height Ratio": leg_length / height,
    "Arm Circumference to Arm Length": arm_circumference / arm_length,
    "Arm Circumference to Height": arm_circumference / height
  };

  const problems = [];
  if (bmi_cat === 'Underweight') problems.push("Risk of nutrient deficiency, weak immunity, osteoporosis");
  else if (bmi_cat === 'Overweight') problems.push("Risk of high blood pressure, joint problems, early-stage metabolic issues");
  else if (bmi_cat === 'Obese') problems.push("High risk of diabetes, heart disease, stroke, fatty liver, joint damage");

  if (whr_status === 'High Risk')
    problems.push("Central obesity: risk of cardiovascular disease and Type 2 diabetes");

  if (whtr > 0.5)
    problems.push("Excess abdominal fat — increased risk of metabolic disorders");

  const mets_risks = [];
  if ((gender === 'Male' && waist > 102) || (gender === 'Female' && waist > 88))
    mets_risks.push("High waist circumference");
  if (bmi >= 30)
    mets_risks.push("Obesity (BMI ≥ 30)");

  // Generate Report
  let report = `<h2>🧾 Final Health Analysis Report</h2>`;

  report += `<h3>📌 Input Summary</h3>
    Gender: ${gender}<br>
    Weight: ${weight} kg<br>
    Height: ${height} cm<br>
    Arm Length: ${arm_length} cm, Leg Length: ${leg_length} cm<br>
    Arm Circumference: ${arm_circumference} cm<br>
    Hip: ${hip} cm, Waist: ${waist} cm<br><br>`;

  report += `<h3>📊 Body Composition</h3>
    BMI: ${bmi.toFixed(2)} (${bmi_cat})<br>
    LBM: ${lbm.toFixed(2)} kg<br>
    SMM: ${smm.toFixed(2)} kg<br>
    Fat Mass: ${fat_mass.toFixed(2)} kg<br>
    BFP: ${bfp.toFixed(2)}%<br><br>`;

  report += `<h3>📐 Ratios and Indicators</h3>
    WHR: ${whr.toFixed(2)} (${whr_status})<br>
    WHtR: ${whtr.toFixed(2)}<br><br>`;

  report += `<h3>💪 Limb Proportions</h3>`;
  for (let key in limbRatios) {
    report += `${key}: ${limbRatios[key].toFixed(2)}<br>`;
  }

  if (problems.length > 0) {
    report += `<h3>⚠️ Potential Health Risks</h3>`;
    problems.forEach((p, i) => {
      report += `${i + 1}. ${p}<br>`;
    });
  } else {
    report += `<p>✅ You're in a healthy range! Keep it up!</p>`;
  }

  if (mets_risks.length > 0) {
    report += `<h3>🔍 Metabolic Syndrome Indicators</h3>`;
    mets_risks.forEach((m, i) => {
      report += `${i + 1}. ${m}<br>`;
    });
  }

  report += `<br><h3>📋 Summary</h3>
    This report analyzes your key health indicators. BMI indicates general weight category. WHR and WHtR provide insight into abdominal fat. High values are linked to risks like cardiovascular disease and metabolic disorders. Maintain a healthy lifestyle and seek medical advice if needed.`;

  document.getElementById('report').innerHTML = report;
}
