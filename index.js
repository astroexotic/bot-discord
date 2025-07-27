// Importer les modules nécessaires
const { 
    Client, GatewayIntentBits, MessageEmbed, 
    ChannelType 
} = require('discord.js');
require('dotenv').config();

// Créer le client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Message d'accueil quand un membre rejoint
client.on('guildMemberAdd', member => {
    const embed = new MessageEmbed()
        .setColor('#34eb46')
        .setTitle('Bienvenue ! 🎉')
        .setDescription(`Bienvenue sur le serveur, ${member.user.tag} ! Pense à lire les règles !`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: "L'équipe du serveur", iconURL: 'https://link_vers_une_image_de_footer.png' });

    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === '👋-bienvenue');
    if (welcomeChannel) welcomeChannel.send({ embeds: [embed] });
});

// Connexion avec le token
client.login(process.env.TOKEN);
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lien')
    .setDescription('Récupère tous les liens d\'images du salon'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.channel;
    let links = [];

    try {
      // Récupérer l'historique complet (limite max 100 messages par fetch, on boucle)
      let lastId;
      while (true) {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await channel.messages.fetch(options);
        if (messages.size === 0) break;

        messages.forEach(msg => {
          // Récupérer les URLs des attachments
          msg.attachments.forEach(attachment => {
            if (attachment.contentType?.startsWith('image/') || attachment.url) {
              links.push(attachment.url);
            }
          });
          // Récupérer les liens d'images dans le texte (https?)
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const foundUrls = msg.content.match(urlRegex);
          if (foundUrls) {
            foundUrls.forEach(url => {
              // Optionnel: filtrer pour images seulement (extension)
              if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
                links.push(url);
              }
            });
          }
        });

        lastId = messages.last().id;
        if (messages.size < 100) break;
      }

      if (links.length === 0) {
        await interaction.editReply('Aucun lien d\'image trouvé dans ce salon.');
        return;
      }

      // Supprimer les doublons
      links = [...new Set(links)];

      // Créer un buffer avec le contenu des liens
      const buffer = Buffer.from(links.join('\n'), 'utf-8');

      // Envoyer en fichier txt
      const attachment = new AttachmentBuilder(buffer, { name: 'liens_images.txt' });
      await interaction.editReply({ content: `Voici tous les liens d'images (${links.length}) du salon :`, files: [attachment], ephemeral: true });

    } catch (error) {
      console.error(error);
      await interaction.editReply('Une erreur est survenue lors de la récupération des liens.');
    }
  },
};





