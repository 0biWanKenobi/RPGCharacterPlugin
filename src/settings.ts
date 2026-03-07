import {App, Notice, PluginSettingTab, setIcon, Setting} from "obsidian";
import type RPGCharacterPlugin from "./main";
import P2PService from "./p2p";
import {initCampaignAddButton} from "./settings/campaign";
import {initAddDungeonMasterOption } from "./settings/dungeonMaster";

interface DungeonMasterSettings {
	id: string;
	name: string;
	image?: string;
	campaigns: string[];
	lastUpdated: Date;
}

interface CharacterSettings {
	id: string;
	campaignId: string;
	name: string;
	playerName: string;
	image?: string;
	level: number;
	class: string;
	lastUpdated: Date;
}

interface CampaignSettings {
	id: string;
	name: string;
	masterId: string; 
	playerCount: number;
	joined: boolean;
	yourCharacterId?: string;
	startDate: Date;
	endDate?: Date;
	lastUpdated: Date;
}

export interface PluginSettings {
	dungeonMasters: DungeonMasterSettings[];
	joinedCampaigns: string[];
	playerPeerId: string;
	lastUpdated?: Date;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	dungeonMasters: [],
	joinedCampaigns: [],
	playerPeerId: '',
	lastUpdated: undefined,	
}

export class SettingTab extends PluginSettingTab {
	plugin: RPGCharacterPlugin;
	private readonly p2pService: P2PService;

	constructor(app: App, plugin: RPGCharacterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.p2pService = new P2PService(this.plugin.settings.playerPeerId);
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		
		containerEl.createEl('h2', { text: 'RPG Character Plugin Settings', cls: 'plugin-settings-title' });
		
		
		headerWithIcon(containerEl, 'Dungeon Masters', 'dice');
		
		const dmGallery = containerEl.createEl('div', {cls: 'plugin-settings-dm-gallery'})

		//TODO: add a search function over the DMs
		
		//TODO: allow user to set a nickname for the master, so we can show it in the DMs gallery as a pending request
		initAddDungeonMasterOption(containerEl)
			.onAddClicked(async (dmId, dmName) => {
				await this.p2pService.getPeerIdAsync();
				(await this.p2pService.connectToPeerAsync(dmId))				
					.requestCharacter()
					.onCharacterReceived((c) => {
						new Notice('Character sheet received');
						console.log(c);
					});
			this.plugin.settings.dungeonMasters.push({
				id: dmId,
				name: dmName,
				campaigns: [],
				lastUpdated: new Date(),
			})
			await this.plugin.saveSettings();
			this.display()
			});
		
		for (const dmSettings of this.plugin.settings.dungeonMasters) {
			const dmEl = dmGallery.createEl(
				'div',
				{cls: 'plugin-settings-dm-gallery-item', attr: {'data-dm-id': dmSettings.id}},
			)
			dmEl.createEl('div', {text: dmSettings.name, cls: 'plugin-settings-dm-gallery-item-name'})
			if(dmSettings.image) {
				dmEl.createEl('div', {cls: 'plugin-settings-dm-gallery-item-avatar'})
			}
		}
		
		
		//TODO: campaign gallery, sorted by master as a default, sortable by date, name

		headerWithIcon(containerEl, 'Campaigns', 'scroll-text');
		
		const campaignGallery = containerEl.createEl('div', {cls: 'plugin-settings-campaigns-gallery'})
		
		const campaignAddBtn = initCampaignAddButton(containerEl)
		

		headerWithIcon(containerEl, 'Characters', 'file-user');
		
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
