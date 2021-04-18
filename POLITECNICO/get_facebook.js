const puppet = require("puppeteer");
require("dotenv").config();
const fs = require("fs");
const json_files = require("../json_files");


(async () => {

    const browser = await puppet.launch({
        headless: false
    })

    const context = browser.defaultBrowserContext();
    //        URL                  An array of permissions
    context.overridePermissions("https://www.facebook.com", ["geolocation", "notifications"]);

    const page = await browser.newPage();

    const dimensions = await page.evaluate(() => {
        return {
            width: 1200,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        };
    });

    await page.goto("https://www.facebook.com")
    await page.waitFor(5000)
    await page.type("input[name='email']", process.env.FB_USERN)
    await page.waitFor(5000)
    await page.type("input[ type='password']", process.env.FB_PASS)
    await page.waitFor(5000)
    await page.click("button[name ='login']")
    await page.waitFor(5000)


    let girls_names = json_files.readJson("../female_names_3.json")
    let people = json_files.readJson("people.json")
    let global_count = json_files.readJson("global_count.json")

    let count = global_count.count

    var global_timer = setInterval(async () => {

        if (count === people.length) {
            console.log("process finished")
            clearInterval(global_timer)
        }
        else {

            await page.goto(people[count].url)
            await page.waitFor(3000)
            let name_2 = people[count].name.split(" ")[0]
            let is_girl = girls_names.some((elem) => elem.name === name_2.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase())
            let details = await page.evaluate((selector) => {


                let x = document.getElementsByClassName("sej5wr8e")
                let details_1 = x[0].getElementsByTagName("ul")[0]
                if (details_1) {
                    details_1 = details_1.childNodes
                    console.log(x)
                    //console.log("details",details_1[0)
                    console.log("details", details_1)
                    return Array.from(details_1).map(elem_4 => elem_4.textContent)

                } else {
                    return ("none")
                }

            })
            await page.waitFor(1000)
            //console.log(details)

            setTimeout(async () => {
                await call_timers(is_girl, people[count].url, people[count].name, details)
               
                fs.writeFileSync("global_count.json", JSON.stringify({ count: count }), err => {
                    console.log("error", err)
                })

                count++

            }, Math.ceil(Math.random() * 3000))

          
        }


    }, 70000)

    async function scrape_photos(url, name, info) {

        return await new Promise(async function (resolve, reject) {

            const photo_page = await page.evaluate((selector) => {

                let x = document.querySelectorAll(".sjgh65i0")
                let lnks = (x[1].getElementsByTagName("a"))

                return Array.from(lnks).map(elem => elem.getAttribute("href"))
            })

            await page.goto(photo_page[0])
            await page.waitFor(1000)

            let photo_links = await page.evaluate((selector) => {

                let links = document.getElementsByTagName("a")
                //console.log(links)
                return Array.from(links).map(element => element.getAttribute("href")).filter(elem_2 => {
                    if (elem_2) {
                        if (/&type=3/.test(elem_2)) {
                            return elem_2
                        }
                    }
                })

            })

            if (photo_links && photo_links.length !== 0) {
                if (photo_links.length > 10) {
                    photo_links = photo_links.slice(0, 10)
                }
            }

            console.log("photo linksss 2:  ", photo_links)

            let z = 0
            let images_array = []

            var timer = setInterval(async () => {

                if (z === photo_links.length - 1) {
                    // console.log("process finished")
                    // console.log("images array is: ", images_array)

                    clearInterval(timer)
                    return resolve({ name: name, images: images_array, url: url, details: info })
                }


                if (photo_links[z]) {
                    console.log("photo links z: ", photo_links[z])
                    await page.goto(photo_links[z].toString())
                    await page.waitFor(1500)

                    let image = await page.evaluate((seletor) => {

                        let x = document.getElementsByTagName("img")
                        return Array.from(x).map(img => img.getAttribute("src"))

                    })

                    if (image && image.length !== 0) {
                        images_array.push(image[0])

                    }
                    z++

                } else {

                    clearInterval(timer)
                    return resolve({ name: name, images: "none", url: url, details: info })               
                }

            }, 4000)

        })

    }

    async function scrape_friends_main(url) {

        let person_url = url
        let id = /php\?id/.test(url)
        id ? person_url = url + "&sk=friends" : person_url = url + "/friends"

        console.log("url: ", url)
        console.log("person url: ", person_url)

        await page.goto(person_url)

        let friends = await page.evaluate(async () => {

            return await new Promise(function (resolve, reject) {

                let i = 0
                let distance = 300
                let arr = []

                var timer_3 = setInterval(() => {

                    if (i === 12) {
                        let y = document.getElementsByClassName("bp9cbjyn")
                        for (let j = 0; j < y.length; j++) {
                            if (/grancolombiano/i.test(y[j].textContent.toString())) {

                                let links = y[j].getElementsByTagName("a")
                                arr.push({
                                    name: y[j].textContent.slice(0, y[j].textContent.indexOf("Politécnico")),
                                    url: links[0].getAttribute("href")
                                })
                            }

                        }
                        // console.log(arr)
                        clearInterval(timer_3)

                        return resolve(Array.from(arr).map(elem => elem))

                    }
                    else {

                        window.scrollBy(0, distance)
                        i++
                        distance += 500
                    }

                }, 1000)

            })

        })

        return friends
    }

    async function call_timers(bool, url, name, info) {

        if (bool) {
            return await scrape_photos(url, name, info).then(async res => {
                json_files.saveJSON("kittys.json", res)
                return await scrape_friends_main(url).then(async res_2 => {
                    console.log("friends", res_2)
                    if (res_2 && res_2.length) {
                        let people_arr = json_files.readJson("people.json")
                        for (let i = 2; i < res_2.length; i++) {
                            let already_there = people_arr.some(elem => elem.url === res_2[i].url)
                            if (!already_there && res_2[i].name.length < 30) {
                                json_files.saveJSON("people.json", res_2[i])

                            }
                        }

                    }

                })

            })

        }
        else {
            return await scrape_friends_main(url).then(res_2 => {
                console.log("friends", res_2)
                if (res_2 && res_2.length) {
                    let people_arr = json_files.readJson("people.json")
                    for (let i = 2; i < res_2.length; i++) {
                        let already_there = people_arr.some(elem => elem.url === res_2[i].url)
                        if (!already_there && res_2[i].name.length < 30) {
                            json_files.saveJSON("people.json", res_2[i])

                        }
                    }

                }

            })

        }

    }





})()


