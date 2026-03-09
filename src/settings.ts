import {App, Notice, PluginSettingTab, setIcon, Setting} from "obsidian";
import type RPGCharacterPlugin from "./main";
import P2PService from "./p2p";
import {initCampaignAddButton} from "./settings/campaign";
import {
	AddDungeonMasterModal,
	initDungeonMasterGalleryItem, RemoveDungeonMasterModal
} from "./settings/dungeonMaster";
import {DungeonMasterSettings} from "./settings/interfaces";



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

		//TODO: add a search function over the DMs
		const dmGallery = containerEl.createEl('div', {cls: 'plugin-settings-dm-gallery'})
		
		const removeDmModal = new RemoveDungeonMasterModal(this.app);

		for (const dmSettings of this.plugin.settings.dungeonMasters) {			
			const galleryItem  = initDungeonMasterGalleryItem(dmGallery, dmSettings);
			galleryItem.icon.onclick = async () => {
				const shouldRemove = await removeDmModal.waitResponse();
				if(!shouldRemove) return;
				const indexToDelete = this.plugin.settings.dungeonMasters
					.findIndex(d => d.id === galleryItem.id);
				this.plugin.settings.dungeonMasters.splice(indexToDelete, 1);
				await this.plugin.saveSettings();
				this.display();
			}
		}
		
		const dmAddModal = new AddDungeonMasterModal(this.app);
		dmAddModal.content
			.onAddClicked(async (dmId, dmName) => {
				await this.p2pService.getPeerIdAsync();
				// TODO: convert to promise.then? right now it blocks until a response is received!!
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
				dmAddModal.close();
			});
		
		new Setting(containerEl)
			.addButton( btn => {
				btn.setButtonText('Add New Dungeon Master')
					.onClick(() => dmAddModal.open())
			})
			
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
