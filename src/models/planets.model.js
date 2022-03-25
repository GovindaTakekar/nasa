const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse"); 

const isHabbitablePlanets = [];

function isHabbitable(planet){
    return planet["koi_disposition"] === "CONFIRMED" && planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11 && planet["koi_prad"] < 1.6 ;
}

function loadPlanetsData(){

   return new Promise((resolve , reject) => {
       fs.createReadStream(path.join(__dirname ,"..", ".." ,"data", "kepler_data.csv"))
         .pipe(parse({
             comment: "#",
             columns: true
         }))
         .on("data" , (data)=>{
             if(isHabbitable(data)){
                 isHabbitablePlanets.push({
                     kepler_name: data["kepler_name"],
                     isConfirmed : data["koi_disposition"],
                     flux : data["koi_insol"],
                     prad: data["koi_prad"]
                 });
             }
         })
         .on("error" , (err)=>{
             console.log(err);
             reject(err);
         })
         .on('end' , ()=>{ 
             console.log(`the total ${isHabbitablePlanets.length} planet is found !! `);
             resolve();
         });
       
         parse();
});
       
}

  module.exports = {
      loadPlanetsData,
      planets : isHabbitablePlanets,
  }


