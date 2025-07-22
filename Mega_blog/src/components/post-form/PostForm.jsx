import React, { useCallback, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { Input, RTE, Button } from "../../components";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "inactive",
      category: post?.category || "Uncategorized",
      tags: post?.tags?.join(", ") || "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const autoSaveTimer = useRef(null);
  const isSubmittingRef = useRef(false);

  const savePost = async (data, status = "inactive", isAutoSave = false) => {
    if (isSubmittingRef.current && !isAutoSave) return;

    try {
      if (!isAutoSave) isSubmittingRef.current = true;

      const now = dayjs().toISOString();
      const commonData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status,
        category: data.category,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        updatedAt: now,
        author: userData?.name || userData?.email,
      };

      if (post) {
        if (data.image && data.image.length > 0) {
          const file = await appwriteService.uploadFile(data.image[0]);
          if (file) commonData.featuredImageFile = file.$id;
        } else {
          commonData.featuredImageFile =
            post.featuredImage || "default_image_id";
        }

        const response = await appwriteService.updatePost(post.$id, commonData);
        if (response && !isAutoSave) {
          navigate(`/post/${post.$id}`);
          dispatch({ type: "posts/updatePost", payload: response });
        }
      } else {
        if (!data.image || data.image.length === 0) {
          if (!isAutoSave) alert("Please upload a featured image.");
          return;
        }

        const file = await appwriteService.uploadFile(data.image[0]);
        if (!file) {
          if (!isAutoSave) alert("Image upload failed.");
          return;
        }

        const dbPost = await appwriteService.createPost({
          ...commonData,
          featuredImageFile: file.$id,
          userId: userData.$id,
          createdAt: now,
        });

        if (dbPost && !isAutoSave) {
          navigate(`/post/${dbPost.$id}`);
          dispatch({ type: "posts/addPost", payload: dbPost });
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      if (!isAutoSave) alert("An error occurred. Please try again.");
    } finally {
      if (!isAutoSave) isSubmittingRef.current = false;
    }
  };

  const submit = (data) => savePost(data, "active");
  const saveAsDraft = (data) => savePost(data, "inactive");

  const slugTransform = useCallback((value) => {
    return (
      value
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || ""
    );
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }

      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

      autoSaveTimer.current = setTimeout(async () => {
        const formData = getValues();
        const isValid = await trigger(["title", "slug", "content"]);
        if (isValid) await savePost(formData, "inactive", true);
      }, 30000);
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, slugTransform, getValues, trigger]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-wrap gap-6 px-6 py-10 transition-all duration-300 min-h-screen w-full rounded-xl shadow-xl bg-gray-50 text-gray-900"
    >
      <div className="w-full lg:w-2/3 space-y-6">
        <Input
          label="Title"
          placeholder="Enter your blog title"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug"
          placeholder="Auto-generated slug"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-full lg:w-1/3 space-y-6">
        <Input
          label="Featured Image"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", {
            required: !post ? "Featured image is required" : false,
          })}
        />
        {post?.featuredImage && (
          <div className="rounded-lg overflow-hidden border">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="object-cover w-full h-48"
            />
          </div>
        )}

        {/* Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            {...register("category", { required: true })}
            className="rounded-md border px-3 py-2 focus:outline-none bg-white border-gray-300 text-black"
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        {/* Tags Input */}
        <Input
          label="Tags (comma-separated)"
          placeholder="e.g., web, react, blog"
          {...register("tags")}
        />

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="rounded-md border px-3 py-2 focus:outline-none bg-white border-gray-300 text-black"
          >
            <option value="active">Published</option>
            <option value="inactive">Draft</option>
          </select>
        </div>

        {/* Author Info */}
        {userData?.name || userData?.email ? (
          <p className="text-sm text-gray-500">
            Author: <strong>{userData.name || userData.email}</strong>
          </p>
        ) : null}

        <Button type="submit" className="w-full py-3 bg-green-500">
          {post ? "Update Post" : "Publish Post"}
        </Button>

        <Button
          type="button"
          className="w-full py-3 bg-yellow-500"
          onClick={handleSubmit(saveAsDraft)}
        >
          Save as Draft
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
