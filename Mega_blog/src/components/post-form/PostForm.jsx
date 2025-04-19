import React, { useCallback, useEffect } from "react";
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

  const submit = async (data) => {
    if (post) {
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
          dispatch({
            type: "posts/updatePost",
            payload: response,
          });
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    } else {
      if (!data.image || data.image.length === 0) {
        alert("Please upload a featured image.");
        return;
      }

      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
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
          dispatch({
            type: "posts/addPost",
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
      className="flex flex-wrap gap-4 bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="w-full lg:w-2/3 space-y-4">
        <Input
          label="Title"
          placeholder="Enter post title"
          {...register("title", { required: true })}
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
        />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
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
        />

        {post && (
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
        />

        <Button
          type="submit"
          className="w-full py-3"
          bgColor={post ? "bg-green-500" : undefined}
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
