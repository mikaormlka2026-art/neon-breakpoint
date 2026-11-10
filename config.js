export const CFG={
 player:{radius:.19,accel:18,friction:9,maxSpeed:4.9,sprint:1.48,jump:5.4,gravity:14,air:0.48,dashSpeed:10,dashTime:.16,slideTime:.55,slideSpeed:7.3,hp:100},
 weapons:[
 {name:"VANTA",type:"PISTOLET",mag:12,reserve:72,damage:28,rate:.22,reload:1.05,spread:.012,recoil:.012,pellets:1,range:12,color:"#b8fff4",sound:180},
 {name:"BREACH",type:"SHOTGUN",mag:6,reserve:36,damage:13,rate:.72,reload:1.35,spread:.095,recoil:.075,pellets:8,range:8,color:"#ffbd78",sound:95},
 {name:"RIPTIDE",type:"SMG",mag:30,reserve:150,damage:10,rate:.075,reload:1.3,spread:.035,recoil:.022,pellets:1,range:10,color:"#80b8ff",sound:145},
 {name:"ARC-9",type:"FUSIL ÉNERGÉTIQUE",mag:8,reserve:48,damage:48,rate:.55,reload:1.5,spread:.004,recoil:.04,pellets:1,range:16,color:"#c78cff",sound:65}
 ],
 enemy:{runner:{hp:55,speed:2.5,damage:10,range:1.1,rate:.85,color:"#ff5373",radius:.22},gunner:{hp:72,speed:1.25,damage:9,range:7,rate:1.35,color:"#f6a64e",radius:.25},brute:{hp:190,speed:.82,damage:22,range:1.35,rate:1.5,color:"#b17cff",radius:.34},warden:{hp:900,speed:1.05,damage:18,range:9,rate:1.1,color:"#ff416d",radius:.48}},
 camera:{shake:.65}
};
export const MAP=[
"11111111111111111111",
"10000000000000000001",
"10200000100002000001",
"10000000100000000001",
"10001100000000110001",
"10001000020000100001",
"10001000000000100001",
"10000000000000000001",
"10000011101110000001",
"10000010000010000001",
"10000010000010000001",
"10000010000010000001",
"10000000000000000001",
"10002000010000020001",
"10000000010000000001",
"10000000000000000001",
"11111111111111111111"
];
