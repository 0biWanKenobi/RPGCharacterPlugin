import crypto, { type KeyObject } from "crypto";
import { SecretStorage } from "obsidian";

export type KeyPair = {
    publicKey: KeyObject;
    privateKey: KeyObject;
};

export default class AuthenticationService {

    private keyPair: KeyPair | undefined;

    /**
     *
     */
    constructor(ss: SecretStorage) {
        const storedKp = ss.getSecret("kp");
        if(storedKp) {
            this.keyPair = JSON.parse(storedKp);
        }
        else {
            this.keyPair = crypto.generateKeyPairSync("x25519");
            ss.setSecret("kp", JSON.stringify(this.keyPair));   
        }
    }

    public getPublicKey(): Buffer {
        if (!this.keyPair) {
            throw new Error("Key pair is not initialized");
        }
        return this.keyPair.publicKey.export({ type: "spki", format: "der" });
    }
}
