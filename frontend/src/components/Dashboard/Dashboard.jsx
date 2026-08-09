import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import transactionService from '../../services/transactionService';
import reportService from '../../services/reportService';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  PlusCircle,
  BarChart3,
  TrendingUp,
  History,
  DollarSign
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();

  // Transaction Form States
  const [txType, setTxType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [submittingTx, setSubmittingTx] = useState(false);
  const [txMessage, setTxMessage] = useState(null);

  // History & Report States
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Load transactions and financial report
  const loadDashboardData = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      await refreshUser();

      // Fetch Transaction History
      const txData = await transactionService.getTransactionsByAccount(user.id);
      setTransactions(txData || []);

      // Fetch Financial Report
      try {
        const reportData = await reportService.getFinancialReport(user.id);
        setReport(reportData);
      } catch (err) {
        console.warn('Report service unavailable or empty report history');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  // Handle New Deposit / Withdrawal Submission
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setSubmittingTx(true);
    setTxMessage(null);

    try {
      await transactionService.createTransaction(user.id, amount, txType);
      setTxMessage({ type: 'success', text: `Successfully logged ${txType} of $${parseFloat(amount).toFixed(2)}` });
      setAmount('');
      // Reload balance and transaction history
      await loadDashboardData();
    } catch (err) {
      setTxMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Transaction failed. Check service connection.'
      });
    } finally {
      setSubmittingTx(false);
    }
  };

  return (
    <section id="dashboard" className="dashboard-section">

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Balance Overview Card */}
        <div className="dashboard-card">
          <div className="card-heading">
            <span>Account Balance</span>
          </div>
          <div className="balance-amount">
            ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          <p className="balance-subtitle">
            🟢 Active Account Balance synced with Account Service
          </p>
        </div>

        {/* Quick Transaction Form */}
        <div className="dashboard-card">
          <div className="card-heading">
            <span>New Transaction</span>
            <PlusCircle size={20} color="#10b981" />
          </div>

          {/* Deposit vs Withdrawal Switcher */}
          <div className="tx-type-toggle">
            <button
              className={`type-btn ${txType === 'deposit' ? 'active deposit' : ''}`}
              onClick={() => setTxType('deposit')}
            >
              <ArrowDownLeft size={16} style={{ display: 'inline', marginRight: '6px' }} /> Deposit
            </button>
            <button
              className={`type-btn ${txType === 'withdrawal' ? 'active withdrawal' : ''}`}
              onClick={() => setTxType('withdrawal')}
            >
              <ArrowUpRight size={16} style={{ display: 'inline', marginRight: '6px' }} /> Withdrawal
            </button>
          </div>

          {/* Transaction Form */}
          <form onSubmit={handleTransactionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-wrapper">
              <DollarSign size={18} className="input-icon" />
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="form-input"
                placeholder="Enter amount (e.g. 250.00)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="form-submit-btn" disabled={submittingTx}>
              {submittingTx ? 'Processing...' : `Submit ${txType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
            </button>

            {txMessage && (
              <div
                style={{
                  fontSize: '0.85rem',
                  color: txMessage.type === 'success' ? '#10b981' : '#ef4444',
                  textAlign: 'center',
                  marginTop: '6px'
                }}
              >
                {txMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* Financial Analytics Report */}
        <div className="dashboard-card history-section">
          <div className="card-heading">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} color="#06b6d4" /> Real-Time Analytics Summary
            </span>
          </div>

          <div className="report-grid">
            <div className="report-stat-box">
              <div className="report-label">Total Deposits</div>
              <div className="report-val" style={{ color: '#10b981' }}>
                +${report?.total_deposits?.toLocaleString() || '0.00'}
              </div>
            </div>
            <div className="report-stat-box">
              <div className="report-label">Total Withdrawals</div>
              <div className="report-val" style={{ color: '#ef4444' }}>
                -${report?.total_withdrawals?.toLocaleString() || '0.00'}
              </div>
            </div>
            <div className="report-stat-box">
              <div className="report-label">Net Flow</div>
              <div className="report-val" style={{ color: '#06b6d4' }}>
                ${((report?.total_deposits || 0) - (report?.total_withdrawals || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="dashboard-card history-section">
          <div className="card-heading">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="#10b981" /> Recent Transactions
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {transactions.length} Total Logs
            </span>
          </div>

          {transactions.length === 0 ? (
            <p style={{ color: '#8b949e', textAlign: 'center', padding: '30px 0' }}>
              No transactions logged yet. Submit a deposit or withdrawal above!
            </p>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className={`tx-badge ${tx.transaction_type}`}>
                        {tx.transaction_type === 'deposit' ? (
                          <ArrowDownLeft size={14} />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: tx.transaction_type === 'deposit' ? '#10b981' : '#ef4444' }}>
                      {tx.transaction_type === 'deposit' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.85rem' }}>
                      REF-{String(tx.id).padStart(5, '0')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
