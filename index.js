// Require the necessary discord.js classes
require("dotenv").config();
const { Op } = require("sequelize");
const fetch = require("node-fetch");
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { Users, Shop } = require("./dbObjects.js");
const { addBalance, getBalance } = require("./helperMethods.js");
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
  if (msg.author.bot) return;
  if (msg.content === "Hi") {
    // If a user sends "Hi" to the server, the bot will reply
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => msg.reply(`Hello, ${msg.author.username}! ${data[0].q}`));
  } else if (
    msg.content.toLowerCase() === "bat!work" ||
    msg.content.toLowerCase() === "bat!w"
  ) {
    addBalance(currency, msg.author.id, 5).then((u) =>
      msg.reply(
        `${msg.author.username} went to work and earned 5 batcoins. Your balance is now ${u.balance}.`
      )
    );
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
