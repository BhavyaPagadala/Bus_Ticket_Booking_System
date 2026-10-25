import {cities} from './cities.js';

// Single sample boarding point per city. These are recognizable, named bus
// terminals/stops rather than generated "Main Bus Station (Demo)" labels.
// The demo seed uses this same mapping for every scheduled sample trip.
const stationByCity={
  Agra:'Idgah Bus Stand',
  Ahmedabad:'Geeta Mandir ST Bus Station',
  Amritsar:'Amritsar Bus Stand',
  Anantapur:'Anantapur APSRTC Bus Station',
  Bengaluru:'Kempegowda Bus Station (Majestic)',
  Bhimavaram:'Bhimavaram RTC Bus Station',
  Bhopal:'Nadra Bus Stand',
  Chandigarh:'ISBT Sector 17',
  Chennai:'CMBT (Koyambedu)',
  Coimbatore:'Gandhipuram Central Bus Stand',
  Delhi:'Kashmere Gate ISBT',
  Dehradun:'ISBT Dehradun',
  Eluru:'Eluru APSRTC Bus Station',
  Guntur:'Guntur APSRTC Bus Station',
  Hyderabad:'Dilsukhnagar Bus Stop',
  Indore:'Sarwate Bus Stand',
  Jaipur:'Sindhi Camp Bus Stand',
  Jammu:'Jammu General Bus Stand',
  Kadapa:'Kadapa APSRTC Bus Station',
  Kakinada:'Kakinada APSRTC Bus Station',
  Karimnagar:'Karimnagar Bus Station',
  Khammam:'Khammam Bus Station',
  Kochi:'Vyttila Mobility Hub',
  Kolkata:'Esplanade Bus Terminus',
  Kurnool:'Kurnool APSRTC Bus Station',
  Lucknow:'Alambagh Bus Terminal',
  Mahbubnagar:'Mahbubnagar Bus Station',
  Mancherial:'Mancherial Bus Station',
  Mangaluru:'State Bank Bus Stand',
  Mumbai:'Mumbai Central Bus Station',
  Mysuru:'Mysuru Suburban Bus Stand',
  Nagpur:'Ganeshpeth Bus Stand',
  Nellore:'Nellore APSRTC Bus Station',
  Nizamabad:'Nizamabad Bus Station',
  Ongole:'Ongole APSRTC Bus Station',
  Patna:'Mithapur Bus Terminal',
  Pune:'Swargate Bus Station',
  Rajahmundry:'Rajahmundry APSRTC Bus Station',
  Srikakulam:'Srikakulam APSRTC Bus Station',
  Shimla:'Old Bus Stand',
  Surat:'Surat Central Bus Station',
  Suryapet:'Suryapet Bus Station',
  Thane:'Vandana Bus Station',
  Thiruvananthapuram:'Thampanoor Central Bus Station',
  Tirupati:'Tirupati APSRTC Bus Station',
  Udaipur:'Udaipole Bus Stand',
  Vijayawada:'Pandit Nehru Bus Station (PNBS)',
  Visakhapatnam:'RTC Complex (Dwaraka Nagar)',
  Vizianagaram:'Vizianagaram APSRTC Bus Station',
  Warangal:'Hanamkonda Bus Station'
};

export function stationsFor(city){
  return cities.includes(city)&&stationByCity[city]?[stationByCity[city]]:[];
}

export function sampleStation(city){
  return stationsFor(city)[0];
}
