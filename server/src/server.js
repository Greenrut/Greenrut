import app from './app.js'
import { config } from './config/env.js'
import { connectDatabase } from './config/db.js'

async function start() {
  await connectDatabase()

  app.listen(config.port, () => {
    console.log(`Greenrut API running on http://localhost:${config.port}`)
  })
}

start().catch((error) => {
  console.error(error)
  process.exit(1)
})
