import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    description: (
      <>
        Our Help Center is designed from the ground up to be easily navigated and
        used to find answers to your questions quickly.
      </>
    ),
  },
  {
    title: 'Comprehensive Articles',
    description: (
      <>
        Browse through our collection of articles covering various topics and
        find the information you need in our organized documentation.
      </>
    ),
  },
  {
    title: 'Quick Search',
    description: (
      <>
        Use our search functionality to quickly find specific articles and
        get the help you need without browsing through multiple pages.
      </>
    ),
  },
];

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <div key={idx} className={clsx('col col--4')}>
              <div className="text--center padding-horiz--md">
                <Heading as="h3">{props.title}</Heading>
                <p>{props.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
