import Link from "next/link";
import { getAuthors } from "@/lib/api";
import { PlusIcon, Edit2Icon } from "lucide-react";
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

export default async function AuthorsPage() {
  const res = await getAuthors();
  const authors = res.data.authors;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with title and create button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="medium">
          Authors
        </Typography>
        <Button
          component={Link}
          href="/cms/authors/new"
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
          New Author
        </Button>
      </Stack>

      {/* Authors grid */}
      <Grid container spacing={3}>
        {authors.map((author) => (
          <Grid item xs={12} sm={6} md={4} key={author.authorId}>
            <Card
              sx={{
                height: 225,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar alt={author.authorName} src={author.authorImage || undefined} sx={{ width: 64, height: 64 }}>
                    {author.authorName ? author.authorName.charAt(0) : null}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {author.authorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {author.description}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" justifyContent="flex-end" mt={2}>
                  <Chip label={`ID: ${author.authorId}`} size="small" variant="outlined" />
                </Stack>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href={`/cms/authors/${author.authorId}`}
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
      {authors.length === 0 && (
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
            No authors found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by creating your first author
          </Typography>
          <Button component={Link} href="/cms/authors/new" variant="contained" startIcon={<PlusIcon />}>
            Create Author
          </Button>
        </Box>
      )}
    </Box>
  );
}
