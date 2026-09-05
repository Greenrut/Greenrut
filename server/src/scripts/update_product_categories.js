import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { Product } from '../models/Product.js'

async function run() {
  await connectDatabase()
  
  const updates = [
    { id: "6a75ed27f652e03bce5420ae", category: "MEN & WOMEN" },
    { id: "6a75ee0ef652e03bce5420c3", category: "DAILY SUPPLEMENTS (Nutrition)" },
    { id: "6a75eec0f652e03bce5420cf", category: "TARGETED HEALTH" },
    { id: "6a75ef56f652e03bce5420ec", category: "TARGETED HEALTH" }
  ]

  for (const item of updates) {
    const res = await Product.updateOne({ _id: item.id }, { $set: { category: item.category } })
    console.log(`Updated product ${item.id} (${item.category}): modifiedCount = ${res.modifiedCount}`)
  }
}

run()
  .then(() => disconnectDatabase())
  .catch(err => {
    console.error(err)
    disconnectDatabase()
  })
