import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel("/user/list")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching user list:", err));
  }, [refreshKey]);

  return (
    <div>
      <Typography variant="body1" sx={{ p: 2, fontWeight: "bold" }}>
        User List:
      </Typography>
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem
              button
              component={Link}
              to={`/users/${item._id}`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText primary={`${item.first_name} ${item.last_name}`} />

              <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                {/* Bubble xanh: số ảnh */}
                <Chip
                  label={item.photoCount ?? 0}
                  size="small"
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    fontWeight: "bold",
                    minWidth: 28,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/photos/${item._id}`);
                  }}
                />

                {/* Bubble đỏ: số comment */}
                <Chip
                  label={item.commentCount ?? 0}
                  size="small"
                  sx={{
                    backgroundColor: "#f44336",
                    color: "white",
                    fontWeight: "bold",
                    minWidth: 28,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/photos/${item._id}`);
                  }}
                />
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
