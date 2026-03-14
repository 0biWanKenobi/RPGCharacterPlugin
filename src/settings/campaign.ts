import { Signal, signal } from "@preact/signals";
import {ButtonComponent, Notice, Setting} from "obsidian";
import { PluginSetting } from "rpg_shared/settings/plugin";

export const initCampaignIdSetting = (
    containerEl: HTMLElement,
    value: string
) => {
	const campaignId = signal(value);
    // noinspection SpellCheckingInspection -- fix "cmpgn" in the placeholder
	const setting = new Setting(containerEl)
                .setName('Campaign ID')
                .setDesc('This will download the campaign info. Your DM can find it in their campaign settings.')
                .addText(text => text
					// eslint-disable-next-line obsidianmd/ui/sentence-case
                    .setPlaceholder('rpg_cmpgn_id_4c58112a-f325-4397-b5b7-db137ef42414')
                    .setValue(value)
                    .onChange(async (value) => {
                        campaignId.value = value;
                    })
                );
    return new PluginSetting<string>(setting, campaignId);
}

export const initCampaignNameSetting = (
    containerEl: HTMLElement,
    value: string,
    disabled: Signal<boolean>
) => {
	const campaignName = signal(value);
    const setting = new Setting(containerEl)
			.setName('Campaign name')
			.setDesc('Name of this awesome campaign')
			.addText(text => {
				text
					.setPlaceholder('Name of the campaign')
					.setValue(value)
					.onChange(async (value) => {
						campaignName.value = value;
					})
					.setDisabled(true);
				disabled.subscribe((v) =>text.setDisabled(v));
				return text;
			});
    return new PluginSetting<string>(setting, campaignName);
}
export const initCampaignAddButton = (
	containerEl: HTMLElement,
)=> {

	const wrapper = containerEl.createEl('div', {cls: 'ps-btn plugin-settings-campaign-add'})
	const campaignIdInput = initCampaignIdSetting(wrapper, '')

	new ButtonComponent(wrapper)
		.setButtonText('Join campaign')
		.onClick(async () => {
			new Notice('Join request sent!')
		})

	return campaignIdInput;
}
