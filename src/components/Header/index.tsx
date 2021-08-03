import styles from './header.module.scss';

export default function Header() {
  return (
    <header>
      <div className={styles.headerContainer}>
        <a href="/">
          <img src="/logo.svg" alt="logo" />
        </a>
      </div>
    </header>
  );
}
