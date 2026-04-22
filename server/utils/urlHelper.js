// utils/urlHelper.js
export const getImageUrl = (req, relativePath) => {
  // No Railway, o header x-forwarded-proto indica HTTPS
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  
  // Forçar HTTPS em produção
  if (process.env.NODE_ENV === 'production') {
    return `https://${host}${relativePath}`;
  }
  
  return `${protocol}://${host}${relativePath}`;
};