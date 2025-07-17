export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
  recommendations: string[];
}

export interface SEOMetrics {
  titleLength: number;
  descriptionLength: number;
  keywordsCount: number;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasStructuredData: boolean;
  hasCanonical: boolean;
}

export const validateSEOData = (seoData: any): SEOValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Title validation
  if (!seoData.title) {
    errors.push('Title is required');
    score -= 20;
  } else {
    const titleLength = seoData.title.length;
    if (titleLength < 30) {
      warnings.push('Title is too short (recommended: 30-60 characters)');
      score -= 5;
    } else if (titleLength > 60) {
      warnings.push('Title is too long (recommended: 30-60 characters)');
      score -= 5;
    }
  }

  // Description validation
  if (!seoData.description) {
    errors.push('Meta description is required');
    score -= 15;
  } else {
    const descLength = seoData.description.length;
    if (descLength < 120) {
      warnings.push('Meta description is too short (recommended: 120-160 characters)');
      score -= 5;
    } else if (descLength > 160) {
      warnings.push('Meta description is too long (recommended: 120-160 characters)');
      score -= 5;
    }
  }

  // Keywords validation
  if (!seoData.keywords || seoData.keywords.length === 0) {
    warnings.push('Keywords are missing');
    score -= 5;
  } else if (seoData.keywords.length > 10) {
    warnings.push('Too many keywords (recommended: 5-10)');
    score -= 3;
  }

  // Open Graph validation
  if (!seoData.openGraph) {
    warnings.push('Open Graph tags are missing');
    score -= 10;
  } else {
    if (!seoData.openGraph.title) {
      warnings.push('Open Graph title is missing');
      score -= 3;
    }
    if (!seoData.openGraph.description) {
      warnings.push('Open Graph description is missing');
      score -= 3;
    }
    if (!seoData.openGraph.image) {
      warnings.push('Open Graph image is missing');
      score -= 5;
    }
  }

  // Twitter Card validation
  if (!seoData.twitter) {
    warnings.push('Twitter Card tags are missing');
    score -= 5;
  }

  // Canonical URL validation
  if (!seoData.canonical) {
    warnings.push('Canonical URL is missing');
    score -= 5;
  }

  // Structured data validation
  if (!seoData.structuredData) {
    recommendations.push('Consider adding structured data for better search results');
    score -= 3;
  }

  // Recommendations
  if (score >= 90) {
    recommendations.push('Excellent SEO optimization!');
  } else if (score >= 80) {
    recommendations.push('Good SEO optimization with room for improvement');
  } else if (score >= 70) {
    recommendations.push('Average SEO optimization - consider addressing warnings');
  } else {
    recommendations.push('Poor SEO optimization - address errors and warnings');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
    recommendations
  };
};

export const getSEOMetrics = (seoData: any): SEOMetrics => {
  return {
    titleLength: seoData.title?.length || 0,
    descriptionLength: seoData.description?.length || 0,
    keywordsCount: seoData.keywords?.length || 0,
    hasOpenGraph: !!seoData.openGraph,
    hasTwitterCard: !!seoData.twitter,
    hasStructuredData: !!seoData.structuredData,
    hasCanonical: !!seoData.canonical
  };
};

export const generateSEOReport = (seoData: any): string => {
  const validation = validateSEOData(seoData);
  const metrics = getSEOMetrics(seoData);
  
  let report = `SEO Analysis Report\n`;
  report += `==================\n\n`;
  
  report += `Overall Score: ${validation.score}/100\n`;
  report += `Status: ${validation.isValid ? 'VALID' : 'INVALID'}\n\n`;
  
  report += `Metrics:\n`;
  report += `- Title Length: ${metrics.titleLength} characters\n`;
  report += `- Description Length: ${metrics.descriptionLength} characters\n`;
  report += `- Keywords Count: ${metrics.keywordsCount}\n`;
  report += `- Open Graph: ${metrics.hasOpenGraph ? 'Yes' : 'No'}\n`;
  report += `- Twitter Card: ${metrics.hasTwitterCard ? 'Yes' : 'No'}\n`;
  report += `- Structured Data: ${metrics.hasStructuredData ? 'Yes' : 'No'}\n`;
  report += `- Canonical URL: ${metrics.hasCanonical ? 'Yes' : 'No'}\n\n`;
  
  if (validation.errors.length > 0) {
    report += `Errors:\n`;
    validation.errors.forEach(error => {
      report += `- ${error}\n`;
    });
    report += `\n`;
  }
  
  if (validation.warnings.length > 0) {
    report += `Warnings:\n`;
    validation.warnings.forEach(warning => {
      report += `- ${warning}\n`;
    });
    report += `\n`;
  }
  
  if (validation.recommendations.length > 0) {
    report += `Recommendations:\n`;
    validation.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  
  return report;
};

// Helper function to test SEO configs
export const testSEOConfig = (configName: string, seoData: any): void => {
  console.group(`SEO Test: ${configName}`);
  
  const validation = validateSEOData(seoData);
  const metrics = getSEOMetrics(seoData);
  
  console.log('Score:', validation.score);
  console.log('Valid:', validation.isValid);
  console.log('Metrics:', metrics);
  
  if (validation.errors.length > 0) {
    console.error('Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }
  
  console.log('Recommendations:', validation.recommendations);
  console.groupEnd();
};

// Function to validate all SEO configs
export const validateAllSEOConfigs = (seoConfigs: any): void => {
  console.group('SEO Configuration Validation');
  
  Object.keys(seoConfigs).forEach(configKey => {
    const config = seoConfigs[configKey];
    if (typeof config === 'function') {
      // Skip function configs for now
      console.log(`Skipping function config: ${configKey}`);
    } else {
      testSEOConfig(configKey, config);
    }
  });
  
  console.groupEnd();
};
