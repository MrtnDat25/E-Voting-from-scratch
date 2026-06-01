const { formidable } = require("formidable");

const importQueue = require("../../queues/import.queue");

exports.importVoters = async (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const file = files.file?.[0] || files.file;

    if (!file) {
      return res.status(400).json({ message: "No file" });
    }

    // 👉 push job vào queue
    await importQueue.add("import", {
      filePath: file.filepath,
      electionId: fields.electionId,
    });

    return res.json({
      status: "queued",
      message: "Import is processing",
    });
  });
};