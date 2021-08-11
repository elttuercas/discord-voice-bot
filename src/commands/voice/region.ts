import * as Discord            from 'discord.js';
import CommandHelpData         from '../../types/CommandHelpData';
import {TemporaryVoiceChannel} from '../../models/TemporaryVoiceChannel';

/**
 * Set or display the voice channel's current region.
 *
 * @this CommandHandlerData
 *
 * @author Carlos Amores
 */
export async function run() : Promise<void>
{
    let vc : Discord.VoiceChannel | null = this.message.member.voice.channel;
    if (vc === null)
    {
        this.message.reply('You are not in a voice channel.').catch(console.error);
        return;
    }

    TemporaryVoiceChannel.findOne(
        {
            where : {
                owner_id : this.message.member.id,
                guild_id : this.message.guild.id,
                alive    : true
            }
        }
    )
        .then((tvc : TemporaryVoiceChannel | null) =>
        {
            if (tvc === null)
            {
                this.message.reply('You are not in a temporary voice channel.').catch(console.error);
                return;
            }
            else if (!tvc.memberIsOwner(this.message.member))
            {
                this.message.reply('You do not own the voice channel.').catch(console.error);
                return;
            }

            if (this.arguments[0] === '')
            {
                // When no region name is specified, display the current region of the channel.
                this.message.reply('The current region is: ' + vc.rtcRegion !== null ? '`' + vc.rtcRegion + '`' : '`automatic`').catch(console.error);
                return;
            }
            else
            {
                vc.setRTCRegion(this.arguments[0])
                    .then(() =>
                    {
                        this.message.reply('Region changed successfully.').catch(console.error);
                    })
                    .catch((e : any) =>
                    {
                        console.error(e);
                        this.message.reply('There has been an error setting the voice region. (This is an experimental command, errors are expected)').catch(console.error);
                    });
            }
        });
}

/**
 * Return relevant information about the command.
 *
 * @author Carlos Amores
 */
export function help() : CommandHelpData
{
    return {
        commandName        : '[EXPERIMENTAL] Voice Region',
        commandDescription : 'Display the current region or set the channel\'s region',
        commandUsage       : '.voice.region [NEW REGION]'
    };
}
