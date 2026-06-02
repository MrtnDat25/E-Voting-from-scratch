const { formidable } = require("formidable");
const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const User = require("../../users/user.model");
const Election = require("../election.model");
const ElectionVoter = require("./electionVoter.model");

exports.importVoters = async (req, res) => {

  const form = formidable({
    multiples: false,
  });

  form.parse(
    
    
    
    req,
    async (err, fields, files) => {

      console.log("FIELDS:", fields);
      console.log("FILES:", files);
      try {

        if (err) {
          return res.status(500).json({
            status: "error",
            message: err.message,
          });
        }

        const electionId =
          Array.isArray(fields.electionId)
            ? fields.electionId[0]
            : fields.electionId;
console.log("FIELDS:", fields);
console.log("FIELD KEYS:", Object.keys(fields));
        const file =
          files.file?.[0] ||
          files.file;

        if (!electionId) {
          return res.status(400).json({
            status: "error",
            message: "ElectionId is required",
          });
        }

        if (!file) {
          return res.status(400).json({
            status: "error",
            message: "Excel file is required",
          });
        }

        // =====================
        // CHECK ELECTION
        // =====================

        const election =
          await Election.findById(
            electionId
          );

        if (!election) {
          return res.status(404).json({
            status: "error",
            message: "Election not found",
          });
        }

        // =====================
        // READ EXCEL
        // =====================

        const workbook =
          XLSX.readFile(
            file.filepath
          );

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const rows =
          XLSX.utils.sheet_to_json(
            sheet
          );

        let inserted = 0;
        let duplicated = 0;
        let createdUsers = 0;

        // =====================
        // LOOP ROWS
        // =====================

        for (const row of rows) {

          let email =
            row.email ||
            row.Email ||
            row.EMAIL;

          if (!email) continue;

          email = String(email)
            .trim()
            .toLowerCase();

          const fullName =
            row.fullName ||
            row.FullName ||
            row.name ||
            email.split("@")[0];

          // =====================
          // FIND USER
          // =====================

          let user =
            await User.findOne({
              email,
            });

          // =====================
          // CREATE USER
          // =====================

          if (!user) {

            const passwordHash =
              await bcrypt.hash(
                email,
                10
              );

            user =
              await User.create({
                email,
                fullName,
                role: "voter",
                passwordHash,
              });

            createdUsers++;
          }

          // =====================
          // CHECK DUPLICATE
          // =====================

          const existed =
            await ElectionVoter.findOne({
              electionId,
              voterId: user._id,
            });

          if (existed) {

            duplicated++;

            continue;
          }

          // =====================
          // CREATE RELATION
          // =====================

          await ElectionVoter.create({
            electionId,
            voterId: user._id,
          });

          inserted++;
        }

        // =====================
        // DELETE TEMP FILE
        // =====================

        if (
          file?.filepath &&
          fs.existsSync(
            file.filepath
          )
        ) {
          fs.unlinkSync(
            file.filepath
          );
        }

        return res.status(200).json({
          status: "success",
          inserted,
          duplicated,
          createdUsers,
        });

      } catch (error) {

        console.log(
          "IMPORT ERROR:",
          error
        );

        return res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
    }
  );
};