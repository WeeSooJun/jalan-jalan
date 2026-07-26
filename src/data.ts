// Data extracted from legacy/site.template.html — single source of truth for the React app.
export type LatLng = [number, number];

export interface Trail {
  id: string; name: string; region: string; km: number; hrs: string;
  effort: 1 | 2 | 3; shade: string;
  mrt: [string, string[]][];
  blurb: string; highlights: string[];
  food: [string, string, string, string][];
  sights: [string, string, string][];
  tips: string;
}

export const LINE: Record<string, [string, string]> = {
  NS:["#D42E12","NS"], EW:["#009645","EW"], NE:["#9900AA","NE"],
  CC:["#FA9E0D","CC"], DT:["#005EC4","DT"], TE:["#9D5B25","TE"], LRT:["#748477","LR"]
};

export const GEO: Record<string, LatLng> = {
"Seah Im Food Centre":[1.26657,103.81925],"ABC Brickworks Market":[1.28688,103.80813],
"Pasir Panjang Food Centre":[1.27592,103.79141],"Beauty World Centre Food Centre":[1.34241,103.77654],
"The Rail Mall":[1.35781,103.76808],"Cheong Chin Nam Road":[1.34379,103.77509],
"Adam Road Food Centre":[1.32408,103.81418],"Roti Prata House, Upper Thomson":[1.35362,103.83447],
"Upper Thomson cafés":[1.354,103.8325],"Taman Jurong Market & Food Centre":[1.33472,103.72158],
"Boon Lay Place Food Village":[1.34576,103.71308],"East Coast Lagoon Food Village":[1.30726,103.9348],
"Bedok 85 Fengshan":[1.332,103.93877],"Changi Village Hawker Centre":[1.38966,103.98809],
"Punggol Settlement":[1.42088,103.9122],"Tebing Lane":[1.39267,103.91618],
"Kopitiam @ Waterway Point":[1.40654,103.90199],"Old Airport Road Food Centre":[1.30825,103.88581],
"Satay by the Bay":[1.28234,103.86864],"Kim San Leng, Bishan":[1.34923,103.8499],
"Poison Ivy Bistro, Bollywood Farms":[1.41836,103.71667],"Chong Pang Market & Food Centre":[1.43145,103.82854],
"Sembawang White Beehoon":[1.44198,103.82389],"Beaulieu House":[1.46338,103.83688],
"Pasir Ris Central Hawker Centre":[1.37347,103.95157],"Tampines Round Market":[1.34537,103.94463],
"Little Island Brewing Co":[1.38993,103.98871],"Food Republic, VivoCity":[1.26429,103.8223],
"Coastes, Siloso Beach":[1.25363,103.81514],"Ubin kampong eateries":[1.4015,103.9636],
"Henderson Waves":[1.27603,103.8155],"Gillman Barracks":[1.27719,103.80415],
"HortPark":[1.279,103.80112],"Bukit Timah Railway Station":[1.33466,103.78149],
"Former Ford Factory":[1.35283,103.76884],"Bukit Timah Summit detour":[1.3546,103.7763],
"TreeTop Walk":[1.35749,103.80893],"Jelutong Tower":[1.3527,103.8123],
"Lower Peirce Boardwalk":[1.36902,103.82659],"Chinese Garden":[1.34235,103.7326],
"Science Centre":[1.33284,103.73582],"Grasslands + otter family":[1.33936,103.7273],
"Bedok Jetty":[1.30643,103.94178],"Xtreme SkatePark":[1.3037,103.9146],
"Changi Beach WWII site":[1.38273,104.00198],"Coney Island Park":[1.40939,103.92637],
"Lorong Halus Wetland":[1.39556,103.92441],"Punggol Waterway Park":[1.411,103.90481],
"Gardens by the Bay (outdoor)":[1.28459,103.86466],"Marina Barrage":[1.27991,103.87047],
"Bishan-AMK Park":[1.36517,103.8363],"Sungei Buloh Wetland Reserve":[1.44535,103.73214],
"Kranji War Memorial":[1.41903,103.75731],"Hay Dairies Goat Farm":[1.43165,103.70995],
"Sembawang Hot Spring Park":[1.43431,103.82261],"Sembawang Park beach":[1.4628,103.8379],
"Masjid Petempatan Melayu":[1.4591,103.84175],"Pasir Ris Park mangroves":[1.3677,103.96196],
"Tampines Eco Green":[1.36378,103.94818],"Pasir Ris beach":[1.3815,103.953],
"Chek Jawa Wetlands":[1.40829,103.99189],"Bike rental on Ubin":[1.4017,103.9631],
"Changi Boardwalk":[1.3925,103.9835],"Fort Siloso + Skywalk":[1.25852,103.80863],
"Berlayer Creek":[1.26895,103.80393],"Sentosa beaches":[1.25474,103.81189],
"HarbourFront MRT":[1.26531,103.82056],"Pasir Panjang MRT":[1.27621,103.79135],
"Hillview MRT":[1.36289,103.76778],"King Albert Park MRT":[1.33589,103.78324],
"Beauty World MRT":[1.3409,103.77575],"Caldecott MRT":[1.33735,103.83954],
"Marymount MRT":[1.34871,103.83942],"Lakeside MRT":[1.34426,103.72095],
"Chinese Garden MRT":[1.34235,103.7326],"Siglap MRT":[1.31001,103.93003],
"Bayshore MRT":[1.31312,103.94231],"Punggol MRT":[1.41493,103.91017],
"Bishan MRT":[1.35102,103.85006],"Bayfront MRT":[1.28187,103.85908],
"Kranji MRT":[1.42509,103.76214],"Yishun MRT":[1.42944,103.83501],
"Sembawang MRT":[1.44905,103.82005],"Pasir Ris MRT":[1.36713,103.96056],
"Tampines MRT":[1.35619,103.95463],"Labrador Park MRT":[1.27237,103.80342]
};

