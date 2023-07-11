// Require the necessary discord.js classes
require("dotenv").config();
const config = require("./config.json");
const { Op } = require("sequelize");
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
const { log } = require("node:util");
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // To be removed when the the bot is global

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.config = config;

// Initialize currency to keep track of users' balances
client.currency = new Collection();

client.cooldowns = new Collection();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach((b) => client.currency.set(b.user_id, b));
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Events
const files = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
// Loop over each file
for (const file of files) {
  // Split the file at its extension and get the event name
  const eventName = file.split(".")[0];
  // Require the file
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

// Client prefix commands
client.prefixCommands = new Collection();
// Read the Commands Directory, and filter the files that end with .js
const prefixCmds = fs
  .readdirSync("./prefixCommands")
  .filter((file) => file.endsWith(".js"));
// Loop over the Command files
for (const file of prefixCmds) {
  // Get the command name from splitting the file
  const commandName = file.split(".")[0];
  // Require the file
  const command = require(`./prefixCommands/${file}`);

  // console.log(`Attempting to load command ${commandName}`);
  // Set the command to a collection
  client.prefixCommands.set(commandName, command);
}

// Client slash commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Loading slash commands
for (const folder of commandFolders) {
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

// Log in to Discord with your client's token
client.login(token);
