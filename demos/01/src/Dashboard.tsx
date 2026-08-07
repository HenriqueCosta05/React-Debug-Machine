import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import MarketSentiment from './components/widgets/MarketSentiment/MarketSentiment';
import PortfolioPerformance from './components/widgets/PortfolioPerformance/PortfolioPerformance';
import MyPortfolio from './components/widgets/MyPortfolio/MyPortfolio';
import ProtectCapital from './components/widgets/ProtectCapital/ProtectCapital';
import TradingActivity from './components/widgets/TradingActivity/TradingActivity';
import LastActivity from './components/widgets/LastActivity/LastActivity';
import QuickActions from './components/widgets/QuickActions/QuickActions';
import TopPicks from './components/widgets/TopPicks/TopPicks';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.marketSentiment}><MarketSentiment /></div>
          <div className={styles.portfolioPerformance}><PortfolioPerformance /></div>
          <div className={styles.myPortfolio}><MyPortfolio /></div>
          <div className={styles.protectCapital}><ProtectCapital /></div>
          <div className={styles.tradingActivity}><TradingActivity /></div>
          <div className={styles.quickActions}><QuickActions /></div>
          <div className={styles.topPicks}><TopPicks /></div>
          <div className={styles.lastActivity}><LastActivity /></div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
