import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import fetchModel, { BASE_URL } from "../../lib/fetchModelData";

function UserComments({ setTopBarContext }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Lấy thông tin user
    fetchModel(`/user/${userId}`)
      .then((res) => {
        if (isMounted) {
          setUser(res.data);
          if (setTopBarContext) {
            setTopBarContext(
              `Comments of ${res.data.first_name} ${res.data.last_name}`
            );
          }
        }
      })
      .catch((err) => console.error("Error fetching user:", err));

    // Lấy danh sách comments của user
    fetchModel(`/commentsOfUser/${userId}`)
      .then((res) => {
        if (isMounted) setComments(res.data);
      })
      .catch((err) => console.error("Error fetching comments:", err));

    return () => {
      isMounted = false;
    };
  }, [userId, setTopBarContext]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  if (comments.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        {user.first_name} {user.last_name} chưa có bình luận nào.
      </Typography>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Bình luận của {user.first_name} {user.last_name}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {comments.map((item, index) => {
        const thumbnailSrc = `${BASE_URL.replace("/api", "")}/images/${
          item.photo_file_name
        }`;

        return (
          <Card
            key={index}
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
              "&:hover": { boxShadow: 3, borderColor: "primary.main" },
            }}
            onClick={() => navigate(`/photos/${userId}/${item.photo_id}`)}
          >
            {/* Thumbnail ảnh nhỏ */}
            <CardMedia
              component="img"
              image={thumbnailSrc}
              alt={item.photo_file_name}
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            {/* Nội dung comment */}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {new Date(item.date_time).toLocaleString()}
              </Typography>
              <Typography variant="body1">{item.comment}</Typography>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default UserComments;
