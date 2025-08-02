let products = [
  // Computers
  { id: 1, name: "Desktop PC Pro", price: 250000, category: "Computers", image: "images/computers/desktop.jpg" },
  { id: 2, name: "All-in-One Touch", price: 320000, category: "Computers", image: "images/computers/allinone.jpg" },
  { id: 3, name: "Mini Workstation", price: 295000, category: "Computers", image: "images/computers/workstation.jpg" },
  { id: 4, name: "Gaming PC Elite", price: 450000, category: "Computers", image: "images/computers/gaming.jpg" },

  // Phones
  { id: 5, name: "iPhone 14 Pro", price: 980000, category: "Phones", image: "images/phones/iphone14pro.jpg" },
  { id: 6, name: "Samsung Galaxy S23", price: 750000, category: "Phones", image: "images/phones/galaxy-s23.jpg" },
  { id: 7, name: "Tecno Camon 20", price: 145000, category: "Phones", image: "images/phones/camon20.jpg" },
  { id: 8, name: "Infinix Zero 30", price: 165000, category: "Phones", image: "images/phones/zero30.jpg" },

  // Laptops
  { id: 9, name: "MacBook Air M2", price: 1150000, category: "Laptops", image: "images/laptops/macbook-air.jpg" },
  { id: 10, name: "HP Spectre x360", price: 890000, category: "Laptops", image: "images/laptops/hp-spectre.jpg" },
  { id: 11, name: "Dell XPS 13", price: 970000, category: "Laptops", image: "images/laptops/dell-xps.jpg" },
  { id: 12, name: "Lenovo ThinkPad X1", price: 845000, category: "Laptops", image: "images/laptops/thinkpad.jpg" },

  // Electronics
  { id: 13, name: "Bluetooth Speaker", price: 25000, category: "Electronics", image: "images/electronics/speaker.jpg" },
  { id: 14, name: "Smart LED TV 50", price: 360000, category: "Electronics", image: "images/electronics/tv.jpg" },
  { id: 15, name: "Wireless Charger", price: 15000, category: "Electronics", image: "images/electronics/charger.jpg" },
  { id: 16, name: "Noise Cancelling Headphones", price: 68000, category: "Electronics", image: "images/electronics/headphones.jpg" },

  // Security
  { id: 17, name: "CCTV Camera Set", price: 120000, category: "Security", image: "images/security/cctv.jpg" },
  { id: 18, name: "Smart Door Lock", price: 70000, category: "Security", image: "images/security/door-lock.jpg" },
  { id: 19, name: "Motion Sensor Light", price: 23000, category: "Security", image: "images/security/motion.jpg" },
  { id: 20, name: "Wireless Alarm System", price: 54000, category: "Security", image: "images/security/alarm.jpg" },

  // Health
  { id: 21, name: "Digital Thermometer", price: 7000, category: "Health", image: "images/health/thermometer.jpg" },
  { id: 22, name: "Blood Pressure Monitor", price: 32000, category: "Health", image: "images/health/bp-monitor.jpg" },
  { id: 23, name: "Infrared Thermometer", price: 11000, category: "Health", image: "images/health/infrared.jpg" },
  { id: 24, name: "Digital Weighing Scale", price: 18000, category: "Health", image: "images/health/scale.jpg" },

  // Cars
  { id: 25, name: "Toyota Camry 2019", price: 4200000, category: "Cars", image: "images/cars/camry.jpg" },
  { id: 26, name: "Honda CR-V 2021", price: 5300000, category: "Cars", image: "images/cars/honda-crv.jpg" },
  { id: 27, name: "Hyundai Elantra 2020", price: 3800000, category: "Cars", image: "images/cars/elantra.jpg" },
  { id: 28, name: "Ford Explorer 2018", price: 4600000, category: "Cars", image: "images/cars/explorer.jpg" },

  // Drones
  { id: 29, name: "DJI Mini 3 Pro", price: 460000, category: "Drones", image: "images/drones/dji-mini3.jpg" },
  { id: 30, name: "DJI Phantom 4", price: 850000, category: "Drones", image: "images/drones/phantom4.jpg" },
  { id: 31, name: "Syma X8 Pro", price: 95000, category: "Drones", image: "images/drones/syma.jpg" },
  { id: 32, name: "Parrot Anafi", price: 320000, category: "Drones", image: "images/drones/anafi.jpg" },

  // Buses
  { id: 33, name: "Toyota Hiace Bus", price: 8500000, category: "Buses", image: "images/buses/hiace.jpg" },
  { id: 34, name: "Ford Transit", price: 9200000, category: "Buses", image: "images/buses/transit.jpg" },
  { id: 35, name: "Mercedes Sprinter", price: 11000000, category: "Buses", image: "images/buses/sprinter.jpg" },
  { id: 36, name: "Hyundai County", price: 8900000, category: "Buses", image: "images/buses/county.jpg" },

  // Printers
  { id: 37, name: "HP DeskJet 2720", price: 48000, category: "Printers", image: "images/printers/hp-deskjet.jpg" },
  { id: 38, name: "Canon Pixma G3411", price: 73000, category: "Printers", image: "images/printers/canon-pixma.jpg" },
  { id: 39, name: "Epson EcoTank L3150", price: 87000, category: "Printers", image: "images/printers/epson-ecotank.jpg" },
  { id: 40, name: "Brother DCP-L2540DW", price: 96000, category: "Printers", image: "images/printers/brother-dcp.jpg" },

  // Bikes
  { id: 41, name: "Mountain Bike XT 21-Speed", price: 150000, category: "Bikes", image: "images/bikes/mountain-bike.jpg" },
  { id: 42, name: "BMX Freestyle Bike", price: 105000, category: "Bikes", image: "images/bikes/bmx-freestyle.jpg" },
  { id: 43, name: "Road Bike 700c Racer", price: 185000, category: "Bikes", image: "images/bikes/road-bike.jpg" },
  { id: 44, name: "Foldable Commuter Bike", price: 98000, category: "Bikes", image: "images/bikes/foldable-bike.jpg" },

  // Smart Home
  { id: 45, name: "Smart Light Bulb", price: 8000, category: "Smart Home", image: "images/smart-home/lightbulb.jpg" },
  { id: 46, name: "WiFi Smart Plug", price: 9500, category: "Smart Home", image: "images/smart-home/smart-plug.jpg" },
  { id: 47, name: "Smart Thermostat", price: 52000, category: "Smart Home", image: "images/smart-home/thermostat.jpg" },
  { id: 48, name: "Voice Assistant Speaker", price: 32000, category: "Smart Home", image: "images/smart-home/speaker.jpg" },

  // Wearables
  { id: 49, name: "Apple Watch Series 9", price: 320000, category: "Wearables", image: "images/wearables/apple-watch.jpg" },
  { id: 50, name: "Samsung Galaxy Watch 6", price: 270000, category: "Wearables", image: "images/wearables/galaxy-watch.jpg" },
  { id: 51, name: "Xiaomi Mi Band 8", price: 28000, category: "Wearables", image: "images/wearables/mi-band.jpg" },
  { id: 52, name: "Fitbit Charge 6", price: 90000, category: "Wearables", image: "images/wearables/fitbit.jpg" },

  // Kids
  { id: 53, name: "Electric Toy Car", price: 65000, category: "Kids", image: "images/kids/electric-car.jpg" },
  { id: 54, name: "Educational Tablet", price: 45000, category: "Kids", image: "images/kids/edu-tablet.jpg" },
  { id: 55, name: "Remote Control Helicopter", price: 38000, category: "Kids", image: "images/kids/rc-heli.jpg" },
  { id: 56, name: "Smart Drawing Board", price: 25000, category: "Kids", image: "images/kids/drawing-board.jpg" },

  // Power
  { id: 57, name: "1.5kVA Inverter", price: 185000, category: "Power", image: "images/power/inverter.jpg" },
  { id: 58, name: "Solar Panel 200W", price: 72000, category: "Power", image: "images/power/solar-panel.jpg" },
  { id: 59, name: "Power Bank 20000mAh", price: 18000, category: "Power", image: "images/power/powerbank.jpg" },
  { id: 60, name: "Generator 3.5KVA", price: 230000, category: "Power", image: "images/power/generator.jpg" }
];

