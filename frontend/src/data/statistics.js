export const impactStats = [
  {
    id: 'water',
    kicker: 'Water',
    meter: { type: 'pair', caption: 'Water needed per kilogram of food', rows: [{ label: 'Beef', pct: 100, display: '15,400 L' }, { label: 'Vegetables', pct: 2, display: '320 L' }] },
    title: 'Water in 1 kg of Beef',
    value: '15,400',
    unit: 'liters',
    desc: 'The global average water footprint of beef. Vegetables average about 320 liters per kilogram.',
    icon: 'FaDroplet',
    color: '#a6b48f',
    references: [
      { org: 'Water Footprint Network', title: 'Product water footprints', link: 'https://www.waterfootprint.org/' },
      { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' }
    ]
  },
  {
    id: 'co2',
    kicker: 'Climate',
    meter: { type: 'note', text: 'Illustrative · per person, per year' },
    title: 'CO₂ Reduced',
    value: '140',
    unit: 'kg CO₂',
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
    kicker: 'Land',
    meter: { type: 'pair', caption: 'Land needed, beef vs plant foods', rows: [{ label: 'Beef', pct: 100, display: '100%' }, { label: 'Plant foods', pct: 10, display: 'up to 90% less' }] },
    title: 'Land Preserved',
    value: '1,050',
    unit: 'sq. ft',
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
    kicker: 'Forests',
    meter: { type: 'note', text: 'Illustrative · per person, per year' },
    title: 'Trees Protected',
    value: '35',
    unit: 'trees',
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
    kicker: 'Food',
    meter: { type: 'gauge', pct: 33, caption: 'of the world’s cereal goes to animal feed' },
    title: 'Grain Redirected',
    value: '1,020',
    unit: 'kg',
    desc: 'Equivalent to a year of staples. Roughly a third of the world’s cereal crops go to animal feed rather than people.',
    icon: 'FaWheatAwn',
    color: '#93a77b',
    references: [
      { org: 'FAO', title: 'World food and agriculture statistical yearbook', link: 'https://www.fao.org/publications/home/fao-flagship-publications/world-food-and-agriculture---statistical-yearbook/en' },
      { org: 'Our World in Data', title: 'How much of the world’s grain is fed to animals?', link: 'https://ourworldindata.org/land-use' }
    ]
  },
  {
    id: 'wild',
    kicker: 'Wildlife',
    meter: { type: 'stack', caption: 'Share of mammal biomass on Earth', segments: [{ label: 'Livestock', pct: 60 }, { label: 'Humans', pct: 36 }, { label: 'Wild', pct: 4 }] },
    title: 'Wild Mammals',
    value: '4',
    unit: '% of mammal mass',
    desc: 'Livestock make up about 60% of the biomass of all mammals on Earth and humans 36%. Wild mammals are just 4%.',
    icon: 'FaPaw',
    color: '#c9824a',
    references: [
      { org: 'PNAS (Bar-On et al., 2018)', title: 'The biomass distribution on Earth', link: 'https://www.pnas.org/doi/10.1073/pnas.1711842115' },
      { org: 'Our World in Data', title: 'Wild mammals have declined', link: 'https://ourworldindata.org/wild-mammal-decline' }
    ]
  }
];

// Index chart: a high-meat diet is 100 on every measure, so three different
// units can share one axis. CO₂ follows Scarborough et al. (2014): 7.2 kg/day
// high-meat, 3.8 vegetarian, 2.9 vegan. Land follows the ~76% reduction in
// Poore & Nemecek (2018). Water and the vegetarian land value are rounded
// estimates and the chart says so.
export const resourceComparisonData = [
  { name: 'Carbon footprint', Vegan: 40, Vegetarian: 53, 'High-meat': 100 },
  { name: 'Water footprint', Vegan: 50, Vegetarian: 70, 'High-meat': 100 },
  { name: 'Farmland use', Vegan: 25, Vegetarian: 45, 'High-meat': 100 },
];

// Projection, not a measurement: assumes every day looks like a typical vegan
// day compared with a high-meat one (4.3 kg CO₂e is 7.2 minus 2.9 kg/day).
export const weeklySavingsData = [
  { day: 'Mon', Water: 1200, CO2: 4.3, Land: 18 },
  { day: 'Tue', Water: 2400, CO2: 8.6, Land: 36 },
  { day: 'Wed', Water: 3600, CO2: 12.9, Land: 54 },
  { day: 'Thu', Water: 4800, CO2: 17.2, Land: 72 },
  { day: 'Fri', Water: 6000, CO2: 21.5, Land: 90 },
  { day: 'Sat', Water: 7200, CO2: 25.8, Land: 108 },
  { day: 'Sun', Water: 8400, CO2: 30.1, Land: 126 },
];

// Dataset-level references for the two charts.
export const chartReferences = {
  comparison: [
    { org: 'Climatic Change (Scarborough et al., 2014)', title: 'Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK', link: 'https://link.springer.com/article/10.1007/s10584-014-1169-1' },
    { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
    { org: 'Our World in Data', title: 'Environmental impacts of food production', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
  ],
  weekly: [
    { org: 'Climatic Change (Scarborough et al., 2014)', title: 'Dietary greenhouse gas emissions by diet', link: 'https://link.springer.com/article/10.1007/s10584-014-1169-1' },
    { org: 'Water Footprint Network', title: 'Product water footprints', link: 'https://www.waterfootprint.org/' },
    { org: 'Our World in Data', title: 'Environmental impacts of food production', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
  ],
};
