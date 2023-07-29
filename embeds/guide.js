const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder()
  .setColor(0x000000)
  .setTitle("Batfarm Guide")
  .setThumbnail(
    "https://www.animatedimages.org/data/media/196/animated-bat-image-0050.gif"
  )
  .setDescription(
    "There are two types of commands: **slash** command and **prefix** command.\n**Slash Command**\nType `/` and select from the pop-up selection.\nSlash command list:\n- anime-quote\n- astronomy-picture\n- cat\n- coffee\n\n**Prefix Command**\nType `bat (command name)`. *Certain commands need additional information following the command name.*\nPrefix command list:\n- **balance/bal/b**: shows the balance of the user.\n- **daily**: gives user daily reward.\n- **work/w**: rewards user a certain amount of batcoins every hour.\n- **shop**: displays the items user can buy or sell.\n- **buy**: buys an item. Specify item name and quantity. Quantity defaults to 1.\n- **sell**: sells an item. Specify item name and quantity. Quantity defaults to 1.\n- **deposit/dep**: deposits a certain amount of batcoins to the bank. Specify the amount.\n- **withdraw/wd**: withdraws a certain amount of batcoins to the bank. Specify the amount.\n- **rob**: robs another user. Mention the user.\n- **transfer/tf/tr**: transfers an amount of batcoins to another user. Specify the user and the amount.\n- **fish**: catches a fish that can be sold. The user is required to buy a fishing rod first.\n- **garden/g**: shows the current garden of the user.\n- **inventory**: shows the inventory of the user.\n- **plant**: plants seed(s) owned in the garden. Specify the plant/crop.\n- **water**: waters all plants in the garden.\n- **harvest**: harvests the plants in the garden. Specify the plant name and the quantity of crops.\n- **jail**: jails another user. Mention the user.\n- **8ball**: gives a yes/no answer to any questions.\n- **quote/qt/q**: gives user a motivational quote.\n- **highlow/hl**: plays highlow game.\n- **leaderboard/lb**: displays ten users with the most batcoins.\n- **help/guide**: displays the guide to the bot.\n\n*You can use `all` to replace the quantity/amount of certain commands: sell, deposit, withdraw, plant, harvest.*"
  )
  .setFooter({
    text: "Have fun!",
  });
module.exports = embed;
