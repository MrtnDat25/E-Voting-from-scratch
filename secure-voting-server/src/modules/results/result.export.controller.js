import XLSX from "xlsx";
import ElectionResult
from "./result.model.js";
export const exportResultExcel =
async (req,res)=>{
  try{
    const result =
      await ElectionResult
      .findOne({
        electionId:
          req.params.electionId
      })
      .populate(
        "results.candidateId"
      );
    if(!result){
      return res.status(404).json({
        status:"error",
        message:
          "Result not found"
      });
    }
    const rows =
      result.results.map(item=>({
        Candidate:
          item.candidateId?.name,
        Email:
          item.candidateId?.email,
        Votes:
          item.votes
      }));
    const workbook =
      XLSX.utils.book_new();
    const worksheet =
      XLSX.utils.json_to_sheet(
        rows
      );
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Results"
    );
    const buffer =
      XLSX.write(
        workbook,
        {
          type:"buffer",
          bookType:"xlsx"
        }
      );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=result.xlsx"
    );
    return res.send(buffer);
  }
  catch(err){
    return res.status(500).json({
      status:"error",
      message:
        err.message
    });
  }
};