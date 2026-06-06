const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

// CẤU HÌNH MULTER ĐỂ NHẬN FILE ẢNH
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./images";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// lay danh sach anh cua nguoi dung

router.get("/photosOfUser/:id", async (request, response) => {
  
  // userId mà nó lấy từ token
  const userId = request.params.id;

  try {
    const photos = await Photo.find({ user_id: userId });

    if (!photos || photos.length === 0) {
      return response.status(200).json([]);
    }

    const photosObj = JSON.parse(JSON.stringify(photos));

    await Promise.all(
      photosObj.map(async (photo) => {
        if (photo.comments && photo.comments.length > 0) {
          await Promise.all(
            photo.comments.map(async (comment) => {
              const user = await User.findById(
                comment.user_id,
                "_id first_name last_name"
              );
              comment.user = user;
              delete comment.user_id;
            })
          );
        }
      })
    );

    response.status(200).json(photosObj);
  } catch (err) {
    response
      .status(500)
      .json({ message: "Lỗi hệ thống khi truy vấn ảnh", error: err.message });
  }
});

// them cmt vao anh
router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  
  const photoId = req.params.photo_id;
  const { comment } = req.body;

  // Lấy ID user từ token (middleware)
  const userId = req.user.userId;

  if (!comment || comment.trim().length === 0) {
    return res.status(400).send("Bình luận không được để trống");
  }

  try {
    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).send("Không tìm thấy ảnh");

    // Push comment mới vào mảng comments của ảnh
    photo.comments.push({
      comment: comment,
      date_time: new Date(),
      user_id: userId,
    });
    await photo.save();
    res.status(200).send("Thêm bình luận thành công!");
  } catch (err) {
    res.status(500).send("Lỗi hệ thống khi thêm bình luận: " + err.message);
  }
});

// upload anh moi
router.post("/photos/new", upload.single("uploadedphoto"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Vui lòng chọn một file ảnh để tải lên");
  }

  const userId = req.user.userId;

  try {
    await Photo.create({
      file_name: req.file.filename,
      date_time: new Date(),
      user_id: userId,
      comments: [],
    });

    res.status(200).send("Upload ảnh thành công!");
  } catch (err) {
    res.status(500).send("Lỗi khi lưu ảnh vào Database: " + err.message);
  }
});

module.exports = router;
