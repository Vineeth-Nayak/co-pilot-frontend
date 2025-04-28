"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, getCategory } from "@/lib/api";
import { useEffect, useState } from "react";
import { Box, Button, FormControl, FormHelperText, FormLabel, Grid, Input, Stack, TextField, Typography } from "@mui/material";

export default function CategoryForm({ categoryId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setLoadingData(true);
      getCategory(categoryId)
        .then((res) => reset(res.data))
        .catch((error) => console.error("Failed to load category data", error))
        .finally(() => setLoadingData(false));
    }
  }, [categoryId, reset]);

  const onSubmit = async (data) => {
    try {
      if (categoryId) {
        await updateCategory(categoryId, data);
      } else {
        await createCategory(data);
      }
      router.push("/cms/categories");
    } catch (error) {
      console.error("Failed to submit category data", error);
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
          {categoryId ? "Edit Category" : "Create Category"}
        </Typography>

        <Grid container spacing={3}>
          {/* Category Name */}
          <Grid item size={{ xs: 12 }}>
            <FormControl fullWidth error={!!errors.categoryName}>
              {/* <FormLabel>Category Name *</FormLabel> */}
              <TextField
                variant="outlined"
                label="Category Name*"
                {...register("categoryName", { required: "Category name is required" })}
                placeholder="Enter category name"
                sx={{ maxWidth: "800px" }}
                fullWidth
              />
              {errors.categoryName && <FormHelperText>{errors.categoryName.message}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Stack direction="row" justifyContent="flex-start" spacing={2} pt={2}>
          <Button type="button" onClick={() => router.push("/cms/categories")} variant="outlined" sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
            {categoryId ? "Update Category" : "Create Category"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
