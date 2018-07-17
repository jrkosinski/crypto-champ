pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./OracleInterface.sol";
import "./SafeMath.sol";

//TODO: find a way to divide proportional chumpkins 
//TODO: implement payouts 
//TODO: change fighter1 & fighter2 to participants (array)
//TODO: make generic for any sporting event with multiple participants 


/*
TEST: 
instance.testOracleConnection()
instance.setOracleAddress()
instance.getOracleAddress()
instance.getBettableMatches()
instance.getMostRecentMatch()           
instance.getMatch(0)
instance.getMatch(0x...)
instance.placeBet(0x..., 0.001, 1)
instance.placeBet(0x..., 0.001, 0)
place duplicate bet 
*/

/// @title BoxingBets
/// @author John R. Kosinski
/// @notice Takes bets and handles payouts for boxing matches 
contract BoxingBets is Ownable {

    using SafeMath for uint; 

    //boxing results oracle 
    address oracleAddress = 0x345cA3e014Aaf5dcA488057592ee47305D9B3e10;
    OracleInterface oracle = OracleInterface(oracleAddress); 
    
    //mappings 
    mapping(address => bytes32[]) private userToBets;
    mapping(bytes32 => Bet[]) private matchToBets;
    mapping(bytes32 => bool) private matchPaidOut; 

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

    /// @notice handle the payout of winnings for the given (completed) match 
    /// @param _matchId the id of the match for which to pay out winnings
    function _payOutForMatch(bytes32 _matchId) private view {

        OracleInterface.MatchOutcome outcome; 
        (,,,,,outcome) = oracle.getMatch(_matchId);
        Bet[] storage bets = matchToBets[_matchId]; 

        uint[] memory amountsToPay = new uint[](bets.length);
        bool[] memory wins = new bool[](bets.length); 
        uint i;

        if (outcome == OracleInterface.MatchOutcome.Draw) {
            for (i = 0; i < bets.length; i++) {
                amountsToPay[i] = bets[i].amount;
            }
        } else {
            uint winningAmount = 0; 
            uint losingAmount = 0; 
            uint totalPot = 0; 
            uint winnersBetAmount = 0;

            //count the winning & losing bet amounts
            for (i = 0; i < bets.length; i++) {
                if ((bets[i].outcome == BettableOutcome.Fighter1 && outcome == OracleInterface.MatchOutcome.Fighter1) || 
                    (bets[i].outcome == BettableOutcome.Fighter2 && outcome == OracleInterface.MatchOutcome.Fighter2)) {
                    winningAmount += bets[i].amount;
                    wins[i] = true;
                } else {
                    losingAmount += bets[i].amount; 
                    wins[i] = false;
                }
                totalPot += bets[i].amount;
            }

            //calculate the amount to pay out for each bet 
            for (i = 0; i < bets.length; i++) {
                amountsToPay[i] = 0; 
                if (wins[i]) {
                    uint proportion = (bets[i].amount / winnersBetAmount);
                    amountsToPay[i] = totalPot * proportion;
                }
            }
        }

        //pay out the necessary amounts 
        for (i = 0; i < bets.length; i++) {
            if (amountsToPay[i] > 0) {
                //_payOutBet(bets[i], amountsToPay[i]); 
            }
        }
    }


    /// @notice sets the address of the boxing oracle contract to use 
    /// @dev setting a wrong address may result in false return value, or error 
    /// @param _oracleAddress the address of the boxing oracle 
    /// @return true if connection to the new oracle address was successful
    function setOracleAddress(address _oracleAddress) external onlyOwner returns (bool) {
        oracleAddress = _oracleAddress;
        oracle = OracleInterface(oracleAddress); 
        return oracle.testConnection();
    }

    /// @notice gets the address of the boxing oracle being used 
    /// @return the address of the currently set oracle 
    function getOracleAddress() external view returns (address) {
        return oracleAddress;
    }

    /// @notice gets a list ids of all currently bettable matches
    /// @return array of match ids 
    function getBettableMatches() public view returns (bytes32[]) {
        return oracle.getPendingMatches(); 
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

        return oracle.getMatch(_matchId); 
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

        return oracle.getMostRecentMatch(true); 
    }

    /// @notice places a non-rescindable bet on the given match 
    /// @param _matchId the id of the match on which to bet 
    /// @param _amount the amount (in wei) to bet 
    /// @param _outcome the outcome to bet on 
    function placeBet(bytes32 _matchId, uint _amount, BettableOutcome _outcome) public payable {

        //make sure that match exists 
        require(oracle.matchExists(_matchId)); 

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
        return oracle.testConnection();
    }


    function math1() public pure returns (uint) {
        //return (10000000000000*1000000)/1010000000000000; 
        uint w = 1010000000000000; 
        uint b = 1000000000000000; 
        return (b.mul(1000000)).div(w);
    }

/*
    function _payOutBet(Bet storage _bet, uint amount) private {
        
    }
    
    function checkOutcome(bytes32 _matchId) public returns (OracleInterface.MatchOutcome)  {
        OracleInterface.MatchOutcome outcome; 

        (,,,, outcome) = oracle.getMatch(_matchId); 

        if (outcome != OracleInterface.MatchOutcome.Pending) {
            if (!matchPaidOut[_matchId]) {
                //_payOutForMatch(_matchId, outcome);
            }
        }

        return outcome; 
    }
    */
}