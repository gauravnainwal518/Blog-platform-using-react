import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Select, RTE, Button } from "../../components/index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"; // Importing dispatch

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
  const dispatch = useDispatch(); // Initialize dispatch
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    if (post) {
      // Update post logic
      const updatedData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
      };

      if (data.image && data.image.length > 0) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          updatedData.featuredImageFile = data.image[0];
        }
      }

      try {
        const response = await appwriteService.updatePost(
          post.$id,
          updatedData
        );
        if (response) {
          navigate(`/post/${post.$id}`);
          // Optionally dispatch the updated post to the Redux store
          dispatch({
            type: "posts/updatePost",
            payload: response, // Assuming you have an updatePost action in the slice
          });
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    } else {
      // Create post logic
      if (!data.image || data.image.length === 0) {
        alert("Please upload a featured image.");
        return;
      }

      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        console.log("Data being sent to createPost:", {
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImageFile: data.image[0],
          userId: userData.$id,
        });

        const dbPost = await appwriteService.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImageFile: data.image[0],
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
          // Dispatch the new post to the Redux store
          dispatch({
            type: "posts/addPost", // Assuming you have an addPost action in the slice
            payload: dbPost,
          });
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", {
            required: !post ? "Featured image is required" : false,
          })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
