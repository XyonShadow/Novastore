const products = [
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
  { id: 25, name: "HP DeskJet 2720", price: 48000, category: "Printers", image: "images/printers/hp-deskjet.jpg" },
  { id: 26, name: "Canon Pixma G3411", price: 73000, category: "Printers", image: "images/printers/canon-pixma.jpg" },
  { id: 27, name: "Epson EcoTank L3150", price: 87000, category: "Printers", image: "images/printers/epson-ecotank.jpg" },
  { id: 28, name: "Brother DCP-L2540DW", price: 96000, category: "Printers", image: "images/printers/brother-dcp.jpg" },

  // Bikes
  { id: 29, name: "Mountain Bike XT 21-Speed", price: 150000, category: "Bikes", image: "images/bikes/mountain-bike.jpg" },
  { id: 30, name: "BMX Freestyle Bike", price: 105000, category: "Bikes", image: "images/bikes/bmx-freestyle.jpg" },
  { id: 31, name: "Road Bike 700c Racer", price: 185000, category: "Bikes", image: "images/bikes/road-bike.jpg" },
  { id: 32, name: "Foldable Commuter Bike", price: 98000, category: "Bikes", image: "images/bikes/foldable-bike.jpg" }
];
