import React from 'react';
import styles from './HeroBanner.module.css';

const HeroBanner: React.FC = () => {
    return (
        <section className={styles.heroContainer}>
            <div className={styles.concreteTexture} />

            {/* Bloques geométricos estratégicos - SIN vacíos */}
            <div className={styles.geometricBlocks}>
                <div className={styles.accentBar} data-color="red" data-position="top" />
                <div className={styles.accentBar} data-color="yellow" data-position="middle" />
                <div className={styles.accentBar} data-color="red" data-position="bottom" />
                <div className={styles.solidBlock} data-position="hero" />
            </div>

            <div className={styles.contentLayer}>
                <div className={styles.textContent}>
                    <div className={styles.labelSmall}>PORTFOLIO 2025</div>
                    <h1 className={styles.name}>LAURA</h1>

                    {/* Tagline con más jerarquía */}
                    <div className={styles.taglineBlock}>
                        <div className={styles.taglineLine} />
                        <p className={styles.tagline}>
                            MÚSICA × TECNOLOGÍA
                        </p>
                    </div>

                    {/* Roles con más espacio */}
                    <div className={styles.rolesContainer}>
                        <div className={styles.roleBlock}>
                            <span className={styles.roleNumber}>01</span>
                            <span className={styles.roleText}>FULL STACK<br />DEVELOPER</span>
                        </div>
                        <div className={styles.roleBlock}>
                            <span className={styles.roleNumber}>02</span>
                            <span className={styles.roleText}>AI<br />ENGINEER</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles de esquina minimalistas */}
            <div className={styles.cornerDetails}>
                <div className={styles.cornerTopLeft}>
                    <div className={styles.cornerLine} />
                    <div className={styles.cornerLine} />
                </div>
                <div className={styles.cornerBottomRight}>
                    <div className={styles.cornerLine} />
                    <div className={styles.cornerLine} />
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;

