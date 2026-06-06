import React, { useState } from "react";
import { TextField, Button, Typography, Grid, Paper, Box } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function LoginRegister({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);

  // State phuc vu dang nhap
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // State phuc vu dang ky
  const [regData, setRegData] = useState({
    login_name: "",
    password: "",
    rePassword: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [regMessage, setRegMessage] = useState({ text: "", isError: false });

  // hàm đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // ngắn không cho F5
    setLoginError("");
    try {
      const res = await fetchModel("/admin/login", {
        method: "POST",
        data: { login_name: loginName, password: loginPassword },
      });
      onLoginSuccess(res.data);
    } catch (err) {
      setLoginError(
        err.response?.data || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleRegChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // ngắn chặn F5
    setRegMessage({ text: "", isError: false });

    if (
      !regData.login_name ||
      !regData.password ||
      !regData.first_name ||
      !regData.last_name
    ) {
      setRegMessage({
        text: "Vui lòng điền đầy đủ thông tin bắt buộc!",
        isError: true,
      });
      return;
    }
    if (regData.password !== regData.rePassword) {
      setRegMessage({
        text: "Mật khẩu nhập lại không trùng khớp!",
        isError: true,
      });
      return;
    }

    try {
      await fetchModel("/user", { method: "POST", data: regData });
      setRegMessage({
        text: "Đăng ký thành công! Hãy chuyển sang Đăng nhập.",
        isError: false,
      });
      setRegData({
        login_name: "",
        password: "",
        rePassword: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (err) {
      setRegMessage({
        text: err.response?.data || "Đăng ký thất bại.",
        isError: true,
      });
    }
  };

  return (
    <Box className="auth-container">
      <Paper
        elevation={4}
        className={`auth-paper ${isLoginView ? "login-mode" : "register-mode"}`}
      >
        {isLoginView ? (
          <>
            <Typography variant="h4" className="auth-title-login">
              Đăng Nhập
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Tên đăng nhập"
                fullWidth
                margin="normal"
                required
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              {loginError && (
                <Typography
                  color="error"
                  variant="body2"
                  className="auth-message"
                >
                  {loginError}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="auth-submit-btn"
              >
                LOGIN
              </Button>
            </form>

            <Typography className="auth-toggle-text" variant="body2">
              Bạn chưa có tài khoản?{" "}
              <a
                className="auth-toggle-link"
                onClick={() => setIsLoginView(false)}
              >
                Đăng ký ngay
              </a>
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" className="auth-title-register">
              Tạo Tài Khoản Mới
            </Typography>
            <form onSubmit={handleRegister}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tên đăng nhập *"
                    name="login_name"
                    fullWidth
                    required
                    value={regData.login_name}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nghề nghiệp"
                    name="occupation"
                    fullWidth
                    value={regData.occupation}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mật khẩu *"
                    type="password"
                    name="password"
                    fullWidth
                    required
                    value={regData.password}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nhập lại mật khẩu *"
                    type="password"
                    name="rePassword"
                    fullWidth
                    required
                    value={regData.rePassword}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tên *"
                    name="first_name"
                    fullWidth
                    required
                    value={regData.first_name}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Họ *"
                    name="last_name"
                    fullWidth
                    required
                    value={regData.last_name}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Địa chỉ"
                    name="location"
                    fullWidth
                    value={regData.location}
                    onChange={handleRegChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mô tả bản thân"
                    name="description"
                    multiline
                    rows={2}
                    fullWidth
                    value={regData.description}
                    onChange={handleRegChange}
                  />
                </Grid>
              </Grid>

              {regMessage.text && (
                <Typography
                  color={regMessage.isError ? "error" : "success.main"}
                  variant="body2"
                  className="auth-message"
                >
                  {regMessage.text}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                className="auth-submit-btn"
              >
                REGISTER ME
              </Button>
            </form>

            <Typography className="auth-toggle-text" variant="body2">
              Đã có tài khoản?{" "}
              <a
                className="auth-toggle-link"
                onClick={() => setIsLoginView(true)}
              >
                Quay lại đăng nhập
              </a>
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
