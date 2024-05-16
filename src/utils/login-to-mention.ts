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

export function LoginToMention(login: string, members: Collection<string, GuildMember>): string {
	const discordId = getDiscordIdByLogin(login, members);
	if (discordId === undefined) {
		return login;
	}
	return `<@${discordId}>`;
}
