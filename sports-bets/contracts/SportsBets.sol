pragma solidity ^0.4.17;

import "./Disableable.sol";
import "./OracleInterface.sol";

//TODO: cache matches so that we don't have to keep calling another contract (does it waste gas?)


/// @title SportsBets
/// @author John R. Kosinski
/// @notice Takes bets and handles payouts for sporting matches 
contract SportsBets is Disableable {

    //boxing results oracle 
    address internal boxingOracleAddr = 0x6Dca9BB7dA4c09930A466956E0A3e3F7fee1ef7D;
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
        uint8 chosenWinner; 
    }

    /// @notice determines whether or not the user has already bet on the given match
    /// @param _user address of a user
    /// @param _matchId id of a match 
    /// @param _chosenWinner the index of the participant to bet on (to win)
    /// @return true if the given user has already placed a bet on the given match 
    function _betIsValid(address _user, bytes32 _matchId, uint8 _chosenWinner) private view returns (bool) {

        //ensure that user hasn't already bet on match 
        bytes32[] storage userBets = userToBets[_user]; 
        if (userBets.length > 0) {
            for (uint n = 0; n < userBets.length; n++) {
                if (userBets[n] == _matchId) {
                    //user has already bet on match 
                    return false;
                }
            }
        }

        //ensure that bet is valid for the match 
        //TODO: combine this with other validation so that match is only gotten once 
        uint8 participantCount; 
        (,,,participantCount,,,) = boxingOracle.getMatch(_matchId);
        if (_chosenWinner >= participantCount)
            return false;

        return true;
    }

    /// @notice determines whether or not bets may still be accepted for the given match
    /// @param _matchId id of a match 
    /// @return true if the match is bettable 
    function _matchOpenForBetting(bytes32 _matchId) private view returns (bool) {
        OracleInterface.MatchOutcome outcome; 
        (,,,,,outcome,) = getMatch(_matchId);
        return outcome == OracleInterface.MatchOutcome.Pending;
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

    /// @notice gets a list ids of all matches
    /// @return array of match ids 
    function getMatches() public view returns (bytes32[]) {
        return boxingOracle.getAllMatches(); 
    }

    /// @notice returns the full data of the specified match 
    /// @param _matchId the id of the desired match
    /// @return match data 
    function getMatch(bytes32 _matchId) public view returns (
        bytes32 id,
        string name, 
        string participants,
        uint8 participantCount,
        uint date, 
        OracleInterface.MatchOutcome outcome, 
        int8 winner) { 

        return boxingOracle.getMatch(_matchId); 
    }

    /// @notice returns the full data of the most recent bettable match 
    /// @return match data 
    function getMostRecentMatch() public view returns (
        bytes32 id,
        string name, 
        string participants,
        uint participantCount, 
        uint date, 
        OracleInterface.MatchOutcome outcome, 
        int8 winner) { 

        return boxingOracle.getMostRecentMatch(true); 
    }

    /// @notice gets the current matches on which the user has bet 
    /// @return array of match ids 
    function getUserBets() public view returns (bytes32[]) {
        return userToBets[msg.sender];
    }

    /// @notice gets a user's bet on a given match 
    /// @param _matchId the id of the desired match 
    /// @return tuple containing the bet amount, and the index of the chosen winner (or (0,0) if no bet found)
    function getUserBet(bytes32 _matchId) public view returns (uint amount, uint8 winner) { 
        Bet[] storage bets = matchToBets[_matchId]; 
        for (uint n = 0; n < bets.length; n++) {
            if (bets[n].user == msg.sender) {
                return (bets[n].amount, bets[n].chosenWinner);
            }
        }
        return (0, 0); 
    }

    /// @notice places a non-rescindable bet on the given match 
    /// @param _matchId the id of the match on which to bet 
    /// @param _chosenWinner the index of the participant chosen as winner
    function placeBet(bytes32 _matchId, uint8 _chosenWinner) public payable notDisabled {

        //bet must be above a certain minimum 
        require(msg.value >= minimumBet);

        //make sure that match exists 
        require(boxingOracle.matchExists(_matchId)); 

        //require that chosen winner falls within the defined number of participants for match
        require(_betIsValid(msg.sender, _matchId, _chosenWinner));

        //match must still be open for betting
        require(_matchOpenForBetting(_matchId)); 

        //transfer the money into the account 
        //TODO: why this not work
        //address(this).transfer(msg.value);

        //add the new bet 
        Bet[] storage bets = matchToBets[_matchId]; 
        bets.push(Bet(msg.sender, _matchId, msg.value, _chosenWinner))-1; 

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
