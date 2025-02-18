const fs = require("fs")

const filepath = '/app/data/data.txt'
const url = "http://test-server:3000"

function writeData(args) {
  try {
    const content = args.join(" ")
    fs.writeFileSync(filepath, content)
    console.log(`Successfully wrote to ${filepath}: "${content}"`)
    process.exit(0)
  } catch (error) {
    console.error("Write failed:", error.message)
    process.exit(1)
  }
}

async function fetchData() {
  try {
    const response = await fetch(url)
    const data = await response.text()
    console.log(data)
    process.exit(0)
  } catch (error) {
    console.error("Fetch failed:", error.message)
    process.exit(1)
  }
}

// Process Command-Line Arguments
const [,, command, ...args] = process.argv

switch(command) {
  case 'fetch': {
    fetchData()
    break
  }
  case 'write': {
    writeData(args)
    break
  }
  default: {
    console.error("Invalid command. Use 'write <data>' or 'fetch'.")
    process.exit(1)
  }
}
