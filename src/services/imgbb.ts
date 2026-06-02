const convertToWebp = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Falha ao obter contexto do canvas'));
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Conversão para WebP falhou'));
        
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
        const webpFile = new File([blob], newFileName, { type: "image/webp" });
        resolve(webpFile);
      }, 'image/webp', 0.85); // 85% de qualidade para manter boa resolução com arquivo menor
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar imagem para conversão'));
    };
    
    img.src = url;
  });
};

export const uploadImageToImgbb = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('Chave da API do ImgBB não configurada no .env');
  }

  let fileToUpload = file;
  
  // Tentar converter para WebP se já não for
  if (!file.type.includes('webp')) {
    try {
      fileToUpload = await convertToWebp(file);
    } catch (err) {
      console.warn('Erro ao converter imagem para webp, enviando a original:', err);
    }
  }

  const formData = new FormData();
  formData.append('image', fileToUpload);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error(data.error?.message || 'Erro ao fazer upload da imagem');
  }
};
