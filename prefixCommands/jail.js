const { AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

exports.run = async (client, msg, args) => {
  if (msg.mentions.users.size === 0) {
    return msg.reply("Mention the user you want to jail.");
  }
  const jailed = msg.mentions.users.first(); // Retrieve jailed user
  const canvas = Canvas.createCanvas(500, 500); // Create canvas
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage(
    // Load jailed user's avatar to canvas
    jailed.avatarURL({ size: 2048, extension: "jpg" })
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const jail = await Canvas.loadImage("./images/jail.png"); // Load jail bars to canvas
  ctx.drawImage(jail, 0, 0, canvas.width + 400, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "jail.png",
  });
  return msg.reply({
    content: `<@${jailed.id}> has been arrested by GCPD and jailed!`,
    files: [attachment],
  });
};

exports.name = "jail";
