const puppet = require("puppeteer");
require("dotenv").config();
const fs = require("fs");
const json_files = require("./json_files");


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
    // const hrefElement = await page.$('input');



    let girls_names = json_files.readJson("female_names_2.json")
    girls_names=girls_names.slice(205,221) //(0,10)(9,28)(26,46)(44,64)(62,82)

    let j = 0


    var constant_timer = setInterval(async () => {


        if (j === girls_names.length - 1) {
            clearInterval(constant_timer)
            console.log("process ended")
        }
        else {
            let a_Count2 = await page.$$eval('a', a => a.map(element => {
                let elem_regex = new RegExp("uniandeseduco.workplace.com/profile.php")
                if (element.href.toString().match(elem_regex)) {
                    return ({
                        name: element.textContent,
                        link: element.href
                    })
                }
            })
            );

            json_files.saveJSON("data.json", a_Count2)

            console.log(a_Count2)


            const inputValue = await page.$eval("input[placeholder='Buscar un miembro']", el => el.value);
            for (let i = 0; i < inputValue.length; i++) {
                await page.keyboard.press('Backspace');
            }
            await page.type("input[placeholder='Buscar un miembro']", girls_names[j].name.toLowerCase())
            await page.waitFor(5000)
            await autoScroll(page)
            j += 1;
        }
    }, 130000)

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 500;
                var timer = setInterval(async () => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    console.log("scroll height is", scrollHeight)
                    if (totalHeight >= scrollHeight) {
                        console.log("finished scrolling", scrollHeight)

                        clearInterval(timer);
                        resolve();
                    }
                }, 2000);
            });
        });
    }

})()

