// -----------------------------------------------------------
// A simple discord bot Honey pot
//
// (C) 2026 HoneyPot — Badlands Edition
// Released under MIT License (MIT)
// linting: Biome
// -----------------------------------------------------------
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

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

client.once("ready", () => {
	console.log(`Connected as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.id !== CHANNEL_ID) return;

	if (WHITELIST.includes(message.author.id)) {
		return;
	}

	if (!message.member) return;

	try {
		await message.delete().catch(() => {});
		await message.member.kick("Honey Pot");

		console.log(`${message.author.tag} a était kick.`);
	} catch (error) {
		console.error("Impossible de kick membre :", error);
	}
});

client.login(TOKEN);
