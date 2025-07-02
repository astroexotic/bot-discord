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
        .setDescription(`Bienvenue sur le serveur, ${member.user.tag} ! Pense à lire les règles et à te présenter dans #présentation !`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: "L'équipe du serveur", iconURL: 'https://link_vers_une_image_de_footer.png' });

    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === '👋-bienvenue');
    if (welcomeChannel) welcomeChannel.send({ embeds: [embed] });
});

// Connexion avec le token
client.login(process.env.TOKEN);




