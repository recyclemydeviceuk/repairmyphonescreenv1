// =============================================================================
// locations.ts - Complete location data for all SEO pages
// =============================================================================

export interface City {
  name: string;
  slug: string;
  county?: string;
  postcode?: string;
}

export interface Region {
  slug: string;
  name: string;
  cities: City[];
}

export interface Brand {
  baseSlug: string;
  name: string;
  fullName: string;
  bookRepairPath: string;
  regions: Region[];
}

// =============================================================================
// City data by region
// =============================================================================

const northWestCities: City[] = [
  { name: 'Adlington', slug: 'adlington', county: 'Lancashire', postcode: 'PR6' },
  { name: 'Blackburn', slug: 'blackburn', county: 'Lancashire', postcode: 'BB1' },
  { name: 'Blackpool', slug: 'blackpool', county: 'Lancashire', postcode: 'FY1' },
  { name: 'Bolton', slug: 'bolton', county: 'Greater Manchester', postcode: 'BL1' },
  { name: 'Buckshaw Village', slug: 'buckshaw-village', county: 'Lancashire', postcode: 'PR7' },
  { name: 'Burnley', slug: 'burnley', county: 'Lancashire', postcode: 'BB11' },
  { name: 'Chorley', slug: 'chorley', county: 'Lancashire', postcode: 'PR7' },
  { name: 'Cleveleys', slug: 'cleveleys', county: 'Lancashire', postcode: 'FY5' },
  { name: 'Clitheroe', slug: 'clitheroe', county: 'Lancashire', postcode: 'BB7' },
  { name: 'Darwen', slug: 'darwen', county: 'Lancashire', postcode: 'BB3' },
  { name: 'Euxton', slug: 'euxton', county: 'Lancashire', postcode: 'PR7' },
  { name: 'Failsworth', slug: 'failsworth', county: 'Greater Manchester', postcode: 'M35' },
  { name: 'Lancaster', slug: 'lancaster', county: 'Lancashire', postcode: 'LA1' },
  { name: 'Leyland', slug: 'leyland', county: 'Lancashire', postcode: 'PR25' },
  { name: 'Liverpool', slug: 'liverpool', county: 'Merseyside', postcode: 'L1' },
  { name: 'Lytham', slug: 'lytham', county: 'Lancashire', postcode: 'FY8' },
  { name: 'Manchester', slug: 'manchester', county: 'Greater Manchester', postcode: 'M1' },
  { name: 'Ormskirk', slug: 'ormskirk', county: 'Lancashire', postcode: 'L39' },
  { name: 'Penwortham', slug: 'penwortham', county: 'Lancashire', postcode: 'PR1' },
  { name: 'Preston', slug: 'preston', county: 'Lancashire', postcode: 'PR1' },
  { name: 'Skelmersdale', slug: 'skelmersdale', county: 'Lancashire', postcode: 'WN8' },
  { name: 'Southport', slug: 'southport', county: 'Merseyside', postcode: 'PR8' },
  { name: 'Wigan', slug: 'wigan', county: 'Greater Manchester', postcode: 'WN1' },
];

const eastCities: City[] = [
  { name: 'Cambridge', slug: 'cambridge', county: 'Cambridgeshire', postcode: 'CB1' },
  { name: 'Colchester', slug: 'colchester', county: 'Essex', postcode: 'CO1' },
  { name: 'Great Yarmouth', slug: 'great-yarmouth', county: 'Norfolk', postcode: 'NR30' },
  { name: 'Ipswich', slug: 'ipswich', county: 'Suffolk', postcode: 'IP1' },
  { name: 'Luton', slug: 'luton', county: 'Bedfordshire', postcode: 'LU1' },
  { name: 'Norwich', slug: 'norwich', county: 'Norfolk', postcode: 'NR1' },
  { name: 'Peterborough', slug: 'peterborough', county: 'Cambridgeshire', postcode: 'PE1' },
];

