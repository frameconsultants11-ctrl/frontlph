export function calculateExperience(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return "0 years";
  }

  const currentYear = new Date().getFullYear();

  const startYears = experience
    .map((item) => Number(item.from))
    .filter((year) => !isNaN(year));

  if (startYears.length === 0) {
    return "0 years";
  }

  const earliestYear = Math.min(...startYears);

  const totalYears = currentYear - earliestYear;

  return `${totalYears} years`;
}