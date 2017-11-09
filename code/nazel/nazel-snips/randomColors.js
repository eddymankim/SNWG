// function randomColorReturn (){
export default function colorName(){
let colorCodes = [
0x0040ff,
0x9d2d74,
0xcbc14f,
0x31a3f7,
0x913c41,
0xa25a2a,
0x581850
]
  return colorCodes[Math.floor(Math.random() * colorCodes.length)]
}
