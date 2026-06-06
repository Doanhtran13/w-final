import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  Button,
  TextField,
} from "@mui/material";

import { useParams, Link, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel, { BASE_URL } from "../../lib/fetchModelData";

function UserPhotos({
  advancedFeature,
  setTopBarContext,
  refreshKey,
  onCommentAdded,
}) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [newComments, setNewComments] = useState({});

  const fetchPhotos = () => {
    fetchModel(`/photosOfUser/${userId}`)
      .then((res) => setPhotos(res.data))
      .catch((err) => console.error("Error fetching photos:", err));
  };

  useEffect(() => {
    let isMounted = true;

    fetchModel(`/user/${userId}`)
      .then((res) => {
        if (isMounted) {
          setUser(res.data);
          if (setTopBarContext)
            setTopBarContext(
              `Photos of ${res.data.first_name} ${res.data.last_name}`
            );
        }
      })
      .catch((err) =>
        console.error("Error fetching user data in photos:", err)
      );

    fetchModel(`/photosOfUser/${userId}`)
      .then((res) => {
        if (isMounted) setPhotos(res.data);
      })
      .catch((err) => console.error("Error fetching photos:", err));

    return () => {
      isMounted = false;
    };
  }, [userId, setTopBarContext, refreshKey]);

  if (!user || photos.length === 0) {
    return <Typography>No photos...</Typography>;
  }

  const currentIndex = photoId ? photos.findIndex((p) => p._id === photoId) : 0;
  const currentPhoto = photos[currentIndex !== -1 ? currentIndex : 0];

  const goNext = () => {
    if (currentIndex < photos.length - 1) {
      navigate(`/photos/${userId}/${photos[currentIndex + 1]._id}`);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(`/photos/${userId}/${photos[currentIndex - 1]._id}`);
    }
  };

  const handleAddComment = async (photoIdToComment) => {
    const text = newComments[photoIdToComment];
    if (!text || text.trim() === "") return;

    try {
      await fetchModel(`/commentsOfPhoto/${photoIdToComment}`, {
        method: "POST",
        data: { comment: text },
      });
      setNewComments({ ...newComments, [photoIdToComment]: "" });
      fetchPhotos();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Lỗi gửi comment:", err);
      alert("Lỗi khi gửi bình luận!");
    }
  };

  const renderPhoto = (photo) => {
    const finalImageSrc = `${BASE_URL.replace("/api", "")}/images/${
      photo.file_name
    }`;

    return (
      <Card variant="outlined" key={photo._id} style={{ marginBottom: "20px" }}>
        <CardHeader
          title={new Date(photo.date_time).toLocaleString()}
          subheader={`By ${user.first_name} ${user.last_name}`}
        />
        <CardMedia
          component="img"
          image={finalImageSrc}
          alt={photo.file_name}
          sx={{ objectFit: "contain", maxHeight: "500px", width: "100%" }}
        />
        <CardContent>
          <Typography variant="h6">Comments:</Typography>
          <Divider style={{ margin: "10px 0" }} />

          {photo.comments && photo.comments.length > 0 ? (
            photo.comments.map((c) => (
              <div
                key={c._id}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  {new Date(c.date_time).toLocaleString()} -{" "}
                  <Link to={`/users/${c.user._id}`}>
                    {c.user.first_name} {c.user.last_name}
                  </Link>
                </Typography>
                <Typography variant="body1" style={{ marginTop: "5px" }}>
                  {c.comment}
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet.
            </Typography>
          )}

          <div style={{ display: "flex", marginTop: "15px" }}>
            <TextField
              label="Viết bình luận..."
              variant="outlined"
              size="small"
              fullWidth
              value={newComments[photo._id] || ""}
              onChange={(e) =>
                setNewComments({ ...newComments, [photo._id]: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
              onClick={() => handleAddComment(photo._id)}
            >
              Gửi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {advancedFeature ? (
        <>
          {renderPhoto(currentPhoto)}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              disabled={currentIndex === 0}
              onClick={goPrev}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              disabled={currentIndex === photos.length - 1}
              onClick={goNext}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        photos.map((p) => renderPhoto(p))
      )}
    </div>
  );
}

export default UserPhotos;
