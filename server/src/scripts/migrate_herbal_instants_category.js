import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { Product } from '../models/Product.js'

async function run() {
  await connectDatabase()
  
  const res = await Product.updateMany(
    { category: "HERBAL INSTANTS" },
    { $set: { category: "NUTRITION & INSTANTS" } }
  )
  
  console.log(`Database Migration Complete! Updated ${res.modifiedCount} products from 'HERBAL INSTANTS' to 'NUTRITION & INSTANTS'`)
}

run()
  .then(() => disconnectDatabase())
  .catch(err => {
    console.error(err)
    disconnectDatabase()
  })
