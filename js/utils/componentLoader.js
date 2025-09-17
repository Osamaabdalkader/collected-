// js/utils/componentLoader.js - أداة تحميل المكونات
export async function loadComponent(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`فشل تحميل ${filePath}: ${response.status}`);
        }
        
        const content = await response.text();
        document.getElementById(containerId).innerHTML = content;
        
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        document.getElementById(containerId).innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
                خطأ في تحميل المكون: ${filePath}
            </div>
        `;
        return false;
    }
}
