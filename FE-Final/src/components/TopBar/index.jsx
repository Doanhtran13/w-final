import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import { useNavigate } from "react-router-dom";

function TopBar({
  currentUser,
  onLogout,
  topBarContext,
  advancedFeature,
  setAdvancedFeature,
}) {
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng chọn file ảnh
  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Sử dụng FormData để đóng gói file ảnh
    const formData = new FormData();

    formData.append("uploadedphoto", file);

    try {
      await fetchModel("/photos/new", {
        method: "POST",
        data: formData,
      });

      e.target.value = null;
      navigate(`/photos/${currentUser._id}`);
    } catch (err) {
      console.error("Lỗi upload:", err);
      alert("Lỗi khi tải ảnh lên. Vui lòng thử lại!");
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          {currentUser ? `Hi ${currentUser.first_name}` : "Please Login"}
        </Typography>

        <Typography
          variant="h6"
          color="inherit"
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          {topBarContext || "Photo Sharing App"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {currentUser && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedFeature}
                  onChange={(e) => setAdvancedFeature(e.target.checked)}
                  sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="white">
                  Enable Advanced Features
                </Typography>
              }
            />
          )}
          {currentUser && (
            <>
              <input
                type="file"
                accept="image/*"
                id="photo-upload-input"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload-input">
                <Button
                  component="span"
                  variant="contained"
                  color="success"
                  sx={{ mr: 2, fontWeight: "bold" }}
                >
                  Add Photo
                </Button>
              </label>
              <Button
                onClick={() => navigate("/edit-profile")}
                component="span"
                variant="contained"
                color="warning"
                sx={{ display: "none", mr: 2, fontWeight: "bold" }}
              >
                Edit profile
              </Button>
              <Button
                color="inherit"
                onClick={onLogout}
                sx={{
                  fontWeight: "bold",
                  border: "1px solid white",
                  borderRadius: 1,
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
