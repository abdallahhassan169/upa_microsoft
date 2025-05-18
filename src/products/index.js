import { externalDb, sourceDb } from "../dbConfig.js";

export const productChanges = async (data) => {
  try {
    console.log(data);
    const payload = data;

    const { action, id, name } = payload;

    switch (action) {
      case "insert":
        await externalDb.query(
          "INSERT INTO commercial (id, p_name) VALUES ($1, $2)",
          [id, name]
        );

        break;

      case "update":
        await externalDb.query(
          "UPDATE commercial SET p_name = $1 WHERE id = $2",
          [name, id]
        );

        break;

      case "delete":
        await externalDb.query("DELETE FROM commercial WHERE id = $1", [id]);

        break;

      default:
        console.log("action is ", action);
    }
  } catch (err) {
    await externalDb.query(
      "INSERT INTO failed_jobs (payload, error) VALUES ($1, $2)",
      [data, err.message]
    );
  }
};

export const productsCron = async () => {
  console.log("running daily sync job...");

  try {
    const { rows: sourceProducts } = await sourceDb.query(
      "SELECT id, product_name FROM products"
    );

    const { rows: existingProducts } = await externalDb.query(
      "SELECT id FROM commercial"
    );
    const existingIds = new Set(existingProducts.map((p) => p.id));

    const missingProducts = sourceProducts.filter(
      (p) => !existingIds.has(p.id)
    );

    for (const product of missingProducts) {
      try {
        await externalDb.query(
          "INSERT INTO commercial (id, p_name) VALUES ($1, $2)",
          [product.id, product.product_name]
        );
      } catch (err) {
        await externalDb.query(
          "INSERT INTO failed_jobs (payload, error) VALUES ($1, $2)",
          [JSON.stringify(product), err.message]
        );
        console.error(
          `failed to insert product ID: ${product.id}`,
          err.message
        );
      }
    }

    console.log("✅ Daily sync completed");
  } catch (err) {
    console.error("❌ Error in cron job:", err.message);
  }
};