const midlandsCities: City[] = [
  { name: 'Birmingham', slug: 'birmingham', county: 'West Midlands', postcode: 'B1' },
  { name: 'Bradford', slug: 'bradford', county: 'West Yorkshire', postcode: 'BD1' },
  { name: 'Coventry', slug: 'coventry', county: 'West Midlands', postcode: 'CV1' },
  { name: 'Derby', slug: 'derby', county: 'Derbyshire', postcode: 'DE1' },
  { name: 'Dudley', slug: 'dudley', county: 'West Midlands', postcode: 'DY1' },
  { name: 'Hereford', slug: 'hereford', county: 'Herefordshire', postcode: 'HR1' },
  { name: 'Leeds', slug: 'leeds', county: 'West Yorkshire', postcode: 'LS1' },
  { name: 'Leicester', slug: 'leicester', county: 'Leicestershire', postcode: 'LE1' },
  { name: 'Lichfield', slug: 'lichfield', county: 'Staffordshire', postcode: 'WS13' },
  { name: 'Nottingham', slug: 'nottingham', county: 'Nottinghamshire', postcode: 'NG1' },
  { name: 'Shrewsbury', slug: 'shrewsbury', county: 'Shropshire', postcode: 'SY1' },
  { name: 'Stoke-on-Trent', slug: 'stoke-on-trent', county: 'Staffordshire', postcode: 'ST1' },
  { name: 'West Bromwich', slug: 'west-bromwich', county: 'West Midlands', postcode: 'B70' },
  { name: 'Wolverhampton', slug: 'wolverhampton', county: 'West Midlands', postcode: 'WV1' },
  { name: 'Worcester', slug: 'worcester', county: 'Worcestershire', postcode: 'WR1' },
];

const northEastCities: City[] = [
  { name: 'Darlington', slug: 'darlington', county: 'County Durham', postcode: 'DL1' },
  { name: 'Durham', slug: 'durham', county: 'County Durham', postcode: 'DH1' },
  { name: 'Hartlepool', slug: 'hartlepool', county: 'County Durham', postcode: 'TS24' },
  { name: 'Middlesbrough', slug: 'middlesbrough', county: 'North Yorkshire', postcode: 'TS1' },
  { name: 'Newcastle', slug: 'newcastle', county: 'Tyne and Wear', postcode: 'NE1' },
  { name: 'Sunderland', slug: 'sunderland', county: 'Tyne and Wear', postcode: 'SR1' },
  { name: 'Tynemouth', slug: 'tynemouth', county: 'Tyne and Wear', postcode: 'NE30' },
];

const scotlandCities: City[] = [
  { name: 'Aberdeen', slug: 'aberdeen', postcode: 'AB10' },
  { name: 'Ayr', slug: 'ayr', postcode: 'KA7' },
  { name: 'Dumfries', slug: 'dumfries', postcode: 'DG1' },
  { name: 'Dundee', slug: 'dundee', postcode: 'DD1' },
  { name: 'Dunfermline', slug: 'dunfermline', postcode: 'KY11' },
  { name: 'Edinburgh', slug: 'edinburgh', postcode: 'EH1' },
  { name: 'Elgin', slug: 'elgin', postcode: 'IV30' },
  { name: 'Falkirk', slug: 'falkirk', postcode: 'FK1' },
  { name: 'Glasgow', slug: 'glasgow', postcode: 'G1' },
  { name: 'Inverness', slug: 'inverness', postcode: 'IV1' },
  { name: 'Livingston', slug: 'livingston', postcode: 'EH54' },
  { name: 'Perth', slug: 'perth', postcode: 'PH1' },
  { name: 'Stirling', slug: 'stirling', postcode: 'FK8' },
];

