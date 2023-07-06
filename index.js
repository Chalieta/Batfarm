// Require the necessary discord.js classes
require("dotenv").config();
const { Op } = require("sequelize");
const fetch = require("node-fetch");
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  codeBlock,
} = require("discord.js");
const { Users, Shop, Inventory } = require("./dbObjects.js");
const { addBalance, getBalance } = require("./helperMethods.js");
const { log } = require("node:util");
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // To be removed when the the bot is global
const prefix = "bat";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize currency to keep track of users' balances
const currency = new Collection();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach((b) => currency.set(b.user_id, b));
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Events
client.on(Events.MessageCreate, async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(3).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "quote") {
    // If a user sends "Hi" to the server, the bot will reply
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) =>
        msg.reply(`Hello, ${msg.author.username}! "${data[0].q}" —${data[0].a}`)
      );
  } else if (command === "work" || command === "w") {
    let amountEarned = Math.floor(Math.random() * 20) + 10;
    addBalance(currency, msg.author.id, amountEarned).then((u) =>
      msg.reply(
        `${msg.author.username} went to work and earned ${amountEarned} batcoins.`
      )
    );
  } else if (command === "balance" || command === "bal") {
    const balance = getBalance(currency, msg.author.id);
    msg.reply(
      `You have ${balance.wallet} batcoins on hand and ${balance.bank} batcoins in the bank.`
    );
  } else if (command === "inventory" || command === "inv" || command === "i") {
    const user = await Users.findOne({ where: { user_id: msg.author.id } });
    const items = await user.getItems(msg.author.id);

    if (!items.length) return msg.reply(`${msg.author.username} has nothing!`);

    return msg.reply(
      `${msg.author.username}'s Inventory:\n${items
        .map((i) => `${i.item.name} x${i.amount}`)
        .join("\n")}`
    );
  } else if (command === "transfer" || command === "tf") {
    if (msg.mentions.users.size === 0) {
      return msg.reply(
        "Mention the user you want to transfer batcoins to. For example: `bat tf @Batfarm 5`"
      );
    }

    let target;
    for (const u of msg.mentions.users.keys()) {
      target = u;
    }

    if (args.length < 2) {
      return msg.reply(
        "Provide an amount you want to transfer. For example: `bat tf @Batfarm 5`"
      );
    }

    // Parse amount of money
    const amount = parseInt(args[1]);
    if (isNaN(amount)) {
      return msg.reply(
        "Provide a valid amount in a valid format. For example: `bat tf @Batfarm 5`"
      );
    }

    // Check if the amount of money <= 0
    if (amount <= 0) {
      return msg.reply("Provide an amount greater than 0.");
    }

    // Check if the amount of money <= wallet
    const balance = getBalance(currency, msg.author.id);
    if (amount > balance.wallet) {
      return msg.reply(
        `Transfer failed! You only have ${balance.wallet} batcoins on hand.`
      );
    }

    // Transfer
    addBalance(currency, msg.author.id, -amount);
    addBalance(currency, target, amount);

    return msg.reply(
      `Successfully transferred ${amount} batcoins to <@${target}>.`
    );
  } else if (command === "shop") {
    const items = await Shop.findAll();
    return msg.reply(
      codeBlock(items.map((i) => `${i.name}: 🪙${i.cost}`).join("\n"))
    );
  } else if (command === "buy") {
    if (args.length < 2) {
      return msg.reply("Provide the name of item you want to buy.");
    }
    const itemName = args[0] + " " + args[1];
    const item = await Shop.findOne({
      where: { name: { [Op.like]: itemName } },
    });

    if (!item) return msg.reply(`That item doesn't exist.`);
    const balance = getBalance(currency, msg.author.id);
    if (item.cost > balance.wallet) {
      return msg.reply(
        `You currently have ${balance.wallet}, but the ${item.name} costs ${item.cost}!`
      );
    }

    const user = await Users.findOne({
      where: { user_id: msg.author.id },
    });
    addBalance(currency, msg.author.id, -item.cost);
    await user.addItem(msg.author.id, item);

    return msg.reply(`You've bought: ${item.name}.`);
  }
});

// Client commands
client.commands = new Collection();
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(token);