export const ROUTES: Record<string, (string | LatLng)[]> = {
 ridges:["HarbourFront MRT","Seah Im Food Centre",[1.2717,103.819],"Henderson Waves",[1.2758,103.809],"HortPark",[1.279,103.79],"Pasir Panjang MRT"],
 rail:["The Rail Mall","Hillview MRT",[1.352,103.771],"Beauty World MRT","Bukit Timah Railway Station",[1.328,103.787]],
 macritchie:["Marymount MRT",[1.3438,103.832],[1.342,103.821],"Jelutong Tower","TreeTop Walk",[1.356,103.818],[1.3438,103.832],"Marymount MRT"],
 jurong:["Lakeside MRT","Grasslands + otter family",[1.335,103.728],"Chinese Garden","Chinese Garden MRT"],
 eastcoast:["Siglap MRT",[1.305,103.925],"East Coast Lagoon Food Village","Bedok Jetty",[1.3247,103.955],[1.36,103.988],"Changi Beach WWII site","Changi Village Hawker Centre"],
 punggol:["Punggol MRT","Punggol Waterway Park",[1.413,103.908],"Punggol Settlement","Coney Island Park"],
 kallang:["Bishan MRT","Bishan-AMK Park",[1.352,103.862],[1.328,103.87],[1.308,103.871],"Gardens by the Bay (outdoor)","Marina Barrage"],
 buloh:["Kranji MRT","Kranji War Memorial","Sungei Buloh Wetland Reserve","Poison Ivy Bistro, Bollywood Farms"],
 sembawang:["Yishun MRT","Chong Pang Market & Food Centre","Sembawang Hot Spring Park","Sembawang White Beehoon","Masjid Petempatan Melayu","Sembawang Park beach"],
 pasirris:["Pasir Ris MRT","Pasir Ris Park mangroves","Pasir Ris beach",[1.37,103.945],"Tampines Eco Green"],
 ubin:["Changi Village Hawker Centre","Changi Boardwalk","Bike rental on Ubin","Chek Jawa Wetlands"],
 sentosa:["Labrador Park MRT","Berlayer Creek",[1.2645,103.818],"Food Republic, VivoCity",[1.259,103.819],"Fort Siloso + Skywalk","Sentosa beaches"]
};

