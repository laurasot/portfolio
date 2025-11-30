import React from 'react';
import styles from './About.module.css';

interface Skill {
    name: string;
    highlighted?: boolean;
}

const About: React.FC = () => {
    const musicSkills: Skill[] = [
        { name: 'Cueca and Salsa' },
        { name: 'Composition', highlighted: true },
        { name: 'Music Theory' },
        { name: 'Performance' },
        { name: 'Ableton' }
    ];

    const techSkills: Skill[] = [
        { name: 'Generative AI', highlighted: true },
        { name: 'NLP', highlighted: true },
        { name: 'Machine Learning' },
        { name: 'Deep Learning' },
        { name: 'Data Science' },
        { name: 'Python', highlighted: true },
        { name: 'Computer Vision' },
    ];

    const devSkills: Skill[] = [
        { name: 'AWS' },
        { name: 'CDK' },
        { name: 'React', highlighted: true },
        { name: 'TypeScript', highlighted: true },
        { name: 'Node.js' },
        { name: 'Java' },
        { name: 'PostgreSQL' },
        { name: 'Git' },
        { name: 'Docker' }
    ];

    return (
        <section className={styles.aboutContainer} id="sobre-mi">
            <div className={styles.grainTexture} />
            <div className={styles.aboutContent}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Sobre Mí</h2>
                </div>

                <div className={styles.aboutGrid}>
                    <div className={styles.aboutText}>
                        <p className={styles.aboutParagraph}>
                            Me alegra que estés aquí. No te asustes por el diseño brutalista: siempre me ha gustado el arte y quise hacer algo innovador y disruptivo para una web que habla de mí, es que
                            me encanta crear, pensar soluciones a través ¿porqué no? de la sensibilidad artistica.
                        </p>
                        <p className={styles.aboutParagraph}>
                            Mi hobby principal es tocar piano, no por los aplausos, sino por lo que me provoca escuchar mis propias melodías. También soy una apasionada por la tecnología;
                            partí a los 19 sin título, solo con ganas de aprender y de explorar lo último en innovación. Ahí me encontré con la IA,
                            y desde entonces mi camino ha sido más que crear webs (front y backend) y dar soporte a sistemas distribuidos:
                            también diseñar soluciones desde los datos y la IA generativa.
                        </p>
                        <p className={styles.aboutParagraph}>
                            Eso resume mi perfil: una joven en constante aprendizaje que combina formación full-stack con ciencia de datos y AI engineering, buscando crear soluciones que inspiren.
                        </p>
                    </div>

                    <div className={styles.skillsContainer}>

                        <div className={styles.skillCategory}>
                            <div className={styles.skillHeader}>
                                <h3 className={styles.skillTitle}>AI ENGINEERING</h3>
                            </div>
                            <div className={styles.skillList}>
                                {techSkills.map((skill) => (
                                    <span 
                                        key={skill.name} 
                                        className={`${styles.skillTag} ${skill.highlighted ? styles.highlighted : ''}`}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.skillCategory}>
                            <div className={styles.skillHeader}>
                                <h3 className={styles.skillTitle}>FULL STACK DEVELOPER</h3>
                            </div>
                            <div className={styles.skillList}>
                                {devSkills.map((skill) => (
                                    <span 
                                        key={skill.name} 
                                        className={`${styles.skillTag} ${skill.highlighted ? styles.highlighted : ''}`}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.skillCategory}>
                            <div className={styles.skillHeader}>
                                <h3 className={styles.skillTitle}>MÚSICA</h3>
                            </div>
                            <div className={styles.skillList}>
                                {musicSkills.map((skill) => (
                                    <span 
                                        key={skill.name} 
                                        className={`${styles.skillTag} ${skill.highlighted ? styles.highlighted : ''}`}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section >
    );
};

export default About;

