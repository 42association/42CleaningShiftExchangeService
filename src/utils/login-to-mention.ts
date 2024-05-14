import { Client } from 'discord.js';

//function getDiscordIdFromName(login: string, members: Collection<string, GuildMember>): string | void {
//	const member = members.find(member => { return
//		member.displayName === login || member.user.globalName === login;
//	});
//	if (!member) {
//		return;
//	}
//	return member.id;
//}

export function LoginToMention(login: string, client: Client): string {
	const user = client.users.resolve(login)
	if (user === null) {
		return login;
	}
	return `<@${user.id}>`;
}
