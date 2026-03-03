import AuthenticationService from "authentication";
import { DataConnection, Peer } from "peerjs";

export default class P2PService {

    private peer: Peer | undefined;
    private peerId: string | undefined;
    private authService: AuthenticationService;

    private peerIdPromise = Promise.withResolvers<string>();

    /**
     * Builds the peer and sets up the "open" event listener
     * to store the peer ID when the connection is established.
     */
    constructor(authService: AuthenticationService) {
        this.peer = new Peer();
        this.authService = authService;
        this.peer.on("open", (id) => {
            this.peerId = id;
            this.peerIdPromise.resolve(id);
        });
    }


    public async getPeerIdAsync(): Promise<string> {
        return this.peerIdPromise.promise;
    }

    public connectToPeerAsync(peerId: string): Promise<DataConnection> {

        if (!this.peer) {
            return Promise.reject(new Error("PeerJS is not initialized"));
        }
        
        const { promise, resolve, reject } = Promise.withResolvers<DataConnection>();
        const connection = this.peer.connect(peerId);
        
        connection.on("open", () => {
            resolve(connection);
        });
        connection.on("error", (err) => {
            reject(err);
        });
        
        return promise;
    }

    public sendHandshake(connection: DataConnection) {
        const publicKey = this.authService.getPublicKey();
        connection.send({ type: "handshake", publicKey });
    }
}