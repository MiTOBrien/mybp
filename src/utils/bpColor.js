export function getBpColor(systolic, diastolic) {
  // Extreme (red)
  if (systolic > 180 || diastolic > 120) {
    return 'bp-red'
  }

  // Highly elevated (orange)
  if ((systolic >= 130 && systolic <= 180) || (diastolic >= 80 && diastolic <= 120)) {
    return 'bp-orange'
  }

  // Elevated (yellow)
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return 'bp-yellow'
  }

  // Normal (green)
  if (systolic < 120 && diastolic < 80) {
    return 'bp-green'
  }

  // Fallback (should never hit)
  return 'bp-green'
}
