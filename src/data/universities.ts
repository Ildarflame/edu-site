export type University = {
  slug: string;
  name: string;
  shortName: string;
  country: string;
  region: string;
};

export const UNIVERSITIES: University[] = [
  // US
  { slug: "mit", name: "Massachusetts Institute of Technology", shortName: "MIT", country: "US", region: "US" },
  { slug: "stanford", name: "Stanford University", shortName: "Stanford", country: "US", region: "US" },
  { slug: "harvard", name: "Harvard University", shortName: "Harvard", country: "US", region: "US" },
  { slug: "cmu", name: "Carnegie Mellon University", shortName: "CMU", country: "US", region: "US" },
  { slug: "berkeley", name: "UC Berkeley", shortName: "Berkeley", country: "US", region: "US" },
  { slug: "caltech", name: "California Institute of Technology", shortName: "Caltech", country: "US", region: "US" },
  { slug: "georgia-tech", name: "Georgia Institute of Technology", shortName: "Georgia Tech", country: "US", region: "US" },
  { slug: "umich", name: "University of Michigan", shortName: "UMich", country: "US", region: "US" },
  { slug: "uiuc", name: "University of Illinois Urbana-Champaign", shortName: "UIUC", country: "US", region: "US" },
  { slug: "utexas", name: "University of Texas at Austin", shortName: "UT Austin", country: "US", region: "US" },
  { slug: "ucla", name: "University of California, Los Angeles", shortName: "UCLA", country: "US", region: "US" },
  { slug: "columbia", name: "Columbia University", shortName: "Columbia", country: "US", region: "US" },
  { slug: "cornell", name: "Cornell University", shortName: "Cornell", country: "US", region: "US" },
  { slug: "princeton", name: "Princeton University", shortName: "Princeton", country: "US", region: "US" },
  { slug: "upenn", name: "University of Pennsylvania", shortName: "UPenn", country: "US", region: "US" },
  { slug: "nyu", name: "New York University", shortName: "NYU", country: "US", region: "US" },
  { slug: "purdue", name: "Purdue University", shortName: "Purdue", country: "US", region: "US" },
  { slug: "uw", name: "University of Washington", shortName: "UW", country: "US", region: "US" },
  { slug: "usc", name: "University of Southern California", shortName: "USC", country: "US", region: "US" },
  { slug: "virginia-tech", name: "Virginia Tech", shortName: "Virginia Tech", country: "US", region: "US" },
  // UK
  { slug: "oxford", name: "University of Oxford", shortName: "Oxford", country: "UK", region: "UK" },
  { slug: "cambridge", name: "University of Cambridge", shortName: "Cambridge", country: "UK", region: "UK" },
  { slug: "imperial", name: "Imperial College London", shortName: "Imperial", country: "UK", region: "UK" },
  { slug: "ucl", name: "University College London", shortName: "UCL", country: "UK", region: "UK" },
  { slug: "edinburgh", name: "University of Edinburgh", shortName: "Edinburgh", country: "UK", region: "UK" },
  { slug: "kings", name: "King's College London", shortName: "KCL", country: "UK", region: "UK" },
  { slug: "manchester", name: "University of Manchester", shortName: "Manchester", country: "UK", region: "UK" },
  // EU
  { slug: "eth-zurich", name: "ETH Zurich", shortName: "ETH", country: "CH", region: "EU" },
  { slug: "tu-munich", name: "Technical University of Munich", shortName: "TU Munich", country: "DE", region: "EU" },
  { slug: "tu-berlin", name: "Technical University of Berlin", shortName: "TU Berlin", country: "DE", region: "EU" },
  { slug: "rwth-aachen", name: "RWTH Aachen University", shortName: "RWTH Aachen", country: "DE", region: "EU" },
  { slug: "delft", name: "Delft University of Technology", shortName: "TU Delft", country: "NL", region: "EU" },
  { slug: "kth", name: "KTH Royal Institute of Technology", shortName: "KTH", country: "SE", region: "EU" },
  { slug: "polytechnique", name: "École Polytechnique", shortName: "Polytechnique", country: "FR", region: "EU" },
  { slug: "polimi", name: "Politecnico di Milano", shortName: "PoliMi", country: "IT", region: "EU" },
  // Asia & AU
  { slug: "nus", name: "National University of Singapore", shortName: "NUS", country: "SG", region: "Asia" },
  { slug: "ntu-sg", name: "Nanyang Technological University", shortName: "NTU", country: "SG", region: "Asia" },
  { slug: "tokyo", name: "University of Tokyo", shortName: "UTokyo", country: "JP", region: "Asia" },
  { slug: "tsinghua", name: "Tsinghua University", shortName: "Tsinghua", country: "CN", region: "Asia" },
  { slug: "iit-bombay", name: "IIT Bombay", shortName: "IIT Bombay", country: "IN", region: "Asia" },
  { slug: "iit-delhi", name: "IIT Delhi", shortName: "IIT Delhi", country: "IN", region: "Asia" },
  { slug: "kaist", name: "KAIST", shortName: "KAIST", country: "KR", region: "Asia" },
  { slug: "hku", name: "University of Hong Kong", shortName: "HKU", country: "HK", region: "Asia" },
  { slug: "melbourne", name: "University of Melbourne", shortName: "Melbourne", country: "AU", region: "Asia" },
  { slug: "unsw", name: "University of New South Wales", shortName: "UNSW", country: "AU", region: "Asia" },
  // Canada
  { slug: "waterloo", name: "University of Waterloo", shortName: "Waterloo", country: "CA", region: "US" },
  { slug: "uoft", name: "University of Toronto", shortName: "UofT", country: "CA", region: "US" },
  { slug: "ubc", name: "University of British Columbia", shortName: "UBC", country: "CA", region: "US" },
  { slug: "mcgill", name: "McGill University", shortName: "McGill", country: "CA", region: "US" },
];
