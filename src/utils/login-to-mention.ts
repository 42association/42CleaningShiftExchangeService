import { Collection, GuildMember } from 'discord.js';

async function getDiscordIdByLogin(login: string, members: Collection<string, GuildMember>): Promise<string | void> {
	const member = members.find(member => {
		return member.displayName === login || member.user.globalName === login;
	});
	if (!member) {
		return ;
	}
	return member.id;
}

export async function LoginToMention(login: string, members: Collection<string, GuildMember>) {
	const discordId = await getDiscordIdByLogin(login, members);
	if (discordId === undefined) {
		return login;
	}
	return `<@${discordId}>`;
}