// Baked fallback — overridden live from data.gov.sg at runtime (see lib/clean.ts)
export const CLEAN_BAKED: Record<string, string> = {
  "Adam Road Food Centre":"7 Sep · 7–8 Dec",
  "Bedok 85 Fengshan":"28 Sep–2 Oct · 28–29 Dec",
  "Boon Lay Place Food Village":"21–22 Sep · 30 Nov–3 Dec",
  "Changi Village Hawker Centre":"Q4 TBC · repairs & redecoration from 1 Oct 2026",
  "East Coast Lagoon Food Village":"12–14 Oct",
  "ABC Brickworks Market":"28–29 Sep · 14–15 Dec",
  "Old Airport Road Food Centre":"28 Sep–1 Oct · 7–10 Dec",
  "Pasir Panjang Food Centre":"24–25 Aug · 23 Nov",
  "Pasir Ris Central Hawker Centre":"17–18 Aug · 16–18 Nov",
  "Taman Jurong Market & Food Centre":"31 Aug–2 Sep · 30 Nov–1 Dec",
  "Tampines Round Market":"28–30 Sep · 14–16 Dec",
  "Chong Pang Market & Food Centre":"14–17 Sep · 16–17 Nov"
};

export const DATA_ASOF = "25 Jul 2026";

export const TRAIL_ALERTS: Record<string, string> = {
  rail:"Featured Central stretch is open. Rail Corridor (South), Henderson Rd → Spooner Rd, is closed for improvement works until ~Jul 2027.",
  kallang:"A section of Kallang Park Connector is closed for construction — alternative path signposted. Check NParks noticeboard."
};

export const NEW_PARKS: [string, string, string, string][] = [
  ["Nature Immersion Trail, Botanic Gardens","Jun 2026","Free","Asia's first certified nature-immersion trail at Saraca Stream — slow, self-guided, deliberately quiet."],
  ["Bulim Park","Jan 2026","Free","Jurong West's new 14-football-field park: 3-storey sheltered playground, nets, Sky Corridor."],
  ["King's Road Park","Dec 2025","Free","Farrer Road pocket park with a 400 sqm dog run and nature play area."],
  ["Compassvale Walk Park","Jun 2025","Free","Sengkang therapeutic garden — foot reflexology path, butterfly planting."],
  ["Punggol Heritage Trail","First 400 m open","Free","Recreated old bus stops + kampong-games playground; full trail early 2027."]
];

export const COMING_PARKS: [string, string, string][] = [
  ["Mandai Mangrove & Mudflat Nature Park","2028","Coastal boardwalks + shorebird viewpoints beside Sungei Buloh."],
  ["Bukit Batok Hillside Nature Park","from 2028","9.2 ha of trails, streams and native habitat."],
  ["Ang Mo Kio Garden West","2029","Garden loop, lily pond, new playgardens."],
  ["Teachers' Estate + Farrer Park","by 2030","Forested hillock park (Upper Thomson) and a city-fringe fitness loop."]
];

export const UPDATE_LINKS: [string, string, string][] = [
  ["NParks Noticeboard","https://www.nparks.gov.sg/noticeboard","live park & PCN closure notices"],
  ["Rail Corridor closure notices","https://railcorridor.nparks.gov.sg/closure-notice/","section-by-section trail status"],
  ["NEA hawker cleaning dates (data.gov.sg)","https://data.gov.sg/datasets?query=hawker+centres+closure","quarterly cleaning + long closures, all 123 centres"],
  ["NParks news","https://www.nparks.gov.sg/news","new park openings and announcements"]
];

