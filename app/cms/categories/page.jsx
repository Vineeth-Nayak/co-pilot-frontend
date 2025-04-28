import Link from "next/link";
import { getCategories } from "@/lib/api";
import { PlusIcon, Edit2Icon } from "lucide-react";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";

export default async function CategoriesPage() {
  const res = await getCategories();
  const categories = res.data.categories;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with title and create button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="medium">
          Categories
        </Typography>
        <Button
          component={Link}
          href="/cms/categories/new"
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{
            boxShadow: 1,
            "&:hover": {
              boxShadow: 2,
              backgroundColor: "primary.dark",
            },
          }}
        >
          New Category
        </Button>
      </Stack>

      {/* Categories grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.categoryId}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Typography variant="h6" component="h2">
                    {category.categoryName}
                  </Typography>
                  <Chip label={`ID: ${category.categoryId}`} size="small" variant="outlined" />
                </Stack>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href={`/cms/categories/${category.categoryId}`}
                  size="small"
                  variant="outlined"
                  startIcon={<Edit2Icon size={16} />}
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  Edit
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty state */}
      {categories.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            textAlign: "center",
            p: 4,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by creating your first category
          </Typography>
          <Button component={Link} href="/cms/categories/new" variant="contained" startIcon={<PlusIcon />}>
            Create Category
          </Button>
        </Box>
      )}
    </Box>
  );
}
