import { computed, signal } from "@preact/signals";
import { Notice, Setting } from "obsidian";
import { PluginSetting } from "../settings/index";
import { campaignId } from "./campaign";

const characterId = signal('');

const initCharacterIdSetting = (
    containerEl: HTMLElement,
    value: string
) => {

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

export { initCharacterIdSetting };


const characterNotLoadedShouldHide = computed(() => (campaignId.value || '') == '');

export const initCharacterNotLoadedWarning = (containerEl: HTMLElement) => {
    const characterNotLoadedWarning = new Setting(containerEl)
        .setName('No character loaded')
        .setDesc('Please enter a valid campaign ID to load your character information.');

    return new PluginSetting(characterNotLoadedWarning, characterNotLoadedShouldHide);
}