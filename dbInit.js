// Initializing the database once

const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Shop = require("./models/Shop.js")(sequelize, Sequelize.DataTypes);
require("./models/Users.js")(sequelize, Sequelize.DataTypes);
require("./models/Inventory.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    const shop = [
      // Update or insert
      Shop.upsert({ name: "Fishing Rod", cost: 500, counter: 5 }),
      Shop.upsert({ name: "Tomato Seed", cost: 20 }),
      Shop.upsert({ name: "Eggplant Seed", cost: 20 }),
      Shop.upsert({ name: "Corn Seed", cost: 30 }),
      Shop.upsert({ name: "Pepper Seed", cost: 30 }),
      Shop.upsert({ name: "Tomato", cost: 60, counter: 3 }),
      Shop.upsert({ name: "Eggplant", cost: 60, counter: 3 }),
      Shop.upsert({ name: "Corn", cost: 80, counter: 3 }),
      Shop.upsert({ name: "Pepper", cost: 8, counter: 3 }),
      Shop.upsert({ name: "Carp", cost: 80 }),
      Shop.upsert({ name: "Crab", cost: 80 }),
      Shop.upsert({ name: "Squid", cost: 80 }),
      Shop.upsert({ name: "Lobster", cost: 100 }),
      Shop.upsert({ name: "Salmon", cost: 100 }),
      Shop.upsert({ name: "Snapper", cost: 100 }),
      Shop.upsert({ name: "Sturgeon", cost: 500 }),
      Shop.upsert({ name: "Tuna", cost: 500 }),
      Shop.upsert({ name: "Shark", cost: 1000 }),
    ];

    await Promise.all(shop);
    console.log("Database synced");

    sequelize.close();
  })
  .catch(console.error);
