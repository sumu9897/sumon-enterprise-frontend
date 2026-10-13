import { useEffect, useState } from 'react';
import api from '../services/api';

let contentPromise;
const loadContent = () => {
  contentPromise ||= api.get('/site-content').then((response) => response.data.data);
  return contentPromise;
};

const useSiteContent = () => {
  const [content, setContent] = useState(null);
  useEffect(() => {
    let active = true;
    loadContent().then((data) => active && setContent(data)).catch(() => undefined);
    return () => { active = false; };
  }, []);
  return content;
};

export default useSiteContent;
