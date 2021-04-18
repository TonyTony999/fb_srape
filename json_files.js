const fs = require("fs")

//console.log(fs.readFileSync("data.json"))


module.exports = {
  readJson(filename) {
    return (JSON.parse(fs.readFileSync(filename).toString()))
  }
  ,
  saveJSON(filename, new_data) {

    let incoming_data = this.readJson(filename)

    //console.log("stored data is", incoming_data)
    /*new_data.forEach(element => {
      incoming_data.push(element)
      
    });*/
    incoming_data.push(new_data)

    fs.writeFileSync(filename, JSON.stringify(incoming_data), err => {
      console.log("error", err)
    })

  },

  saveJSON_2(filename, new_data) {

    {

      let incoming_data = this.readJson(filename)
      console.log("stored data is", incoming_data)
      new_data.forEach(element => {
        incoming_data.filtered.push(element)

      });

      fs.writeFile(filename, JSON.stringify(incoming_data), err => {
        console.log("error", err)
      })
    }
  }

  //saveJSON("data.json",json_file,new_data  )
}


