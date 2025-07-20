import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, RTE, Button } from "../../components/index";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "draft",
    },
  });

  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(post?.featuredImage || null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submit = async (data) => {
    if (!userData) {
      alert("User not authenticated");
      return;
    }

    try {
      let file = post?.featuredImage;
      if (selectedImage) {
        const uploadedFile = await appwriteService.uploadFile(selectedImage);
        file = uploadedFile ? uploadedFile.$id : file;
      }

      const now = new Date().toISOString();

      let responsePost;
      if (post) {
        // UPDATE
        responsePost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file,
          authorName: userData.name || userData.email,
          updatedAt: now,
        });
        alert("Post updated successfully");
      } else {
        // CREATE
        responsePost = await appwriteService.createPost({
          ...data,
          featuredImage: file,
          userId: userData.$id,
          authorName: userData.name || userData.email,
          createdAt: now,
          updatedAt: now,
        });
        alert("Post created successfully");
      }

      if (responsePost) {
        navigate(`/post/${responsePost.$id}`);
      }
    } catch (error) {
      console.error("Post form error:", error);
      alert("Something went wrong while saving the post");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <Input label="Title" {...register("title", { required: true })} />
      <Input label="Slug" {...register("slug", { required: true })} />
      <RTE label="Content" name="content" control={control} />
      <Select label="Status" {...register("status")}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </Select>

      {/*  Show Author Name */}
      {userData?.name || userData?.email ? (
        <div className="text-sm text-gray-400 dark:text-gray-300">
          Author: <strong>{userData.name || userData.email}</strong>
        </div>
      ) : null}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Featured Image</label>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-40 w-auto rounded-lg object-cover"
          />
        )}
      </div>

      <Button type="submit">{post ? "Update Post" : "Create Post"}</Button>
    </form>
  );
};

export default PostForm;
