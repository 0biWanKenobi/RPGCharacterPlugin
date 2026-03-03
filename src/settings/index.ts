import type { Signal } from "@preact/signals";
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
}