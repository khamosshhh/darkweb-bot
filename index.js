const discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const client = new discord.Client();

const config = require('./config.json');

require('./live.js')

client.on("ready", async () => {
  console.log(`${client.user.tag} is online!`);
  client.user.setPresence({
    status: "online",
    activity: {
      name: "DMs",  // The message shown
      type: "WATCHING" // PLAYING, WATCHING, LISTENING, STREAMING,
    }
  });
  const brp = client.guilds.cache.get(config.brp);
  const logChannel = client.channels.cache.get(config.logChannel);
  const darkwebChannel = client.channels.cache.get(config.darkwebChannel);
  const darkwebRole = brp.roles.cache.get(config.darkwebRole);

  if (!brp) console.log('BRP SERVER NOT FOUND');
  if (!logChannel) console.log('LOGS CHANNEL NOT FOUND');
  if (!darkwebChannel) console.log('DARKWEB CHANNEL NOT FOUND');
  if (!darkwebRole) console.log('DARKWEB ROLE NOT FOUND');
});

client.on("message", async (message) => {

  // if message author is a bot user acction will be null
  if (message.author.bot) return;

  // if message is recieved in the dm then trigger this event
  if (!message.guild && message.author.id !== client.user.id) {

    //if (message.author) return message.author.send("COMING SOON!!");

    // loading all necessary data
    const brp = client.guilds.cache.get(config.brp);
    const logChannel = client.channels.cache.get(config.logChannel);
    const darkwebChannel = client.channels.cache.get(config.darkwebChannel);
    const darkwebRole = brp.roles.cache.get(config.darkwebRole);

    const brpUser = brp.members.cache.get(message.author.id);
    // to check if user is in the server 
    if (!brpUser) return message.author.send("You are not in BRP server!");
    // to check if user have access to dark web
    if (brpUser.roles.cache.has(darkwebRole)) return message.author.send("You don't have access to BRP DARK WEB");

    // to check if message includes correct format or not 
    const lower = message.content.toLowerCase();
    if (!lower.startsWith('anon')) return message.author.send("Correct format is --> `Anon 123 | Your message`")

    // main processs here
    const msg = message.content;
    message.author.send(msg).then((msg) =>
      message.react("✅") && message.react("❎") && msg.delete({ timeout: 5000 }));

    message.awaitReactions((reaction, user) =>
      user.id == message.author.id &&
      (reaction.emoji.name == "✅" || reaction.emoji.name == "❎"), { max: 1, time: 30000 }
    ).then((collected) => {
      if (collected.first().emoji.name == "✅") {

        let dwchannel = darkwebChannel
        let log = logChannel

        if (!message.attachments.first()) {
          let embed = new MessageEmbed()
            .setAuthor('BRP DarkWeb', 'https://cdn.discordapp.com/attachments/993893179319386223/1006640228901077173/unknown_7.png')
            .setDescription(`<:anon:917008662197850174> ${message.content.toUpperCase()}`)
            .setColor("#000000")
            .setTimestamp()
            .setFooter("Dark Web System Made By khamosshhh🤫#9916")
          dwchannel.send(embed)
          log.send(`${message.author.tag}, posted on DARKWEB`, embed)
        }

        if (!message.content) {
          let embed2 = new MessageEmbed()
            .setAuthor('BRP DarkWeb', 'https://cdn.discordapp.com/attachments/993893179319386223/1006640228901077173/unknown_7.png')
            .setDescription(`<:anon:917008662197850174> ${message.content.toUpperCase()}`)
            .setImage(message.attachments.first().proxyURL)
            .setColor("#000000")
            .setTimestamp()
            .setFooter("Dark Web System Made By khamosshhh🤫#9916")
          dwchannel.send(embed2)
          log.send(`${message.author.tag}, posted on DARKWEB`, embed2)
        }
        else if (message.content, message.attachments.first()) {
          let embed3 = new MessageEmbed()
            .setAuthor('BRP DarkWeb', 'https://cdn.discordapp.com/attachments/993893179319386223/1006640228901077173/unknown_7.png')
            .setDescription(`<:anon:917008662197850174> ${message.content.toUpperCase()}`)
            .setImage(message.attachments.first().proxyURL)
            .setColor("#000000")
            .setTimestamp()
            .setFooter("Dark Web System Made By khamosshhh🤫#9916")
          dwchannel.send(embed3)
          log.send(`${message.author.tag}, posted on DARKWEB`, embed3)
        }

        message.author.send("POSTED TO <#992851108487761930> SUCCESSFULLY!!");
      } else {
        if (collected.first().emoji.name == "❎") {
          message.author.send("POST CANCELLED!");
        }
      }
    });
  }
});
client.login(process.env.TOKEN);