
let PRODUCTS = [
  // ── PHYSIOTHERAPY ─────────────────────────────────────────────
  {id:'PT001',name:'Kinesiology Tape',cat:'Physiotherapy',code:'KT-01',price:1500,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Supports and relieves pain in muscles, joints and ligaments. Reduces swelling, increases mobility and aids recovery from sprains, strains and tendonitis.'},
  {id:'PT002',name:'Plaster of Paris Bandage 8"',cat:'Physiotherapy',code:'POP-08',price:120,img:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80',desc:'Bleached cotton cloth coated with Plaster of Paris powder. Widely used for bone fracture management and dislocation correction.'},
  {id:'PT003',name:'Plaster of Paris Bandage 6"',cat:'Physiotherapy',code:'POP-06',price:100,img:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80',desc:'Standard 6-inch POP bandage for orthopaedic applications, fracture management and post-operative immobilisation.'},
  {id:'PT004',name:'Crepe Bandage 6"',cat:'Physiotherapy',code:'CB-06',price:65,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Provides compression and support to limbs and joints. Used to reduce swelling, relieve pain and support weak body parts.'},
  {id:'PT005',name:'Crepe Bandage 4"',cat:'Physiotherapy',code:'CB-04',price:55,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Elastic crepe bandage providing pressure and support for sprains, strains and post-surgical limb compression.'},
  {id:'PT006',name:'Zinc Oxide Strapping 4"',cat:'Physiotherapy',code:'ZOS-04',price:150,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Non-stretch rigid tape providing firm joint support. Ideal for sports injuries and physiotherapy. Durable fabric with strong adhesive.'},
  {id:'PT007',name:'Elastic Cohesive Bandage',cat:'Physiotherapy',code:'ECB-01',price:600,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Self-adhesive bandage that sticks to itself but not to skin or hair. Flexible, stretchy and comfortable for hairy body parts.'},
  {id:'PT008',name:'Thera Band (per metre)',cat:'Physiotherapy',code:'TB-01',price:1200,img:'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80',desc:'Resistance band for injury rehabilitation, improved mobility and athletic performance. Easy to use at clinic, home or on-the-go.'},
  {id:'PT009',name:'Swiss Ball 55cm',cat:'Physiotherapy',code:'SB-55',price:6500,img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',desc:'Large vinyl ball used to strengthen and stretch the body, improving core stability and balance. Essential physiotherapy equipment.'},
  {id:'PT010',name:'Swiss Ball 65cm',cat:'Physiotherapy',code:'SB-65',price:7500,img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',desc:'65cm vinyl exercise ball for core strengthening, balance training and physiotherapy exercises in clinical and home settings.'},
  {id:'PT011',name:'Swiss Ball 75cm',cat:'Physiotherapy',code:'SB-75',price:8500,img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',desc:'Large 75cm Swiss ball for taller individuals. Enhances core stability, posture and balance in therapy and exercise sessions.'},
  {id:'PT012',name:'Balance Board',cat:'Physiotherapy',code:'BB-01',price:8500,img:'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&q=80',desc:'Improves balance, coordination and core stability. Enhances trunk and pelvic girdle stability and strengthens core muscles.'},
  {id:'PT013',name:'Foam Roller',cat:'Physiotherapy',code:'FR-01',price:2500,img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',desc:'Lightweight cylindrical foam roller. Increases flexibility, reduces post-exercise soreness and eliminates muscle knots effectively.'},
  {id:'PT014',name:'TENS Machine',cat:'Physiotherapy',code:'TENS-01',price:5000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Battery-operated transcutaneous electrical nerve stimulation unit for arthritis, fibromyalgia and chronic pain management.'},
  {id:'PT015',name:'TENS Machine 3-in-1',cat:'Physiotherapy',code:'TENS-3IN1',price:13000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Combines TENS, EMS and Massage technologies. Helps manage pain, aids injury rehabilitation and improves muscle performance.'},
  {id:'PT016',name:'TENS Machine with Ultrasound',cat:'Physiotherapy',code:'TENS-US',price:50000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Professional combo electrotherapy machine with ultrasound for advanced physiotherapy treatment in clinical settings.'},
  {id:'PT017',name:'Hydrocollator (30L)',cat:'Physiotherapy',code:'HC-30',price:60000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Stainless steel hot pack warmer maintaining 71–74°C for moist heat therapy. Capacity 30L. Ideal for physiotherapy clinics.'},
  {id:'PT018',name:'Treadmill',cat:'Physiotherapy',code:'TM-01',price:95000,img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',desc:'2.0HP motor, 0.5–12 km/h speed, 1–10% incline. 18 programs, LCD display showing time, distance, pulse, speed and calories.'},
  {id:'PT019',name:'Magnetic Exercise Bicycle',cat:'Physiotherapy',code:'EB-01',price:45000,img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',desc:'Hi-tech magnetic brake system with adjustable tension. Includes hand pulse monitor, smartphone rack and calorie tracker.'},
  {id:'PT020',name:'6-Speed Massage Gun',cat:'Physiotherapy',code:'MG-01',price:6500,img:'https://images.unsplash.com/photo-1600577916048-804c9191e36e?w=400&q=80',desc:'Deep tissue massage gun with 6 speed settings, 2200mAh rechargeable battery. Quiet glide technology, 2100–3600 RPM.'},
  {id:'PT021',name:'Cervical Hot Pack',cat:'Physiotherapy',code:'CHP-01',price:5000,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Moist heat pack for cervical pain relief. Eases sprains, strains, muscle spasms, whiplash and arthritis symptoms effectively.'},
  {id:'PT022',name:'Infrared Physiotherapy Lamp',cat:'Physiotherapy',code:'IPL-01',price:18000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Adjustable infrared lamp with flexible stand and dimmer switch. Provides local heat therapy for pain relief and circulation.'},

  // ── ORTHOPEDIC ────────────────────────────────────────────────
  {id:'OR001',name:'Standard Wheelchair',cat:'Orthopedic',code:'MA809-46',price:12500,img:'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',desc:'Durable standard manual wheelchair with comfortable seating, adjustable footrests and sturdy frame for daily mobility support.'},
  {id:'OR002',name:'Reclining Commode Wheelchair',cat:'Orthopedic',code:'MA609GCU',price:22500,img:'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',desc:'Multi-function reclining wheelchair with integrated commode. Ideal for patients with limited mobility requiring toilet access.'},
  {id:'OR003',name:'Commode Frame Chair',cat:'Orthopedic',code:'MA8941',price:8000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Sturdy commode chair frame with adjustable height and comfortable seating. Essential for patients with limited mobility.'},
  {id:'OR004',name:'Walking Frame with Wheels',cat:'Orthopedic',code:'MA912L',price:5500,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Lightweight wheeled walking frame providing stability and support for elderly and post-surgical rehabilitation patients.'},
  {id:'OR005',name:'Walking Frame Without Wheels',cat:'Orthopedic',code:'MA915L',price:5500,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Standard aluminium walking frame for mobility support during post-operative recovery, stroke rehabilitation or elderly care.'},
  {id:'OR006',name:'Elbow Crutches',cat:'Orthopedic',code:'MA933L',price:2450,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Adjustable forearm crutches with ergonomic grip and arm support. Suitable for long-term use in fracture recovery.'},
  {id:'OR007',name:'Axillary Crutch (Medium)',cat:'Orthopedic',code:'MA925L-M',price:2050,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Standard underarm crutch for short-term mobility assistance post-fracture or surgery. Adjustable height for patient comfort.'},
  {id:'OR008',name:'Shower Chair',cat:'Orthopedic',code:'MA7985LA',price:1350,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Lightweight, rust-resistant shower chair with non-slip feet. Provides safe bathing support for elderly and rehabilitation patients.'},
  {id:'OR009',name:'Airprene Knee Support',cat:'Orthopedic',code:'BK-021',price:1800,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Airprene knee brace providing compression and support for mild to moderate knee instability, arthritis and sports injuries.'},
  {id:'OR010',name:'Superior Airprene Knee Brace ROM',cat:'Orthopedic',code:'BK-022',price:4850,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Range-of-motion knee brace with hinges for post-surgical rehabilitation, ligament injuries and controlled movement recovery.'},
  {id:'OR011',name:'Philadelphia Cervical Collar',cat:'Orthopedic',code:'BC-001',price:2500,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Semi-rigid Philadelphia collar for cervical immobilisation following neck injury, surgery or whiplash trauma management.'},
  {id:'OR012',name:'Breathable Spinal Brace',cat:'Orthopedic',code:'BB-006',price:4550,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Rigid lumbar-sacral support brace for lower back pain, disc herniation and post-vertebral surgery stabilisation.'},
  {id:'OR013',name:'Air Walker Boot',cat:'Orthopedic',code:'BSW-035',price:8500,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Pneumatic walking boot for ankle fractures, sprains and post-surgical foot and ankle immobilisation.'},
  {id:'OR014',name:'Elastic Lumbar Support',cat:'Orthopedic',code:'BB-115',price:2150,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Elastic lumbar back support belt for lower back pain relief, posture correction and light activity support.'},
  {id:'OR015',name:'Silicone Full Insoles',cat:'Orthopedic',code:'BH-014',price:3500,img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',desc:'Full-length silicone insoles providing cushioning and arch support for heel pain, flat feet and diabetic foot care.'},
  {id:'OR016',name:'Thigh High Compression Stocking',cat:'Orthopedic',code:'BW-017',price:2850,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Medical grade compression stockings for DVT prevention, varicose veins and post-surgical venous blood flow support.'},
  {id:'OR017',name:'Abdominal Binder',cat:'Orthopedic',code:'BB-028',price:1300,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Post-operative abdominal binder providing compression and support after abdominal surgery, hernia repair or C-section.'},

  // ── LABORATORY EQUIPMENT ──────────────────────────────────────
  {id:'LB001',name:'Blood Gas Analyzer',cat:'Laboratory',code:'BGA-01',price:900000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Advanced analyser measuring pH, pCO₂, pO₂ and electrolytes from whole blood. Critical for ICU and emergency diagnosis.'},
  {id:'LB002',name:'Haematology Analyzer DH31',cat:'Laboratory',code:'DH31',price:500000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'5-part differential haematology analyser for complete blood count. High throughput, accurate and easy to operate.'},
  {id:'LB003',name:'Chemistry Analyzer — Fully Auto AS120',cat:'Laboratory',code:'AS120',price:1100000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Fully automated biochemistry analyser for comprehensive metabolic panels, liver function, renal function and lipid profiles.'},
  {id:'LB004',name:'Chemistry Analyzer — Semi Auto',cat:'Laboratory',code:'CHEM-SA',price:210000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Semi-automated biochemistry analyser for glucose, creatinine, urea, bilirubin and other chemistry tests.'},
  {id:'LB005',name:'Electrolyte Analyzer EL120',cat:'Laboratory',code:'EL120',price:320000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'ISE-based electrolyte analyser measuring Na⁺, K⁺, Cl⁻, Ca²⁺ and pH rapidly with minimal sample volume.'},
  {id:'LB006',name:'Coagulation Analyzer',cat:'Laboratory',code:'CA-01',price:200000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Measures PT, APTT, TT and fibrinogen for monitoring anticoagulation therapy and bleeding disorders.'},
  {id:'LB007',name:'Binocular Microscope X07',cat:'Laboratory',code:'X07',price:24000,img:'https://images.unsplash.com/photo-1606206591513-adbfbba4d93b?w=400&q=80',desc:'High-quality binocular microscope with 4x, 10x, 40x and 100x oil objectives. Essential for haematology and microbiology.'},
  {id:'LB008',name:'Urine Analyzer HYSI20',cat:'Laboratory',code:'HYSI20',price:120000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Automated urine chemistry analyser reading 10+ parameters from test strips with rapid, accurate results.'},
  {id:'LB009',name:'Blood Bank Refrigerator',cat:'Laboratory',code:'BBR-01',price:550000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Dedicated blood bank refrigerator maintaining precise 4°C temperature for safe blood product storage and supply.'},
  {id:'LB010',name:'Laboratory Refrigerator',cat:'Laboratory',code:'LR-01',price:85000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Medical-grade laboratory refrigerator for reagent, sample and vaccine storage at controlled temperatures.'},
  {id:'LB011',name:'Biosafety Cabinet Class II A2',cat:'Laboratory',code:'BSC-IIA2',price:850000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Class II Type A2 biological safety cabinet providing personnel, product and environmental protection for lab work.'},
  {id:'LB012',name:'Centrifuge — 12 Tubes',cat:'Laboratory',code:'CF-12',price:15000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Bench-top centrifuge with 12-tube capacity. Variable speed for blood separation, urinalysis and other lab applications.'},
  {id:'LB013',name:'Centrifuge — 6 Tubes',cat:'Laboratory',code:'CF-06',price:8500,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Compact 6-tube centrifuge ideal for small laboratories, clinics and remote settings requiring basic separation.'},
  {id:'LB014',name:'Autoclave Machine 18L',cat:'Laboratory',code:'AC-18',price:18500,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'18-litre table-top autoclave for sterilisation of instruments, media and laboratory consumables at 121°C/134°C.'},
  {id:'LB015',name:'Phlebotomy Chair',cat:'Laboratory',code:'PBC-01',price:32000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Ergonomic phlebotomy chair with adjustable arm rest for blood collection. Comfortable and safe for patients and staff.'},
  {id:'LB016',name:'Biotime Immunoassay Analyzer',cat:'Laboratory',code:'BIA-01',price:150000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Rapid immunoassay analyser for hormones, tumour markers, infectious disease serology and cardiac biomarkers.'},
  {id:'LB017',name:'Water Bath 15 Litres',cat:'Laboratory',code:'WB-15',price:19000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Digital thermostat water bath for incubation, thawing blood products and temperature-controlled lab procedures.'},
  {id:'LB018',name:'Dry Chemistry Analyzer SDI',cat:'Laboratory',code:'SDI-01',price:550000,img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',desc:'Point-of-care dry chemistry analyser for rapid metabolic testing without liquid reagents. Ideal for clinics and POC settings.'},

  // ── LAB CONSUMABLES & RAPID KITS ─────────────────────────────
  {id:'LC001',name:'Malaria Rapid Test (PF) 25s',cat:'Lab Consumables',code:'MAL-PF25',price:1200,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Rapid diagnostic cassette for Plasmodium falciparum antigen detection in whole blood. Results in 15 minutes.'},
  {id:'LC002',name:'Hepatitis B Surface Ag Strips 50s',cat:'Lab Consumables',code:'HBSAG-50',price:1200,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Rapid immunochromatographic test for HBsAg detection in serum or plasma. High sensitivity and specificity.'},
  {id:'LC003',name:'Pregnancy Test Strips 50s',cat:'Lab Consumables',code:'PREG-50',price:400,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Urine hCG detection strips for early pregnancy diagnosis. Highly sensitive, rapid results within 3 minutes.'},
  {id:'LC004',name:'Urinalysis Strips (10 Para) 100s',cat:'Lab Consumables',code:'URS-100',price:700,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'10-parameter urine test strips for glucose, protein, pH, blood, leukocytes, nitrites, ketones and more.'},
  {id:'LC005',name:'H. Pylori Ag Cassette (Stool) 25s',cat:'Lab Consumables',code:'HP-AG25',price:2800,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Rapid stool antigen test for H. pylori detection. Non-invasive, accurate and easy to perform.'},
  {id:'LC006',name:'Vacutainer Purple EDTA 4ml 100s',cat:'Lab Consumables',code:'VAC-EDTA',price:650,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'EDTA-coated evacuated blood collection tubes for haematology and molecular testing.'},
  {id:'LC007',name:'On Call Plus Glucometer',cat:'Lab Consumables',code:'GLU-01',price:1700,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Point-of-care blood glucose monitor with accurate readings within 5 seconds using minimal blood sample.'},
  {id:'LC008',name:'On Call Plus Strips 50s',cat:'Lab Consumables',code:'GLU-STR50',price:900,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Compatible test strips for On Call Plus glucometer. 50 strips per box for routine glucose monitoring.'},
  {id:'LC009',name:'Dengue IgG/IgM/NS1 Cassette 25s',cat:'Lab Consumables',code:'DEN-25',price:5500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Triple combo rapid test detecting dengue IgG, IgM and NS1 antigen simultaneously in whole blood.'},
  {id:'LC010',name:'Pap Smear Kit 25s',cat:'Lab Consumables',code:'PAP-25',price:4500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Complete Pap smear collection kit for cervical cancer screening. Includes spatula, cytobrush and fixative.'},

  // ── OPTICAL EQUIPMENT ─────────────────────────────────────────
  {id:'OP001',name:'Auto Refractometer RM 9000',cat:'Optical',code:'RM9000',price:377000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'OPTIK Auto Refractometer for objective measurement of refractive errors. CE and FDA registered. Precise and fast.'},
  {id:'OP002',name:'Auto Refractometer KR 9000',cat:'Optical',code:'KR9000',price:435000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Combined auto refractometer and keratometer for measuring refractive errors and corneal curvature.'},
  {id:'OP003',name:'Zeiss Visue 100',cat:'Optical',code:'ZEISS-V100',price:1740000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Premium ZEISS portable refractor combining auto-refraction and visual acuity testing in a single ergonomic device.'},
  {id:'OP004',name:'Slit Lamp 3 Step',cat:'Optical',code:'SL-3S',price:282750,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'3-step magnification slit lamp for anterior and posterior eye segment examination. Precise illumination and optics.'},
  {id:'OP005',name:'Slit Lamp 5 Step',cat:'Optical',code:'SL-5S',price:529250,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'5-step slit lamp biomicroscope for detailed cornea, lens, vitreous and fundus examination in clinical settings.'},
  {id:'OP006',name:'Auto Lensometer',cat:'Optical',code:'ALM-01',price:195750,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Automated lensometer for measuring the prescription of existing spectacle lenses with high accuracy and speed.'},
  {id:'OP007',name:'Streak Retinoscope MK YZ24B',cat:'Optical',code:'YZ24B',price:72500,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Streak retinoscope for objective refraction assessment in all ages including pre-verbal children and special needs.'},
  {id:'OP008',name:'Tonometer (Tonopen)',cat:'Optical',code:'TONO-01',price:507500,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Handheld Tonopen for intraocular pressure measurement. Essential for glaucoma screening and monitoring.'},
  {id:'OP009',name:'Trial Set Box (232 pcs)',cat:'Optical',code:'TSB-232',price:38425,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Complete trial lens set with 232 pieces in a carrying case. Used for subjective refraction and spectacle prescription.'},
  {id:'OP010',name:'Phoropter Manual',cat:'Optical',code:'PHOR-M',price:319000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Manual phoropter (refractor head) for subjective refraction, visual acuity assessment and binocular vision testing.'},
  {id:'OP011',name:'LED Chart 5M',cat:'Optical',code:'LED-5M',price:29000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'LED-backlit visual acuity chart for 5-metre testing distance. Multiple optotype charts for comprehensive assessment.'},
  {id:'OP012',name:'TCS-880 Ophthalmic Unit',cat:'Optical',code:'TCS880',price:797500,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Complete ophthalmic examination unit combining slit lamp, refraction table and chair for comprehensive eye care.'},

  // ── MORTUARY EQUIPMENT ────────────────────────────────────────
  {id:'MO001',name:'9-Body Morgue Freezer',cat:'Mortuary',code:'MF-9B',price:1800000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'9-body mortuary refrigerator. Temperature range 5 to -10°C, direct cooling, 220V/50-60Hz, 2610W. Dimensions: 2300×2360×1785mm.'},
  {id:'MO002',name:'Body Lifter (Standard 225kg)',cat:'Mortuary',code:'BL-225',price:350000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Standard mortuary body lifter with 225kg load rating. Compatible with Nuline mortuary fridges and freezers.'},
  {id:'MO003',name:'Embalming Machine',cat:'Mortuary',code:'EM-01',price:150000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Electric embalming machine for injecting formaldehyde solution at high speed. Cabinet-mounted with castor wheels for mobility.'},
  {id:'MO004',name:'Autopsy Table',cat:'Mortuary',code:'AT-01',price:120000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Stainless steel autopsy table available mobile or stationary. May include downdraft ventilation and integrated autopsy sink.'},
  {id:'MO005',name:'Mortuary Trolley',cat:'Mortuary',code:'MT-01',price:75000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Medical grade stainless steel mortuary trolley for body transport within hospital and morgue. Available with or without cover.'},
  {id:'MO006',name:'Autopsy Kit / Set',cat:'Mortuary',code:'AK-01',price:87000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Complete autopsy instrument set including scalpel, PM40 knife, forceps, ladles, organ knife and enterotome scissors.'},
  {id:'MO007',name:'Casket Lowering Gear',cat:'Mortuary',code:'CLG-01',price:280000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Telescopic casket lowering device extending 62"×25" to 94"×38". Unique braking system for constant controlled lowering.'},

  // ── THEATRE EQUIPMENT ─────────────────────────────────────────
  {id:'TH001',name:'Anesthesia Machine — Superstar S6100D',cat:'Theatre',code:'S6100D',price:1200000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'Professional anesthesia machine with vaporizer, ventilator and monitoring capabilities for surgical theatre use.'},
  {id:'TH002',name:'Anesthesia Machine — Mindray Wato 35',cat:'Theatre',code:'WATO35',price:3000000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'Advanced Mindray Wato 35 anaesthesia workstation with integrated monitoring, ventilation and gas delivery.'},
  {id:'TH003',name:'Electric Operating Table (Elektro)',cat:'Theatre',code:'OT-EL',price:560000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'Electrically adjustable operating table with multiple positioning modes for all surgical specialities.'},
  {id:'TH004',name:'LED Theatre Light — Double Arm Ceiling',cat:'Theatre',code:'TL-DA',price:435000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'Dual-arm ceiling-mounted LED surgical light providing shadow-free illumination across the operative field.'},
  {id:'TH005',name:'Patient Monitor — 5 Parameter (Contec)',cat:'Theatre',code:'CMS9000',price:95000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'5-parameter bedside monitor measuring ECG, SpO₂, NIBP, temperature and respiration with alarm system.'},
  {id:'TH006',name:'Patient Monitor — 7 Parameter (Mindray)',cat:'Theatre',code:'MR-7P',price:750000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'7-parameter Mindray patient monitor with advanced waveforms, trends and connectivity for ICU/theatre use.'},
  {id:'TH007',name:'Defibrillator — Mindray BeneHeart D6',cat:'Theatre',code:'D6',price:750000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'Professional defibrillator/AED with manual override, pacing and monitoring for emergency resuscitation.'},
  {id:'TH008',name:'Diathermy Machine 400W',cat:'Theatre',code:'DTH-400',price:260000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'400-watt electrosurgical unit for cutting and coagulation. Precise power control for safe surgical procedures.'},
  {id:'TH009',name:'Autoclave 50L',cat:'Theatre',code:'AC-50',price:180000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'50-litre pre-vacuum autoclave for sterilisation of surgical instruments, linen and porous loads at 134°C.'},
  {id:'TH010',name:'Ventilator S1100',cat:'Theatre',code:'S1100',price:1650000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'ICU/theatre ventilator with volume and pressure control modes, waveform display and alarm system for adult and paediatric use.'},
  {id:'TH011',name:'Crash Cart',cat:'Theatre',code:'CC-01',price:75000,img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',desc:'Fully equipped crash cart with drawers for emergency medications, airway management and resuscitation equipment.'},
  {id:'TH012',name:'Suction Machine — 2 Bottle (Yuwell)',cat:'Theatre',code:'YW-2B',price:22000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Electric two-bottle suction machine for surgical aspiration, wound drainage and airway secretion removal.'},

  // ── HOSPITAL FURNITURE & WARD ─────────────────────────────────
  {id:'HW001',name:'Single Crank ABS Hospital Bed',cat:'Hospital Furniture',code:'HB-ABS1',price:24000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Single crank ABS panel hospital bed with side rails. Durable, easy to clean and suitable for general wards.'},
  {id:'HW002',name:'5-Function Electric Hospital Bed',cat:'Hospital Furniture',code:'HB-5F',price:220000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'5-function electric hospital bed with backrest, knee rest, height and Trendelenburg adjustment for ICU/ward use.'},
  {id:'HW003',name:'Baby Incubator',cat:'Hospital Furniture',code:'BI-01',price:248000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Neonatal incubator with precise temperature, humidity and oxygen control for premature and low-birth-weight infants.'},
  {id:'HW004',name:'Baby Warmer / Resuscitaire',cat:'Hospital Furniture',code:'BW-01',price:240000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'Radiant warmer for neonatal resuscitation and stabilisation. Open access design for clinical interventions.'},
  {id:'HW005',name:'Examination Couch',cat:'Hospital Furniture',code:'EC-01',price:10500,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Padded examination couch with adjustable backrest. Vinyl upholstered for easy cleaning and infection control.'},
  {id:'HW006',name:'Drip Stand',cat:'Hospital Furniture',code:'DS-01',price:3500,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Adjustable height IV drip stand with 4-hook top and 5-wheel base for stability and mobility.'},
  {id:'HW007',name:'Oxygen Concentrator 5L',cat:'Hospital Furniture',code:'OC-5L',price:75000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'5-litre single flow oxygen concentrator delivering 93%±3% pure oxygen for COPD, respiratory support and clinical use.'},
  {id:'HW008',name:'Oxygen Concentrator 10L',cat:'Hospital Furniture',code:'OC-10L',price:115000,img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',desc:'10-litre dual flow oxygen concentrator for two patients simultaneously. Low noise, energy efficient operation.'},
  {id:'HW009',name:'Delivery Bed (Manual)',cat:'Hospital Furniture',code:'DB-MAN',price:28000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'Manual delivery bed with leg rests and adjustable backrest for obstetric and gynaecological procedures.'},
  {id:'HW010',name:'Bedside Cabinet (ABS)',cat:'Hospital Furniture',code:'BC-ABS',price:9000,img:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',desc:'ABS plastic bedside cabinet with drawer and lower shelf for patient personal items storage.'},

  // ── SURGICAL INSTRUMENTS ──────────────────────────────────────
  {id:'SI001',name:'Major Cesarean Set',cat:'Surgical Instruments',code:'MCS-01',price:45000,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Complete set of sterilised instruments for major caesarean section including forceps, scissors, retractors and needle holders.'},
  {id:'SI002',name:'Major General Surgical Set',cat:'Surgical Instruments',code:'MGS-01',price:65000,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Comprehensive general surgery instrument set with Spencer Wells forceps, Mayo scissors, retractors and sponge holders.'},
  {id:'SI003',name:'Minor General Surgical Set',cat:'Surgical Instruments',code:'MINS-01',price:55000,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Minor general surgery set including needle holder, scissors, forceps and instrument tray for clinic procedures.'},
  {id:'SI004',name:'Laparotomy Instrument Set',cat:'Surgical Instruments',code:'LAP-01',price:45000,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Complete laparotomy set including Balfour retractor, bowel clamps, Yankauer suction, Metzenbaum scissors and instrument tray.'},
  {id:'SI005',name:'Major Delivery Set',cat:'Surgical Instruments',code:'MDS-01',price:15800,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Full major delivery instrument set including scissors, forceps, specula, needle holder, rubber mackintosh sheet and tray.'},
  {id:'SI006',name:'Minor Delivery Set',cat:'Surgical Instruments',code:'MINDS-01',price:6500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Minor delivery set with episiotomy scissors, kocher forceps, sponge holders, specula and instrument tray.'},
  {id:'SI007',name:'D&C Set',cat:'Surgical Instruments',code:'DNC-01',price:8500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Dilation and curettage instrument set including uterine sound, Hegar dilators, curettes, Vulsellum forceps and tray.'},
  {id:'SI008',name:'Dressing Set',cat:'Surgical Instruments',code:'DRS-01',price:4500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Standard wound dressing set with scissors, forceps, sponge holder and tray for outpatient wound care.'},
  {id:'SI009',name:'Suture Set',cat:'Surgical Instruments',code:'SUT-01',price:4500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Suture instrument set including needle holder, scissors, forceps, kidney dish and gallipot.'},
  {id:'SI010',name:'IUCD Insertion Pack',cat:'Surgical Instruments',code:'IUCD-01',price:6500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Complete IUCD insertion instrument pack with uterine sound, speculum, sponge forceps, scissors and instrument tray.'},

  // ── CONSUMABLES ──────────────────────────────────────────────
  {id:'CO001',name:'Normal Saline 500ml',cat:'Consumables',code:'NS-500',price:75,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'0.9% sodium chloride intravenous infusion for fluid replacement, drug dilution and wound irrigation.'},
  {id:'CO002',name:'Dextrose 5% 500ml',cat:'Consumables',code:'D5-500',price:95,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'5% dextrose IV infusion providing glucose supplementation and fluid maintenance in hospital settings.'},
  {id:'CO003',name:'Ringers Lactate 500ml',cat:'Consumables',code:'RL-500',price:75,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Balanced crystalloid IV solution for volume replacement in dehydration, trauma and surgical fluid management.'},
  {id:'CO004',name:'IV Giving Set 25s',cat:'Consumables',code:'IVS-25',price:450,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Sterile disposable IV administration set with drip chamber and flow regulator. Box of 25 sets.'},
  {id:'CO005',name:'Latex Examination Gloves (Medium)',cat:'Consumables',code:'EG-M',price:350,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Powder-free latex examination gloves providing protection during clinical examinations and procedures.'},
  {id:'CO006',name:'2cc Syringes Without Needle 100s',cat:'Consumables',code:'SYR-2',price:450,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Sterile 2ml disposable syringes with Luer slip tip. Latex-free. Box of 100 units.'},
  {id:'CO007',name:'10cc Syringes Without Needle 100s',cat:'Consumables',code:'SYR-10',price:650,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Sterile 10ml disposable syringes. Latex-free Luer slip tip. Box of 100 for blood collection and medication administration.'},
  {id:'CO008',name:'Foley Catheter FR16 (each)',cat:'Consumables',code:'FOL-16',price:75,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'2-way Foley urinary catheter size FR16. Latex with silicone coating, 10ml balloon. Single sterile pack.'},
  {id:'CO009',name:'Brannula G18 Green 100s',cat:'Consumables',code:'IV-G18',price:1400,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'18G IV cannula (green) for blood transfusion and fluid therapy. Safety designed with injection port. Box of 100.'},
  {id:'CO010',name:'Povidone Iodine 5 Litres',cat:'Consumables',code:'PI-5L',price:3000,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'10% povidone iodine antiseptic solution for wound care, skin preparation and surgical scrubbing.'},
  {id:'CO011',name:'Nylon Suture 2/0 RC (Dozen)',cat:'Consumables',code:'SUT-NYL',price:500,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Non-absorbable nylon suture 2/0 on round-bodied needle. Ideal for skin closure, tendon and general surgery.'},
  {id:'CO012',name:'Oxygen Mask Adult',cat:'Consumables',code:'OM-AD',price:140,img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',desc:'Disposable adult oxygen therapy mask with elastic strap and adjustable nose piece for supplemental oxygen delivery.'},
];


const S = window.MedCoreSecurity;
let ALL_CATS = ['All', ...new Set(PRODUCTS.map((p) => p.cat))];
let activeCategory = 'All';
let searchQuery = '';
function fmt(n){return 'KES '+Number(n).toLocaleString('en-KE');}
function productText(product, key){ return String(product[key] || ''); }
function buildCatTabs(){
  const el = document.getElementById('catTabs');
  S.clear(el);
  ALL_CATS.forEach((category) => {
    const count = category === 'All' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === category).length;
    const btn = S.el('button', { className: `cat-btn${category === activeCategory ? ' active' : ''}`, type: 'button', text: category });
    const badge = S.el('span', { className: 'cat-count', text: count });
    btn.append(badge);
    btn.addEventListener('click', () => setCategory(category));
    el.append(btn);
  });
}
function setCategory(category){ activeCategory = category; buildCatTabs(); renderProducts(); }
function filterProducts(){ searchQuery = document.getElementById('searchInput').value.toLowerCase(); renderProducts(); }
function renderProducts(){
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');
  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'All' || p.cat === activeCategory;
    const haystack = [p.name, p.cat, p.code, p.desc].map((v) => String(v || '').toLowerCase()).join(' ');
    return matchCat && (!searchQuery || haystack.includes(searchQuery));
  });
  document.getElementById('resultsCount').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
  if (!filtered.length) { grid.style.display='none'; empty.style.display='block'; return; }
  grid.style.display='grid'; empty.style.display='none'; S.clear(grid);
  filtered.forEach((p) => {
    const card = S.el('div', { className: 'prod-card' });
    const imgWrap = S.el('div', { className: 'prod-img' });
    const img = S.el('img', { alt: productText(p, 'name'), loading: 'lazy' });
    if (S.isValid(p.img, 'url')) img.src = p.img;
    const fallback = S.el('div', { className: 'prod-img-fallback', text: '🏥' });
    fallback.style.display = 'none';
    img.addEventListener('error', () => { img.style.display = 'none'; fallback.style.display = 'flex'; });
    imgWrap.append(img, fallback, S.el('span', { className: 'cat-badge', text: productText(p, 'cat') }));
    const body = S.el('div', { className: 'prod-body' });
    body.append(S.el('div', { className: 'prod-name', text: productText(p, 'name') }), S.el('div', { className: 'prod-desc', text: productText(p, 'desc') }));
    const footer = S.el('div', { className: 'prod-footer' });
    const details = S.el('div');
    const price = S.el('div', { className: 'prod-price', text: fmt(p.price) });
    price.append(S.el('small', { text: '/unit' }));
    details.append(price, S.el('div', { className: 'prod-code', text: productText(p, 'code') }));
    footer.append(details, S.el('a', { className: 'btn-quote', href: 'medcore-quote.html', text: 'Quote →' }));
    body.append(footer); card.append(imgWrap, body); grid.append(card);
  });
}
async function loadManagedProducts(){
  try{
    const res = await fetch('/api/products');
    if(!res.ok) return;
    const managedProducts = await res.json();
    if(Array.isArray(managedProducts) && managedProducts.length){
      PRODUCTS = managedProducts.map((p) => ({ id:p.id, name:p.name, cat:p.cat || p.category, code:p.code, price:p.price, img:p.img || p.imageUrl, desc:p.desc || p.description }));
      ALL_CATS = ['All', ...new Set(PRODUCTS.map((p)=>p.cat))];
    }
  }catch(error){ console.info('Using embedded product catalogue fallback.', error); }
}
async function initProducts(){ await loadManagedProducts(); buildCatTabs(); renderProducts(); }
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput')?.addEventListener('input', filterProducts);
  document.getElementById('btt')?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  const btt=document.getElementById('btt');
  window.addEventListener('scroll',()=>btt.classList.toggle('visible',window.scrollY>300));
  initProducts();
});
