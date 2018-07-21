
crypto-champ
============

Motivation
----------
Mainly and in short, to explore in depth the details of ethereum smart contract development with solidity, and to provide an educational example thereof. The main points to be hit: 
- creation of a data-providing oracle
- use of an oracle 
- creation and use of library contracts
- consumption of smart contract from front end using web3 
- development using ganche testnet
- testing using rinkeby testnet 
- deployment to mainnet

Organization of Code
--------------------
- Web3 client: https://github.com/jrkosinski/crypto-champ/tree/master/client
- Oracle: https://github.com/jrkosinski/crypto-champ/tree/master/boxing-oracle
- Main Oracle Code: https://github.com/jrkosinski/crypto-champ/tree/master/boxing-oracle/contracts
- Contract: https://github.com/jrkosinski/crypto-champ/tree/master/sports-bets
- Main Contract Code: https://github.com/jrkosinski/crypto-champ/tree/master/sports-bets/contracts

How it Works: Oracle
--------------------
The oracle pushes data regarding upcoming & past boxing matches onto the ethereum blockchain. Its main function is to provide data on what boxing matches are available, and most importantly, who won them. The oracle is trusted to provide the correct winner for each match. Provides the following main user stories: 
- enter a new boxing match record 
- update status of a match (pending, underway, decided, etc.) 
- declare the winner of a match

How it Works: Contract
----------------------
Allows bets to be placed on matches, collects the bets, and pays out the winnings (a small percentage going to the house). Available matches are pulled directly from the oracle. 

The process of betting is as such: 
- place a bet, specifying a match id, a chosen winner, and an amount to bet (must be above a set minimum); the funds to cover the bet are transferred in the function call 
- on a draw, all bets are refunded in full 
- on a loss, all funds sent are just gone forever
- on a win, a percentage of the total pot is transferred to bettor, proportional to the size of his/her bet, and minus a small cut for the house 

Provides for the following main user stories: 
- query the matches currently available for betting 
- query past (decided) match results 
- place a bet 
- check the status of a bet or match 
 
How it Works: Client
--------------------
No client currently exists, as of this writing, for the oracle. The client allows users to: 
- see a list of bettable and decided matches 
- see a list of their own bets 
- query the total amount bet (by all users combined) on a particular match 
- place a bet 
- query the status of a bet or match 

Libraries Used or Adapted
-------------------------
- OpenZeppelin's Ownable contract https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/ownership
- OpenZeppelin's SafeMath contract https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/math