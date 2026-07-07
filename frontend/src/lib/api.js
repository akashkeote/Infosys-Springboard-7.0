const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://infosys-springboard-7-0.onrender.com/api";

/**
 * Fetch schemes with optional filters
 */
export async function fetchSubsidies({
  state,
  category,
  ministry,
  search,
  limit = 20,
} = {}) {
  const params = new URLSearchParams();

  if (state && state !== "All States") params.set("state", state);
  if (category && category !== "All Categories")
    params.set("category", category);
  if (ministry && ministry !== "All Ministries")
    params.set("ministry", ministry);
  if (search) params.set("search", search);
  params.set("limit", String(limit));

  const res = await fetch(`${BASE_URL}/subsidies?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch subsidies: ${res.status}`);
  return res.json();
}

/**
 * Fetch a single scheme by ID
 */
export async function fetchSchemeById(id) {
  const res = await fetch(`${BASE_URL}/subsidies/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Scheme not found: ${id}`);
  return res.json();
}

/**
 * Fetch dashboard analytics stats.
 * Backend returns: { totalSchemes, byState:{...}, byCategory:{...}, byMinistry:{...} }
 * We enrich it with totalStates / totalCategories / totalMinistries counts so
 * StatsCards can simply read stats.totalStates etc.
 */
export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/subsidies/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  const raw = await res.json();
  return {
    ...raw,
    totalStates:      raw.byState    ? Object.keys(raw.byState).length    : 0,
    totalCategories:  raw.byCategory ? Object.keys(raw.byCategory).length  : 0,
    totalMinistries:  raw.byMinistry ? Object.keys(raw.byMinistry).length  : 0,
  };
}

/**
 * Trigger manual sync with remote data source
 */
export async function syncSchemes() {
  const res = await fetch(`${BASE_URL}/subsidies/sync`, { method: "POST" });
  if (!res.ok) throw new Error("Sync failed");
  return res.json();
}

/**
 * Submit a new application
 */
export async function submitApplication(data) {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Application failed: ${await res.text()}`);
  return res.json();
}

/* ─── Filter Data Lists ─── */
export const STATE_LIST = [
  "All States",
  "All",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const CATEGORY_LIST = [
  "All Categories",
  "Agriculture,Rural & Environment",
  "Banking,Financial Services and Insurance",
  "Business & Entrepreneurship",
  "Education & Learning",
  "Health & Wellness",
  "Housing & Shelter",
  "Public Safety,Law & Justice",
  "Science, IT & Communications",
  "Skills & Employment",
  "Social welfare & Empowerment",
  "Sports & Culture",
  "Transport & Infrastructure",
  "Travel & Tourism",
  "Utility & Sanitation",
  "Women and Child",
];

export const MINISTRY_LIST = [
  "All Ministries",
  "Ministry Of Agriculture And Farmers Welfare",
  "Ministry Of Chemicals And Fertilizers",
  "Ministry Of Civil Aviation",
  "Ministry Of Commerce And Industry",
  "Ministry Of Communications",
  "Ministry Of Consumer Affairs, Food And Public Distribution",
  "Ministry Of Culture",
  "Ministry Of Defence",
  "Ministry Of Development Of North Eastern Region",
  "Ministry Of Earth Sciences",
  "Ministry Of Education",
  "Ministry Of Electronics And Information Technology",
  "Ministry Of Environment, Forest And Climate Change",
  "Ministry Of Finance",
  "Ministry Of Fisheries, Animal Husbandry And Dairying",
  "Ministry Of Food Processing Industries",
  "Ministry Of Health And Family Welfare",
  "Ministry Of Heavy Industries",
  "Ministry Of Home Affairs",
  "Ministry Of Housing And Urban Affairs",
  "Ministry Of Information And Broadcasting",
  "Ministry Of Jal Shakti",
  "Ministry Of Labour And Employment",
  "Ministry Of Law And Justice",
  "Ministry Of Micro, Small And Medium Enterprises",
  "Ministry Of Mines",
  "Ministry Of New And Renewable Energy",
  "Ministry Of Panchayati Raj",
  "Ministry Of Petroleum And Natural Gas",
  "Ministry Of Ports, Shipping And Waterways",
  "Ministry Of Power",
  "Ministry Of Railways",
  "Ministry Of Road Transport And Highways",
  "Ministry Of Rural Development",
  "Ministry Of Science And Technology",
  "Ministry Of Skill Development And Entrepreneurship",
  "Ministry Of Social Justice And Empowerment",
  "Ministry Of Statistics And Programme Implementation",
  "Ministry Of Steel",
  "Ministry Of Textiles",
  "Ministry Of Tourism",
  "Ministry Of Tribal Affairs",
  "Ministry Of Women And Child Development",
  "Ministry Of Youth Affairs And Sports",
];

/* ─── Category Icons & Colors ─── */
export const CATEGORY_META = {
  "Agriculture,Rural & Environment": { icon: "Wheat", color: "#16a34a" },
  "Banking,Financial Services and Insurance": { icon: "Landmark", color: "#0284c7" },
  "Business & Entrepreneurship": { icon: "Briefcase", color: "#7c3aed" },
  "Education & Learning": { icon: "GraduationCap", color: "#2563eb" },
  "Health & Wellness": { icon: "Heart", color: "#dc2626" },
  "Housing & Shelter": { icon: "Home", color: "#ea580c" },
  "Public Safety,Law & Justice": { icon: "Scale", color: "#4338ca" },
  "Science, IT & Communications": { icon: "Monitor", color: "#0891b2" },
  "Skills & Employment": { icon: "Wrench", color: "#ca8a04" },
  "Social welfare & Empowerment": { icon: "HandHeart", color: "#e11d48" },
  "Sports & Culture": { icon: "Trophy", color: "#9333ea" },
  "Transport & Infrastructure": { icon: "Train", color: "#64748b" },
  "Travel & Tourism": { icon: "Plane", color: "#0d9488" },
  "Utility & Sanitation": { icon: "Droplets", color: "#2563eb" },
  "Women and Child": { icon: "Baby", color: "#db2777" },
};

/**
 * Check if a scheme deadline has expired
 */
export function isSchemeExpired(deadline) {
  if (!deadline) return false;
  try {
    const d = new Date(deadline);
    d.setHours(23, 59, 59, 999);
    return new Date() > d;
  } catch {
    return false;
  }
}
