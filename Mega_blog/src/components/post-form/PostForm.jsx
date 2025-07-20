import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, RTE, Button } from "../../components/index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostForm = ({ post }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.image || "");

  const submit = async (data) => {
    if (post) {
      const fileToUpload = file ? await appwriteService.uploadFile(file) : null;

      if (fileToUpload) {
        await appwriteService.deleteFile(post.featuredImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: fileToUpload ? fileToUpload.$id : post.featuredImage,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const fileToUpload = await appwriteService.uploadFile(file);

      if (fileToUpload) {
        const dbPost = await appwriteService.createPost({
          ...data,
          featuredImage: fileToUpload.$id,
          author: userData?.name || "Anonymous",
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <Input
          label="Title"
          placeholder="Enter title"
          {...register("title", { required: true })}
        />
        {errors.title && <p className="text-red-500">Title is required</p>}

        <Input
          label="Slug"
          placeholder="enter-slug"
          {...register("slug", { required: true })}
        />
        {errors.slug && <p className="text-red-500">Slug is required</p>}

        {/* Status Select Field */}
        <div className="w-full">
          <label htmlFor="status" className="block font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            {...register("status", { required: true })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Status --</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">Status is required</p>
          )}
        </div>

        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
        {errors.content && <p className="text-red-500">Content is required</p>}

        <div>
          <label className="block mb-1">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 h-40 object-contain"
            />
          )}
        </div>

        <Button type="submit">{post ? "Update Post" : "Create Post"}</Button>
      </form>
    </div>
  );
};

export default PostForm;
