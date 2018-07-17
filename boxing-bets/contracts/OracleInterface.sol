pragma solidity ^0.4.17;

contract OracleInterface {

    enum MatchOutcome {
        Pending,    //match has not been fought to decision
        Draw,       //anything other than a clear winner (e.g. cancelled)
        Fighter1,   //fighter1 won
        Fighter2    //fighter2 won
    }

    function getPendingMatches() public view returns (bytes32[]);

    function getAllMatches() public view returns (bytes32[]);

    function matchExists(bytes32 _matchId) public view returns (bool); 

    function getMatch(bytes32 _matchId) public view returns (
        bytes32 id,
        string _name, 
        string _fighter1, 
        string _fighter2, 
        uint _date, 
        MatchOutcome _outcome);

    function getMostRecentMatch(bool _pending) public view returns (
        bytes32 id,
        string _name, 
        string _fighter1, 
        string _fighter2, 
        uint _date, 
        MatchOutcome _outcome);

    function testConnection() public pure returns (bool);
}
