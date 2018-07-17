pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./OracleInterface.sol";


/// @title SportsBets
/// @author John R. Kosinski
/// @notice Takes bets and handles payouts for sporting matches 
contract SportsBets is Ownable {

    //boxing results oracle 
    address internal boxingOracleAddr = 0x345cA3e014Aaf5dcA488057592ee47305D9B3e10;
    OracleInterface internal boxingOracle = OracleInterface(boxingOracleAddr); 

    //constants
    uint internal minimumBet = 1000000000000;
    
    //mappings 
    mapping(address => bytes32[]) internal userToBets;
    mapping(bytes32 => Bet[]) internal matchToBets;
    mapping(bytes32 => bool) internal matchPaidOut; 

    struct Bet {
        address user;
        bytes32 matchId;
        uint amount; 
        BettableOutcome outcome; 
    }

    enum BettableOutcome {
        Fighter1,
        Fighter2
    }

    /// @notice determines whether or not the user has already bet on the given match
    /// @param _user address of a user
    /// @param _matchId id of a match 
    /// @return true if the given user has already placed a bet on the given match 
    function _userHasBetOnMatch(address _user, bytes32 _matchId) private view returns (bool) {
        bytes32[] storage userBets = userToBets[_user]; 
        if (userBets.length > 0) {
            for (uint n = 0; n < userBets.length; n++) {
                if (userBets[n] == _matchId) {
                    return true;
                }
            }
        }

        return false;
    }


    /// @notice sets the address of the boxing oracle contract to use 
    /// @dev setting a wrong address may result in false return value, or error 
    /// @param _oracleAddress the address of the boxing oracle 
    /// @return true if connection to the new oracle address was successful
    function setOracleAddress(address _oracleAddress) external onlyOwner returns (bool) {
        boxingOracleAddr = _oracleAddress;
        boxingOracle = OracleInterface(boxingOracleAddr); 
        return boxingOracle.testConnection();
    }

    /// @notice gets the address of the boxing oracle being used 
    /// @return the address of the currently set oracle 
    function getOracleAddress() external view returns (address) {
        return boxingOracleAddr;
    }

    /// @notice gets a list ids of all currently bettable matches
    /// @return array of match ids 
    function getBettableMatches() public view returns (bytes32[]) {
        return boxingOracle.getPendingMatches(); 
    }

    /// @notice returns the full data of the specified match 
    /// @param _matchId the id of the desired match
    /// @return match data 
    function getMatch(bytes32 _matchId) public view returns (
        bytes32 id,
        string name, 
        string fighter1, 
        string fighter2, 
        uint date, 
        OracleInterface.MatchOutcome outcome) { 

        return boxingOracle.getMatch(_matchId); 
    }

    /// @notice returns the full data of the most recent bettable match 
    /// @return match data 
    function getMostRecentMatch() public view returns (
        bytes32 id,
        string name, 
        string fighter1, 
        string fighter2, 
        uint date, 
        OracleInterface.MatchOutcome outcome) { 

        return boxingOracle.getMostRecentMatch(true); 
    }

    /// @notice places a non-rescindable bet on the given match 
    /// @param _matchId the id of the match on which to bet 
    /// @param _amount the amount (in wei) to bet 
    /// @param _outcome the outcome to bet on 
    function placeBet(bytes32 _matchId, uint _amount, BettableOutcome _outcome) public payable {

        //make sure that match exists 
        require(boxingOracle.matchExists(_matchId)); 

        //user should not have already placed bet (can't change bet after placing) 
        require(!_userHasBetOnMatch(msg.sender, _matchId)); 

        //add the new bet 
        Bet[] storage bets = matchToBets[_matchId]; 
        bets.push(Bet(msg.sender, _matchId, _amount, _outcome))-1; 

        //add the mapping
        bytes32[] storage userBets = userToBets[msg.sender]; 
        userBets.push(_matchId); 
    }

    /// @notice tests that we are connected to a valid oracle for match results 
    /// @return true if valid connection 
    function testOracleConnection() public view returns(bool) {
        return boxingOracle.testConnection();
    }
}