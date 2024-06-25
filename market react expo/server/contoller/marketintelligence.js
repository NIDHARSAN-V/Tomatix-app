const axios = require("axios")
const cheerio = require("cheerio")
const { response } = require('express')


const getmarketintelligence = async function (req,res1) {
    try {

        var state_name = req.body.statename


        if (typeof state_name !== 'undefined' && state_name.trim() === "") {
            console.error("No input given")
        }

        const url = `https://www.kisandeals.com/mandiprices/TOMATO/${state_name}/ALL`


       await axios.get(url)
            .then(function (response) {
                // console.log(response.data)
                const cheer = cheerio.load(response.data)

                let tables = []
                cheer('table').each(function (i, table) {
                    let tabledata = []

                    cheer(table).find('tr').each(function (j, row) {
                        let rowdata = []
                        cheer(row).find('td,th').each(function (k, box) {
                            rowdata.push(cheer(box).text())
                        })
                        tabledata.push(rowdata)
                    })
                    tables.push(tabledata)
                })


                // console.log(tables)
                let q_and_a = []
                cheer('body > div:nth-child(10) > div > div > ul > li').each(function (i, li) {
                    const q = cheer(li).find('h5').text().trim()

                    const a = cheer(li).find('p').text().trim()

                    q_and_a.push({ q, a })

                })

                console.log(q_and_a)
                console.log(tables)
                return res1.status(200).send({table:tables , qanda:q_and_a ,success:true,
                    message:"successful"
                })
            })
            .catch(function (error) {
                console.error("Error in fetchning data")
                return res1.send({success:false , message:"Unsuccessful_inner"})
                
            })





    }
    catch (error) {
        console.log(error)
        return res1.send({success:false , message:"Unsuccessful_outer"})
    }
}



module.exports = {getmarketintelligence}


