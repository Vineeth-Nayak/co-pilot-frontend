"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createArticle, getArticle, getAuthors, getCategories, updateArticle } from "@/lib/api";

const ClientTiptapEditor = dynamic(() => import("./ClientTiptapEditor"), {
  ssr: false,
  loading: () => <Box className="editor-input border rounded p-2 min-h-[200px]">Loading editor…</Box>,
});

export default function ArticleForm({ articleId }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      hero: "",
      authorId: "",
      categoryId: "",
      tags: [],
      articleType: "text",
      description: "",
      mediaUrl: "",
    },
  });

  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const articleType = watch("articleType");
  const heroImageUrl = watch("hero");

  useEffect(() => {
    async function load() {
      try {
        const [catRes, authRes] = await Promise.all([getCategories(), getAuthors()]);
        setCategories(catRes.data.categories || []);
        setAuthors(authRes.data.authors || []);

        if (articleId) {
          const artRes = await getArticle(articleId);
          const data = artRes.data;
          reset({
            title: data.title,
            subtitle: data.subtitle || "",
            hero: data.articleImage || "",
            authorId: data.author?._id || "",
            categoryId: data.category?._id || "",
            tags: data.tags || [],
            articleType: data.articleType || "text",
            description: data.description || "",
            mediaUrl: data.mediaUrl || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, [articleId, reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        category: formData.categoryId,
        author: formData.authorId,
        articleImage: formData.hero,
      };

      if (articleId) await updateArticle(articleId, payload);
      else await createArticle(payload);
      router.push("/cms/articles");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !getValues("tags").includes(newTag)) {
        const updatedTags = [...getValues("tags"), newTag];
        setValue("tags", updatedTags);
        e.target.value = "";
      }
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = getValues("tags").filter((tag) => tag !== tagToDelete);
    setValue("tags", updatedTags);
  };

  if (loadingData) {
    return (
      <Box p={3} textAlign="center">
        Loading…
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: "800px",
        mx: "auto",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h5" component="h2" fontWeight="medium">
          {articleId ? "Edit Article" : "Create Article"}
        </Typography>

        <FormControl fullWidth error={!!errors.title}>
          <FormLabel>Title *</FormLabel>
          <TextField variant="outlined" {...register("title", { required: "Title is required" })} placeholder="Article title" />
          {errors.title && <FormHelperText>{errors.title.message}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <FormLabel>Subtitle</FormLabel>
          <TextField variant="outlined" {...register("subtitle")} placeholder="Subtitle" />
        </FormControl>

        <FormControl fullWidth error={!!errors.hero}>
          <FormLabel>Hero Image URL *</FormLabel>
          <TextField
            variant="outlined"
            {...register("hero", { required: "Hero image is required" })}
            placeholder="https://example.com/image.jpg"
          />
          {errors.hero && <FormHelperText>{errors.hero.message}</FormHelperText>}
          {heroImageUrl && (
            <Box mt={2}>
              <img src={heroImageUrl} alt="Hero Preview" style={{ width: "100%", borderRadius: 8 }} />
            </Box>
          )}
        </FormControl>

        <FormControl fullWidth error={!!errors.authorId}>
          <FormLabel>Author *</FormLabel>
          <Controller
            control={control}
            name="authorId"
            rules={{ required: "Author is required" }}
            render={({ field }) => (
              <Select {...field} variant="outlined" displayEmpty>
                <MenuItem value="" disabled>
                  Select Author
                </MenuItem>
                {authors.map((author) => (
                  <MenuItem key={author._id} value={author._id}>
                    {author.authorName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.authorId && <FormHelperText>{errors.authorId.message}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth error={!!errors.categoryId}>
          <FormLabel>Category *</FormLabel>
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select {...field} variant="outlined" displayEmpty>
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <FormLabel>Tags</FormLabel>
          <Input placeholder="Type tag and press Enter" onKeyDown={handleAddTag} fullWidth />
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {watch("tags").map((tag) => (
              <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} />
            ))}
          </Box>
        </FormControl>

        <FormControl fullWidth error={!!errors.articleType}>
          <FormLabel>Article Type *</FormLabel>
          <Controller
            control={control}
            name="articleType"
            rules={{ required: "Article type is required" }}
            render={({ field }) => (
              <Select {...field} variant="outlined">
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
              </Select>
            )}
          />
          {errors.articleType && <FormHelperText>{errors.articleType.message}</FormHelperText>}
        </FormControl>

        {articleType === "text" ? (
          <FormControl fullWidth>
            <FormLabel>Description</FormLabel>
            <Controller name="description" control={control} render={({ field }) => <ClientTiptapEditor {...field} />} />
          </FormControl>
        ) : (
          <FormControl fullWidth error={!!errors.mediaUrl}>
            <FormLabel>Media URL *</FormLabel>
            <TextField
              variant="outlined"
              {...register("mediaUrl", {
                required: "Media URL is required",
              })}
              placeholder="https://example.com/media.mp4"
            />
            {errors.mediaUrl && <FormHelperText>{errors.mediaUrl.message}</FormHelperText>}
          </FormControl>
        )}

        <Divider />

        <Box textAlign="right">
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {articleId ? "Update Article" : "Create Article"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
