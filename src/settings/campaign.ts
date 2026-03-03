import { Signal, signal } from "@preact/signals";
import { Setting } from "obsidian";
import { PluginSetting } from "./index";

export const campaignId = signal('');
export const initCampaignIdSetting = (
    containerEl: HTMLElement,
    value: string
) => {

    const setting = new Setting(containerEl)
                .setName('Campaign ID')
                .setDesc('This will download the campaign info. Your DM can find it in their campaign settings.')
                .addText(text => text
                    .setPlaceholder('rpg_cmpgn_id_4c58112a-f325-4397-b5b7-db137ef42414')
                    .setValue(value)
                    .onChange(async (value) => {
                        campaignId.value = value;
                    })
                );
    return new PluginSetting<string>(setting, campaignId);
}


const campaignName = signal('');
export const initCampaignNameSetting = (
    containerEl: HTMLElement,
    value: string,
    disabled: Signal<boolean>
) => {

    const setting = new Setting(containerEl)
			.setName('Campaign Name')
			.setDesc('Name of this awesome campaign')
			.addText(text => {
				text
					.setPlaceholder('Name of the Campaign')
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
