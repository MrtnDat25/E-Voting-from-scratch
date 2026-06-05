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

    mapping(
        uint256 => Election
    ) public elections;

    mapping(
        bytes32 => bool
    ) public ballotHashes;

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

        elections[
            electionId
        ] = Election({

            electionId:
                electionId,

            company:
                msg.sender,

            electionHash:
                electionHash,

            resultHash:
                bytes32(0),

            closed:
                false
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
            !ballotHashes[
                ballotHash
            ],
            "Duplicate ballot"
        );

        ballotHashes[
            ballotHash
        ] = true;

        emit BallotSubmitted(
            electionId,
            ballotHash
        );
    }

    function publishResult(

        uint256 electionId,

        bytes32 resultHash

    ) external {

        elections[
            electionId
        ].resultHash =
            resultHash;

        elections[
            electionId
        ].closed =
            true;

        emit ResultPublished(
            electionId,
            resultHash
        );
    }
}