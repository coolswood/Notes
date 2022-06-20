import styles from './styles.module.scss';

export const Wrapper = ({ children }: {children: any}) => {
    return <div className={styles.wrap}>{children}</div>;
}