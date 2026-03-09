import {computed, type Signal, signal} from "@preact/signals";
import { Notice, Setting } from "obsidian";
import { PluginSetting } from "rpg_shared/settings/plugin";

export const initCharacterIdSetting = (
    containerEl: HTMLElement,
    value: string
) => {
	const characterId = signal(value);
    const setting = new Setting(containerEl)
                .setName('Character ID')
                .setDesc('Your Character ID. Give it to your master to link it to the campaign.')
                .addButton(btn => btn
                    .setButtonText('Copy to clipboard')
                    .setIcon('copy')
                    .onClick(async () => {
                        await navigator.clipboard.writeText(characterId.value);
                        new Notice('Character ID copied to clipboard!');
                    })
                )
                .addText(text => text
                    .setPlaceholder('Character ID')
                    .setValue(value)
                    .setDisabled(true)
                );
    return new PluginSetting<string>(setting, characterId);
}

export const initCharacterNotLoadedWarning = (
	containerEl: HTMLElement,
	campaignId: Signal<string>,
) => {
	const characterNotLoadedShouldHide = computed(() => (campaignId.value || '') == '');
    const characterNotLoadedWarning = new Setting(containerEl)
        .setName('No character loaded')
        .setDesc('Please enter a valid campaign ID to load your character information.');

    return new PluginSetting(characterNotLoadedWarning, characterNotLoadedShouldHide);
}
