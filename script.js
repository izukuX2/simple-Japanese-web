document.addEventListener('DOMContentLoaded', () => {
    // المشاريع المتاحة
    const projects = [
        {
            name: "مشروع تعلم اليابانية",
            description: "تعرف على الكلمات اليابانية مع معانيها ونطقها باللغة العربية.",
            link: "japanese_project/index.html"
        },
        {
            name: "مشروع إدارة المهام",
            description: "تطبيق بسيط لإدارة المهام اليومية وتحسين الإنتاجية.",
            link: "task_manager/index.html"
        },
        {
            name: "مشروع تعديل السكربتات",
            description: "أداة لتعديل وتحسين سكربتات الألعاب بشكل بسيط وسريع.",
            link: "script_editor/index.html"
        }
    ];

    // تحديد مكان عرض المشاريع
    const projectsContainer = document.getElementById('projects');

    // التأكد من عدم وجود عناصر موجودة مسبقًا
    projectsContainer.innerHTML = '';

    // عرض المشاريع على الصفحة
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item';

        projectDiv.innerHTML = `
            <h2>${project.name}</h2>
            <p>${project.description}</p>
            <a href="${project.link}" class="btn">عرض المشروع</a>
        `;

        projectsContainer.appendChild(projectDiv);
    });
});