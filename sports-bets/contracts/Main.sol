pragma solidity ^0.4.17;

import "./BetPayout.sol";


/*
PROBLEMS 
- owner is free to change out oracle at any time 
- who controls when betting is closed?
- is it possible for owner to steal all the money before payout time? 


TEST: 
instance.testOracleConnection()
instance.setOracleAddress()
instance.getOracleAddress()
instance.getBettableMatches()
instance.getMostRecentMatch()           
instance.getMatch(0)
instance.getMatch("")
instance.placeBet("", 0.001, 1)
instance.placeBet("", 0.001, 0)
place duplicate bet 

*/

contract Main is BetPayout {

    /// @notice gets the address of this contract 
    /// @return address 
    function getAddress() public view returns (address) {
        return this;
    }
}