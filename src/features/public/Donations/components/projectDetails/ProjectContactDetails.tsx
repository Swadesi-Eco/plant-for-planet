import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';

interface Props {
  contactDetails: Array<{
    id: number;
    icon: JSX.Element;
    text: string;
    link: string;
  }>;
}

function ProjectContactDetails({ contactDetails }: Props): ReactElement {
  return (
    <div className={styles.projectMoreInfo}>
      <div className={styles.infoTitle}>Contact Details</div>
      {contactDetails.map((contactDetails) => (
        <div key={contactDetails.id}>
          {contactDetails.link ? (
            <a href={contactDetails.link} target="_blank">
              <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
                {contactDetails.icon}
                <span style={{ marginLeft: '16px', flexGrow: 1 }}>
                  {contactDetails.text}
                </span>
              </div>
            </a>
          ) : (
            <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
              {contactDetails.icon}
              <span style={{ marginLeft: '16px', flexGrow: 1 }}>
                {contactDetails.text}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectContactDetails;