const southEastCities: City[] = [
  { name: 'Barking and Dagenham', slug: 'barking-and-dagenham', county: 'London', postcode: 'IG11' },
  { name: 'Barnet', slug: 'barnet', county: 'London', postcode: 'EN5' },
  { name: 'Bexley', slug: 'bexley', county: 'London', postcode: 'DA5' },
  { name: 'Brent', slug: 'brent', county: 'London', postcode: 'HA9' },
  { name: 'Brighton', slug: 'brighton', county: 'East Sussex', postcode: 'BN1' },
  { name: 'Bromley', slug: 'bromley', county: 'London', postcode: 'BR1' },
  { name: 'Camden', slug: 'camden', county: 'London', postcode: 'NW1' },
  { name: 'Canterbury', slug: 'canterbury', county: 'Kent', postcode: 'CT1' },
  { name: 'City of London', slug: 'city-of-london', county: 'London', postcode: 'EC1' },
  { name: 'Croydon', slug: 'croydon', county: 'London', postcode: 'CR0' },
  { name: 'Ealing', slug: 'ealing', county: 'London', postcode: 'W5' },
  { name: 'Enfield', slug: 'enfield', county: 'London', postcode: 'EN1' },
  { name: 'Greenwich', slug: 'greenwich', county: 'London', postcode: 'SE10' },
  { name: 'Hackney', slug: 'hackney', county: 'London', postcode: 'E8' },
  { name: 'Hammersmith and Fulham', slug: 'hammersmith-and-fulham', county: 'London', postcode: 'W6' },
  { name: 'Haringey', slug: 'haringey', county: 'London', postcode: 'N4' },
  { name: 'Harrow', slug: 'harrow', county: 'London', postcode: 'HA1' },
  { name: 'Havering', slug: 'havering', county: 'London', postcode: 'RM1' },
  { name: 'Hillingdon', slug: 'hillingdon', county: 'London', postcode: 'UB8' },
  { name: 'Hounslow', slug: 'hounslow', county: 'London', postcode: 'TW3' },
  { name: 'Islington', slug: 'islington', county: 'London', postcode: 'N1' },
  { name: 'Kensington and Chelsea', slug: 'kensington-and-chelsea', county: 'London', postcode: 'SW7' },
  { name: 'Kingston upon Thames', slug: 'kingston-upon-thames', county: 'London', postcode: 'KT1' },
  { name: 'Lambeth', slug: 'lambeth', county: 'London', postcode: 'SW2' },
  { name: 'Lewisham', slug: 'lewisham', county: 'London', postcode: 'SE13' },
  { name: 'London', slug: 'london', county: 'London', postcode: 'EC1' },
  { name: 'Maidstone', slug: 'maidstone', county: 'Kent', postcode: 'ME14' },
  { name: 'Merton', slug: 'merton', county: 'London', postcode: 'SW19' },
  { name: 'Newham', slug: 'newham', county: 'London', postcode: 'E6' },
  { name: 'Redbridge', slug: 'redbridge', county: 'London', postcode: 'IG1' },
  { name: 'Richmond upon Thames', slug: 'richmond-upon-thames', county: 'London', postcode: 'TW9' },
  { name: 'Southampton', slug: 'southampton', county: 'Hampshire', postcode: 'SO14' },
  { name: 'Southwark', slug: 'southwark', county: 'London', postcode: 'SE1' },
  { name: 'Sutton', slug: 'sutton', county: 'London', postcode: 'SM1' },
  { name: 'Tower Hamlets', slug: 'tower-hamlets', county: 'London', postcode: 'E1' },
  { name: 'Waltham Forest', slug: 'waltham-forest', county: 'London', postcode: 'E17' },
  { name: 'Wandsworth', slug: 'wandsworth', county: 'London', postcode: 'SW18' },
  { name: 'Westminster', slug: 'westminster', county: 'London', postcode: 'SW1' },
];

const southWestCities: City[] = [
  { name: 'Bournemouth', slug: 'bournemouth', county: 'Dorset', postcode: 'BH1' },
  { name: 'Bristol', slug: 'bristol', county: 'Bristol', postcode: 'BS1' },
  { name: 'Cheltenham', slug: 'cheltenham', county: 'Gloucestershire', postcode: 'GL50' },
  { name: 'Cornwall', slug: 'cornwall', county: 'Cornwall', postcode: 'TR1' },
  { name: 'Exeter', slug: 'exeter', county: 'Devon', postcode: 'EX1' },
  { name: 'Glastonbury', slug: 'glastonbury', county: 'Somerset', postcode: 'BA6' },
  { name: 'Gloucester', slug: 'gloucester', county: 'Gloucestershire', postcode: 'GL1' },
  { name: 'Newquay', slug: 'newquay', county: 'Cornwall', postcode: 'TR7' },
  { name: 'Plymouth', slug: 'plymouth', county: 'Devon', postcode: 'PL1' },
  { name: 'Poole', slug: 'poole', county: 'Dorset', postcode: 'BH15' },
  { name: 'Salisbury', slug: 'salisbury', county: 'Wiltshire', postcode: 'SP1' },
  { name: 'Somerset', slug: 'somerset', county: 'Somerset', postcode: 'TA1' },
  { name: 'Southampton', slug: 'southampton', county: 'Hampshire', postcode: 'SO14' },
  { name: 'Weymouth', slug: 'weymouth', county: 'Dorset', postcode: 'DT4' },
];

