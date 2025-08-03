let products = [
  // Tech & Gadgets
  {
    id: 1,
    name: "LIFEBEE Real-Time Multi-Language Translation Smart Wireless Glasses",
    price: 84631,
    category: "Tech & Gadgets",
    image: "Assets/Products/lifebee-translation-glasses.jpg",
    description: "Instant voice translation in over 30 languages with stylish, hands-free smart glasses perfect for travel and business."
  },

  {
    id: 2,
    name: "COIUSOR Men's Smartwatch 1.53-inch",
    price: 85249,
    category: "Tech & Gadgets",
    image: "Assets/Products/coiusor-smartwatch.jpg",
    description: "Track your health, calls, and daily fitness with this sleek 1.53-inch smartwatch designed for modern lifestyles."
  },

  {
    id: 3,
    name: "Exquisite High-Value, Breath Light Rhythm Earbuds",
    price: 114755,
    category: "Tech & Gadgets",
    image: "Assets/Products/breath-light-earbuds.jpg",
    description: "Premium wireless earbuds with rhythmic breathing lights, immersive sound, and long-lasting comfort."
  },

  {
    id: 4,
    name: "BDF P37 Version 10.1 Inch Android 11 Tablet PC",
    price: 174633,
    category: "Tech & Gadgets",
    image: "Assets/Products/bdf-p37-tablet.jpg",
    description: "Experience smooth multitasking with a powerful 10.1-inch tablet running Android 11 and dual SIM support."
  },

  {
    id: 5,
    name: "Teclast T70 Tablet PC 14 Inch Max Display Pad",
    price: 712775,
    category: "Tech & Gadgets",
    image: "Assets/Products/teclast-t70.jpg",
    description: "A massive 14-inch display for streaming, gaming, or productivity—Teclast T70 blends power with elegance."
  },

  {
    id: 6,
    name: "Ultra HD 4K Wireless VR Glasses with 120Hz Refresh Rate & 110° Wide-Angle Display",
    price: 176467,
    category: "Tech & Gadgets",
    image: "Assets/Products/ultra-hd-vr-glasses.jpg",
    description: "Immerse yourself in 4K virtual worlds with 120Hz refresh rate and ultra-wide FOV—no wires, just thrill."
  },

  {
    id: 7,
    name: "Teclast P50 2025 Tablet",
    price: 363902,
    category: "Tech & Gadgets",
    image: "Assets/Products/teclast-p50.jpg",
    description: "Next-gen 2025 Teclast P50 with enhanced performance, crystal-clear visuals, and ultra-slim design."
  },

  {
    id: 8,
    name: "1.83-inch Smart Watch",
    price: 108643,
    category: "Tech & Gadgets",
    image: "Assets/Products/1-83-inch-smartwatch.jpg",
    description: "Stay connected and fit with a large 1.83-inch smartwatch featuring health tracking and Bluetooth calls."
  },

  {
    id: 9,
    name: "Zealot S97 Powerful Outdoor Portable Subwoofer Wireless Speaker",
    price: 366417,
    category: "Tech & Gadgets",
    image: "Assets/Products/zealot-s97-speaker.jpg",
    description: "Unleash the party with the Zealot S97: booming bass, waterproof build, and up to 12 hours of playtime."
  },

  {
    id: 10,
    name: "Siindoo Hybrid Active Noise-Cancelling Headphones with Touchscreen",
    price: 131099,
    category: "Tech & Gadgets",
    image: "Assets/Products/siindoo-hybrid-headphones.jpg",
    description: "Touchscreen control meets hybrid noise cancellation for the ultimate focused listening on the go."
  },

  {
    id: 11,
    name: "2.4G Remote Control Interactive Robot Dog",
    price: 137063,
    category: "Tech & Gadgets",
    image: "Assets/Products/robot-dog.jpg",
    description: "A smart robotic pet that barks, dances, and follows commands—fun for kids and tech lovers alike."
  },

  {
    id: 12,
    name: "New 3 in 1 Smart Watch with Earbuds, 1.46-inch HD Screen, Call Answering/Speaker",
    price: 100932,
    category: "Tech & Gadgets",
    image: "Assets/Products/3-in-1-smartwatch.jpg",
    description: "All-in-one smart device with hidden earbuds, call functions, and a vibrant 1.46\" HD display."
  },

  // Computer & Accessories
  {
    id: 13,
    name: "M-Amazup Portable MP3 Player with Dual Wireless Transmission",
    price: 105434,
    category: "Computer & Accessories",
    image: "Assets/Products/m-amazup-mp3.jpg",
    description: "Compact car stereo system with FM radio, stereo speakers, USB playback, and rechargeable battery."
  },

  {
    id: 14,
    name: "Portable Multi-Function CD Player with 4000mAh",
    price: 275732,
    category: "Computer & Accessories",
    image: "Assets/Products/portable-cd-player.jpg",
    description: "High-fidelity sound system with FM radio, dual speakers, wireless connectivity, and A-B loop."
  },

  {
    id: 15,
    name: "Professional 70mm Refractor Astronomy Telescope",
    price: 234066,
    category: "Computer & Accessories",
    image: "Assets/Products/astronomy-telescope.jpg",
    description: "HD wide-angle telescope with tripod for stargazing and planet observation."
  },

  {
    id: 16,
    name: "HGFRTEE 15.6-inch Touch Portable Display",
    price: 342452,
    category: "Computer & Accessories",
    image: "Assets/Products/hgfrtee-portable-display.jpg",
    description: "1080P full HD VESA-compatible travel monitor for laptops and business use."
  },

  {
    id: 17,
    name: "Uperfect 16 Inch Portable Monitor 2.5K 120Hz IPS",
    price: 518934,
    category: "Computer & Accessories",
    image: "Assets/Products/uperfect-monitor.jpg",
    description: "Ultra-bright 400nits matte display with FreeSync and wide viewing angle, USB-C/HDTV support."
  },

  {
    id: 18,
    name: "Cappsu 68GB MP3 Player with Wireless Connectivity",
    price: 135093,
    category: "Computer & Accessories",
    image: "Assets/Products/cappsu-mp3.jpg",
    description: "HiFi MP3 player with headphones, FM radio, recording, and 30-hour playback."
  },

  {
    id: 19,
    name: "LESOWN 8.8\" Portable IPS LCD Monitor",
    price: 388248,
    category: "Computer & Accessories",
    image: "Assets/Products/lesown-lcd-monitor.jpg",
    description: "USB-powered secondary screen with sleek metal case, real-time sunset scene."
  },

  {
    id: 20,
    name: "ANMITE 14\" Touchscreen Monitor FHD 1080P",
    price: 330336,
    category: "Computer & Accessories",
    image: "Assets/Products/anmite-touchscreen.jpg",
    description: "1920x1200 matte display with FreeSync, built-in audio, and USB-C power."
  },

  // Car Accessories
  {
    id: 21,
    name: "VENBES 7-inch Carplay Android Auto Multimedia Stereo Player",
    price: 114792,
    category: "Car Accessories",
    image: "Assets/Products/venbes-carplay-7in.jpg",
    description: "Universal touch screen stereo system with wireless Carplay/Android Auto support and mirror link.",
  },

  {
    id: 22,
    name: "Luxury Plush Car Seat Covers - Faux Fox Fur",
    price: 76652,
    category: "Car Accessories",
    image: "Assets/Products/plush-seat-covers-khaki.jpg",
    description: "Thick, warm faux fur car seat covers for winter comfort. Includes back storage pockets.",
  },

  {
    id: 23,
    name: "NP-Style Rear Roof Spoiler for Nissan SUVs",
    price: 418514,
    category: "Car Accessories",
    image: "Assets/Products/npstyle-nissan-spoiler.jpg",
    description: "Gloss black aerodynamic ABS spoiler with gurney flap, compatible with multiple Nissan models.",
  },

  {
    id: 24,
    name: "PODOFO Single DIN Car Radio 7in IPS Touch Display",
    price: 208429,
    category: "Car Accessories",
    image: "Assets/Products/podofo-7in-radio.jpg",
    description: "Retractable touchscreen stereo with mirror link, FM, USB-C, and rear camera support.",
  },

  {
    id: 25,
    name: "2025 PUPU PU Leather Rear Car Seat Storage Bag",
    price: 79928,
    category: "Car Accessories",
    image: "Assets/Products/pupu-car-bag.jpg",
    description: "PU leather car organizer with large storage, tissue box, and universal hanging fit.",
  },

  {
    id: 26,
    name: "JDM Racing D-Type 350mm Sports Steering Wheel",
    price: 178778,
    category: "Car Accessories",
    image: "Assets/Products/jdm-dtype-wheel.jpg",
    description: "Carbon fiber textured sports steering wheel with red faux leather and black spokes.",
  },

  {
    id: 27,
    name: "Universal Fit Breathable Leather Car Seat Covers",
    price: 324498,
    category: "Car Accessories",
    image: "Assets/Products/universal-leather-covers.jpg",
    description: "All-season polyester/leather seat cushions, full wrap design for SUVs and sedans.",
  },

  {
    id: 28,
    name: "Rear Window Roof Hatchback Spoiler Wing - VW UP/GTI",
    price: 345186,
    category: "Car Accessories",
    image: "Assets/Products/vw-gti-rear-spoiler.jpg",
    description: "Gloss black ABS spoiler for hatchbacks including VW UP, FOX, ID3, and GOLF GTI.",
  },

  // Smart Home Gadgets
  {
    id: 29,
    name: "Smart WiFi Doorbell Camera with 2-Way Audio & Night Vision",
    price: 56573,
    category: "Smart Home Gadget",
    image: "Assets/Products/smart-doorbell-camera.jpg",
    description: "Wireless video doorbell with built-in battery, app control, USB charging, and 2.4G WiFi support.",
  },

  {
    id: 30,
    name: "Inskam Smart Aromatherapy Diffuser with Night Light",
    price: 117183,
    category: "Smart Home Gadget",
    image: "Assets/Products/inskam-aroma-diffuser.jpg",
    description: "USB rechargeable diffuser with 3 mist modes, ambient lighting, and touch control.",
  },

  {
    id: 31,
    name: "JOOAN 1080P Full HD Smart Security Camera",
    price: 52885,
    category: "Smart Home Gadget",
    image: "Assets/Products/jooan-security-camera.jpg",
    description: "Indoor WiFi camera with motion tracking, night vision, 2-way audio, and mobile app control.",
  },

  {
    id: 32,
    name: "Smart Robot Vacuum Cleaner & Mop Combo",
    price: 48564,
    category: "Smart Home Gadget",
    image: "Assets/Products/robot-vacuum-mop.jpg",
    description: "Rechargeable robotic cleaner for pet hair and hard floors with quiet, slim design.",
  },

  {
    id: 33,
    name: "Touchless Foaming Soap Dispenser with Smart Sensor",
    price: 41270,
    category: "Smart Home Gadget",
    image: "Assets/Products/touchless-soap-dispenser.jpg",
    description: "Foam soap dispenser with USB charging and automatic sensor for hygienic handwashing.",
  },

  {
    id: 34,
    name: "Automatic Dust Box Robot with App Control",
    price: 957689,
    category: "Smart Home Gadget",
    image: "Assets/Products/auto-dustbox-cleaner.jpg",
    description: "High-end laser-guided robotic cleaner with water tank, WiFi, and app-controlled navigation.",
  },

  {
    id: 35,
    name: "Digital Shower Head System with LED Display & Lights",
    price: 376207,
    category: "Smart Home Gadget",
    image: "Assets/Products/led-digital-shower.jpg",
    description: "Stylish grey shower head system with LED indicators and ambiance lighting for bathrooms.",
  },

  {
    id: 36,
    name: "Smart Automatic Wall-Mount Foaming Soap Dispenser",
    price: 116884,
    category: "Smart Home Gadget",
    image: "Assets/Products/wall-auto-soap-dispenser.jpg",
    description: "Rechargeable wall-mounted soap dispenser with LED screen and adjustable foam control.",
  },

  {
    id: 37,
    name: "Thermostatic Full Copper Rain Shower System",
    price: 192450,
    category: "Smart Home Gadget",
    image: "Assets/Products/thermostatic-rain-shower.jpg",
    description: "LED digital display shower set with ambiance lights, rainfall and handheld combo.",
  },

  {
    id: 38,
    name: "3-in-1 Mini Robot Vacuum & Mop Cleaner",
    price: 64401,
    category: "Smart Home Gadget",
    image: "Assets/Products/mini-robot-vacuum.jpg",
    description: "Ultra-slim cordless cleaner for sweeping, vacuuming, and mopping under furniture.",
  },

  // Mobile Accessories
  {
    id: 39,
    name: "2025 Hot HiFi Smart Wireless Earbuds with Touchable LCD",
    price: 82275,
    category: "Mobile Accessories",
    image: "Assets/Products/hifi-wireless-earbuds.jpg",
    description: "Noise-canceling wireless earbuds with LCD screen, Type-C charging, built-in mic, ideal for workouts and bilingual interface.",
  },

  {
    id: 40,
    name: "Adjustable Laptop Stand with Phone Holder",
    price: 59713,
    category: "Mobile Accessories",
    image: "Assets/Products/adjustable-laptop-stand.jpg",
    description: "Portable and adjustable laptop stand for 17.3-inch devices with integrated mobile phone holder.",
  },

  {
    id: 41,
    name: "3-in-1 Foldable Wireless Charging Station for Apple Devices",
    price: 42241,
    category: "Mobile Accessories",
    image: "Assets/Products/foldable-wireless-charger.jpg",
    description: "Foldable fast charging dock for iPhone, Apple Watch, and AirPods with sleek stand design.",
  },

  {
    id: 42,
    name: "Mingmai Magnetic 3-in-1 Wireless Charging Station",
    price: 49927,
    category: "Mobile Accessories",
    image: "Assets/Products/mingmai-wireless-charger.jpg",
    description: "Compact folding charger with LED indicator for iPhone, AirPods, and Apple Watch — perfect travel companion.",
  },

  {
    id: 43,
    name: "240Wmax 4-in-1 USB-C Charging Cable with Display",
    price: 23567,
    category: "Mobile Accessories",
    image: "Assets/Products/240w-usb-c-cable.jpg",
    description: "Durable spring-type multi-charging cable with digital display, suitable for various phone brands and car use.",
  },

  {
    id: 44,
    name: "2024 Magnetic AI 3-Axis Video Stabilizer",
    price: 321159,
    category: "Mobile Accessories",
    image: "Assets/Products/ai-stabilizer.jpg",
    description: "Anti-shake camera stabilizer with AI tracking, fill light, gesture control, and 4 shooting modes — includes tripod.",
  },

  {
    id: 45,
    name: "COMITOK L7C Smart 3-Axis Gimbal with Fill Light",
    price: 124752,
    category: "Mobile Accessories",
    image: "Assets/Products/comitok-gimbal.jpg",
    description: "Handheld gimbal for stable mobile shooting, gesture control, live broadcasting, and vlog recording.",
  },

  {
    id: 46,
    name: "15W Multi-Device Wireless Charging Station",
    price: 32580,
    category: "Mobile Accessories",
    image: "Assets/Products/multi-device-charger.jpg",
    description: "Universal wireless charging station for Android, iPhone, Google Pixel, AirPods, and Samsung Buds.",
  },

  {
    id: 47,
    name: "2025 Phone Vlog Selfie Monitor Screen (3.97\")",
    price: 134044,
    category: "Mobile Accessories",
    image: "Assets/Products/vlog-selfie-monitor.jpg",
    description: "Rear camera monitor for live streaming with low latency, rechargeable, dual power modes, and compact ABS screen.",
  },

  {
    id: 48,
    name: "Unlocked Android Smartphone with Stylus (8GB+256GB)",
    price: 569969,
    category: "Mobile Accessories",
    image: "Assets/Products/android-smartphone.jpg",
    description: "Large-screen smartphone with high-res camera, stylus, 4100mAh battery, and bundle of protective accessories.",
  },

  // Gaming and Entertainment
  {
    id: 49,
    name: "Retro Handheld Game Console R36S - 64GB",
    price: 170758,
    category: "Gaming and Entertainment",
    image: "Assets/Products/retro-console-r36s.jpg",
    description: "Portable retro gaming console with 8.89cm screen, USB charging, rechargeable battery, and plug-and-play support for classic titles.",
  },

  {
    id: 50,
    name: "MAMBASNAKE 5-in-1 Gaming Peripherals Set",
    price: 204375,
    category: "Gaming and Entertainment",
    image: "Assets/Products/mambasnake-gaming-set.jpg",
    description: "Complete gaming set with LED backlit keyboard, RGB mouse, headset with mic, stereo speakers, and mouse pad — PC, Mac, Xbox, PS4 compatible.",
  },

  {
    id: 51,
    name: "Wireless Gaming Headset with Mic",
    price: 61923,
    category: "Gaming and Entertainment",
    image: "Assets/Products/wireless-gaming-headset.jpg",
    description: "Colorful wireless over-ear gaming headset with USB-C charging, lithium battery, and high-performance sound — great for eSports and PC gaming.",
  },

  {
    id: 52,
    name: "Ultimate Virtual Dating 3D Glasses",
    price: 121536,
    category: "Gaming and Entertainment",
    image: "Assets/Products/virtual-dating-glasses.jpg",
    description: "4K 1080p cinema & gaming headset with custom focus, vision adaption, and a shared immersive tech experience for couples.",
  },

  {
    id: 53,
    name: "ONIKUMA High-Performance Wired Gaming Headset",
    price: 71998,
    category: "Gaming and Entertainment",
    image: "Assets/Products/onikuma-gaming-headset.jpg",
    description: "Durable wired headset with adjustable mic and strong audio clarity — made for pro gamers and e-sports enthusiasts.",
  },

  {
    id: 54,
    name: "GAMER01 RGB Gaming Mouse Pad (Large)",
    price: 72726,
    category: "Gaming and Entertainment",
    image: "Assets/Products/gamer01-rgb-mousepad.jpg",
    description: "Large RGB gaming mouse pad with 14 light modes, touch control, anti-slip rubber base — perfect for competitive setups.",
  },

  {
    id: 55,
    name: "Wireless Controller for PS4 with USB Cable",
    price: 79833,
    category: "Gaming and Entertainment",
    image: "Assets/Products/ps4-wireless-controller.jpg",
    description: "Rechargeable wireless PS4 controller with vibration, motion control, multi-touchpad, and audio jack — PS4, Slim, Pro, and PC compatible.",
  },

  {
    id: 56,
    name: "Logitech Racing Wheel Stand - Adjustable for G29/G27",
    price: 814925,
    category: "Gaming and Entertainment",
    image: "Assets/Products/logitech-racing-stand.jpg",
    description: "Adjustable SIM racing stand for Logitech G29/G27 with ergonomic cockpit design — perfect for realistic racing simulation.",
  },

  {
    id: 57,
    name: "UNICO SNK MVS Mini Retro Arcade Console",
    price: 370653,
    category: "Gaming and Entertainment",
    image: "Assets/Products/unico-mini-arcade.jpg",
    description: "Retro arcade console with joystick and 45 classic SNK NeoGeo games including KOF, Metal Slug, and Samurai Shodown — USB powered.",
  },

  {
    id: 58,
    name: "Corner Gaming Desk for Two - L-Shaped Design",
    price: 986874,
    category: "Gaming and Entertainment",
    image: "Assets/Products/corner-gaming-desk.jpg",
    description: "Modern ergonomic gaming desk with red accents, dual monitor support, headphone hooks, and minimalist cork finish for home or office.",
  },

  // Tools & DIY
  {
    id: 59,
    name: "23pcs Complete Home Repair Tool Set",
    description: "Plastic box with essential tools for home repairs. Multi-functional hardware kit including screwdrivers, pliers, wrenches, and more. Designed for both DIY and professional use.",
    price: 48914,
    category: "Tools & DIY",
    image: "Assets/Products/toolset-23pcs.jpg"
  },
  
  {
    id: 60,
    name: "216/46pcs Mechanic Tool Socket Set",
    description: "Comprehensive mechanic socket set with 1/2\", 1/4\", and 3/8\" drives. SAE & metric sizes. Includes a 72-tooth ratchet wrench. Ideal for cars, garages, bikes, and home use.",
    price: 617171,
    category: "Tools & DIY",
    image: "Assets/Products/mechanic-socket-set.jpg"
  },
  
  {
    id: 61,
    name: "Bxuyk Cordless Electric Drill Set - 8V",
    description: "Compact electric drill kit with USB rechargeable lithium battery. Comes with LED light, multiple screwdriver bits, and attachments. Great for DIY projects and light repairs.",
    price: 138017,
    category: "Tools & DIY",
    image: "Assets/Products/bxuyk-drill.jpg"
  },
  
  {
    id: 62,
    name: "CHISHIB 16-Line Green Laser Level Pro",
    description: "High-precision leveling tool with 4x360° auto-leveling, touch panel, and remote. Ideal for renovation and construction. USB/battery powered with accessories and case.",
    price: 151832,
    category: "Tools & DIY",
    image: "Assets/Products/chishib-laser-level.jpg"
  },
  
  {
    id: 63,
    name: "Hi-Spec 109pcs Electric Tool Kit",
    description: "Three-tier portable toolbox with 109 electric tools including an 8V screwdriver. Great for home repairs and mechanics. Comes with organized storage drawers.",
    price: 469937,
    category: "Tools & DIY",
    image: "Assets/Products/hispec-109pc-kit.jpg"
  },
  
  {
    id: 64,
    name: "Hi-Spec Electric Screwdriver & Drill Bit Set",
    description: "Cordless 8V electric screwdriver with a full set of bits, portable toolbox, and USB charging. Ideal for home furniture repairs, installations, and yard maintenance.",
    price: 161046,
    category: "Tools & DIY",
    image: "Assets/Products/hispec-electric-screwdriver.jpg"
  },

  // Health and Personal Care
  {
    id: 65,
    name: "USB Rechargeable Facial Skincare Beauty Device",
    description: "Multi-functional beauty device for facial care. Lightweight and portable with lithium battery (18650 series). Perfect gift for Mother’s Day or Valentine’s. Simplifies skincare routine.",
    price: 39134,
    category: "Health & Personal Care",
    image: "Assets/Products/skincare-device.jpg"
  },
  
  {
    id: 66,
    name: "7-Color Facial & Neck Beauty Set",
    description: "Complete 7-color LED therapy set for facial and neck care. Ideal gift for Valentine’s Day. Enhances skin appearance and promotes relaxation.",
    price: 97301,
    category: "Health & Personal Care",
    image: "Assets/Products/7color-beauty-set.jpg"
  },
  
  {
    id: 67,
    name: "Intelligent Automatic Electric Toothbrush",
    description: "USB rechargeable toothbrush with six vibration modes, soft bristles, deep cleaning capability, and 2-minute timer. Comes with night mode and 8 brush heads.",
    price: 16986,
    category: "Health & Personal Care",
    image: "Assets/Products/smart-toothbrush.jpg"
  },
  
  {
    id: 68,
    name: "ROZINO Turmeric + Vitamin C Hand & Foot Cream",
    description: "Hydrating and nourishing hand & foot cream enriched with hyaluronic acid, almond oil, and jojoba seed oil. Designed for dry skin care and daily moisture.",
    price: 35456,
    category: "Health & Personal Care",
    image: "Assets/Products/rozino-cream.jpg"
  },
  
  {
    id: 69,
    name: "MIGUAN Rechargeable Electric Foot File",
    description: "Portable callus remover and pedicure kit with USB charging. Hypoallergenic and ideal for smooth foot care. Lightweight and easy to carry.",
    price: 94803,
    category: "Health & Personal Care",
    image: "Assets/Products/miguan-foot-file.jpg"
  },
  
  {
    id: 70,
    name: "99-Speed Deep Tissue Percussion Massager",
    description: "Advanced handheld percussion massager with 99 speed levels and 8 interchangeable heads. Designed for deep tissue therapy and muscle relaxation.",
    price: 127891,
    category: "Health & Personal Care",
    image: "Assets/Products/deep-tissue-massager.jpg"
  },
  
  {
    id: 71,
    name: "Powerful Massage Gun with 9 Heads",
    description: "USB charging muscle massage gun with 9 interchangeable heads for full body and back. Suitable for sports recovery and fitness relaxation.",
    price: 73330,
    category: "Health & Personal Care",
    image: "Assets/Products/powerful-massage-gun.jpg"
  },
  
  {
    id: 72,
    name: "7-Color Light Therapy Face Mask",
    description: "LED face mask designed for facial and neck skincare treatments. Great gift for girlfriends, women, and loved ones. Compact and effective skincare.",
    price: 51288,
    category: "Health & Personal Care",
    image: "Assets/Products/light-therapy-mask.jpg"
  },
  
  {
    id: 73,
    name: "Mini Portable Neck & Muscle Massager",
    description: "Rechargeable, ergonomic massage tool for neck and body relaxation. Compact, alcohol-free device ideal for on-the-go relief from muscle stress.",
    price: 28704,
    category: "Health & Personal Care",
    image: "Assets/Products/neck-muscle-massager.jpg"
  },
  
  {
    id: 75,
    name: "3pcs Bed Wedge Pillow Set - Postoperative Support",
    description: "Foam wedge pillow set for back, leg, and knee support. Adjustable 9 & 30.48 cm folding triangular design, ideal for acid reflux relief, snoring prevention, and post-surgery comfort. Grey velvet. Limited stock – only 6 left.",
    price: 136484,
    category: "Health & Personal Care",
    image: "Assets/Products/bed-wedge-pillow.jpg"
  },

  // Home & Kitchen
  {
    id: 76,
    name: "44pcs Silicone Kitchen Utensil Set with Non-Stick Wooden Handles",
    description: "Complete set of spatulas, whisks, spoons, tongs, and more. Ideal for holidays and daily cooking. Heat-resistant and modern design.",
    price: 88535,
    category: "Home & Kitchen",
    image: "Assets/Products/silicone-utensil-set.jpg"
  },
  
  {
    id: 77,
    name: "3pcs Flannel Farmhouse Kitchen Mat Set - Vintage Knife & Fork Design",
    description: "Durable and fade-resistant kitchen floor mats. 10mm thick polyester material, great for indoor spaces like porches, kitchens, and laundry rooms.",
    price: 50945,
    category: "Home & Kitchen",
    image: "Assets/Products/kitchen-mat-set.jpg"
  },
  
  {
    id: 78,
    name: "4-in-1 Foldable Broom and Dustpan Set",
    description: "Includes dustpan, broom, and squeegee. Compact and foldable cleaning set for kitchen, bathroom, and bedroom floors.",
    price: 39134,
    category: "Home & Kitchen",
    image: "Assets/Products/foldable-broom-dustpan.jpg"
  },
  
  {
    id: 79,
    name: "2pcs Automatic Motion Sensor Trash Cans - Touchless Slim Design",
    description: "Smart garbage bins with lids. Perfect for bathrooms, kitchens, and offices. Space-saving and odor-controlling.",
    price: 97370,
    category: "Home & Kitchen",
    image: "Assets/Products/motion-sensor-trash-cans.jpg"
  },
  
  {
    id: 80,
    name: "360-Degree Rotating Kitchen Organizer - 3 Layers",
    description: "Spice rack with metal construction and high-capacity triple-layer design. Stores seasonings, oils, and more efficiently.",
    price: 46309,
    category: "Home & Kitchen",
    image: "Assets/Products/rotating-kitchen-organizer.jpg"
  },
  
  {
    id: 81,
    name: "14-in-1 Multifunctional Vegetable Chopper and Slicer",
    description: "Kitchen slicer ideal for potatoes, tomatoes, and more. Compact and versatile for home or restaurant use. Plastic build.",
    price: 203196,
    category: "Home & Kitchen",
    image: "Assets/Products/vegetable-chopper.jpg"
  },

  {
    id: 82,
    name: "BioloMix Professional 2200W Blender with Timer & Jar",
    description: "Smart blender with 2L jar, 600ml portable cup, and pre-programmed settings. Smoothie crusher and food processor.",
    price: 331942,
    category: "Home & Kitchen",
    image: "Assets/Products/biolomix-blender.jpg"
  }
];

// random promotions
const promoOptions = [
  { discount: 15, badges: ["Hot Deal"] },
  { discount: 25, badges: ["Clearance"] },
  { discount: 10, badges: ["Limited Stock"] },
  { discount: 30, badges: ["Big Sale"] }
];

// If demo data hasn't been set in this (browser) session, generate and store it
const stored = sessionStorage.getItem("demoProducts");
let storedProducts = stored ? JSON.parse(stored) : [];

// refresh when product count changes
if (!stored || storedProducts.length !== products.length) {
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
  storedProducts = demoProducts;
}

// Load the stored demo product data for consistent rendering
products = storedProducts;

//TODO: IMPLEMENT BACKEND FETCHING