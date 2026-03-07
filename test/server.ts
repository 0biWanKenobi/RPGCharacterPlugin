import {Peer} from "peerjs";

function startServer(){
	console.log("Starting server...");
	const myPeerId = `rpg_dm_id_${crypto.randomUUID()}`
	const dmClient = new Peer(myPeerId);
	dmClient.on('open', (serverPeerId) => {
		if(serverPeerId != myPeerId){
			throw Error("Server returned peer ID does not match ours!!");
		}
		console.log(`Server ID is ${serverPeerId}`);
		// @ts-ignore
		document.querySelector("#peer").innerHTML = serverPeerId;
	})
	
	dmClient.on('connection', (dataConnection) => {
		console.log(`Connected to ${dataConnection.peer}`);
		dataConnection.on('data', (data) => {
			console.log(`Received ${JSON.stringify(data)}`);
			if(isPlayerRequest(data)) {
				dataConnection.send({
					 id: crypto.randomUUID(),
					 name: 'Test Character',
					 class: 'Ranger',
					 level: 1, 
					 type: "CharacterMessage"
				})
			}
		})
	})
	
	dmClient.on('error', (err) => {
		console.log(err);
	})
	
	return {
		dmClient,
		exit: () => {
			dmClient.destroy();
		}
		
	}
}

function isPlayerRequest(data: unknown): data is PlayerRequest {
	return typeof data === "object"
		&& data != null
		&& 'baseType' in data
		&& data.baseType == 'player'
	;
}

type Request = {
	baseType: 'player'
}

type PlayerRequest = Request & {
	id: string;
	name: string;
	sentAt: Date;
	type: 'join' | 'getCharacter' | 'leave'
}

type PlayerCharacterRequest = PlayerRequest & {
	campaignId: string;
	characterId: string;
}

const server = startServer();
window.addEventListener("beforeunload", () => {
	console.log("Exiting server...");
	server.exit();
});
