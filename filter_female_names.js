const json_files=require("./json_files.js");

let obj=json_files.readJson("./female_names_2.json")

console.log(obj.length)

/*obj.forEach((element,index) => {
    if(index<100){
        console.log(element)
    }
});*/

let filtered=obj.filter((element)=>{
    return element.mean_age<35 && element.mean_age>18
}).sort(function(a,b){
    return b.frequency-a.frequency
})

json_files.saveJSON_2("filtered_female_3.json", filtered)



console.log(filtered.length)
console.log(filtered)