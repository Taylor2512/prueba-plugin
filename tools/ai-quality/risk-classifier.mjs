const flags = new Set(process.argv.slice(2));
const weights = {canvas:2,snapshot:2,publicApi:2,security:2,manyFiles:1,noTests:1,multiDomain:1,vendor:1};
let score=0; for(const [k,v] of Object.entries(weights)) if(flags.has(k)) score+=v;
const cls=score<=2?"R0":score<=4?"R1":score<=7?"R2":"R3";
console.log(JSON.stringify({score,class:cls},null,2));
