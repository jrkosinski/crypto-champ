pragma solidity ^0.4.17;

import "./SportsBets.sol";
import "./SafeMath.sol";
import "./OracleInterface.sol";


contract BetPayout is SportsBets {

    using SafeMath for uint; 

    //constants 
    uint housePercentage = 1; 
    uint multFactor = 1000000;

    /// @notice pays out winnings to a user 
    /// @param _user the user to whom to pay out 
    /// @param _amount the amount to pay out 
    function _payOutWinnings(address _user, uint _amount) private {
        _user.transfer(_amount);
    }

    /// @notice transfers any remaining to the house (the house's cut)
    function _transferToHouse() private {
        owner.transfer(address(this).balance);
    }

    /// @notice determines whether or not the given bet is a winner 
    /// @param _outcome the match's actual outcome
    /// @param _chosenWinner the participant chosen by the bettor as the winner 
    /// @param _actualWinner the actual winner 
    /// @return true if the bet was a winner
    function _isWinningBet(OracleInterface.MatchOutcome _outcome, uint8 _chosenWinner, int8 _actualWinner) private pure returns (bool) {
        return _outcome == OracleInterface.MatchOutcome.Decided && _chosenWinner >= 0 && (_chosenWinner == uint8(_actualWinner)); 
    }

    /// @notice calculates the amount to be paid out for a bet of the given amount, under the given circumstances
    /// @param _winningTotal the total monetary amount of winning bets 
    /// @param _totalPot the total amount in the pot for the match 
    /// @param _betAmount the amount of this particular bet 
    /// @return an amount in wei
    function _calculatePayout(uint _winningTotal, uint _totalPot, uint _betAmount) private view returns (uint) {
        //calculate proportion
        uint proportion = (_betAmount.mul(multFactor)).div(_winningTotal);
        
        //calculate raw share
        uint rawShare = _totalPot.mul(proportion).div(multFactor);

        //if share has been rounded down to zero, fix that 
        if (rawShare == 0) 
            rawShare = minimumBet;
        
        //take out house's cut 
        rawShare = rawShare/(100 * housePercentage);
        return rawShare;
    }

    /// @notice calculates how much to pay out to each winner, then pays each winner the appropriate amount 
    /// @param _matchId the unique id of the match
    /// @param _outcome the match's outcome
    /// @param _winner the index of the winner of the match (if not a draw)
    function _payOutForMatch(bytes32 _matchId, OracleInterface.MatchOutcome _outcome, int8 _winner) private {
    
        Bet[] storage bets = matchToBets[_matchId]; 
        uint losingTotal = 0; 
        uint winningTotal = 0; 
        uint totalPot = 0;
        uint[] memory payouts = new uint[](bets.length);
        
        //count winning bets & get total 
        uint n;
        for (n = 0; n < bets.length; n++) {
            uint amount = bets[n].amount;
            if (_isWinningBet(_outcome, bets[n].chosenWinner, _winner)) {
                winningTotal = winningTotal.add(amount);
            } else {
                losingTotal = losingTotal.add(amount);
            }
        }
        totalPot = (losingTotal.add(winningTotal)); 

        //calculate payouts per bet 
        for (n = 0; n < bets.length; n++) {
            if (_outcome == OracleInterface.MatchOutcome.Draw) {
                payouts[n] = bets[n].amount;
            } else {
                if (_isWinningBet(_outcome, bets[n].chosenWinner, _winner)) {
                    payouts[n] = _calculatePayout(winningTotal, totalPot, bets[n].amount); 
                } else {
                    payouts[n] = 0;
                }
            }
        }

        //pay out the payouts 
        for (n = 0; n < payouts.length; n++) {
            _payOutWinnings(bets[n].user, payouts[n]); 
        }

        //transfer the remainder to the owner
        _transferToHouse();
    }
    
    
    /// @notice check the outcome of the given match; if ready, will trigger calculation of payout, and actual payout to winners
    /// @param _matchId the id of the match to check
    /// @return the outcome of the given match 
    function checkOutcome(bytes32 _matchId) public notDisabled returns (OracleInterface.MatchOutcome)  {
        OracleInterface.MatchOutcome outcome; 
        int8 winner = -1;

        (,,,,,outcome,winner) = boxingOracle.getMatch(_matchId); 

        if (outcome == OracleInterface.MatchOutcome.Decided) {
            if (!matchPaidOut[_matchId]) {
                _payOutForMatch(_matchId, outcome, winner);
            }
        } 

        return outcome; 
    }
}