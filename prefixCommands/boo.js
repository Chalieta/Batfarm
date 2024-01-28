const { AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

exports.run = async (client, msg, args) => {
  if (msg.mentions.users.size === 0) {
    return msg.reply("Mention the user you want to boo.");
  }
  const booed = msg.mentions.users.first(); // Retrieve booed user
  const canvas = Canvas.createCanvas(500, 500); // Create canvas
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage(
    // Load jailed user's avatar to canvas
    booed.avatarURL({ size: 2048, extension: "jpg" })
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const tomato = await Canvas.loadImage("./images/tomato.png"); // Load tomato to canvas
  ctx.drawImage(tomato, 30, 20, canvas.width - 300, canvas.height - 300);
  ctx.drawImage(tomato, 300, 180, canvas.width - 300, canvas.height - 300);
  ctx.drawImage(tomato, 90, 270, canvas.width - 300, canvas.height - 300);

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "boo.png",
  });
  return msg.reply({
    content: `${booed}, YOU SUCK! BOO 👎👎👎`,
    files: [attachment],
  });
};

exports.name = "boo";
