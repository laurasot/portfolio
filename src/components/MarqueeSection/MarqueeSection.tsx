import React from 'react';
import styles from './MarqueeSection.module.css';

const MarqueeSection: React.FC = () => {
    const text = "DONDE LA MÚSICA Y LA TECNOLOGÍA CONVERGEN / ";

    return (
        <section className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
                <div className={styles.marqueeTrack}>
                    <span className={styles.marqueeText}>
                        {text.repeat(10)}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default MarqueeSection;