export const TRAILS: Trail[] = [
{ id:"ridges", name:"Southern Ridges", region:"South", km:10, hrs:"3–4 h", effort:2, shade:"Patchy shade",
  mrt:[["HarbourFront",["NE","CC"]],["Pasir Panjang",["CC"]]],
  blurb:"The classic: Mount Faber to Kent Ridge over Henderson Waves and the elevated Forest Walk, canopy level the whole way.",
  highlights:["Henderson Waves at dusk","Forest Walk steel canopy path","City + port views from Faber Point"],
  food:[
    ["Seah Im Food Centre","hawker","$","Chicken rice and lor mee right opposite HarbourFront — fuel up before the climb."],
    ["ABC Brickworks Market","hawker","$","Detour off Alexandra: Fatty Cheong char siew, Ah Balling glutinous rice balls."],
    ["Pasir Panjang Food Centre","hawker","$","Old-school zi char and Hokkien mee near the Kent Ridge end."]
  ],
  sights:[
    ["Henderson Waves","Free","36 m up, Singapore's highest pedestrian bridge. Golden hour is the shot."],
    ["Gillman Barracks","Free","Contemporary art galleries in colonial blocks — short detour, closed Mondays."],
    ["HortPark","Free","Themed gardens and plant swap corner midway; good toilet + water stop."]
  ],
  tips:"Start HarbourFront, end Pasir Panjang so the big climb comes first. Weekday mornings near-empty." },

{ id:"rail", name:"Rail Corridor (Central)", region:"Central", km:8, hrs:"2.5 h", effort:1, shade:"Mostly shaded",
  mrt:[["Hillview",["DT"]],["King Albert Park",["DT"]],["Beauty World",["DT"]]],
  blurb:"Flat, jungle-flanked path along the old KTM railway line, past truss bridges and the restored 1932 Bukit Timah Railway Station.",
  highlights:["Restored Bukit Timah Railway Station","Two black truss bridges","Dense secondary forest, zero traffic"],
  food:[
    ["Beauty World Centre Food Centre","hawker","$","4th-storey old-school food centre — the stand-in while Bukit Timah Market rebuilds (till ~2029)."],
    ["The Rail Mall","cafe","$$","Springleaf Prata Place and brunch cafes right at the Hillview trailhead."],
    ["Cheong Chin Nam Road","hawker","$","Al-Azhar supper strip + Boon Tong Kee chicken rice, 5 min from the station."]
  ],
  sights:[
    ["Bukit Timah Railway Station","Free","Restored station + Station Master's quarters, now a garden café."],
    ["Former Ford Factory","Free–$6","WWII surrender site museum on Upper Bukit Timah. Free for citizens/PRs."],
    ["Bukit Timah Summit detour","Free","Add Singapore's highest hill (163 m) if legs still fresh."]
  ],
  tips:"Fully flat — good easy day or run. Gravel fine after rain, some stretches muddy at the edges." },

{ id:"macritchie", name:"MacRitchie TreeTop Walk Loop", region:"Central", km:10, hrs:"3.5–4.5 h", effort:3, shade:"Mostly shaded",
  mrt:[["Caldecott",["CC","TE"]],["Marymount",["CC"]]],
  blurb:"Proper rainforest loop around the reservoir with the free-standing TreeTop suspension bridge 25 m above the forest floor.",
  highlights:["TreeTop Walk suspension bridge","Jelutong Tower lookout","Monitor lizards + long-tailed macaques"],
  food:[
    ["Adam Road Food Centre","hawker","$","Selera Rasa nasi lemak (the Sultan of Brunei's pick) post-hike."],
    ["Roti Prata House, Upper Thomson","hawker","$","Crispy prata till late; the classic finish if you exit via Venus Drive."],
    ["Upper Thomson cafés","cafe","$$","One Man Coffee, Habitat — flat whites and brunch along Thomson Road."]
  ],
  sights:[
    ["TreeTop Walk","Free","One-way suspension bridge, closed Mondays, last entry 4:45 pm."],
    ["Jelutong Tower","Free","Five-storey birdwatching tower — hornbills at dawn."],
    ["Lower Peirce Boardwalk","Free","Quiet 900 m boardwalk extension under old-growth forest."]
  ],
  tips:"No food inside the reserve — carry 1.5 L water. Don't hold plastic bags visibly; macaques will negotiate." },

{ id:"jurong", name:"Jurong Lake Gardens Loop", region:"West", km:5, hrs:"1.5–2 h", effort:1, shade:"Patchy shade",
  mrt:[["Lakeside",["EW"]],["Chinese Garden",["EW"]]],
  blurb:"Restored swamp forest, lalang fields and the rebuilt Chinese Garden pagodas around Jurong Lake — flat and pram-friendly.",
  highlights:["Rasau Walk floating boardwalk","Lalang field (the Instagram grass)","Chinese Garden twin pagodas"],
  food:[
    ["Taman Jurong Market & Food Centre","hawker","$","Underrated two-floor centre — yong tau foo and claypot rice."],
    ["Boon Lay Place Food Village","hawker","$","Power nasi lemak and Huat Huat BBQ chicken wings, one MRT stop away."]
  ],
  sights:[
    ["Chinese Garden","Free","Rebuilt pagodas and stone boat — sunset over the lake."],
    ["Science Centre","~$12","Cheap rainy-day escape next door; Omni-Theatre extra."],
    ["Grasslands + otter family","Free","Smooth-coated otters cruise the lake edge at dawn."]
  ],
  tips:"Combine with the Coast-to-Coast Trail — this is its western trailhead (C2C runs 36 km to Coney Island)." },

{ id:"eastcoast", name:"East Coast → Changi Beach", region:"East", km:15, hrs:"3.5–5 h", effort:2, shade:"Bring cap",
  mrt:[["Siglap",["TE"]],["Bayshore",["TE"]]],
  blurb:"Sea breeze the whole way: East Coast Park along the coastal PCN past Bedok Jetty to Changi Beach. Rent a bike to shorten it.",
  highlights:["Bedok Jetty anglers at sunrise","Ship-watching along the strait","Changi Beach's old kampong casuarinas"],
  food:[
    ["East Coast Lagoon Food Village","hawker","$","Satay, BBQ stingray and orh luak with sand between your toes."],
    ["Bedok 85 Fengshan","hawker","$","Bak chor mee soup supper legend, short detour inland."],
    ["Changi Village Hawker Centre","hawker","$","Finish line nasi lemak — join the longest queue, it's correct."]
  ],
  sights:[
    ["Bedok Jetty","Free","300 m into the sea; best free sunrise on the island."],
    ["Xtreme SkatePark","Free","Watch (or drop in) at the bowl near Marine Cove."],
    ["Changi Beach WWII site","Free","Sook Ching memorial markers along the quietest beach left."]
  ],
  tips:"Minimal shade after 10 am — start 7 am or go 4 pm onwards for sunset into Changi." },

{ id:"punggol", name:"Punggol Waterway + Coney Island", region:"North-East", km:8, hrs:"2.5–3 h", effort:1, shade:"Patchy shade",
  mrt:[["Punggol",["NE","LRT"]]],
  blurb:"Man-made waterway park flowing into wild Coney Island — rustic paths, casuarina woods and (if lucky) the resident boars.",
  highlights:["Jewel Bridge over the waterway","Coney Island's five beaches","Lorong Halus Red Bridge at sunrise"],
  food:[
    ["Punggol Settlement","seafood","$$","Chilli crab and salted egg sotong overlooking the strait."],
    ["Tebing Lane","cafe","$$","Container-park cafés at the waterway's edge — brunch before the island."],
    ["Kopitiam @ Waterway Point","hawker","$","Aircon backup when the humidity wins."]
  ],
  sights:[
    ["Coney Island Park","Free","Gates open 7 am–7 pm; no lights, no water — bring your own."],
    ["Lorong Halus Wetland","Free","Former landfill turned reed-bed wetland; red bridge is the landmark."],
    ["Punggol Waterway Park","Free","Sunset from Jewel Bridge, otters most evenings."]
  ],
  tips:"Coney has zero facilities — hit toilets at Punggol Settlement first. Watch for boars: keep distance, no food out." },

{ id:"kallang", name:"Bishan Park → Marina Barrage", region:"Central", km:11, hrs:"3–4 h", effort:2, shade:"Patchy shade",
  mrt:[["Bishan",["NS","CC"]],["Bayfront",["CC","DT"]]],
  blurb:"Follow the Kallang River from Bishan-AMK Park's naturalised banks all the way downstream to Gardens by the Bay and the Barrage.",
  highlights:["Bishan otter family","Kallang Basin skyline reveal","Supertrees at the finish"],
  food:[
    ["Old Airport Road Food Centre","hawker","$","Arguably the GOAT hawker centre — lor mee, rojak, wanton mee. Mid-route detour."],
    ["Satay by the Bay","hawker","$$","Satay under the Supertrees at the finish line."],
    ["Kim San Leng, Bishan","hawker","$","Kopi + toast starting fuel at Bishan North."]
  ],
  sights:[
    ["Gardens by the Bay (outdoor)","Free","Outdoor gardens free; Supertree light show nightly 7:45 & 8:45 pm."],
    ["Marina Barrage","Free","Rooftop lawn, kites, and the full skyline panorama."],
    ["Bishan-AMK Park","Free","River restored from concrete canal — otters and herons at dawn."]
  ],
  tips:"Do it southbound in the afternoon and time arrival for the 7:45 pm light show. MRT home from Bayfront." },

{ id:"buloh", name:"Sungei Buloh + Kranji Countryside", region:"North", km:5, hrs:"2–3 h", effort:1, shade:"Patchy shade",
  mrt:[["Kranji",["NS"]]],
  blurb:"Mangrove boardwalks over mudflats: migratory birds Sep–Mar, resident crocodiles year-round. Singapore's wildest corner.",
  highlights:["Estuarine crocodile spotting","Migratory shorebirds at the hides","Mud lobster mounds on the boardwalk"],
  food:[
    ["Poison Ivy Bistro, Bollywood Farms","cafe","$$","Farm-to-table nasi lemak and banana flower salad in the Kranji countryside."],
    ["Pack a picnic","—","$","No food inside the reserve — the Eagle Point shelters have the views."]
  ],
  sights:[
    ["Sungei Buloh Wetland Reserve","Free","Free entry daily 7 am–7 pm; Migratory Bird Trail hides."],
    ["Kranji War Memorial","Free","4,400 Commonwealth graves on a quiet hill — sobering and beautiful."],
    ["Hay Dairies Goat Farm","Free","Free entry, $ for milk; feeding before 10:30 am."]
  ],
  tips:"Kranji Express shuttle or 25 min walk from Kranji MRT. Binoculars transform this one. Peak birds: Oct–Feb." },

{ id:"sembawang", name:"Sembawang Hot Spring → Coast", region:"North", km:6, hrs:"2 h", effort:1, shade:"Patchy shade",
  mrt:[["Yishun",["NS"]],["Sembawang",["NS"]]],
  blurb:"Boil eggs at Singapore's only natural hot spring, then walk north through old black-and-white bungalow country to a real sand beach.",
  highlights:["70 °C cascading foot bath","Colonial-era Sembawang Park","Natural beach + ship-spotting"],
  food:[
    ["Chong Pang Market & Food Centre","hawker","$","Nasi lemak and satay bee hoon before you start."],
    ["Sembawang White Beehoon","restaurant","$$","The original — worth the queue after the walk."],
    ["Beaulieu House","cafe","$$","1910s seaside villa café inside Sembawang Park."]
  ],
  sights:[
    ["Sembawang Hot Spring Park","Free","Free entry; bring eggs (10–12 min in the 70 °C pool) and a towel."],
    ["Sembawang Park beach","Free","One of the last natural beaches; view of the shipyard cranes."],
    ["Masjid Petempatan Melayu","Free","1963 kampong mosque under a giant rubber tree."]
  ],
  tips:"Egg supplies: buy at Chong Pang first. Weekday mornings are all uncles and foot baths — the best crowd." },

{ id:"pasirris", name:"Pasir Ris Mangroves + Tampines Eco Green", region:"East", km:6, hrs:"2 h", effort:1, shade:"Patchy shade",
  mrt:[["Pasir Ris",["EW"]]],
  blurb:"Six-storey birdwatching tower, a genuine mangrove river boardwalk, then an untamed savannah-style park kept deliberately wild.",
  highlights:["Mangrove boardwalk over Sungei Tampines","Bird tower at canopy height","Eco Green's grassland paths"],
  food:[
    ["Pasir Ris Central Hawker Centre","hawker","$","Two floors — soya sauce chicken and prawn mee downstairs."],
    ["Tampines Round Market","hawker","$","Breakfast heavyweight: min jiang kueh and fried carrot cake."]
  ],
  sights:[
    ["Pasir Ris Park mangroves","Free","Mudskippers, kingfishers, tree-climbing crabs at low tide."],
    ["Tampines Eco Green","Free","No lights, no bins, compost toilet — properly wild. Day visits only."],
    ["Pasir Ris beach","Free","Quiet stretch for a cool-down; kelongs offshore."]
  ],
  tips:"Check tide tables — low tide turns the mangrove floor into a wildlife show." },

{ id:"ubin", name:"Changi Point + Pulau Ubin", region:"East", km:4, hrs:"half–full day", effort:2, shade:"Patchy shade",
  mrt:[["Tampines",["EW","DT"]]],
  blurb:"Creaky coastal boardwalk at Changi Point, then a $4 bumboat to Pulau Ubin: kampong houses, quarry lakes and Chek Jawa's sea-grass flats.",
  highlights:["Bumboat ride ($4, cash)","Chek Jawa wetlands + Jejawi Tower","Last kampong village in Singapore"],
  food:[
    ["Changi Village Hawker Centre","hawker","$","Nasi lemak wars: pick a queue, no wrong answers."],
    ["Ubin kampong eateries","seafood","$$","Post-ride mee goreng and coconuts by the jetty."],
    ["Little Island Brewing Co","cafe","$$","Craft beer garden at Changi Point for the return leg."]
  ],
  sights:[
    ["Chek Jawa Wetlands","Free","Boardwalk over six ecosystems; check tide < 0.5 m for the flats."],
    ["Bike rental on Ubin","$8–15/day","The whole island opens up; Ketam mountain-bike loop if keen."],
    ["Changi Boardwalk","Free","Sunset section past the sailing club and old ferry terminal."]
  ],
  tips:"Boats leave when 12 people board (or pay out the boat). Bring cash, insect repellent, and no Sunday illusions — go weekday." },

{ id:"sentosa", name:"Berlayer Creek → Sentosa Boardwalk", region:"South", km:5, hrs:"2–3 h", effort:1, shade:"Patchy shade",
  mrt:[["Labrador Park",["CC"]],["HarbourFront",["NE","CC"]]],
  blurb:"Mangrove creek at Labrador, WWII gun batteries, then walk into Sentosa free via the boardwalk to Fort Siloso and Siloso Beach.",
  highlights:["Berlayer Creek mangrove boardwalk","Labrador's 6-inch guns","Fort Siloso Skywalk views"],
  food:[
    ["Seah Im Food Centre","hawker","$","Pre-walk kaya toast and kopi near HarbourFront."],
    ["Food Republic, VivoCity","hawker","$$","Aircon hawker floor with harbour views mid-route."],
    ["Coastes, Siloso Beach","cafe","$$","Feet-in-sand finish if the budget stretches."]
  ],
  sights:[
    ["Fort Siloso + Skywalk","Free","Singapore's best-preserved coastal fort — completely free, 11-storey skywalk."],
    ["Berlayer Creek","Free","One of only two mangrove patches left on the south coast."],
    ["Sentosa beaches","Free","Walking in via boardwalk = free island entry."]
  ],
  tips:"Sentosa on foot costs nothing. Time Fort Siloso for late afternoon, beach for sunset, walk out after dark." }
];

