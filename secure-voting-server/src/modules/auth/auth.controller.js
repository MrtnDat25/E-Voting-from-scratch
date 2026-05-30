const authService =
  require("./auth.service");

exports.register =
  async (req, res) => {

    try {

      const result =
        await authService.register(
          req.body
        );

      return res.status(201)
      .json(result);

    } catch (err) {

      return res.status(500)
      .json({
        status: "error",
        message:
          err.message,
      });
    }
};

exports.login =
  async (req, res) => {

    try {

      const result =
        await authService.login(
          req.body
        );

      return res.status(200)
      .json(result);

    } catch (err) {

      return res.status(500)
      .json({
        status: "error",
        message:
          err.message,
      });
    }
};

exports.refresh =
  async (req, res) => {

    try {

      const result =
        await authService.refresh(
          req.body.refreshToken
        );

      return res.status(200)
      .json(result);

    } catch (err) {

      return res.status(500)
      .json({
        status: "error",
        message:
          err.message,
      });
    }
};

exports.logout =
  async (req, res) => {

    try {

      const result =
        await authService.logout(
          req.user.userId
        );

      return res.status(200)
      .json(result);

    } catch (err) {

      return res.status(500)
      .json({
        status: "error",
        message:
          err.message,
      });
    }
};

exports.me =
  async (req, res) => {

    try {

      const result =
        await authService.me(
          req.user.userId
        );

      return res.status(200)
      .json(result);

    } catch (err) {

      return res.status(500)
      .json({
        status: "error",
        message:
          err.message,
      });
    }
};