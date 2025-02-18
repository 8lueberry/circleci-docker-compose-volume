const { execSync } = require("child_process")

async function runTest() {
  try {
    writeData("Hello from test")
    const res = fetchData()

    if (res === "Hello from test") {
      console.log("✅ Test passed: API returned the expected response.")
      process.exit(0)
    } else {
      console.error(`❌ Test failed: Unexpected response: '${res}'`)
      process.exit(1)
    }
  } catch (err) {
    console.error(`❌ Test failed: API request error:`, err.message)
    process.exit(1)
  }
}

function writeData(content) {
  const res = execSync(`docker compose run --rm test-proxy write ${content}`, { encoding: "utf-8" }).trimEnd()
  console.log(`[test-proxy]: ${res}`)
}

function fetchData() {
  const res = execSync(`docker compose run --rm test-proxy fetch`, { encoding: "utf-8" }).trimEnd()
  return res
}

// Run the test
runTest()