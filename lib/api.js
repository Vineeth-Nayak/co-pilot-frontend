export async function fetcher(url, options) {
    const URL = 'http://localhost:5000' + url;
    const res = await fetch(URL, options);
    if (!res.ok) throw new Error('API error: ' + res.statusText);
    return res.json();
}

export const getCategories = () => fetcher('/api/categories');
export const getAuthors = () => fetcher('/api/authors');
export const getArticles = (query = '') => fetcher(`/api/articles${query}`);
export const getArticle = (id) => fetcher(`/api/articles/${id}`);
export const createArticle = (data) => fetcher('/api/articles', { method: 'POST', body: JSON.stringify(data) });
export const updateArticle = (id, data) => fetcher(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const getCategory = (id) => fetcher(`/api/categories/${id}`);
export const createCategory = (data) => fetcher('/api/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) => fetcher(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const getAuthor = (id) => fetcher(`/api/authors/${id}`);
export const createAuthor = (data) => fetcher('/api/authors', { method: 'POST', body: JSON.stringify(data) });
export const updateAuthor = (id, data) => fetcher(`/api/authors/${id}`, { method: 'PUT', body: JSON.stringify(data) });