const walesCities: City[] = [
  { name: 'Aberystwyth', slug: 'aberystwyth', county: 'Ceredigion', postcode: 'SY23' },
  { name: 'Bangor', slug: 'bangor', county: 'Gwynedd', postcode: 'LL57' },
  { name: 'Brecon', slug: 'brecon', county: 'Powys', postcode: 'LD3' },
  { name: 'Cardiff', slug: 'cardiff', county: 'South Glamorgan', postcode: 'CF10' },
  { name: 'Llandudno', slug: 'llandudno', county: 'Conwy', postcode: 'LL30' },
  { name: 'Newport', slug: 'newport', county: 'Gwent', postcode: 'NP20' },
  { name: 'St Davids', slug: 'st-davids', county: 'Pembrokeshire', postcode: 'SA62' },
  { name: 'Swansea', slug: 'swansea', county: 'West Glamorgan', postcode: 'SA1' },
  { name: 'Wrexham', slug: 'wrexham', county: 'Clwyd', postcode: 'LL11' },
];

// =============================================================================
// Helper: build city slugs with brand-specific suffixes
// =============================================================================

type CitySlugSuffix = string | null; // null means use bare city slug

function buildCitiesWithSuffix(baseCities: City[], suffix: CitySlugSuffix): City[] {
  return baseCities.map((city) => ({
    ...city,
    slug: suffix ? `${city.slug}-${suffix}` : city.slug,
  }));
}

// =============================================================================
// Build regions for each brand
// =============================================================================

// --- iPhone ---
// iPhone NW = default (no region in URL), all cities get "-iphone-repair-service"
// All other regions also get "-iphone-repair-service"

function buildIPhoneRegions(): Region[] {
  const suffix = 'iphone-repair-service';
  return [
    { slug: '', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, suffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, suffix) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, suffix) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, suffix) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, suffix) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, suffix) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, suffix) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, suffix) },
  ];
}

// --- Samsung ---
// NW and SE get "-samsung-repair-service", others get bare slug

function buildSamsungRegions(): Region[] {
  const withSuffix = 'samsung-repair-service';
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, withSuffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, withSuffix) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// --- Samsung Tab ---
// Same pattern as Samsung: NW and SE get suffix, others bare

function buildSamsungTabRegions(): Region[] {
  const withSuffix = 'samsung-repair-service';
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, withSuffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, withSuffix) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// --- iPad ---
// NW and SE get "-ipad-repair-service", others bare

function buildIPadRegions(): Region[] {
  const withSuffix = 'ipad-repair-service';
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, withSuffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, withSuffix) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// --- Huawei ---
// NW and SE get "-huawei-repair-service", others bare

function buildHuaweiRegions(): Region[] {
  const withSuffix = 'huawei-repair-service';
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, withSuffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, withSuffix) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// --- Nokia ---
// NW and SE get "-nokia-repair-service", others bare

function buildNokiaRegions(): Region[] {
  const withSuffix = 'nokia-repair-service';
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, withSuffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, withSuffix) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// --- Google Pixel ---
// NW gets "-google-pixel-repair-service", all others bare

function buildGooglePixelRegions(): Region[] {
  const withSuffix = 'google-pixel-repair-service';
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, withSuffix) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, null) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// --- Sony Xperia ---
// All regions use bare city slug (no suffix)

function buildSonyXperiaRegions(): Region[] {
  return [
    { slug: 'north-west', name: 'North West', cities: buildCitiesWithSuffix(northWestCities, null) },
    { slug: 'east', name: 'East England', cities: buildCitiesWithSuffix(eastCities, null) },
    { slug: 'midlands', name: 'Midlands', cities: buildCitiesWithSuffix(midlandsCities, null) },
    { slug: 'north-east', name: 'North East', cities: buildCitiesWithSuffix(northEastCities, null) },
    { slug: 'scotland', name: 'Scotland', cities: buildCitiesWithSuffix(scotlandCities, null) },
    { slug: 'south-east', name: 'South East', cities: buildCitiesWithSuffix(southEastCities, null) },
    { slug: 'south-west', name: 'South West', cities: buildCitiesWithSuffix(southWestCities, null) },
    { slug: 'wales', name: 'Wales', cities: buildCitiesWithSuffix(walesCities, null) },
  ];
}

// =============================================================================
// All brands
// =============================================================================

