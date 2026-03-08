import {computed} from "@preact/signals";
import {ButtonComponent, Notice, Setting, SettingGroup} from "obsidian";
import {PluginSetting} from "./index";

const initDungeonMasterIdSetting = (setting: Setting, value: string) => {
	return PluginSetting.textual(
		setting,
		'Dungeon Master ID',
		'This will enable sending a connection request to your DM, and accessing their campaigns when they accept.',
		value
	);
}

const initDungeonMasterNameSetting = (	setting: Setting, value: string) => {
	return PluginSetting.textual(
		setting,
		'Name',
		'This will show in the list of your DMs, so you can keep track.',
		value	
	);
}


type DmAddOnClickCallback = (dmId: string, dmName: string) => Promise<void>;
export const initAddDungeonMasterOption = (
	containerEl: HTMLElement,
)=> {

	let dmIdInput: PluginSetting<string>;
	let dmNameInput: PluginSetting<string>;
	let button: ButtonComponent;
	new SettingGroup(containerEl)
		.setHeading('Add New')
		.addSetting((s) => dmIdInput = initDungeonMasterIdSetting(s, ''))
		.addSetting((s) => dmNameInput = initDungeonMasterNameSetting(s, ''))
		.addSetting((s) => {			
				const buttonDisabled = computed(() => !dmIdInput.signal.value)
				const buttonTooltip = computed(() => 
					buttonDisabled.value
						? 'Input a DM Id to send the request'
						: 'Tap to send the request'
				)
				s.addButton( btn => {
					btn.setButtonText('Send request to your DM')
						.setDisabled(buttonDisabled.value)
						.setTooltip(buttonTooltip.value)
					
					buttonDisabled.subscribe(async (isDisabled) => {
						btn.setDisabled(isDisabled).setTooltip(buttonTooltip.value);
					})
					button = btn;					
				})
		})
		.addClass('plugin-setting-group')
	
	const returnedObject = {
		...dmIdInput!,
		onAddClicked: (callback: DmAddOnClickCallback) => {
			button.onClick(async () => {
				new Notice('Join Request Sent!')
				await callback(dmIdInput.signal.value, dmNameInput.signal.value);			
			})
			return returnedObject;
		} 
	}
	return returnedObject;
}
