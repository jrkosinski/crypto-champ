pragma solidity ^0.4.17;

import "./SportsBets.sol";
import "./SafeMath.sol";
import "./OracleInterface.sol";


contract BetPayout is SportsBets {

    using SafeMath for uint; 

    //constants 
    uint houseCutPct = 1; 
    uint multFactor = 1000000;

    function math1() public pure returns (uint) {
        //return (10000000000000*1000000)/1010000000000000; 
        uint w = 1010000000000000; 
        uint b = 1000000000000000; 
        return (b.mul(1000000)).div(w);
    }

    function _payOutBet(address user, uint amount) private {
        user.transfer(amount);
    }

    function _transferToHouse() private {
        owner.transfer(address(this).balance);
    }

    function _isWinningBet(BettableOutcome betOutcome, OracleInterface.MatchOutcome actualOutcome) private pure returns (bool) {
        return ((betOutcome == BettableOutcome.Fighter1 && actualOutcome == OracleInterface.MatchOutcome.Fighter1) || 
        (betOutcome == BettableOutcome.Fighter2 && actualOutcome == OracleInterface.MatchOutcome.Fighter2));
    }

    function _calculatePayout(uint _winningTotal, uint _totalPot, uint _betAmount) private view returns (uint) {
        //calculate proportion
        uint proportion = (_betAmount.mul(multFactor)).div(_winningTotal);
        
        //calculate raw share
        uint rawShare = _totalPot.mul(proportion).div(multFactor);
        
        //take out house's cut 
        return rawShare;
    }

    function _payOutForMatch(bytes32 _matchId, OracleInterface.MatchOutcome outcome) private {
    
        Bet[] storage bets = matchToBets[_matchId]; 
        uint losingTotal = 0; 
        uint winningTotal = 0; 
        uint totalPot = 0;
        uint[] memory payouts = new uint[](bets.length);
        
        //count winning bets & get total 
        uint n;
        for (n = 0; n < bets.length; n++) {
            uint amount = bets[n].amount;
            if (_isWinningBet(bets[n].outcome, outcome)) {
                winningTotal = winningTotal.add(amount);
            } else {
                losingTotal = losingTotal.add(amount);
            }
        }
        totalPot = (losingTotal.add(winningTotal)); 

        //calculate payouts per bet 
        for (n = 0; n < bets.length; n++) {
            if (outcome == OracleInterface.MatchOutcome.Draw) {
                payouts[n] = bets[n].amount;
            } else {
                if (_isWinningBet(bets[n].outcome, outcome)) {
                    payouts[n] = _calculatePayout(winningTotal, totalPot, bets[n].amount); 
                } else {
                    payouts[n] = 0;
                }
            }
        }

        //pay out the payouts 
        for (n = 0; n < payouts.length; n++) {
            _payOutBet(bets[n].user, payouts[n]); 
        }

        //transfer the remainder to the owner
        _transferToHouse();
    }
    
    
    function checkOutcome(bytes32 _matchId) public returns (OracleInterface.MatchOutcome)  {
        OracleInterface.MatchOutcome outcome; 

        (,,,,, outcome) = boxingOracle.getMatch(_matchId); 

        if (outcome != OracleInterface.MatchOutcome.Pending) {
            if (!matchPaidOut[_matchId]) {
                _payOutForMatch(_matchId, outcome);
            }
        } 

        return outcome; 
    }
}