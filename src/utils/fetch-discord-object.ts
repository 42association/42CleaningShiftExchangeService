import { Client, Guild, Collection, GuildMember } from 'discord.js';

export async function FetchGUild(client: Client): Promise<Guild> {
	const guildId = process.env.GUILD_ID;
	if (!guildId) {
		throw new Error('GUILD_ID is not set');
	}
	const guild = await client.guilds.fetch(guildId);
	if (!guild) {
		throw new Error('guild not found');
	}
	return guild;
}

export async function FetchMembers(client: Client): Promise<Collection<string, GuildMember>> {
	const guild = await FetchGUild(client);
	const members = await guild.members.fetch();
	return members;
}
