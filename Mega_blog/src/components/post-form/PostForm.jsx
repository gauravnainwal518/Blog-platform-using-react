import React, { useCallback, useEffect } from "react";
import dayjs from "dayjs";

import { useForm } from "react-hook-form";
import { Input, Select, RTE, Button } from "../../components/index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const submit = async (data) => {
    try {
      const now = dayjs().toISOString(); // Current ISO timestamp

      if (post) {
        const updatedData = {
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          updatedAt: now, // timestamp on update
        };

        if (data.image && data.image.length > 0) {
          const file = await appwriteService.uploadFile(data.image[0]);
          if (file) {
            updatedData.featuredImageFile = file.$id;
          }
        } else {
          updatedData.featuredImageFile =
            post.featuredImage || "default_image_id";
        }

        const response = await appwriteService.updatePost(
          post.$id,
          updatedData
        );
        if (response) {
          navigate(`/post/${post.$id}`);
          dispatch({
            type: "posts/updatePost",
            payload: response,
          });
        }
      } else {
        if (!data.image || data.image.length === 0) {
          alert("Please upload a featured image.");
          return;
        }

        const file = await appwriteService.uploadFile(data.image[0]);
        if (!file) {
          alert("Image upload failed. Please try again.");
          return;
        }

        const dbPost = await appwriteService.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImageFile: file.$id || "default_image_id",
          userId: userData.$id,
          createdAt: now,
          updatedAt: now,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
          dispatch({
            type: "posts/addPost",
            payload: dbPost,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while processing your post. Please try again.");
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={`flex flex-wrap gap-4  p-6 shadow-lg transition-all duration-300 ease-in-out w-full min-h-screen ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="w-full lg:w-2/3 space-y-4">
        <Input
          label="Title"
          placeholder="Enter post title"
          {...register("title", { required: true })}
          className={`${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"
          }`}
        />
        <Input
          label="Slug"
          placeholder="Generated slug"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
          className={`${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"
          }`}
        />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          className={`${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"
          }`}
        />
      </div>

      <div className="w-full lg:w-1/3 space-y-4">
        <Input
          label="Featured Image"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", {
            required: !post ? "Featured image is required" : false,
          })}
          className={`${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"
          }`}
        />

        {post && post.featuredImage && (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="object-cover w-full h-48"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          {...register("status", { required: true })}
          className={`${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"
          }`}
        />

        <Button
          type="submit"
          className={`w-full py-3 ${
            isDarkMode ? "bg-green-600" : "bg-green-500"
          }`}
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
