import mysql from "mysql2"

// define OUTSIDE so it closes automatically
const pool = mysql.createPool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
})

export const handler = async (event) => {
  let result
  let code

  try {
    // Validate input
    if (!event.authCode) {
      //make sure the authCode is provided
      throw new Error("Invalid authentication")
    }
    if (!Array.isArray(event.items)) {
      //make sure the input is an array
      throw new Error("'items' must be an array")
    }

    const authCode = event.authCode
    const items = event.items

    // Check that the authCode belongs to an organization
    const getOrganization = () => {
      return new Promise((resolve, reject) => {
        const orgQuery = "SELECT orgo_id FROM Organization WHERE orgo_id = ?"
        pool.query(orgQuery, [authCode], (error, rows) => {
          if (error) {
            reject(new Error("Database error: " + error.sqlMessage))
          } else {
            resolve(rows && rows.length > 0 ? rows[0].orgo_id : null)
          }
        })
      })
    }

    // Get the categories for the requested names
    const getCategories = (orgoId, names) => {
      return new Promise((resolve, reject) => {
        const catQuery =
          "SELECT cat_id, cat_name FROM Category WHERE orgo_id = ? AND cat_name IN (?)"
        pool.query(catQuery, [orgoId, names], (error, rows) => {
          if (error) {
            reject(new Error("Database error: " + error.sqlMessage))
          } else {
            resolve(rows || [])
          }
        })
      })
    }

    // Insert new items, or update them if the itemID already exists
    const upsertItems = (rows) => {
      return new Promise((resolve, reject) => {
        const upsertQuery =
          "INSERT INTO Item (item_id, item_name, item_lowlimit, item_highlimit, cat_id) VALUES ? " +
          "ON DUPLICATE KEY UPDATE item_name = VALUES(item_name), item_lowlimit = VALUES(item_lowlimit), " +
          "item_highlimit = VALUES(item_highlimit), cat_id = VALUES(cat_id)"
        pool.query(upsertQuery, [rows], (error, upsertResult) => {
          if (error) {
            reject(new Error("Database error: " + error.sqlMessage))
          } else {
            resolve(upsertResult)
          }
        })
      })
    }

    // Check authentication first
    const orgoId = await getOrganization()
    if (orgoId === null) {
      throw new Error("Invalid authentication")
    }

    // Check that every category exists
    if (items.length > 0) {
      const names = [...new Set(items.map((item) => item.category))]
      const categories = await getCategories(orgoId, names)

      const catIds = new Map()
      categories.forEach((c) => catIds.set(c.cat_name, c.cat_id))

      if (names.some((n) => !catIds.has(n))) {
        throw new Error("One or more categories does not exist")
      }

      // Save all items in one statement (all or nothing)
      const rows = items.map((item) => [
        item.itemID,
        item.name,
        item.lowLimit,
        item.highLimit,
        catIds.get(item.category),
      ])
      await upsertItems(rows)
    }

    result = {
      items: items.map((item) => ({
        category: item.category,
        itemID: item.itemID,
        name: item.name,
        highPrice: item.highLimit,
        lowPrice: item.lowLimit,
      })),
    }
    code = 200
  } catch (error) {
    result = { error: error.message }
    code = 400
  }

  const response = {
    statusCode: code,
    body: JSON.stringify(result),
  }

  return response
}
