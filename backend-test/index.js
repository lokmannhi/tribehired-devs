const express = require("express");
const axios = require("axios");
const res = require("express/lib/response");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Lokman Backend");
});

app.get("/top-posts", async (req, res) => {
  try {
    // Fetch all the comments
    const commentsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    const comments = commentsResponse.data;

    // Create a map of postId to number of comments for that post
    const postCommentCount = {};
    comments.forEach((comment) => {
      if (!postCommentCount[comment.postId]) {
        postCommentCount[comment.postId] = 0;
      }
      postCommentCount[comment.postId]++;
    });

    // Fetch all the posts
    const postsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const posts = postsResponse.data;

    // Create an array of post objects with postId, title, body and total number of comments
    const postData = posts.map((post) => {
      return {
        postId: post.id,
        postTitle: post.title,
        postBody: post.body,
        totalNumberOfComments: postCommentCount[post.id] || 0,
      };
    });

    // Sort the array of post objects by total number of comments in descending order
    postData.sort((a, b) => b.totalNumberOfComments - a.totalNumberOfComments);

    // Return the top 10 posts
    res.json(postData.slice(0, 20));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/comments/filter", async (req, res) => {
  try {
    // Fetch all the comments
    const commentsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    let comments = commentsResponse.data;

    // Extract filter parameters from query string
    const { postId, id, name, email, body } = req.query;

    // Filter comments based on provided parameters
    if (postId) {
      comments = comments.filter(
        (comment) => comment.postId === parseInt(postId)
      );
    }
    if (id) {
      comments = comments.filter((comment) => comment.id === parseInt(id));
    }
    if (name) {
      comments = comments.filter((comment) =>
        comment.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (email) {
      comments = comments.filter((comment) =>
        comment.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    if (body) {
      comments = comments.filter((comment) =>
        comment.body.toLowerCase().includes(body.toLowerCase())
      );
    }

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