export const BRANDS: Brand[] = [
  {
    baseSlug: 'iphone-repairs',
    name: 'iPhone',
    fullName: 'iPhone Screen Repair',
    bookRepairPath: '/book-repair/phone/apple',
    regions: buildIPhoneRegions(),
  },
  {
    baseSlug: 'samsung-repairs',
    name: 'Samsung Galaxy',
    fullName: 'Samsung Galaxy Screen Repair',
    bookRepairPath: '/book-repair/phone/samsung',
    regions: buildSamsungRegions(),
  },
  {
    baseSlug: 'samsung-tab-repairs',
    name: 'Samsung Galaxy Tab',
    fullName: 'Samsung Galaxy Tab Screen Repair',
    bookRepairPath: '/book-repair/tablet/samsung',
    regions: buildSamsungTabRegions(),
  },
  {
    baseSlug: 'ipad-repairs',
    name: 'iPad',
    fullName: 'iPad Screen Repair',
    bookRepairPath: '/book-repair/tablet/apple',
    regions: buildIPadRegions(),
  },
  {
    baseSlug: 'huawei-repairs',
    name: 'Huawei',
    fullName: 'Huawei Screen Repair',
    bookRepairPath: '/book-repair/phone/huawei',
    regions: buildHuaweiRegions(),
  },
  {
    baseSlug: 'nokia-repairs',
    name: 'Nokia',
    fullName: 'Nokia Screen Repair',
    bookRepairPath: '/book-repair/phone/nokia',
    regions: buildNokiaRegions(),
  },
  {
    baseSlug: 'google-pixel-repairs',
    name: 'Google Pixel',
    fullName: 'Google Pixel Screen Repair',
    bookRepairPath: '/book-repair/phone/google',
    regions: buildGooglePixelRegions(),
  },
  {
    baseSlug: 'sony-xperia-repairs',
    name: 'Sony Xperia',
    fullName: 'Sony Xperia Screen Repair',
    bookRepairPath: '/book-repair/phone/sony',
    regions: buildSonyXperiaRegions(),
  },
];

// =============================================================================
// Generic location pages (brand-agnostic)
// =============================================================================

export const GENERIC_LOCATIONS = [
  { slug: 'screen-repairs-blackpool', city: 'Blackpool' },
  { slug: 'screen-repairs-bolton', city: 'Bolton' },
  { slug: 'screen-repairs-chorley', city: 'Chorley' },
  { slug: 'screen-repairs-leyland', city: 'Leyland' },
  { slug: 'screen-repairs-liverpool', city: 'Liverpool' },
  { slug: 'screen-repairs-manchester', city: 'Manchester' },
  { slug: 'screen-repairs-preston', city: 'Preston' },
];

// =============================================================================
// Helper: compute the full region URL slug
// e.g. "iphone-repairs", "iphone-repairs-east", "samsung-repairs-north-west"
// =============================================================================

function getRegionUrlSlug(brand: Brand, region: Region): string {
  if (region.slug === '') {
    return brand.baseSlug; // iPhone NW default
  }
  return `${brand.baseSlug}-${region.slug}`;
}

// =============================================================================
// Exported helper functions
// =============================================================================

/**
 * Returns all unique region-level URL slugs.
 * e.g. ["iphone-repairs", "iphone-repairs-east", ..., "samsung-repairs-north-west", ...]
 */
export function getAllRegionSlugs(): string[] {
  const slugs: string[] = [];
  for (const brand of BRANDS) {
    for (const region of brand.regions) {
      slugs.push(getRegionUrlSlug(brand, region));
    }
  }
  return slugs;
}

/**
 * Look up a brand and region by the combined region URL slug.
 * e.g. "iphone-repairs-east" -> { brand: iPhone, region: East England }
 */
export function findBrandAndRegion(
  regionSlug: string
): { brand: Brand; region: Region } | null {
  for (const brand of BRANDS) {
    for (const region of brand.regions) {
      if (getRegionUrlSlug(brand, region) === regionSlug) {
        return { brand, region };
      }
    }
  }
  return null;
}

/**
 * Look up a specific city by region URL slug and city slug.
 * e.g. ("iphone-repairs", "preston-iphone-repair-service")
 *   -> { brand: iPhone, region: NW, city: Preston }
 */
export function findCity(
  regionSlug: string,
  citySlug: string
): { brand: Brand; region: Region; city: City } | null {
  const result = findBrandAndRegion(regionSlug);
  if (!result) return null;

  const { brand, region } = result;
  const city = region.cities.find((c) => c.slug === citySlug);
  if (!city) return null;

  return { brand, region, city };
}
