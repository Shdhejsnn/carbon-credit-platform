// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonCredit {
    address public owner;

    struct Credit {
        uint256 id;
        address issuer;
        address holder;
        uint256 amount;
    }

    uint256 public creditCounter = 0;
    mapping(uint256 => Credit) public credits;

    event CreditIssued(uint256 id, address issuer, address holder, uint256 amount);
    event CreditTransferred(uint256 id, address from, address to);

    constructor() {
        owner = msg.sender;
    }

    function issueCredit(address _holder, uint256 _amount) public {
        require(msg.sender == owner, "Only owner can issue credits");

        creditCounter++;
        credits[creditCounter] = Credit(creditCounter, msg.sender, _holder, _amount);

        emit CreditIssued(creditCounter, msg.sender, _holder, _amount);
    }

    function transferCredit(uint256 _id, address _to) public {
        require(credits[_id].holder == msg.sender, "You can only transfer credits you own");

        credits[_id].holder = _to;

        emit CreditTransferred(_id, msg.sender, _to);
    }

    function getCredit(uint256 _id) public view returns (Credit memory) {
        return credits[_id];
    }
}
