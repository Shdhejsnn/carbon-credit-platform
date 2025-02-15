// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenScore {
    struct Company {
        uint256 greenScore;
        uint256 totalCreditsSold;
        uint256 totalCreditsBought;
        uint256 emissionsReduced;
    }

    mapping(address => Company) public companies;

    event GreenScoreUpdated(address indexed company, uint256 newScore);

    function updateGreenScore(
        address company,
        uint256 creditsSold,
        uint256 creditsBought,
        uint256 emissionsReduced
    ) public {
        companies[company].totalCreditsSold += creditsSold;
        companies[company].totalCreditsBought += creditsBought;
        companies[company].emissionsReduced += emissionsReduced;

        // Green Score Logic
        if (emissionsReduced >= creditsSold) {
            companies[company].greenScore += creditsSold * 10; // Higher reward for actual reduction
        } else {
            companies[company].greenScore += creditsSold * 5; // Lower reward for just selling
        }

        emit GreenScoreUpdated(company, companies[company].greenScore);
    }

    function getGreenScore(address company) public view returns (uint256) {
        return companies[company].greenScore;
    }
}
