import React from 'react';
import styles from './Education.module.css';

interface Tag {
    name: string;
    highlighted?: boolean;
}

interface EducationItem {
    id: number;
    title: string;
    institution: string;
    year: string;
    type: 'Educación' | 'Certificación';
    description?: string;
    tags?: Tag[];
    badgeUrl?: string;
}

const Education: React.FC = () => {
    const educationItems: EducationItem[] = [
        {
            id: 1,
            title: 'Técnico en programación y análisis de sistemas',
            institution: 'Instituto Profesional San Sebastian',
            year: '2025 - 2028',
            type: 'Educación',
            description: 'Especialización en Cloud Computing e Infraestructura',
            tags: [
                { name: 'AWS', highlighted: true },
                { name: 'Cloud' },
                { name: 'Architecture' },
                { name: 'Diseño de soluciones' },
                { name: 'Diseño de base de datos' },
            ],
        },
        {
            id: 2,
            title: 'Certified Tech Developer',
            institution: 'Digital House',
            year: '2023 - 2025',
            type: 'Educación',
            description: 'Especialización full stack developer',
            tags: [
                { name: 'React', highlighted: true },
                { name: 'Java', highlighted: true  },
                { name: 'JavaScript' },
                { name: 'Diseño de soluciones'},
                { name: 'Testing' },
                { name: 'Cloud Computing'}
            ],
        },
    ];

    const certificationItems: EducationItem[] = [
        {
            id: 3,
            title: 'Bootcamp Fundamentos de la Inteligencia Artificial',
            institution: 'IBM and Guayerd',
            year: '2025',
            type: 'Certificación',
            tags: [
                { name: 'Visualizacion de datos' },
                { name: 'Machine Learning' },
                { name: 'Analisis de datos', highlighted: true }
            ],
            badgeUrl: 'https://www.credly.com/badges/4fd1c099-dc40-4e7f-b7c0-3bd62d1584e6',
        },
        {
            id: 4,
            title: 'AWS Certified Cloud Practitioner',
            institution: 'Amazon Web Services',
            year: '2025',
            type: 'Certificación',
            tags: [
                { name: 'AWS', highlighted: true },
                { name: 'Cloud' },
                { name: 'Arquitectura' }
            ],
            badgeUrl: 'https://www.credly.com/badges/2a9b1667-96de-48a1-a81c-39b71ea88d99/linked_in_profile',
        },
        {
            id: 5,
            title: 'AWS Certified AI Practitioner',
            institution: 'Amazon Web Services',
            year: '2025',
            type: 'Certificación',
            tags: [
                { name: 'AWS', highlighted: true },
                { name: 'Fundamentos de IA' },
                { name: 'Redes Neuronales' },
                { name: 'Machine Learning' },
                { name: 'Generative AI', highlighted: true },

            ],
            badgeUrl: 'https://www.credly.com/badges/20919825-bb26-4752-b657-fa22b674730e/linked_in_profile',
        },
        {
            id: 6,
            title: 'Bootcamp Java Full Stack',
            institution: 'Coding Dojo',
            year: '2022',
            type: 'Certificación',
            tags: [
                { name: 'Java' },
                { name: 'POO' },
                { name: 'Spring Boot', highlighted: true }
            ]
        },
        {
            id: 6,
            title: 'Bootcamp Ruby on Rails',
            institution: 'Le wagon',
            year: '2021',
            type: 'Certificación',
            tags: [
                { name: 'Ruby', highlighted: true },
                { name: 'Rails' },
                { name: 'Git' }
            ],
        },
    ];

    return (
        <section className={styles.educationContainer} id="educacion">
            <div className={styles.grainTexture} />
            <div className={styles.educationContent}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Formación</h2>
                </div>

                <div className={styles.educationSection}>
                    <h3 className={styles.subsectionTitle}>Educación Formal</h3>
                    <div className={styles.educationGrid}>
                        {educationItems.map((item) => (
                            <article
                                key={item.id}
                                className={styles.educationCard}
                                data-type={item.type}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.educationYear}>{item.year}</span>
                                </div>

                                <h4 className={styles.educationTitle}>{item.title}</h4>
                                <p className={styles.educationInstitution}>{item.institution}</p>

                                {item.description && (
                                    <p className={styles.educationDescription}>
                                        {item.description}
                                    </p>
                                )}

                                {item.tags && item.tags.length > 0 && (
                                    <div className={styles.educationTags}>
                                        {item.tags.map((tag) => (
                                            <span 
                                                key={tag.name} 
                                                className={`${styles.educationTag} ${tag.highlighted ? styles.highlighted : ''}`}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>

                <div className={styles.certificationSection}>
                    <h3 className={styles.subsectionTitle}>Certificaciones</h3>
                    <div className={styles.certificationGrid}>
                        {certificationItems.map((item) => (
                            <article
                                key={item.id}
                                className={styles.educationCard}
                                data-type={item.type}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.educationYear}>{item.year}</span>
                                </div>

                                <h4 className={styles.educationTitle}>{item.title}</h4>
                                <p className={styles.educationInstitution}>{item.institution}</p>

                                {item.description && (
                                    <p className={styles.educationDescription}>
                                        {item.description}
                                    </p>
                                )}

                                {item.tags && item.tags.length > 0 && (
                                    <div className={styles.educationTags}>
                                        {item.tags.map((tag) => (
                                            <span 
                                                key={tag.name} 
                                                className={`${styles.educationTag} ${tag.highlighted ? styles.highlighted : ''}`}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {item.badgeUrl && item.badgeUrl.trim() !== '' && (
                                    <a
                                        href={item.badgeUrl}
                                        className={styles.badgeButton}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        VER BADGE
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
