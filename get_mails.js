const puppet = require("puppeteer");
require("dotenv").config();
const fs = require("fs");
const json_files = require("./json_files");
const axios=require("axios");


(async () => {

    var results = []

    const browser = await puppet.launch({
        headless: false
    })
    const page = await browser.newPage();

    const dimensions = await page.evaluate(() => {
        return {
            width: 960,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        };
    });

    await page.goto("http://correo.uniandes.edu.co")
    await page.waitFor(5000)
    await page.type("#i0116", process.env.USERN_)
    await page.waitFor(5000)
    await page.click("#idSIButton9")
    //await page.waitFor(15000)
    //await page.click("#idSIButton9")
    await page.waitFor(5000)
    await page.type("#i0118", process.env.PASS)
    await page.waitFor(5000)
    await page.click("#idSIButton9")
    await page.waitFor(5000)
    await page.goto("https://uniandeseduco.workplace.com")
    await page.waitFor(10000)
    await page.type(".inputtext", process.env.USERN_)
    await page.waitFor(8000)
    await page.click("[data-testid='next_button']")
    await page.waitFor(5000)
    //await page.click("[href='https://uniandeseduco.workplace.com/groups/1818489305057615/']")
    await page.goto("https://uniandeseduco.workplace.com/groups/1818489305057615/members")
    // await page.type("div.n1l5q3vz input", "ana maria")
    await page.waitFor(5000)


    let girls_names = json_files.readJson("updated.json")
    girls_names=girls_names.slice(2196,2396) 

    let i=1
    let e_array=[]
    let admin_array=[]

    var timer=setInterval(async()=>{
        if(i===girls_names.length){
            
            //console.log(e_array)
            console.log(e_array)
            console.log(admin_array)
            console.log("e_array length is: ",e_array.length)
            console.log("admin array length is: ",admin_array.length)
            console.log("process ended")
            clearInterval(timer)
            
        }
        else{

            let margin;

            setTimeout(async()=>{

            console.log(margin)

            await page.goto(girls_names[i].link)
            await page.waitFor(3000)

            let dat_b= await page.$$eval("div.lenub8rc >ul>li", element=>element.map(elem=>{   
                    if(elem.innerText){
                        return elem.innerText
                    }
            }))

            dat_b=dat_b.filter(element=>{
                if(element){
                    return element
                }
            })

            if(dat_b && dat_b.length<=6){
                if(dat_b && dat_b.length!==0){

                    for(let j=0;j<dat_b.length;j++){
                      if(dat_b[j] && dat_b[j].toString().match(/@uniandes.edu.co/)){
                          let regex=/\w+.\w+@uniandes.edu.co/
                          let rege_match=dat_b[j].match(regex)
                          if(rege_match && rege_match.length!==0){
                              e_array.push( {name:girls_names[i].name,email:rege_match[0], url:girls_names[i].link,info:dat_b } )
                              json_files.saveJSON("processed.json", {name:girls_names[i].name,email:rege_match[0],url:girls_names[i].link})
                              break
                          }                   
                       }
                    }
                    console.log(dat_b)
                    //console.log("arr length :",dat_b.length)

                }
            }

            else if(dat_b && dat_b.length>6){
                for(let j=0;j<dat_b.length;j++){
                    if(dat_b[j] && dat_b[j].toString().match(/@uniandes.edu.co/)){
                        let regex=/\w+.\w+@uniandes.edu.co/
                        let rege_match=dat_b[j].match(regex)
                        if(rege_match && rege_match.length!==0){
                            admin_array.push( {name:girls_names[i].name,email:rege_match[0],info:dat_b } )
                            json_files.saveJSON("admin.json", {name:girls_names[i].name,email:rege_match[0],url:girls_names[i].link,info:dat_b})
                            break
                        }                   
                     }
                  }
                  console.log(dat_b)
                  //console.log("arr length :",dat_b.length)

            }
          

              },2000+margin)

            margin=Math.ceil(Math.random()*2000)

            console.log(e_array)
            i++
        }
       
    }, 10000)


})()
