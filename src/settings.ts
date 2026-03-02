import {App, PluginSettingTab, Setting} from "obsidian";
import RPGCharacterPlugin from "./main";

interface CharacterSettings {
	id: string;
	campaignId: string;
	name: string;
	playerName: string;
	image?: string;
	level: number;
	class: string;
}

interface CampaignSettings {
	id: string;
	name: string;
	master: {
		name: string;
		image?: string;
	}
	startDate: Date;
	endDate?: Date;
}

export interface PluginSettings {
	character: CharacterSettings;
	campaign: CampaignSettings;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	campaign: {
		id: '',
		name: 'An Awesome Campaign',
		startDate: new Date(),
		master: {
			name: 'An Awesome Master',
		}
	},
	character: {
		id: '',
		name: 'An Awesome Character',
		level: 1,
		playerName: 'Your Wonderful Name',
		class: 'Your Excellent Class',
		campaignId: '',
	}
}

export class SettingTab extends PluginSettingTab {
	plugin: RPGCharacterPlugin;

	constructor(app: App, plugin: RPGCharacterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		
		containerEl.createEl('h1', { text: 'RPG Character Plugin Settings'})

		containerEl.createEl('h2', { text: 'Campaign'})
		
		new Setting(containerEl)
			.setName('Campaign ID')
			.setDesc('This will download the campaign info. Ask your master.')
			.addText(text => text
				.setPlaceholder('rpg_cmpgn_id_4c58112a-f325-4397-b5b7-db137ef42414')
				.setValue(this.plugin.settings.campaign.id)
				.onChange(async (value) => {
					this.plugin.settings.campaign.id = value;
					await this.plugin.saveSettings();
					campaignName.setDisabled(false);
				}));
		
		const campaignName = new Setting(containerEl)
				.setName('Campaign Name')
				.setDesc('Name of this awesome campaign')
				.addText(text => 
					text
						.setPlaceholder('Name of the Campaign')
						.setValue(this.plugin.settings.campaign.name)
						.onChange(async (value) => {
							this.plugin.settings.campaign.name = value;
							await this.plugin.saveSettings();
						})
						.setDisabled(true)
				)
		;
	}
}
