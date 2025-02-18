const http = require("http")
const fs = require('fs')

const PORT = process.env.PORT || 3000
const filepath = '/app/data/data.txt'

fs.writeFileSync(filepath, "Hello from default")
console.log(`Successfully written to "${filepath}" with default data`)

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err)
      res.end(`Error: ${err}`)
      return
    }
    
    res.end(data)
  })
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})