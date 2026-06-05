import authService from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user.userId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const me = async (req, res) => {
  try {
    const result = await authService.me(req.user.userId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};