import { Collection, GuildMember } from 'discord.js';

function getDiscordIdFromName(login: string, members: Collection<string, GuildMember>): string | void {
	const member = members.find(member => { return
		member.displayName === login || member.globalName === login;
	});
	if (!member) {
		return;
	}
	return member.id;
}

export function LoginToMention(login: string, members: Collection<string, GuildMember>): string {
	const discordId = getDiscordIdFromName(login, members);
	if (discordId === undefined) {
		return login;
	}
	return `<@${discordId}>`;
}
