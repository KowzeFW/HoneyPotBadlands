// -----------------------------------------------------------
// A simple discord bot Honey pot
//
// (C) 2026 HoneyPot — Badlands Edition
// Released under MIT License (MIT)
// linting: Biome
// -----------------------------------------------------------
require("dotenv").config();

const {
	Client,
	GatewayIntentBits,
	PermissionFlagsBits,
} = require("discord.js");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const MESSAGES_TO_DELETE = 10;
const FETCH_LIMIT_PER_CHANNEL = 100;

const WHITELIST = [
	process.env.WHITELIST_ID_1,
	process.env.WHITELIST_ID_2,
].filter(Boolean);

if (!TOKEN) {
	console.error("DISCORD_TOKEN non trouvé dans .env");
	process.exit(1);
}

if (!CHANNEL_ID) {
	console.error("CHANNEL_ID non trouvé dans .env");
	process.exit(1);
}

async function collectLastMessages(guild, userId, limit, triggerMessage) {
	const found = new Map([[triggerMessage.id, triggerMessage]]);

	for (const channel of guild.channels.cache.values()) {
		if (!channel.isTextBased() || channel.isThread() || !channel.viewable) {
			continue;
		}

		try {
			const messages = await channel.messages.fetch({
				limit: FETCH_LIMIT_PER_CHANNEL,
			});
			for (const msg of messages.values()) {
				if (msg.author.id === userId) found.set(msg.id, msg);
			}
		} catch (error) {
			console.warn(`Lecture impossible dans #${channel.name} :`, error.message);
		}
	}

	return [...found.values()]
		.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
		.slice(0, limit);
}

client.once("clientReady", () => {
	console.log(`Connected as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.id !== CHANNEL_ID) return;
	if (!message.member) return;
	if (WHITELIST.includes(message.author.id)) return;

	if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
		return;
	}

	if (!message.member.kickable) {
		console.warn(`${message.author.tag} n'est pas kickable (hiérarchie).`);
		return;
	}

	const toDelete = await collectLastMessages(
		message.guild,
		message.author.id,
		MESSAGES_TO_DELETE,
		message,
	);

	try {
		await message.member.kick("Honey Pot");
		console.log(`${message.author.tag} a été kick.`);
	} catch (error) {
		console.error(`Impossible de kick ${message.author.tag} :`, error);
		return;
	}

	let deleted = 0;
	for (const msg of toDelete) {
		try {
			await msg.delete();
			deleted++;
		} catch (error) {
			console.error(`Impossible de supprimer le message ${msg.id} :`, error);
		}
	}
	console.log(`${deleted}/${toDelete.length} message(s) supprimé(s).`);
});

client.on("error", (error) => console.error("Erreur client :", error));
process.on("unhandledRejection", (error) =>
	console.error("Unhandled rejection :", error),
);

client.login(TOKEN);
