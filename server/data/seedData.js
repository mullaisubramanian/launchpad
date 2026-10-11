export const SEED_USERS = [
  {
    id: "u_startup1",
    role: "startup",
    name: "Arjun Kumar",
    phone: "9876543210",
    email: "startup@demo.in",
    pass: "demo123",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641001",
    org: "New Creative",
    created: "2026-01-10T10:00:00Z"
  },
  {
    id: "u_investor1",
    role: "investor",
    name: "Ravi Shankar",
    phone: "9845123456",
    email: "investor@demo.in",
    pass: "demo123",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    org: "Simple Invest",
    created: "2026-01-05T09:00:00Z"
  },
  {
    id: "u_pilot1",
    role: "pilot",
    name: "Meena Lakshmi",
    phone: "9789012345",
    email: "pilot@demo.in",
    pass: "demo123",
    city: "Tiruppur",
    state: "Tamil Nadu",
    pincode: "641601",
    org: "XYZ Logistics",
    created: "2026-01-08T11:30:00Z"
  },
  {
    id: "u_grant1",
    role: "grant",
    name: "Dr. Vijay Kumar",
    phone: "9123456780",
    email: "grant@demo.in",
    pass: "demo123",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    org: "Central Government",
    created: "2026-01-02T14:15:00Z"
  },
  {
    id: "u_startup2",
    role: "startup",
    name: "Suresh Prabhu",
    phone: "9940123456",
    email: "abcdd@gmail.com",
    pass: "demo123",
    city: "Madurai",
    state: "Tamil Nadu",
    pincode: "625001",
    org: "Migrate Bee",
    created: "2026-02-12T08:00:00Z"
  }
];

export const SEED_SCHEMES = [
  {
    id: "s_inv_1",
    type: "investor",
    ownerId: "u_investor1",
    company: "Simple Invest",
    name: "Innovation Power",
    amount: "2000000",
    dept: "Ecommerce",
    desc: "Early stage capital for next-gen direct-to-consumer and retail supply chain platforms.",
    eligibility: "No age limit",
    created: "2026-02-01T10:00:00Z"
  },
  {
    id: "s_inv_2",
    type: "investor",
    ownerId: "u_investor1",
    company: "Simple Invest",
    name: "AgriTech Seed Circle",
    amount: "500000-2500000",
    dept: "Agriculture",
    desc: "Funding technology-driven post-harvest and precision farming startups across India.",
    eligibility: "Working prototype or farm pilots completed.",
    created: "2026-02-10T12:00:00Z"
  },
  {
    id: "s_plt_1",
    type: "pilot",
    ownerId: "u_pilot1",
    company: "XYZ Logistics",
    name: "Innovative Ignite Fund",
    amount: "500000-1000000",
    dept: "Logistics",
    desc: "Paid corporate pilot with our regional fulfillment hubs and fleet network across South India.",
    eligibility: "No age limit to apply",
    created: "2026-02-05T14:00:00Z"
  },
  {
    id: "s_grt_1",
    type: "grant",
    ownerId: "u_grant1",
    company: "Central Government",
    name: "Agri Help Grant",
    amount: "100000",
    dept: "Agriculture",
    grantKind: "Grant",
    desc: "Non-dilutive grant support for registered small agricultural innovators and organic processors.",
    eligibility: "Registered entity with DPIIT recognition.",
    created: "2026-01-20T11:00:00Z"
  },
  {
    id: "s_grt_2",
    type: "grant",
    ownerId: "u_grant1",
    company: "Central Government",
    name: "Initiatives for Development and Innovation Scheme",
    amount: "1000000",
    dept: "IT & Software",
    grantKind: "Scheme",
    desc: "Scheme for open-source AI, sovereign cloud technologies and digital infrastructure.",
    eligibility: "Indian owned and controlled startup with demonstrable tech stack.",
    created: "2026-01-25T15:30:00Z"
  }
];

export const SEED_APPS = [
  {
    id: "app_1",
    schemeId: "s_inv_1",
    userId: "u_startup2",
    startupName: "New Creative",
    desc: "Building a headless omni-channel distribution engine for homegrown fashion brands.",
    fileName: "NewCreative_PitchDeck.pdf",
    fileData: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXprKW1",
    status: "Registered",
    created: "2026-02-15T10:30:00Z",
    updated: "2026-02-15T10:30:00Z"
  },
  {
    id: "app_2",
    schemeId: "s_inv_1",
    userId: "u_startup1",
    startupName: "New Creative",
    desc: "Scale-up expansion round targeting 10 tier-2 cities warehouse integrations.",
    fileName: "PitchDeck_v3.pdf",
    fileData: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXprKW1",
    status: "Accepted",
    created: "2026-02-16T11:00:00Z",
    updated: "2026-02-18T16:20:00Z"
  },
  {
    id: "app_3",
    schemeId: "s_plt_1",
    userId: "u_startup1",
    startupName: "Migrate Bee",
    desc: "Autonomous route optimization software reducing last-mile carbon footprint by 22%.",
    fileName: "Pilot_Proposal_XYZ.docx",
    fileData: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIA",
    status: "Registered",
    created: "2026-02-17T09:15:00Z",
    updated: "2026-02-17T09:15:00Z"
  },
  {
    id: "app_4",
    schemeId: "s_grt_2",
    userId: "u_startup1",
    startupName: "Buzz AI",
    desc: "Multilingual low-resource speech intelligence model for public service delivery.",
    fileName: "Grant_Proposal_BuzzAI.pdf",
    fileData: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXprKW1",
    status: "Registered",
    created: "2026-02-18T14:40:00Z",
    updated: "2026-02-18T14:40:00Z"
  }
];
