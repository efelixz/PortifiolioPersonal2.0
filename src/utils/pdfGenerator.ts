// PDF generation utilities
// Install: npm install jspdf html2canvas

interface HiringPackData {
  name: string;
  role: string;
  skills: string[];
  experience: string;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    image?: string;
    caseUrl?: string;
    codeUrl?: string;
    demoUrl?: string;
  }>;
  contact?: {
    email: string;
    linkedin?: string;
    github?: string;
  };
}

interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
  margin?: number;
}

// Export any HTML element to PDF
export const exportElementToPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    const {
      filename = 'document.pdf',
      format = 'a4',
      orientation = 'portrait',
      quality = 0.95,
      scale = 2,
      margin = 20,
    } = options;

    // Dynamic imports to reduce bundle size
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    // Prepare element for PDF capture
    const originalStyle = prepareElementForPDF(element);

    // Capture element as canvas with high quality
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure all images are loaded in cloned document
        const images = clonedDoc.querySelectorAll('img');
        images.forEach((img) => {
          if (img.src.startsWith('data:') || img.complete) return;
          img.src = img.src; // Force reload
        });
      },
    });

    // Restore original styles
    restoreElementStyles(element, originalStyle);

    // Calculate PDF dimensions
    const imgWidth = format === 'a4' ? 210 : 216; // mm
    const imgHeight = format === 'a4' ? 297 : 279; // mm
    const contentWidth = imgWidth - margin * 2;
    const contentHeight = imgHeight - margin * 2;

    // Calculate scaling to fit content
    const canvasAspectRatio = canvas.height / canvas.width;
    const pdfAspectRatio = contentHeight / contentWidth;

    let finalWidth = contentWidth;
    let finalHeight = contentWidth * canvasAspectRatio;

    if (canvasAspectRatio > pdfAspectRatio) {
      finalHeight = contentHeight;
      finalWidth = contentHeight / canvasAspectRatio;
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
      compress: true,
    });

    // Add canvas to PDF
    const imgData = canvas.toDataURL('image/jpeg', quality);
    const xOffset = (imgWidth - finalWidth) / 2;
    const yOffset = margin;

    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);

    // Add metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      subject: 'Hiring Pack - Jefferson Felix',
      author: 'Jefferson Felix',
      creator: 'Portfolio Website',
    });

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Falha ao gerar PDF. Tente novamente.');
  }
};

// Prepare element styles for PDF capture
const prepareElementForPDF = (element: HTMLElement): string => {
  const originalStyle = element.style.cssText;

  // Apply PDF-friendly styles
  element.style.cssText += `
    width: 800px !important;
    max-width: 800px !important;
    min-width: 800px !important;
    background: white !important;
    color: black !important;
    font-family: 'Inter', Arial, sans-serif !important;
    line-height: 1.5 !important;
    padding: 40px !important;
    box-sizing: border-box !important;
  `;

  // Fix colors for PDF
  const elements = element.querySelectorAll('*');
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlEl);
    
    // Ensure text is readable
    if (computedStyle.color === 'rgb(255, 255, 255)' || 
        computedStyle.color.includes('rgba(255, 255, 255')) {
      htmlEl.style.color = '#000000 !important';
    }
    
    // Fix background colors
    if (computedStyle.backgroundColor.includes('rgba(0, 0, 0') ||
        computedStyle.backgroundColor === 'transparent') {
      htmlEl.style.backgroundColor = 'transparent !important';
    }
  });

  return originalStyle;
};

// Restore original element styles
const restoreElementStyles = (element: HTMLElement, originalStyle: string): void => {
  element.style.cssText = originalStyle;
};

// Generate hiring pack from data
export const generateHiringPack = async (data: HiringPackData): Promise<void> => {
  try {
    // Create temporary container for PDF content
    const container = createHiringPackHTML(data);
    document.body.appendChild(container);

    // Wait for images to load
    await waitForImages(container);

    // Generate PDF
    await exportElementToPDF(container, {
      filename: `${data.name.replace(/\s+/g, '-')}-Hiring-Pack.pdf`,
      format: 'a4',
      orientation: 'portrait',
      quality: 0.95,
      scale: 2,
    });

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating hiring pack:', error);
    throw error;
  }
};

