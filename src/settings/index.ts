import {signal, Signal} from "@preact/signals";
import type { Setting } from "obsidian";

export class PluginSetting<T> {
    setting: Setting;
    signal:Signal<T>;

    /**
     *
     */
    constructor(setting: Setting, campaignId: Signal<T>) {
        this.setting = setting;
        this.signal = campaignId;
    }

    public subscribe(callback: (value: T, setting: Setting) => void) {
        this.signal.subscribe((value) => callback(value, this.setting));
        return this;
    }
	
	public static textual(setting: Setting, name: string, desc: string, value: string) {
		const _signal = signal(value);
		setting
			.setName(name)
			.setDesc(desc)
			.addText(text => text
				.onChange( v => _signal.value = v)
			);
		
		return new PluginSetting(setting, _signal);		
	}
}
