export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const sitemapUrls: SitemapUrl[] = [
  {
    loc: 'https://lemur-ai.com',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    loc: 'https://lemur-ai.com/waitlist',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://lemur-ai.com/login',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: 'https://lemur-ai.com/signup',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://lemur-ai.com/register',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  }
];

export const generateSitemap = (): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  const urls = sitemapUrls.map(url => {
    let urlXml = `  <url>\n    <loc>${url.loc}</loc>`;
    
    if (url.lastmod) {
      urlXml += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      urlXml += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      urlXml += `\n    <priority>${url.priority}</priority>`;
    }
    
    urlXml += '\n  </url>';
    return urlXml;
  }).join('\n');
  
  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n${urlsetClose}`;
};

// Function to generate sitemap and save it (for build process)
export const saveSitemap = async (): Promise<void> => {
  const sitemapContent = generateSitemap();
  
  // In a real application, you would write this to public/sitemap.xml
  // For now, we'll just log it or return it
  console.log('Generated sitemap:', sitemapContent);
  
  // If running in Node.js environment (build process)
  if (typeof window === 'undefined' && typeof require !== 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const publicDir = path.join(process.cwd(), 'public');
      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      
      fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
      console.log('Sitemap saved to:', sitemapPath);
    } catch (error) {
      console.error('Error saving sitemap:', error);
    }
  }
};
