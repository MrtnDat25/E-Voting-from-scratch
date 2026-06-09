// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecureVoting {

    struct Election {
        uint256 electionId;
        address company;
        bytes32 electionHash;
        bytes32 resultHash;
        bool closed;
    }

    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(bytes32 => bool)) public ballotHashes;

    event ElectionCreated(
        uint256 electionId,
        bytes32 electionHash
    );

    event BallotSubmitted(
        uint256 electionId,
        bytes32 ballotHash
    );

    event ResultPublished(
        uint256 electionId,
        bytes32 resultHash
    );

    function createElection(
        uint256 electionId,
        bytes32 electionHash
    ) external {

        require(
            elections[electionId].company == address(0),
            "Election already exists"
        );

        elections[electionId] = Election({
            electionId: electionId,
            company: msg.sender,
            electionHash: electionHash,
            resultHash: bytes32(0),
            closed: false
        });

        emit ElectionCreated(
            electionId,
            electionHash
        );
    }

    function submitBallot(
        uint256 electionId,
        bytes32 ballotHash
    ) external {

        require(
            elections[electionId].company != address(0),
            "Election not found"
        );

        require(
            !elections[electionId].closed,
            "Election closed"
        );

        require(
            !ballotHashes[electionId][ballotHash],
            "Duplicate ballot"
        );

        ballotHashes[electionId][ballotHash] = true;

        emit BallotSubmitted(electionId, ballotHash);
    }

    function publishResult(
        uint256 electionId,
        bytes32 resultHash
    ) external {

        Election storage election =
            elections[electionId];

        require(
            election.company != address(0),
            "Election not found"
        );

        require(
            election.company == msg.sender,
            "Not owner"
        );

        require(
            !election.closed,
            "Already closed"
        );

        election.resultHash = resultHash;
        election.closed = true;

        emit ResultPublished(
            electionId,
            resultHash
        );
    }

    function getElection(
        uint256 electionId
    )
        external
        view
        returns (
            uint256,
            address,
            bytes32,
            bytes32,
            bool
        )
    {
        Election memory election =
            elections[electionId];

        return (
            election.electionId,
            election.company,
            election.electionHash,
            election.resultHash,
            election.closed
        );
    }
}