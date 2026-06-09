import ElectionResult
from "./result.model.js";
export const getResult =
    async(req, res) => {
        try {
            const result =
                await ElectionResult
                .findOne({
                    electionId: req.params
                        .electionId
                })
                .populate(
                    "results.candidateId"
                )
                .populate(
                    "winnerCandidateId"
                );
            if (!result) {
                return res
                    .status(404)
                    .json({
                        status: "error",
                        message: "Result not found"
                    });
            }
            return res.json({
                status: "success",
                data: result
            });
        } catch (err) {
            return res
                .status(500)
                .json({
                    status: "error",
                    message: err.message
                });
        }
    };