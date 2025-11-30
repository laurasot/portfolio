import React from 'react';
import styles from './Projects.module.css';

interface Tag {
    name: string;
    highlighted?: boolean;
}

interface Project {
    id: number;
    title: string;
    description: string;
    category: 'Música' | 'AI' | 'Híbrido' | 'En desarrollo';
    icon: string;
    tags: Tag[];
    link?: string;
}

const Projects: React.FC = () => {
    const projects: Project[] = [
        {
            id: 1,
            title: 'Generación Musical con IA',
            description:
                'Sistema de deep learning para generar composiciones musicales originales basadas en análisis de patrones armónicos y melódicos.',
            category: 'En desarrollo',
            icon: '',
            tags: [
                { name: 'TensorFlow' },
                { name: 'MIDI' },
                { name: 'RNN', highlighted: true },
                { name: 'Composición' }
            ],
        },
        {
            id: 2,
            title: 'Análisis de Sentimientos en Música',
            description:
                'Modelo de machine learning que clasifica emociones en piezas musicales mediante análisis de características acústicas.',
            category: 'En desarrollo',
            icon: '',
            tags: [
                { name: 'Python', highlighted: true },
                { name: 'Librosa' },
                { name: 'Classification' },
                { name: 'Audio Processing' }
            ],
        },
        {
            id: 3,
            title: 'Interpretaciones de Cueca',
            description:
                'Interpretaciones personales de cuecas experimentales del compositor Patricio Fuentes, explorando texturas rítmicas no convencionales, giros armónicos y un enfoque expresivo contemporáneo.',
            category: 'Música',
            icon: '',
            tags: [
                { name: 'Piano', highlighted: true },
                { name: 'Cueca' },
                { name: 'Folclor' },
                { name: 'Performance' }
            ],
        },        
        {
            id: 4,
            title: 'Computer Vision para Partituras',
            description:
                'Sistema de reconocimiento óptico de partituras musicales usando redes neuronales convolucionales.',
            category: 'En desarrollo',
            icon: '',
            tags: [
                { name: 'Computer Vision', highlighted: true },
                { name: 'CNN' },
                { name: 'OCR' },
                { name: 'Music Notation' }
            ],
        },
    ];

    return (
        <section className={styles.projectsContainer} id="proyectos">
            <div className={styles.projectsContent}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Proyectos</h2>
                    <p className={styles.sectionSubtitle}>
                        Exploraciones en la frontera entre música y tecnología
                    </p>
                </div>

                <div className={styles.projectsGrid}>
                    {projects.map((project, index) => (
                        <article
                            key={project.id}
                            className={styles.projectCard}
                            data-index={`0${index + 1}`}
                        >
                            <span className={styles.projectCategory}>
                                {project.category}
                            </span>

                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            <p className={styles.projectDescription}>
                                {project.description}
                            </p>

                            <div className={styles.projectTags}>
                                {project.tags.map((tag) => (
                                    <span 
                                        key={tag.name} 
                                        className={`${styles.projectTag} ${tag.highlighted ? styles.highlighted : ''}`}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>

                            {project.link && (
                                <a
                                    href={project.link}
                                    className={styles.projectLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver proyecto
                                    <span className={styles.linkArrow}>→</span>
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;

