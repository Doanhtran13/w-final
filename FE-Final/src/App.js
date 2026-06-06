import "./App.css";
import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import UserComments from "./components/UserComments";

const App = (props) => {
  const [advancedFeature, setAdvancedFeature] = useState(false);
  const [topBarContext, setTopBarContext] = useState("Home");
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setPhotoRefreshKey((prev) => prev + 1);
    setCommentRefreshKey((prev) => prev + 1);
  };

  const handleCommentAdded = () => {
    setCommentRefreshKey((prev) => prev + 1);
  };

  // quản lý người dùng từ localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  // Hàm xử lý khi Đăng nhập thành công
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

  // Hàm xử lý khi Đăng xuất
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="app-container">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar
            topBarContext={topBarContext}
            advancedFeature={advancedFeature}
            setAdvancedFeature={setAdvancedFeature}
            currentUser={currentUser}
            onLogout={handleLogout}
            onUploadSuccess={handleUploadSuccess}
          />
        </Grid>

        <Grid item xs={12}>
          <div className="main-topbar-buffer" />
        </Grid>

        {currentUser && (
          <Grid item sm={3} xs={12}>
            <Paper className="main-grid-item">
              <UserList refreshKey={commentRefreshKey} />
            </Paper>
          </Grid>
        )}

        <Grid item sm={currentUser ? 9 : 12} xs={12}>
          <Paper className="main-grid-item">
            <Routes>
              {!currentUser ? (
                <>
                  <Route
                    path="/login"
                    element={
                      <LoginRegister onLoginSuccess={handleLoginSuccess} />
                    }
                  />

                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Navigate to="/users" replace />} />
                  <Route
                    path="/users"
                    element={
                      <div
                        style={{
                          padding: "32px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        <h2 style={{ marginBottom: "8px" }}>
                          Photo Sharing App
                        </h2>
                        <p>
                          Chọn một người dùng từ danh sách bên trái để xem thông
                          tin.
                        </p>
                      </div>
                    }
                  />
                  <Route
                    path="*"
                    element={<div>404 - Không tìm thấy trang</div>}
                  />
                  <Route
                    path="/users/:userId"
                    element={<UserDetail setTopBarContext={setTopBarContext} />}
                  />
                  <Route
                    path="/photos/:userId"
                    element={
                      <UserPhotos
                        advancedFeature={advancedFeature}
                        setTopBarContext={setTopBarContext}
                        currentUser={currentUser}
                        refreshKey={photoRefreshKey}
                        onCommentAdded={handleCommentAdded}
                      />
                    }
                  />
                  <Route
                    path="/photos/:userId/:photoId"
                    element={
                      <UserPhotos
                        advancedFeature={advancedFeature}
                        setTopBarContext={setTopBarContext}
                        refreshKey={photoRefreshKey}
                        onCommentAdded={handleCommentAdded}
                      />
                    }
                  />
                  <Route
                    path="/comments/:userId"
                    element={
                      <UserComments setTopBarContext={setTopBarContext} />
                    }
                  />
                  <Route
                    path="/login"
                    element={<Navigate to={`/`} replace />}
                  />
                </>
              )}
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
