const json_files = require("./json_files.js");
const fs = require("fs")

let arr = json_files.readJson("data.json")
let arr_2 = json_files.readJson("female_names_2.json")
let arr_3 = json_files.readJson("updated.json")
let arr_4 = json_files.readJson("filtered_female.json")
//arr=arr.all_files

let new_arr = []
let new_list = [{ name: "init", link: "init" }]
let processed_ = json_files.readJson("processed.json")
let admin_ = json_files.readJson("admin.json")
let people=json_files.readJson("POLITECNICO/people.json")
let kitties=json_files.readJson("POLITECNICO/kittys.json")

/*arr.forEach(element => {
    if(element && element.name && element.name!==null){
      new_arr.push(element)
     // console.log(element)
    }
    
});*/

/*for(let i=0;i<arr.length;i++){
  for(let j=0;j<new_list.length;j++){
    if(arr[i].link===new_list[j].link){
      break
    }
    if(j===new_list.length-1){
      new_list.push(arr[i])
      //console.log("new_arr.length is : ",new_arr.length)
    }
  }
}
fs.writeFile("updated.json", JSON.stringify(new_list), err => {
  console.log("error", err)
})*/


/*
fs.writeFile("data.json", JSON.stringify(new_arr), err => {
    console.log("error", err)
  })*/

/*
arr_2.forEach((element,index)=>{
  if(element.name==="MELISSA"){
    console.log("ndexxx : ", index)
  }
})*/


let file_to_read = fs.readFileSync("female_names_3.json")
let parse = JSON.parse(file_to_read)



//console.log(processed_.length)
//console.log(parse.length)

//console.log(parse.findIndex( elem=>elem.name ==="CARMEN" ))
//console.log(arr_3.slice(2196,2396))

//json_files.saveJSON("POLITECNICO/people.json", ({ name: "alex", url: "turner" }))

console.log("people:",people.length)

console.log("kitties:",kitties.length)

