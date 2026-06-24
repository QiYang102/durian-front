export const transformOembedToIframe = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const oembeds = doc.querySelectorAll('oembed');
  
  oembeds.forEach((oembed) => {
    const url = oembed.getAttribute('url');
    if (!url) return;
    
    let embedUrl = '';
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // Add more platforms as needed
    
    if (embedUrl) {
      // Create iframe wrapper
      const figure = doc.createElement('figure');
      figure.className = 'media';
      
      const div = doc.createElement('div');
      div.style.position = 'relative';
      div.style.paddingBottom = '56.25%';
      div.style.height = '0';
      div.style.overflow = 'hidden';
      
      const iframe = doc.createElement('iframe');
      iframe.src = embedUrl;
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      
      div.appendChild(iframe);
      figure.appendChild(div);
      
      oembed.parentNode?.replaceChild(figure, oembed);
    }
  });
  
  return doc.body.innerHTML;
};

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};