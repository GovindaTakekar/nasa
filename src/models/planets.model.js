const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const isHabbitablePlanets = [];

function isHabbitable(planet){
    return planet["koi_disposition"] === "CONFIRMED" && planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11;
}

function loadPlanetsData(){
    return new Promise((resolve , rejects) => {
      fs.createReadStream(path.join(__dirname , ".." , ".." , "data" , "kepler_data.csv"))
        .pipe(parse({
          comment: '#',
          columns: true
       }))
        .on("data" , (data)=>{
            if(isHabbitable(data)){
                isHabbitablePlanets.push({
                    kepler_name : data['kepler_name'],
                });
            }
        })
        .on("error" , (err)=>{
            console.log(err);
            rejects(err);
        })
        .on("end" , ()=>{
            console.log(`total ${isHabbitablePlanets.length} planets found`);
            resolve();
        });

        parse();

});
}



module.exports = {
    loadPlanetsData,
    planets : isHabbitablePlanets,
}
