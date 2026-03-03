import {App, Notice, PluginSettingTab, setIcon, Setting} from "obsidian";
import type RPGCharacterPlugin from "./main";
import P2PService from "./p2p";
import AuthenticationService from "./authentication";
import {initCampaignIdSetting, initCampaignNameSetting} from "./settings/campaign";
import { initCharacterIdSetting, initCharacterNotLoadedWarning } from "./settings/character";
import { computed } from "@preact/signals";

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
	private readonly p2pService: P2PService;
	private readonly authService: AuthenticationService;

	constructor(app: App, plugin: RPGCharacterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.authService = new AuthenticationService(app.secretStorage);
		this.p2pService = new P2PService(this.authService);
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		
		containerEl.createEl('h2', { text: 'RPG Character Plugin Settings', cls: 'plugin-settings-title' });

		headerWithIcon(containerEl, 'Campaign', 'scroll-text');
		
		const campaignIdSetting = initCampaignIdSetting(
			containerEl,
			this.plugin.settings.campaign.id
		)
		.subscribe(async(value) => {
			this.plugin.settings.campaign.id = value;
			await this.plugin.saveSettings();
		});
		
		const campaignNameDisabled = computed(() => (campaignIdSetting.signal.value || '') == '');
		
		initCampaignNameSetting(
			containerEl,
			this.plugin.settings.campaign.name,
			campaignNameDisabled
		)
		.subscribe(async (value) => {
			this.plugin.settings.campaign.name = value;
			await this.plugin.saveSettings();
		});

		headerWithIcon(containerEl, 'Character', 'file-user');

		initCharacterIdSetting(
			containerEl,
			this.plugin.settings.character.id
		)
		.subscribe(async(value) => {
			this.plugin.settings.character.id = value;
			await this.plugin.saveSettings();
		});

		this.p2pService.getPeerIdAsync().then(async (peerId )=> {
			this.plugin.settings.character.id = peerId;
			await this.plugin.saveSettings();
		});


		initCharacterNotLoadedWarning(containerEl)
		.subscribe((shouldHide, warning ) => {
			if(shouldHide) warning.settingEl.hide();
			else warning.settingEl.show();
		});
		
	}
}

const headerWithIcon = (parent: HTMLElement, title: string, icon: string) => {
	const campaignHeader = new Setting(parent)
	.setName(title)
	.setClass('header-with-icon')
	.setHeading();
	
	setIcon(campaignHeader.settingEl.createDiv({cls: 'header-icon-wrapper'}), icon);

	return campaignHeader;
}