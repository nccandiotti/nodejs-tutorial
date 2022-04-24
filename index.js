const fs = require("fs")
// gives networking capability to create an http service
const http = require("http")
const url = require("url")

// ----------------Blocking Synchronous
// Read files in node js
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8")

// console.log(textIn)

// // write files (create new file) in node js
// const textOut = `This is what we know about the avocado: ${textIn}. \n ${Date.now()}`

// fs.writeFileSync("./txt/output.txt", textOut)
// console.log("File Written!")

// // ----------------Non Blocking asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2)
//   })
// })
// console.log("will read file")

// Server -------------------------------------------------
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data)

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
)
const productOverview = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
)
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
)
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%ID%}/g, product.id)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, product.not_organic)
  return output
}
const server = http.createServer((request, response) => {
  const pathName = request.url

  //   OVERVIEW PAGE
  if (pathName === "/" || pathName === "/overview") {
    response.writeHead(200, {
      "Content-type": "text/html",
    })

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("")
    const output = tempOverview.replace("{%PRODUCT_CARDS%", cardsHtml)
    response.end(output)
    // PRODUCT PAGE
  } else if (pathName === "/product") {
    response.end("this is the PRODUCT")

    // API
  } else if (pathName === "/api") {
    response.writeHead(200, { "Content-type": "application/json" })
    response.end(data)

    // NOT FOUND
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
    })
    response.end("<h1>Page not found!</h1>")
  }
})
// params: port, (local host, don't technically need to specify), third argument is optional callback to confirm server is working
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000")
})