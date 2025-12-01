export const LOCAL_STORAGE_KEY = "user@bill";
export const fields = {
  stateName: {
    bihar: "BIHAR",
    cg: "CHHATTISGARH",
    gujrat: "GUJRAT",
    haryana: "HARYANA",
    hp: "HIMACHAL PRADESH",
    jh: "JHARKHAND",
    ka: "KARNATAKA",
    kl: "KERALA",
    mp: "MADHYA PRADESH",
    maharashtra: "MAHARASHTRA",
    odisha: "ODISHA",
    punjab: "PUNJAB",
    rajasthan: "RAJASTHAN",
    tn: "TAMILNADU",
    up: "UTTAR PRADESH",
    uk: "UTTARAKHAND",
    telangana: "TELANGANA",
    assam: "ASSAM",
    puducherry: "PUDUCHERRY",
    damanDiu: "DAMAN & DIU",
    sikkim: "SIKKIM",
    tripura: "TRIPURA",
  },

  allState: [
    { name: "BIHAR", code: "bh", value: "bihar", label: "BIHAR" },
    {
      name: "CHHATTISGARH",
      code: "cg",
      value: "Chhattisgarh",
      label: "CHHATTISGARH",
    },
    { name: "GUJRAT", code: "gj", value: "	gujrat", label: "GUJRAT" },
    { name: "HARYANA", code: "hr", value: "haryana", label: "HARYANA" },
    {
      name: "HIMACHAL PRADESH",
      code: "hp",
      value: "himachalPradesh	",
      label: "",
    },
    { name: "JHARKHAND", code: "jh", value: "Jharkhand", label: "JHARKHAND" },
    { name: "KARNATAKA", code: "ka", value: "karnataka", label: "KARNATAKA" },
    { name: "KERALA", code: "kl", value: "Kerala", label: "KERALA" },
    {
      name: "MADHYA PRADESH",
      code: "mp",
      value: "madhyaPradesh",
      label: "MADHYA PRADESH",
    },
    {
      name: "MAHARASHTRA",
      code: "mh",
      value: "maharashtra",
      label: "MAHARASHTRA",
    },
    {
      name: "ODISHA",
      code: "od",
      value: "odisha",
      label: "ODISHA",
    },
    { name: "PUNJAB", code: "pb", value: "punjab", label: "PUNJAB" },
    { name: "RAJASTHAN", code: "rj", value: "rajasthan", label: "RAJASTHAN" },
    { name: "TAMILNADU", code: "tn", value: "tamilnadu", label: "TAMILNADU" },
    { name: "UTTAR PRADESH", code: "up", value: "up", label: "UTTAR PRADESH" },
    { name: "UTTARAKHAND", code: "uk", value: "uk", label: "UTTARAKHAND" },
    { name: "TELANGANA", code: "tg", value: "telangana", label: "TELANGANA" },
    { name: "ASSAM", code: "as", value: "assam", label: "ASSAM" },
    { name: "PUDUCHERRY", code: "py", value: "puducherry", label: "PUDUCHERRY" },
    { name: "DAMAN & DIU", code: "dd", value: "damanDiu", label: "DAMAN & DIU" },
    { name: "SIKKIM", code: "sk", value: "sikkim", label: "SIKKIM" },
    { name: "TRIPURA", code: "tr", value: "tripura", label: "TRIPURA" },
  ],
  fromState: [
    {
      name: "Andaman and Nicobar Islands",
    },
    {
      name: "Andhra Pradesh",
    },
    {
      name: "Arunachal Pradesh",
    },
    {
      name: "Assam",
    },
    {
      name: "Bihar",
    },
    {
      name: "Chandigarh",
    },
    {
      name: "Chhattisgarh",
    },
    {
      name: "Dadra and Nagar Haveli",
    },
    {
      name: "Daman and Diu",
    },
    {
      name: "Delhi",
    },
    {
      name: "Goa",
    },
    {
      name: "Gujarat",
    },
    {
      name: "Haryana",
    },
    {
      name: "Himachal Pradesh",
    },
    {
      name: "Jammu and Kashmir",
    },
    {
      name: "Jharkhand",
    },
    {
      name: "Karnataka",
    },
    {
      name: "Kerala",
    },
    {
      name: "Lakshadweep",
    },
    {
      name: "Madhya Pradesh",
    },
    {
      name: "Maharashtra",
    },
    {
      name: "Manipur",
    },
    {
      name: "Meghalaya",
    },
    {
      name: "Mizoram",
    },
    {
      name: "Nagaland",
    },
    {
      name: "Orrisa",
    },
    {
      name: "Pondicherry",
    },
    {
      name: "Punjab",
    },
    {
      name: "Rajasthan",
    },
    {
      name: "Sikkim",
    },
    {
      name: "Tamil Nadu",
    },
    {
      name: "Telangana",
    },
    {
      name: "Tripura",
    },
    {
      name: "Uttar Pradesh",
    },
    {
      name: "Uttarakhand",
    },
    {
      name: "West Bengal",
    },
  ],
  taxMode: [
    {
      name: "DAYS",
    },
    {
      name: "WEEKLY",
    },
    {
      name: "MONTHLY",
    },
    {
      name: "QUARTERLY",
    },
  ],
  haryana: {
    vehiclePermitType: [
      {
        name: "CONTRACT CARRIAGE/PASSANGER VEHICLES",
      },
      {
        name: "PRIVATE SERVICE VEHICLE",
      },
      {
        name: "GOODS VEHICLE",
      },
      {
        name: "STAGE CARRIAGE",
      },
      {
        name: "CONSTRUCTION EQUIPMENT VEHICLE",
      },
    ],
    borderBarrier: [
      {
        name: "AMBALA",
      },
      { name: "BHIWANI" },
      { name: "CHARKHI DADRI" },
      { name: "FARIDABAD" },
      { name: "FATEHABAD" },
      { name: "GURUGRAM" },
      { name: "HISAR" },
      { name: "JHAJJAR" },
      { name: "JIND" },
      { name: "KAITHAL" },
      { name: "KARNAL" },
      { name: "KURUKSHETRA" },
      { name: "MAHENDRAGARH" },
      { name: "NUH" },
      { name: "PALWAL" },
      { name: "PANCHKULA" },
      { name: "PANIPAT" },
      { name: "REWARI" },
      { name: "ROHTAK" },
      { name: "SIRSA" },
      { name: "SONIPAT" },
      { name: "YAMUNA NAGAR" },
    ],
    serviceType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
      {
        name: "AIR CONDITIONED",
      },
    ],
  },
  bihar: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  telangana: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  assam: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  puducherry: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  damanDiu: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  sikkim: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  tripura: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],

    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
    borderBarrier: [
      { name: "ARARIYA" },
      { name: "ARAWAL" },
      { name: "AURANGABAD" },
      { name: "BANKA" },
      { name: "BEGUSARAI" },
      { name: "BETTIAH" },
      { name: "BHABUA" },
      { name: "BHAGALPUR" },
      { name: "BHOJPUR" },
      { name: "BUXUR" },
      { name: "Chapara" },
      { name: "GOPALGANJ" },
      { name: "Patna" },
      { name: "Rohtash" },
      { name: "SAHARSHA" },
      { name: "SAMSTIPUR" },
      { name: "SHEIKHPURA" },
      { name: "SHEOHAR" },
      { name: "SITAMARIH" },
      { name: "SIWAN" },
      { name: "SUPAUL" },
      { name: "VAISHALI" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
  },
  jharkhand: {
    borderBarrier: [
      { name: "BOKARO" },
      { name: "CHATRA" },
      { name: "DEOGHAR" },
      { name: "DHANBAD" },
      { name: "DUMKA" },
      { name: "EAST SINGHBHUM (JAMSHEDPUR)" },
      { name: "GARHWA" },
      { name: "GIRIDIH" },
      { name: "GODDA" },
      { name: "GUMLA" },
      { name: "HAZARIBAGH" },
      { name: "JAMTARA" },
      { name: "KHUNTI" },
      { name: "KODERMA" },
      { name: "LATEHAR" },
      { name: "LOHARDAGA" },
      { name: "PAKUR" },
      { name: "PALAMU" },
      { name: "RAMGARH" },
      { name: "RANCHI" },
      { name: "SAHEBGANJ" },
      { name: "SARAIKELA-KHARSAWAN" },
      { name: "WEST SINGHBHUM (CHAIBASA)" },
    ],
    vehiclePermitType: [
      {
        name: "GOODS VEHICLE",
      },
      {
        name: "STAGE CARRIAGE",
      },
    ],
    permitType: [
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
    ],
  },
  karnataka: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],
    taxMode: [
      {
        name: "WEEKLY",
      },
      {
        name: "MONTHLY",
      },
    ],
    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
      {
        name: "NATIONAL PERMIT",
      },
    ],
    serviceType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
      {
        name: "DELUXE AIR CONDITIONED",
      },
    ],
    borderBarrier: [
      { name: "ARTO,ALAND" },
      { name: "ARTO,ANMOD" },
      { name: "ARTO,ATTIBELE" },
      { name: "ARTO,BAGEPALI" },
      { name: "ARTO,DHOLKHED" },
      { name: "ARTO,GUNDLUPET" },
      { name: "ARTO,HAGARI" },
      { name: "ARTO,HUMNABAD" },
      { name: "ARTO,KAGAWADA" },
      { name: "ARTO,KOGNALI" },
      { name: "ARTO,NANGLI" },
      { name: "ARTO,PUNAJANPUR" },
      { name: "ARTO,TALAPADI" },
      { name: "GOWRIBIDANUR C.P" },
      { name: "RAYALPADU" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
    ],
  },
  odisha: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],
    taxMode: [
      {
        name: "DAYS",
      },
      {
        name: "WEEKLY",
      },
      {
        name: "MONTHLY",
      },
    ],
    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
      {
        name: "HOME STATE PERMIT",
      },
      {
        name: "NATIONAL PERMIT",
      },
    ],
    purposeOfJourney: [
      { name: "CARRYING GOODS" },
      { name: "CARRYING PASSENGER" },
    ],
    serviceType: [
      {
        name: "DELUX AIR CONDITIONED",
      },
      {
        name: "DELUX",
      },
      {
        name: "ORDINARY (3 X 2 SEATER)",
      },
      {
        name: "SLEEPER",
      },
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
    ],
    enteringDistrict: [
      { name: "ANUGUL" },
      { name: "BALANGIR" },
      { name: "BALESHWAR" },
      { name: "BARGARH" },
      { name: "BAUDH" },
      { name: "BHADRAK" },
      { name: "CUTTACK" },
      { name: "DEBAGARH" },
      { name: "DHENKANAL" },
      { name: "GAJAPATI" },
      { name: "GANJAM" },
      { name: "JAGATSINGHAPUR" },
      { name: "JAJAPUR" },
      { name: "JHARSUGUDA" },
      { name: "KALAHANDI" },
      { name: "KANDHAMAL" },
      { name: "KENDRAPARA" },
      { name: "KENDUJHAR" },
      { name: "KHORDHA" },
      { name: "KORAPUT" },
      { name: "MALKANGIRI" },
      { name: "MAYURBHANJ" },
      { name: "NABARANGAPUR" },
      { name: "NAYAGARH" },
      { name: "NUAPADA" },
      { name: "PURI" },
      { name: "RAYAGADA" },
      { name: "SAMBALPUR" },
      { name: "STATE TRANSPORT AUTHORITY" },
      { name: "SUBARNAPUR" },
      { name: "SUNDARGARH" },
    ],

    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
      { name: "EDUCATIONAL INSTITUTIONAL BUS" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
      { name: "PRIVATE VEHICLE" },
    ],
  },
  taminadu: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],
    taxMode: [
      {
        name: "DAYS",
      },
      {
        name: "WEEKLY",
      },
      {
        name: "MONTHLY",
      },
    ],
    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
      {
        name: "HOME STATE PERMIT",
      },
      {
        name: "NATIONAL PERMIT",
      },
    ],

    rtoName: [
      {
        name: "COIMBATORE WEST",
      },
      {
        name: "GOBICHETTIPALAYAM",
      },
      {
        name: "HOSUR",
      },
      {
        name: "KRISHNAGIRI",
      },
      {
        name: "MARTHANDHAM",
      },
      {
        name: "OOTY",
      },
      {
        name: "PETHIKUPPAM",
      },
      {
        name: "POLLACHI",
      },
      {
        name: "POONAMALLEE",
      },
      {
        name: "TENKASI",
      },
      {
        name: "THENI",
      },
      {
        name: "THIRUVALLUR",
      },
      {
        name: "TINDIVANAM",
      },
      {
        name: "VELLORE",
      },
    ],

    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
      { name: "EDUCATIONAL INSTITUTIONAL BUS" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
      { name: "PRIVATE VEHICLE" },
    ],
    borderBarrier: [],
  },
  kerala: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],
    taxMode: [
      {
        name: "DAYS",
      },
      {
        name: "WEEKLY",
      },
      {
        name: "MONTHLY",
      },
    ],
    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
      {
        name: "HOME STATE PERMIT",
      },
      {
        name: "NATIONAL PERMIT",
      },
    ],
    purposeOfJourney: [
      { name: "CARRYING GOODS" },
      { name: "CARRYING PASSENGER" },
    ],
    serviceType: [
      {
        name: "DELUX AIR CONDITIONED",
      },
      {
        name: "DELUX",
      },
      {
        name: "ORDINARY (3 X 2 SEATER)",
      },
      {
        name: "SLEEPER",
      },
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
    ],
    enteringDistrict: [
      { name: "ANUGUL" },
      { name: "BALANGIR" },
      { name: "BALESHWAR" },
      { name: "BARGARH" },
      { name: "BAUDH" },
      { name: "BHADRAK" },
      { name: "CUTTACK" },
      { name: "DEBAGARH" },
      { name: "DHENKANAL" },
      { name: "GAJAPATI" },
      { name: "GANJAM" },
      { name: "JAGATSINGHAPUR" },
      { name: "JAJAPUR" },
      { name: "JHARSUGUDA" },
      { name: "KALAHANDI" },
      { name: "KANDHAMAL" },
      { name: "KENDRAPARA" },
      { name: "KENDUJHAR" },
      { name: "KHORDHA" },
      { name: "KORAPUT" },
      { name: "MALKANGIRI" },
      { name: "MAYURBHANJ" },
      { name: "NABARANGAPUR" },
      { name: "NAYAGARH" },
      { name: "NUAPADA" },
      { name: "PURI" },
      { name: "RAYAGADA" },
      { name: "SAMBALPUR" },
      { name: "STATE TRANSPORT AUTHORITY" },
      { name: "SUBARNAPUR" },
      { name: "SUNDARGARH" },
    ],

    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
      { name: "EDUCATIONAL INSTITUTIONAL BUS" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
      { name: "PRIVATE VEHICLE" },
    ],
  },
  chhattisgarh: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],
    taxMode: [
      {
        name: "WEEKLY",
      },
      {
        name: "MONTHLY",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],
    permitType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
      {
        name: "SPECIAL PERMIT",
      },
    ],
    borderBarrier: [
      { name: "AMBIKAPUR RTO" },
      { name: "BAIKUNTHPUR DTO" },
      { name: "BALODA BAZAR DTO" },
      { name: "BALOD DTO" },
      { name: "BALRAMPUR DTO" },
      { name: "BEMETARA DTO" },
      { name: "BIJAPUR DTO" },
      { name: "BILASPUR RTO" },
      { name: "DANTEWADA DTO" },
      { name: "DHAMTARI DTO" },
      { name: "DURG RTO" },
      { name: "GARIYABAND DTO" },
      { name: "JAGDALPUR RTO" },
      { name: "JANJGIR CHAMPA DTO" },
      { name: "JASHPUR DTO" },
      { name: "KANKER DTO" },
      { name: "KAWARDHA DTO" },
      {
        name: "KONDAGAON DTO",
      },
      { name: "KORBA DTO" },
      { name: "MAHASAMUND DTO" },
      {
        name: "MUNGELI DTO",
      },
      { name: "NARAYANPUR DTO" },
      { name: "RAIGARH DTO" },
      {
        name: "RAIPUR RTO",
      },
      { name: "RAJNANDGAON RTO" },
      { name: "STATE TRANSPORT AUTHORITY" },
      { name: "SUKMA DTO" },
      { name: "SURAJPUR DTO" },
    ],
    serviceType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
      {
        name: "DELUXE AIR CONDITIONED",
      },
    ],
  },
  uttrakhand: {
    vehiclePermitType: [
      {
        name: "CONTRACT CARRIAGE/PASSANGER VEHICLES",
      },
      {
        name: "GOODS VEHICLE",
      },
      {
        name: "CONSTRUCTION EQUIPMENT VEHICLE",
      },
    ],
    districtName: [
      { name: "DEHRADUN" },
      { name: "HARIDWAR" },
      { name: "KOTDWAR (DISTT. PAURI)" },
      { name: "UDHAM SINGH NAGAR" },
    ],

    permitType: [
      { name: "NOT APPLICABLE" },
      { name: "TEMPORARY PERMIT" },
      { name: "TOURIST PERMIT" },
      { name: "SPECIAL PERMIT" },
    ],
    serviceType: [
      { name: "AIR CONDITIONED" },
      { name: "ORDINARY" },
      { name: "NOT APPLICABLE" },
    ],
    barrierName: [
      {
        name: "ONE",
      },
    ],
  },
  up: {
    vehiclePermitType: [
      {
        name: "CONTRACT CARRIAGE/PASSANGER VEHICLES",
      },
      {
        name: "GOODS VEHICLE",
      },
    ],
    borderBarrier: [
      { name: "AGRA" },
      { name: "ALIGARH" },
      { name: "BAGHPAT" },
      { name: "BAHRAICH" },
      { name: "BALLIA" },
      { name: "BALRAMPUR" },
      { name: "BANDA" },
      { name: "BAREILLY" },
      { name: "BIJNOR" },
      { name: "CHANDAULI" },
      { name: "CHITRAKOOT" },
      { name: "DEORIA" },
      { name: "ETAWAH" },
      { name: "GAUTAM BUDDHA NAGAR" },
      { name: "GAZIABAD" },
      { name: "GHAZIPUR" },
      { name: "HAMIRPUR" },
      { name: "JHANSI" },
      { name: "KUSHINAGAR" },
      { name: "LAKHIMPUR" },
      { name: "LALITPUR" },
      { name: "MAHARAJGANJ" },
      { name: "MAHOBA" },
      { name: "MATHURA" },
      { name: "MIRZAPUR" },
      { name: "MUZAFFARNAGAR" },
      { name: "ORAI" },
    ],
    permitType: [
      { name: "NOT APPLICABLE" },
      { name: "TEMPORARY PERMIT" },
      { name: "TOURIST PERMIT" },
    ],

    serviceType: [
      {
        name: "ORDINARY",
      },
      {
        name: "AIR CONDITIONED",
      },
      {
        name: "NOT APPLICABLE",
      },
    ],
    taxMode: [
      {
        name: "DAYS",
      },
      {
        name: "MONTHLY",
      },
      {
        name: "QUARTERLY",
      },
    ],
  },
  punjab: {
    vehiclePermitType: [
      {
        name: "CONTRACT CARRIAGE/PASSANGER VEHICLES",
      },
      {
        name: "GOODS VEHICLE",
      },
      {
        name: "TEMPORARY REGISTERED VEHICLE",
      },
    ],
    borderBarrier: [
      { name: "BATHINDA" },
      { name: "FAZILKA" },
      { name: "MOHALI" },
      { name: "MUKTSAR" },
      { name: "PATHANKOT" },
      { name: "PATIALA" },
      { name: "RUPNAGAR" },
      { name: "SANGRUR" },
    ],
    checkPostName: [
      { name: "DOOMWALI" },
      { name: "GUMJAL" },
      { name: "RAJPURA" },
      { name: "JHARMARI" },
      { name: "KHARAR" },
      { name: "KILLIAN WALI" },
      { name: "MAMOON" },
      { name: "SHAMBU" },
      { name: "MOONAK" },
    ],

    serviceType: [
      { name: "ORDINARY" },
      // { name: 'AIR CONDITIONED' },
      { name: "NOT APPLICABLE" },
    ],
  },
  gujrat: {
    paymentMode: [{ name: "CASH" }, { name: "ONLINE" }],
    serviceType: [
      {
        name: "LUXURY",
      },
      {
        name: "ORDINARY",
      },
    ],
    ownerType: [
      {
        name: "INDIVIDUAL",
      },
      {
        name: "COMPANY",
      },
    ],
    makerStatus: [
      {
        name: "INDIAN",
      },
      {
        name: "IMPORTED",
      },
    ],
    permitType: [
      {
        name: "NOT APPLICABLE",
      },

      {
        name: "TOURIST PERMIT",
      },
      {
        name: "SPECIAL PERMIT",
      },
      {
        name: "SINGLE RETURN TRIP PERMIT",
      },
    ],
    borderBarrier: [
      { name: "AMBAJI" },
      { name: "AMIRGADH" },
      { name: "BHILAD" },
      { name: "CHHOTA UDEPUR" },
      { name: "DAHOD" },
      { name: "GUNDARI" },
      { name: "HAZIRA" },
      { name: "JAMNAGAR" },
      { name: "KAPRADA" },
      { name: "SAGBARA" },
      { name: "SAMKHIYALI" },
      { name: "SHAMLAJI" },
      { name: "SONGADH" },
      { name: "THARAD(KHODA)" },
      { name: "THAVAR" },
      { name: "WAGHAI" },
      { name: "ZOLAD" },
    ],
    checkPostName: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
    ],
  },
  rajasthan: {
    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
      { name: "TEMPORARY REGISTERED VEHICLES" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
    ],
    borderBarrier: [
      { name: "ALWAR" },
      { name: "BANSWARA" },
      { name: "BARAN" },
      { name: "BHARATPUR" },
      { name: "CHITTORGARH" },
      { name: "CHURU" },
      { name: "DHOLPUR" },
      { name: "DUNGARPUR" },
      { name: "GANGANAGAR" },
      { name: "HANUMANGARH" },
      { name: "JAIPUR" },
      { name: "JALORE" },
      { name: "JHALAWAR" },
      { name: "JHUNJHUNU" },
      { name: "PRATAPGARH" },
      { name: "SIROHI" },
    ],

    serviceType: [
      {
        name: "NOT APPLICABLE",
      },
    ],
    permitType: [
      {
        name: "TEMPORARY PERMIT",
      },
      {
        name: "TOURIST PERMIT",
      },
      {
        name: "NOT APPLICABLE",
      },
    ],
    checkPostName: [
      {
        name: "AKERA MOD, ALWAR(ON BILASPUR - BHIWADI ROUTE)",
      },
      { name: "BHIWARI MOD, RADIWAS,BHIWADI(ON DHARUHEDA - BHIWADI ROUTE)" },
      { name: "DHARUHEDA MOD, BHIWARI(ON DHARUHEDA - BHIWADI ROUTE)" },
      { name: "NAREDA KALAN, ALWAR(ON NARNAUL - BEHROD ROUTE)" },
      { name: "NAVGAON, ALWAR(ON SOHNA - ALWAR ROUTE)" },
      { name: "PAKKA BAAG, ALWAR(ON AGRA - BHARATPUR ROUTE)" },
      { name: "SAHAJAHAPUR(ON GURGAON - JAIPUT ROUTE)" },
      { name: "TAWADU MOD, BHIWADI(ON SOHNA - BHIWADI ROUTE)" },
      { name: "BAHAJ, BHARATPUR(ON MATHURA - DEEG ROUTE)" },
      { name: "DHILAWATI, BHARATPUR(ON KOSHI - KAMAN ROUTE)" },
      { name: "JURHARA, KAMA(ON PUNHANA - KAMAN ROUTE)" },
      { name: "RARAH, BHARATPUR(ON MATHURA - BHARATPUR ROUTE)" },
      { name: "UNCHA NANGLA(ON AGRA - BHARATPUR ROUTE)" },
      { name: "NIMBEHERA, CHITTORGARH(ON NIMACH CHITTORGARH - DHOLPUR ROUTE)" },
      { name: "RAJGARH, CHURU(ON HISAR - RAJGARH - CHURU ROUTE)" },
      { name: "BARETHA, DHOLPUR(ON AGRA - DHOLPUR ROUTE)" },
      { name: "CHAMBAL, DHOLPUR(ON MURENA - DHOLPUR ROUTE)" },
      { name: "RATANPUR, DUNGARPUR(ON AHMEDABAD - UDAIPUR ROUTE)" },
      { name: "SIMMALWADA, DUNGARPUR(ON MODASA - DUNGARPUR ROUTE)" },
      { name: "BHADRA, HANUMANGARH(ON HISAR - HANUMANGARH ROUTE)" },
      { name: "SANGARIA, HANUMANGARH(ON DABWALI - HANUMANGARH ROUTE)" },
      { name: "GONERA, JAIPUR(ON NARNAUL - KOTPUTLI ROUTE)" },
      { name: "NAWATA KI DHANI, JHUNJHUNU(ON NARNAUL - JHUNJHUNU ROUTE)" },
      {
        name: "PILOD, JHUNJHUNU(ON NARNAUL - LAHURO SURAJGARH JHUNJHUNU ROUTE)",
      },
      { name: "PIPLI, JHUNJHUNU(ON LAHURO - PILANI JHUNJHUNU ROUTE)" },
      {
        name: "GOMATA, CHHOTI SHADRI, PRATAPGARH(ON NEEMACH - CHOTI SADRI ROUTE)",
      },
      { name: "PRATAPGARH(ON PRATAPGARH - MANSOR ROUTE)" },
      { name: "MANDAR, JALORE(ON PRATAPGARH - SIROHI ROUTE)" },
      { name: "DHANPUR, BANSWARA(ON Ratlam - Banswara Route)" },
      { name: "MONA DUNGAR, BANSWARA(on Jhalod - Banswara Route)" },
      { name: "KASBA THANA, BARAN(on Shivpuri - Baran Route)" },
      { name: "PATLI,S.GANGANAGAR(ON ABHOHAR-HANUMANGARH ROUTE)" },
      { name: "SADHUWALI,S.GANGANAGAR(ON ABHOHAR-HANUMANGARH ROUTE)" },
      { name: "MAKHUPURA, JALORE(on Dessa - Tharad - Barmer route)" },
      { name: "MANDARADI, JALORE(on Bansakantha - Bhinmal route)" },
      { name: "RAIPUR, JHALAWAR(on Soyag - Jhalawar route)" },
      { name: "TEENDHAR, TEEN-DHAR JALAWAR(on Rajgarh - Jhalawar route)" },
    ],
  },
  maharashtra: {
    serviceType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
      {
        name: "AIR CONDITIONED",
      },
      {
        name: "ORDINARY (3 X 2 SEATER)",
      },
    ],

    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE" },
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "PRIVATE SERVICE VEHICLE" },
      { name: "GOODS VEHICLE" },
      { name: "EDUCATIONAL INSTITUTIONAL BUS" },
      { name: "CONSTRUCTION EQUIPMENT VEHICLE" },
      { name: "VOLVO OR MARECEDEX ETC" },
      { name: "EDUCATION BUS" },
      { name: "2WHEELER" },
      { name: "EDUCATIONAL BUS USED BY SCHOOL" },
      { name: "PRIVATE ORGANIZATIONS" },
    ],
    vehicleClass: [
      { name: "3 WHEELER" },
      { name: "MOTOR CAB" },
      { name: "MAXI CAB" },
      { name: "OMNI BUS" },
      { name: "BUS" },
      { name: "EDUCATIONAL BUS" },
      { name: "LIGHT GOODS VEHICLE" },
      { name: "MEDIUM GOODS VEHICLE" },
      { name: "HEAVY GOODS VEHICLE" },
      { name: "SPECIAL" },
    ],
    checkPostName: [
      { name: "KHAPRI" },
      { name: "WARUD" },
      { name: "DEORI" },
      { name: "RAJURA" },
      { name: "PALASNER" },
      { name: "CHORWAD" },
      { name: "PURNAD" },
      { name: "KAGAL" },
      { name: "MANEGAON TEK" },
      { name: "NAWAPUR" },
      { name: "BORGAON" },
      { name: "OMERGA" },
      { name: "INSULI" },
      { name: "MANDRUP" },
      { name: "ACHAD" },
      { name: "PIMPALKUTTI" },
    ],
    borderBarrier: [
      { name: "AMRAVATI" },
      { name: "BHANDARA" },
      { name: "CHANDRAPUR" },
      { name: "DHULE" },
      { name: "JALGAON" },
      { name: "KOLHAPUR" },
      { name: "NAGPUR EAST" },
      { name: "NANDURBAR" },
      { name: "NASHIK" },
      { name: "OSMANABAD" },
      { name: "SINDHUDURG" },
      { name: "SOLAPUR" },
      { name: "THANE" },
      { name: "YAVATMAL" },
    ],
  },
  himachalPradesh: {
    serviceType: [
      {
        name: "NOT APPLICABLE",
      },
      {
        name: "ORDINARY",
      },
      {
        name: "AC(VOLVO ETC)",
      },
      {
        name: "DELUX NON AC(2X2)",
      },
      {
        name: "ORDINARY (3 X 2 SEATER)",
      },
    ],

    vehiclePermitType: [
      { name: "CONTRACT CARRIAGE/PASSANGER VEHICLES" },
      { name: "GOODS VEHICLE" },
    ],

    borderBarrier: [
      { name: "BADDI" },
      { name: "BAROTIWALA" },
      { name: "DAMTAL" },
      { name: "GAGRET" },
      { name: "KALAAMB" },
      { name: "KANDEAL" },
      { name: "MEHATPUR" },
      { name: "PAONTA SAHIB" },
      { name: "PARWANOO" },
      { name: "SWARGHAT" },
      { name: "TIPRA" },
      { name: "TUNUHATTI" },
    ],
  },
};
