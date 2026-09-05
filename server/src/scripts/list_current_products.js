import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { Product } from '../models/Product.js'

async function run() {
  await connectDatabase()
  const products = await Product.find({})
  console.log(`Found ${products.length} products:`)
  products.forEach(p => {
    console.log(`- ID: ${p._id}, Name: ${p.name}, SKU: ${p.sku}, Category: ${p.category}, Price: ${p.price}, Status: ${p.status}, Images: ${JSON.stringify(p.images)}`)
  })
}

run()
  .then(() => disconnectDatabase())
  .catch(err => {
    console.error(err)
    disconnectDatabase()
  })