export const PLACES: [string, string, string, string, string][] = [
["Singapore Chinese Cultural Centre","Telok Ayer","Free","Rotating heritage exhibitions + rooftop sky garden with CBD views. Check their event calendar for free performances.","culture"],
["Fort Canning Park","Dhoby Ghaut","Free","Spice garden, the famous tree tunnel photo spot, and 14th-century history layered on a hill.","nature"],
["National Museums (NMS, Peranakan, ACM)","City","Free for SC/PR","All national museums free for citizens & PRs; ~$10–15 otherwise. NMS rotunda alone is worth it.","culture"],
["Esplanade Waterfront","Marina Bay","Free","Free live gigs most evenings at the outdoor theatre — check 'What's On'.","events"],
["Supertree Grove Light Show","Gardens by the Bay","Free","Garden Rhapsody, nightly 7:45 & 8:45 pm. Lie on the ground under the trees.","events"],
["Botanic Gardens","Napier","Free","UNESCO site, free daily 5 am–midnight; free symphony concerts some weekends at Shaw Foundation stage.","nature"],
["Haw Par Villa","Pasir Panjang","Free","1,000 statues of Chinese mythology including the Ten Courts of Hell ($ for Hell's Museum). Gloriously strange.","culture"],
["Marina Barrage","Marina South","Free","Rooftop lawn for kites and picnics with the full skyline. Combine with Gardens by the Bay.","nature"],
["Kampong Gelam / Chinatown / Little India","Various","Free","NHB self-guided heritage trails (roots.gov.sg) — architecture, murals, and the best snack density per km.","culture"],
["St John's + Lazarus Island","Marina South Pier","~$15 ferry","Island-hop day trip: lagoon swimming at Lazarus's white-sand beach. Bring everything, leave nothing.","nature"]
];

export const EVENT_LINKS: [string, string, string][] = [
["NParks events calendar","https://www.nparks.gov.sg/activities","guided walks, volunteer planting days"],
["SCCC What's On","https://singaporeccc.org.sg","free exhibitions and cultural performances"],
["Esplanade Offstage / What's On","https://www.esplanade.com/whats-on","free waterfront gigs"],
["Visit Singapore events","https://www.visitsingapore.com/whats-happening/all-happenings/","festivals and seasonal happenings"],
["NHB Roots heritage trails","https://www.roots.gov.sg/visit/trails","self-guided heritage walk maps"],
["Honeycombers weekend guides","https://thehoneycombers.com/singapore/","cheap/free weekend roundups"]
];

export const EFFORT: Record<number, string> = {1:"Chill",2:"Moderate",3:"Sweaty"};

export const REGIONS = ["All","Central","East","North","North-East","South","West"];
