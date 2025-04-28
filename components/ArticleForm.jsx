"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createArticle, getArticle, getAuthors, getCategories, updateArticle } from "@/lib/api";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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
      publishDate: "",
      isFeatured: false,
      isDraft: false,
    },
  });

  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const articleType = watch("articleType");

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
            publishDate: data.publishDate ? new Date(data.publishDate).toISOString().slice(0, 16) : "",
            isFeatured: data.isFeatured || false,
            isDraft: data.isDraft || false,
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
        publishDate: new Date(formData.publishDate).toISOString(),
      };

      if (articleId) await updateArticle(articleId, payload);
      else await createArticle(payload);
      router.push("/cms/articles");
    } catch (e) {
      console.error(e);
    }
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
        maxWidth: "900px",
        mx: "auto",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* Basic Info Section */}
      <Stack spacing={4}>
        <Typography variant="h5" component="h2" fontWeight="medium">
          {articleId ? "Edit Article" : "Create Article"}
        </Typography>

        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.title}>
              <FormLabel>Title *</FormLabel>
              <TextField {...register("title", { required: "Title is required" })} placeholder="Article title" fullWidth />
              {errors.title && <FormHelperText>{errors.title.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Subtitle */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Subtitle</FormLabel>
              <TextField {...register("subtitle")} placeholder="Article subtitle" fullWidth />
            </FormControl>
          </Grid>

          {/* Hero Image */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.hero}>
              <FormLabel>Hero Image URL *</FormLabel>
              <TextField
                {...register("hero", { required: "Hero image is required" })}
                placeholder="https://example.com/image.jpg"
                fullWidth
              />
              {errors.hero && <FormHelperText>{errors.hero.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Author */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.authorId}>
              <FormLabel>Author *</FormLabel>
              <Select {...register("authorId", { required: "Author is required" })} defaultValue="">
                <MenuItem value="" disabled>
                  Select Author
                </MenuItem>
                {authors.map((author) => (
                  <MenuItem key={author._id} value={author._id}>
                    {author.authorName}
                  </MenuItem>
                ))}
              </Select>
              {errors.authorId && <FormHelperText>{errors.authorId.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.categoryId}>
              <FormLabel>Category *</FormLabel>
              <Select {...register("categoryId", { required: "Category is required" })} defaultValue="">
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Article Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.articleType}>
              <FormLabel>Article Type *</FormLabel>
              <Select {...register("articleType", { required: "Article type is required" })}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
              </Select>
              {errors.articleType && <FormHelperText>{errors.articleType.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Publish Date */}
          {/* <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.publishDate}>
              <FormLabel>Publish Date *</FormLabel>
              <TextField
                type="datetime-local"
                {...register("publishDate", { required: "Publish date is required" })}
                fullWidth
              />
              {errors.publishDate && <FormHelperText>{errors.publishDate.message}</FormHelperText>}
            </FormControl>
          </Grid> */}

          {/* Status Flags */}
          {/* <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <FormControl>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox {...register("isFeatured")} />
                  <FormLabel>Featured</FormLabel>
                </Stack>
              </FormControl>
              <FormControl>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox {...register("isDraft")} />
                  <FormLabel>Draft</FormLabel>
                </Stack>
              </FormControl>
            </Stack>
          </Grid> */}
        </Grid>

        <Divider />

        {/* Content Section */}
        <Stack spacing={3}>
          {/* Media URL (conditionally shown for video/audio) */}
          {articleType !== "text" && (
            <FormControl fullWidth error={!!errors.mediaUrl}>
              <FormLabel>{articleType === "video" ? "Video URL" : "Audio URL"} *</FormLabel>
              <TextField
                {...register("mediaUrl", { required: articleType !== "text" ? `${articleType} URL is required` : false })}
                placeholder={`https://example.com/${articleType}.mp4`}
                fullWidth
              />
              {errors.mediaUrl && <FormHelperText>{errors.mediaUrl.message}</FormHelperText>}
            </FormControl>
          )}

          {/* Description (conditionally shown for text) */}
          {articleType === "text" && (
            <FormControl fullWidth error={!!errors.description}>
              <FormLabel>Content *</FormLabel>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => <ClientTiptapEditor value={field.value} onChange={field.onChange} />}
              />
              {errors.description && <FormHelperText>{errors.description.message}</FormHelperText>}
            </FormControl>
          )}
        </Stack>

        <Divider />

        {/* Tags Section */}
        <FormControl fullWidth>
          <FormLabel>Tags</FormLabel>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Stack spacing={1}>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {field.value.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => {
                        const newTags = [...field.value];
                        newTags.splice(index, 1);
                        field.onChange(newTags);
                      }}
                    />
                  ))}
                </Stack>
                <TextField
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      e.preventDefault();
                      field.onChange([...field.value, e.target.value.trim()]);
                      e.target.value = "";
                    }
                  }}
                  placeholder="Add tag and press Enter"
                  fullWidth
                />
              </Stack>
            )}
          />
        </FormControl>

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} pt={2}>
          <Button type="button" onClick={() => router.push("/cms/articles")} variant="outlined" sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ minWidth: 120 }}>
            {isSubmitting ? "Saving…" : articleId ? "Update Article" : "Create Article"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
