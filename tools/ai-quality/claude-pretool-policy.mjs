let input="";process.stdin.setEncoding("utf8");process.stdin.on("data",d=>input+=d);process.stdin.on("end",()=>{
 const blocked=[/rm\s+-rf\s+\//,/git\s+reset\s+--hard/,/git\s+clean\s+-fd/];
 if(blocked.some(r=>r.test(input))){console.error("Blocked destructive operation.");process.exit(2);}
 process.exit(0);
});
