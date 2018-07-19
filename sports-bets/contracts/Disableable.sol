pragma solidity ^0.4.17;

import "./Ownable.sol";


contract Disableable is Ownable {
    bool disabled = false; 

    modifier notDisabled() {
        require(!disabled);
        _;
    }

    function Disable() external onlyOwner {
        disabled = true; 
    }

    function Enable() external onlyOwner {
        disabled = false; 
    }
}
