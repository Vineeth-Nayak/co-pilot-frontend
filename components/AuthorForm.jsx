"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createAuthor, updateAuthor, getAuthor } from "@/lib/api";
import { useEffect, useState } from "react";
import { Box, Button, FormControl, FormHelperText, Stack, TextField, Typography, Grid, Avatar } from "@mui/material";

export default function AuthorForm({ authorId }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);

  const mode = !!authorId;

  useEffect(() => {
    if (mode) {
      setLoadingData(true);
      getAuthor(authorId)
        .then((res) => reset(res.data))
        .catch((error) => console.error("Failed to load author data", error))
        .finally(() => setLoadingData(false));
    }
  }, [authorId, mode, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode) {
        await updateAuthor(authorId, data);
      } else {
        await createAuthor(data);
      }
      router.push("/cms/authors");
    } catch (error) {
      console.error("Failed to submit author data", error);
    }
  };

  const authorImage = watch("authorImage") || "";

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
      <Stack spacing={3}>
        <Typography variant="h5" component="h2" fontWeight="medium">
          {mode ? "Edit Author" : "Create Author"}
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Image Preview */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Avatar src={authorImage || "/default-avatar.jpg"} alt="Author" sx={{ width: 120, height: 120, mx: "auto" }} />
          </Grid>

          {/* Author Name */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.authorName}>
              <TextField
                label="Author Name *"
                variant="outlined"
                placeholder="Enter author name"
                fullWidth
                {...register("authorName", { required: "Author name is required" })}
              />
              {errors.authorName && <FormHelperText>{errors.authorName.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Author Image URL */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Image URL"
                variant="outlined"
                placeholder="Enter image URL"
                fullWidth
                {...register("authorImage")}
              />
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Description"
                variant="outlined"
                multiline
                minRows={4}
                placeholder="Enter description"
                fullWidth
                {...register("description")}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Submit Buttons */}
        <Stack direction="row" justifyContent="flex-start" spacing={2} pt={2}>
          <Button type="button" onClick={() => router.push("/cms/authors")} variant="outlined" sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
            {mode ? "Update Author" : "Create Author"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
