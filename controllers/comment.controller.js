import Comment from "../models/comment.model.js"
import User from "../models/user.model.js"

export const getPostComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

    res.json(comments);
};

export const addComment = async (req, res)=>{
    const clerkUserId = req.auth.userId;
    const postId =req.body.postId;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    if (!postId) {
        return res.status(400).json("Post ID is required!");  // ✅ Check if postId is missing
    }

    const user = await User.findOne({ clerkUserId });

    const newComment = new Comment({
        ...req.body,
        user: user._id,
        post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);

};

export const deleteComment = async(req, res) =>{
    const clerkUserId = req.auth.userId;
    const id = req.params.id;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionCliams?.metadata.role || "user";

    if (role === "admin") {
            await Comment.findByIdAndDelete(req.params.id);
            return res.status(200).json("Comment has been Deleted");
    }

    const user = User.findOne({ clerkUserId });

    const deletedComment = await Comment.findByIdAndDelete({
        _id: id,
        user: user._id,
    });

    if (!deletedComment) {
        return res.status(403).json("You can Delete only your Comment!");
    }

    res.status(200).json("Comment Deleted")
};
