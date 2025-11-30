import React from 'react';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
    return (
        <section className={styles.contactContainer} id="contacto">
            <div className={styles.grainTexture} />
            <div className={styles.contactContent}>
                <h2 className={styles.sectionTitle}>Conectemos</h2>
                <p className={styles.sectionSubtitle}>
                Aquí te dejo mis redes por si buscas colaboración en un proyecto, 
                necesitas apoyo creativo/tecnológico o simplemente quieres conversar sobre innovación.
                </p>

                <div className={styles.contactLinks}>
                    <a
                        href="mailto:laura5florencia@gmail.com"
                        className={styles.contactLink}
                        aria-label="Enviar email"
                    >
                        <span className={styles.contactLabel}>EMAIL</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/laurasot/"
                        className={styles.contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <span className={styles.contactLabel}>LINKEDIN</span>
                    </a>

                    <a
                        href="https://github.com/laurasot"
                        className={styles.contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <span className={styles.contactLabel}>GITHUB</span>
                    </a>
                </div>

                <footer className={styles.footer}>
                    <p className={styles.footerText}>
                        Diseñado y desarrollado con precisión y creatividad
                    </p>
                    <p className={styles.footerSignature}>Laura Soto</p>
                    <p className={styles.footerAlias}>alias Popositas</p>
                </footer>
            </div>
        </section>
    );
};

export default Contact;

