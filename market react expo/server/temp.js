// const { PythonShell } = require('python-shell');

// let options = {
//     scriptPath: 'C:/Users/Asus/OneDrive/Desktop/market react expo/server'
// };

// PythonShell.run('market.py', options, function (err, res) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });

// const readLine = require('readline')

// const rl = readLine.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
const axios = require("axios")
const cheerio = require("cheerio")
const { response } = require('express')
var state_name = "Tamil Nadu"


if (typeof state_name !== 'undefined' && state_name.trim() === "") {
    console.error("No input given")
}

const url = `https://www.kisandeals.com/mandiprices/TOMATO/${state_name}/ALL`


axios.get(url)
    .then(function (response) {
        // console.log(response.data)
        const cheer = cheerio.load(response.data)

        let tables = []
        cheer('table').each(function (i, table) {
            let tabledata = []

            cheer(table).find('tr').each(function (j, row) {
                let rowdata = []
                cheer(row).find('td,th').each(function (k, box) {
                    rowdata.push(cheer(box).text().trim())
                })
                tabledata.push(rowdata)
            })
            tables.push(tabledata)
        })


        // console.log(tables)
        let q_and_a = []
        cheer('body > div:nth-child(10) > div > div > ul > li').each(function (i, li) {
            const q = cheer(li).find('h5').text().trim()
            // console.log(q)
            const a = cheer(li).find('p').text().trim()

            q_and_a.push({ q, a })

        })

        // console.log(q_and_a)
        console.log(tables)
    })
    .catch(function (error) {
        console.error("Error in fetchning data")
    })
