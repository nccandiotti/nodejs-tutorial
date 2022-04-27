const fs = require("fs")
// gives networking capability to create an http service
const http = require("http")
const url = require("url")
const slugify = require("slugify")
const replaceTemplate = require("./modules/replaceTemplate")
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
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }))
console.log(slugs)
console.log(slugify("Fresh Avocados", { lower: true }))
const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true)

  //   OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, {
      "Content-type": "text/html",
    })

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("")
    const output = tempOverview.replace("{%PRODUCT_CARDS%", cardsHtml)
    response.end(output)
    // PRODUCT PAGE
  } else if (pathname === "/product") {
    response.writeHead(200, {
      "Content-type": "text/html",
    })
    const product = dataObj[query.id]
    // response.end("this is the PRODUCT")
    const output = replaceTemplate(productOverview, product)
    response.end(output)
    // API
  } else if (pathname === "/api") {
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
