import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, PluginSettings, SettingTab} from "./settings";
import "./styles.css"
import "rpg_shared/styles.css"

export default class RPGCharacterPlugin extends Plugin {
	settings!: PluginSettings;

	async onload() {
		console.log('Loading RPG Character Plugin');
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}