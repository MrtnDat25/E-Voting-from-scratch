import Election from "../elections/election.model.js";
import Ballot from "../ballots/ballot.model.js";
import ElectionResult from "../results/result.model.js";
import ElectionVoter from "../elections/election-voters/electionVoter.model.js";

// COMPANY DASHBOARD
export const getCompanyDashboard = async(req, res) => {
    try {

        const elections = await Election.find({
            companyId: req.user.userId,
        });

        const electionIds =
            elections.map(e => e._id);

        const latestElections =
            await Election.find({
                companyId: req.user.userId,
            })
            .sort({
                createdAt: -1
            })
            .limit(5)
            .select("title status electionType createdAt");

        if (!electionIds.length) {

            return res.json({
                status: "success",
                data: {
                    totalElections: 0,
                    activeElections: 0,
                    totalVotes: 0,
                    publishedResults: 0,
                    latestElections: [],
                },
            });

        }

        const [
            activeElections,
            totalVotes,
            publishedResults,
            drafts,
            votingOpen,
            published
        ] = await Promise.all([

            Election.countDocuments({
                companyId: req.user.userId,
                status: "voting_open",
            }),

            Ballot.countDocuments({
                electionId: {
                    $in: electionIds,
                },
            }),

            ElectionResult.countDocuments({
                electionId: {
                    $in: electionIds,
                },
            }),

            Election.countDocuments({
                companyId: req.user.userId,
                status: "draft",
            }),

            Election.countDocuments({
                companyId: req.user.userId,
                status: "voting_open",
            }),

            Election.countDocuments({
                companyId: req.user.userId,
                status: "published",
            }),

        ]);

        return res.json({
            status: "success",
            data: {
                totalElections: elections.length,
                activeElections,
                totalVotes,
                publishedResults,

                drafts,
                votingOpen,
                published,

                latestElections,
            },
        });

    } catch (err) {

        return res.status(500).json({
            status: "error",
            message: err.message,
        });

    }
};

// VOTER DASHBOARD
export const getVoterDashboard = async(req, res) => {

    try {

        const joined =
            await ElectionVoter.countDocuments({
                voterId: req.user.userId,
            });

        const voted =
            await ElectionVoter.countDocuments({
                voterId: req.user.userId,
                hasVoted: true,
            });

        const requestedTokens =
            await ElectionVoter.countDocuments({
                voterId: req.user.userId,
                hasRequestedToken: true,
            });

        const myElections =
            await ElectionVoter.find({
                voterId: req.user.userId,
            })
            .populate("electionId")
            .sort({
                createdAt: -1,
            })
            .limit(5);

        return res.json({
            status: "success",
            data: {
                joined,
                voted,
                requestedTokens,
                myElections,
            },
        });

    } catch (err) {

        return res.status(500).json({
            status: "error",
            message: err.message,
        });

    }
};