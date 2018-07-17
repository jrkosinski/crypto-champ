/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
	networks: {
		development: {
		  host: "localhost",
		  port: 8545,
		  network_id: "*" // Match any network id
		},
		rinkeby: {
		  host: "localhost", // Connect to geth on the specified
		  port: 8545,
		  from: "0x7e0f9e9b6b2c35da873aa5022b07e18c5e5b6b10", 
		  network_id: 4,
		  gas: 4612388 // Gas limit used for deploys
		}
	}
};
