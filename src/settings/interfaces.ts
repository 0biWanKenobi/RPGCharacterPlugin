export interface DungeonMasterSettings {
	id: string;
	name: string;
	image?: string;
	campaigns: string[];
	lastUpdated: Date;
}

export interface CharacterSettings {
	id: string;
	campaignId: string;
	name: string;
	playerName: string;
	image?: string;
	level: number;
	class: string;
	lastUpdated: Date;
}

export interface CampaignSettings {
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