// random promotions
const promoOptions = [
  { discount: 15, badges: ["Hot Deal"] },
  { discount: 25, badges: ["Clearance"] },
  { discount: 10, badges: ["Limited Stock"] },
  { discount: 30, badges: ["Big Sale"] }
];

// If demo data hasn't been set in this (browser) session, generate and store it
if (!sessionStorage.getItem("demoProducts")) {
  const demoProducts = products.map(product => {
    const promo = promoOptions[Math.floor(Math.random() * promoOptions.length)];
    
    // Generate demo data
    const unitsSold = Math.floor(Math.random() * 500) + 10; // 10 to 509
    const rating = +(Math.random() * 2 + 3).toFixed(1);     // 3 to 5
    const reviewCount = Math.floor(rating * 2 + Math.random() * 8); // 8 to 18

    return {
      ...product,
      discount: promo.discount,
      badges: promo.badges,
      selectedColor: 'Default',
      selectedModel: 'Standard',
      unitsSold,
      rating,
      reviewCount
    };
  });

  // Store the changed product data in sessionStorage for reuse
  sessionStorage.setItem("demoProducts", JSON.stringify(demoProducts));
}

// Load the stored demo product data for consistent rendering
products = JSON.parse(sessionStorage.getItem("demoProducts"));

//TODO: IMPLEMENT BACKEND FETCHING