// Create HTML structure for hiring pack
const createHiringPackHTML = (data: HiringPackData): HTMLElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 800px;
    background: white;
    font-family: 'Inter', Arial, sans-serif;
    color: black;
    padding: 40px;
    box-sizing: border-box;
  `;

  container.innerHTML = `
    <div style="margin-bottom: 40px; text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px;">
      <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937;">
        ${data.name}
      </h1>
      <h2 style="font-size: 18px; color: #6366f1; margin: 0; font-weight: 600;">
        ${data.role}
      </h2>
      ${data.contact ? `
        <div style="margin-top: 15px; font-size: 14px; color: #6b7280;">
          <p style="margin: 5px 0;">${data.contact.email}</p>
          ${data.contact.linkedin ? `<p style="margin: 5px 0;">LinkedIn: ${data.contact.linkedin}</p>` : ''}
          ${data.contact.github ? `<p style="margin: 5px 0;">GitHub: ${data.contact.github}</p>` : ''}
        </div>
      ` : ''}
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 15px 0; color: #1f2937; border-left: 4px solid #6366f1; padding-left: 15px;">
        Habilidades Técnicas
      </h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${data.skills.map(skill => `
          <span style="
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          ">${skill}</span>
        `).join('')}
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 15px 0; color: #1f2937; border-left: 4px solid #6366f1; padding-left: 15px;">
        Experiência
      </h3>
      <p style="line-height: 1.6; color: #374151; margin: 0; font-size: 14px;">
        ${data.experience}
      </p>
    </div>

    <div>
      <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 20px 0; color: #1f2937; border-left: 4px solid #6366f1; padding-left: 15px;">
        Projetos em Destaque
      </h3>
      <div style="display: grid; gap: 20px;">
        ${data.projects.map(project => `
          <div style="
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            background: #f9fafb;
          ">
            <h4 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0; color: #1f2937;">
              ${project.title}
            </h4>
            <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px; line-height: 1.5;">
              ${project.description}
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
              ${project.tech.map(tech => `
                <span style="
                  background: #e0e7ff;
                  color: #3730a3;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 600;
                ">${tech}</span>
              `).join('')}
            </div>
            ${project.caseUrl || project.codeUrl || project.demoUrl ? `
              <div style="font-size: 12px; color: #6b7280;">
                ${project.caseUrl ? `<span style="margin-right: 15px;">📋 Case Study</span>` : ''}
                ${project.codeUrl ? `<span style="margin-right: 15px;">💻 Código</span>` : ''}
                ${project.demoUrl ? `<span>🚀 Demo</span>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        Gerado em ${new Date().toLocaleDateString('pt-BR')} • Portfolio: jefferson.dev
      </p>
    </div>
  `;

  return container;
};

// Wait for all images to load
const waitForImages = (container: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const images = container.querySelectorAll('img');
    if (images.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkComplete();
      } else {
        img.onload = checkComplete;
        img.onerror = checkComplete;
      }
    });

    // Fallback timeout
    setTimeout(resolve, 3000);
  });
};

// Generate CV (simplified version)
export const generateCV = async (data: HiringPackData): Promise<void> => {
  try {
    const cvData = {
      ...data,
      projects: data.projects.slice(0, 3), // Limit to top 3 projects for CV
    };

    const container = createCVHTML(cvData);
    document.body.appendChild(container);

    await waitForImages(container);

    await exportElementToPDF(container, {
      filename: `${data.name.replace(/\s+/g, '-')}-CV.pdf`,
      format: 'a4',
      orientation: 'portrait',
      quality: 0.95,
      scale: 2,
    });

    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};

// Create HTML structure for CV (more compact)
const createCVHTML = (data: HiringPackData): HTMLElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 800px;
    background: white;
    font-family: 'Inter', Arial, sans-serif;
    color: black;
    padding: 40px;
    box-sizing: border-box;
  `;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 5px 0; color: #1f2937;">
        ${data.name}
      </h1>
      <h2 style="font-size: 16px; color: #6366f1; margin: 0 0 10px 0; font-weight: 600;">
        ${data.role}
      </h2>
      ${data.contact ? `
        <p style="font-size: 14px; color: #6b7280; margin: 0;">
          ${data.contact.email}
          ${data.contact.linkedin ? ` • ${data.contact.linkedin}` : ''}
          ${data.contact.github ? ` • ${data.contact.github}` : ''}
        </p>
      ` : ''}
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937; text-transform: uppercase; letter-spacing: 1px;">
        Habilidades
      </h3>
      <p style="line-height: 1.4; color: #374151; margin: 0; font-size: 14px;">
        ${data.skills.join(' • ')}
      </p>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937; text-transform: uppercase; letter-spacing: 1px;">
        Experiência
      </h3>
      <p style="line-height: 1.5; color: #374151; margin: 0; font-size: 14px;">
        ${data.experience}
      </p>
    </div>

    <div>
      <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #1f2937; text-transform: uppercase; letter-spacing: 1px;">
        Projetos Destacados
      </h3>
      ${data.projects.map(project => `
        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
          <h4 style="font-size: 14px; font-weight: bold; margin: 0 0 5px 0; color: #1f2937;">
            ${project.title}
          </h4>
          <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 13px; line-height: 1.4;">
            ${project.description}
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <strong>Tech:</strong> ${project.tech.join(', ')}
          </p>
        </div>
      `).join('')}
    </div>
  `;

  return container;
};