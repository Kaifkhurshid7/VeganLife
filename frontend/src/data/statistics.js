export const impactStats = [
  {
    id: 'water',
    title: 'Water Saved',
    value: '15,400',
    unit: 'Liters',
    desc: 'Equivalent to 190 standard showers. Livestock production utilizes 10x more water than crops.',
    icon: 'FaDroplet',
    color: '#a6b48f',
    references: [
      { org: 'FAO', title: 'Livestock and Water', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' }
    ]
  },
  {
    id: 'co2',
    title: 'CO₂ Reduced',
    value: '140',
    unit: 'Kilograms',
    desc: 'Equivalent to driving 350 miles in a gas car. Animals produce immense direct methane.',
    icon: 'FaCloud',
    color: '#9d82ab',
    references: [
      { org: 'FAO', title: 'Greenhouse gas emissions from livestock', link: 'https://www.fao.org/' },
      { org: 'NASA Climate', title: 'The Causes of Climate Change', link: 'https://climate.nasa.gov/' }
    ]
  },
  {
    id: 'land',
    title: 'Land Preserved',
    value: '1,050',
    unit: 'Square Feet',
    desc: 'Equivalent to 5 student dorms. Plant diets require up to 90% less land than beef production.',
    icon: 'FaGlobeAmericas',
    color: '#e3a36e',
    references: [
      { org: 'Our World in Data', title: 'Land Use of Food', link: 'https://ourworldindata.org/land-use' },
      { org: 'FAO', title: 'Land use in livestock systems', link: 'https://www.fao.org/' }
    ]
  },
  {
    id: 'trees',
    title: 'Trees Protected',
    value: '35',
    unit: 'Forest Trees',
    desc: 'Equivalent to shielding local campus groves. Deforestation is primarily driven by grazing cattle.',
    icon: 'FaTree',
    color: '#573d21',
    references: [
      { org: 'NASA Climate', title: 'Rainforest and deforestation', link: 'https://climate.nasa.gov/' },
      { org: 'FAO', title: 'Forests and agriculture', link: 'https://www.fao.org/' }
    ]
  },
  {
    id: 'grain',
    title: 'Grain Redirected',
    value: '1,020',
    unit: 'Kilograms',
    desc: 'Equivalent to a year of staples. Nearly 40% of the world’s grain is fed to livestock rather than people.',
    icon: 'FaWheatAwn',
    color: '#93a77b',
    references: [
      { org: 'FAO', title: 'Crops and livestock feed', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'How much of the world’s grain is fed to animals?', link: 'https://ourworldindata.org/land-use' }
    ]
  }
];

export const resourceComparisonData = [
  { name: 'Water (L/day)', Vegan: 1200, Vegetarian: 3800, Omnivore: 15000 },
  { name: 'CO₂ (kg/day)', Vegan: 2.1, Vegetarian: 4.8, Omnivore: 7.2 },
  { name: 'Land (sq.ft/day)', Vegan: 18, Vegetarian: 65, Omnivore: 180 },
];

export const weeklySavingsData = [
  { day: 'Mon', Water: 1200, CO2: 5, Land: 18 },
  { day: 'Tue', Water: 2400, CO2: 10, Land: 36 },
  { day: 'Wed', Water: 3600, CO2: 15, Land: 54 },
  { day: 'Thu', Water: 4800, CO2: 20, Land: 72 },
  { day: 'Fri', Water: 6000, CO2: 25, Land: 90 },
  { day: 'Sat', Water: 7200, CO2: 30, Land: 108 },
  { day: 'Sun', Water: 8400, CO2: 35, Land: 126 },
];

// Dataset-level references for the two charts (rows are numeric points).
export const chartReferences = {
  comparison: [
    { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
    { org: 'FAO', title: 'Water footprint of livestock', link: 'https://www.fao.org/' }
  ],
  weekly: [
    { org: 'NASA Climate', title: 'Food and Climate', link: 'https://climate.nasa.gov/' },
    { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' }
  ]
};
