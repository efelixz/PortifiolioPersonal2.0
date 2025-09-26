import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// Tipos para Blockchain Integration
interface WalletConnection {
  address: string;
  chainId: number;
  network: string;
  provider: any;
  isConnected: boolean;
}

interface SmartContract {
  address: string;
  abi: any[];
  name: string;
  description: string;
  functions: string[];
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  blockNumber?: number;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface DeFiData {
  totalValueLocked: string;
  liquidityPools: Array<{
    pair: string;
    liquidity: string;
    volume24h: string;
    apr: string;
  }>;
  tokenPrices: Record<string, string>;
}

interface Web3Analytics {
  walletActivity: {
    transactionCount: number;
    totalVolume: string;
    averageGasUsed: string;
    preferredTokens: string[];
  };
  contractInteractions: Array<{
    contract: string;
    function: string;
    count: number;
    lastUsed: number;
  }>;
  networkPreferences: Record<string, number>;
}

// Hook principal para Blockchain Integration
export function useBlockchainIntegration() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [web3Analytics, setWeb3Analytics] = useState<Web3Analytics>({
    walletActivity: {
      transactionCount: 0,
      totalVolume: '0',
      averageGasUsed: '0',
      preferredTokens: []
    },
    contractInteractions: [],
    networkPreferences: {}
  });

  const [deFiData, setDeFiData] = useState<DeFiData>({
    totalValueLocked: '0',
    liquidityPools: [],
    tokenPrices: {}
  });

  const providerRef = useRef<any>(null);

  // Detectar provedor Web3
  useEffect(() => {
    detectWeb3Provider();
    loadStoredData();
  }, []);

  const detectWeb3Provider = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      providerRef.current = (window as any).ethereum;
      console.log('Web3 provider detected');
    } else {
      console.log('No Web3 provider found');
    }
  }, []);

  // Conectar carteira
  const connectWallet = useCallback(async () => {
    if (!providerRef.current) {
      alert('Por favor, instale MetaMask ou outro provedor Web3');
      return;
    }

    setIsConnecting(true);

    try {
      // Solicitar permissão de conexão
      const accounts = await providerRef.current.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada');
      }

      // Obter informações da rede
      const chainId = await providerRef.current.request({
        method: 'eth_chainId'
      });

      const networkNames: Record<string, string> = {
        '0x1': 'Ethereum Mainnet',
        '0x3': 'Ropsten Testnet',
        '0x4': 'Rinkeby Testnet',
        '0x5': 'Goerli Testnet',
        '0x89': 'Polygon Mainnet',
        '0x13881': 'Mumbai Testnet',
        '0x38': 'BSC Mainnet',
        '0x61': 'BSC Testnet'
      };

      const walletConnection: WalletConnection = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        network: networkNames[chainId] || 'Unknown Network',
        provider: providerRef.current,
        isConnected: true
      };

      setWallet(walletConnection);
      
      // Carregar dados após conexão
      await loadWalletData(walletConnection);
      
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Desconectar carteira
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setTransactions([]);
    setWeb3Analytics({
      walletActivity: {
        transactionCount: 0,
        totalVolume: '0',
        averageGasUsed: '0',
        preferredTokens: []
      },
      contractInteractions: [],
      networkPreferences: {}
    });
  }, []);

  // Carregar dados da carteira
  const loadWalletData = useCallback(async (walletConnection: WalletConnection) => {
    if (!walletConnection.provider) return;

    try {
      // Simular carregamento de transações
      const mockTransactions: Transaction[] = [
        {
          hash: '0x1234...abcd',
          from: walletConnection.address,
          to: '0x5678...efgh',
          value: '0.5',
          gasUsed: '21000',
          status: 'confirmed',
          timestamp: Date.now() - 86400000,
          blockNumber: 18500000
        },
        {
          hash: '0x5678...efgh',
          from: '0x9abc...1234',
          to: walletConnection.address,
          value: '1.2',
          gasUsed: '45000',
          status: 'confirmed',
          timestamp: Date.now() - 172800000,
          blockNumber: 18499500
        }
      ];

      setTransactions(mockTransactions);

      // Simular analytics
      const analytics: Web3Analytics = {
        walletActivity: {
          transactionCount: mockTransactions.length,
          totalVolume: '1.7',
          averageGasUsed: '33000',
          preferredTokens: ['ETH', 'USDC', 'MATIC']
        },
        contractInteractions: [
          {
            contract: '0xA0b86a33E6441E4b0bb6F0A5EF2C4AD2',
            function: 'transfer',
            count: 5,
            lastUsed: Date.now() - 86400000
          },
          {
            contract: '0xB0c96a44F7552F5b6C6F1A6EF3D5BE3F',
            function: 'approve',
            count: 3,
            lastUsed: Date.now() - 172800000
          }
        ],
        networkPreferences: {
          'Ethereum Mainnet': 7,
          'Polygon Mainnet': 3,
          'BSC Mainnet': 2
        }
      };

      setWeb3Analytics(analytics);

    } catch (error) {
      console.error('Erro ao carregar dados da carteira:', error);
    }
  }, []);

  // Carregar contratos inteligentes
  const loadSmartContracts = useCallback(() => {
    const mockContracts: SmartContract[] = [
      {
        address: '0x1234567890123456789012345678901234567890',
        abi: [],
        name: 'Portfolio Token',
        description: 'Token de demonstração para o portfólio',
        functions: ['transfer', 'approve', 'balanceOf', 'totalSupply']
      },
      {
        address: '0x0987654321098765432109876543210987654321',
        abi: [],
        name: 'NFT Collection',
        description: 'Coleção de NFTs do portfólio',
        functions: ['mint', 'burn', 'tokenURI', 'ownerOf']
      },
      {
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        abi: [],
        name: 'DeFi Vault',
        description: 'Vault para farming de yield',
        functions: ['deposit', 'withdraw', 'getReward', 'stake']
      }
    ];

    setContracts(mockContracts);
  }, []);

  // Carregar dados DeFi
  const loadDeFiData = useCallback(async () => {
    // Simular dados DeFi
    const mockDeFiData: DeFiData = {
      totalValueLocked: '1,234,567.89',
      liquidityPools: [
        {
          pair: 'ETH/USDC',
          liquidity: '45,678.90',
          volume24h: '123,456.78',
          apr: '12.5%'
        },
        {
          pair: 'MATIC/USDT',
          liquidity: '23,456.78',
          volume24h: '67,890.12',
          apr: '18.3%'
        },
        {
          pair: 'BNB/BUSD',
          liquidity: '34,567.89',
          volume24h: '89,012.34',
          apr: '15.7%'
        }
      ],
      tokenPrices: {
        'ETH': '2,450.67',
        'BTC': '43,210.89',
        'MATIC': '0.85',
        'BNB': '245.32',
        'USDC': '1.00',
        'USDT': '1.00'
      }
    };

    setDeFiData(mockDeFiData);
  }, []);

  // Executar transação
  const executeTransaction = useCallback(async (to: string, value: string, data?: string) => {
    if (!wallet?.provider) {
      throw new Error('Carteira não conectada');
    }

    try {
      const transactionParameters = {
        to,
        from: wallet.address,
        value: (parseFloat(value) * Math.pow(10, 18)).toString(16), // Convert to wei
        data: data || '0x'
      };

      const txHash = await wallet.provider.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });

      const newTransaction: Transaction = {
        hash: txHash,
        from: wallet.address,
        to,
        value,
        gasUsed: '0', // Will be updated when confirmed
        status: 'pending',
        timestamp: Date.now()
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      return txHash;
    } catch (error) {
      console.error('Erro ao executar transação:', error);
      throw error;
    }
  }, [wallet]);

  // Interagir com contrato inteligente
  const interactWithContract = useCallback(async (contractAddress: string, functionName: string, params: any[] = []) => {
    if (!wallet?.provider) {
      throw new Error('Carteira não conectada');
    }

    try {
      // Simular interação com contrato
      console.log(`Chamando ${functionName} no contrato ${contractAddress} com parâmetros:`, params);
      
      // Simular resultado
      const mockResult = {
        success: true,
        txHash: '0x' + Math.random().toString(16).substring(2, 66),
        gasUsed: '65000',
        blockNumber: 18500001
      };

      // Atualizar analytics
      setWeb3Analytics(prev => ({
        ...prev,
        contractInteractions: [
          ...prev.contractInteractions.filter(c => !(c.contract === contractAddress && c.function === functionName)),
          {
            contract: contractAddress,
            function: functionName,
            count: (prev.contractInteractions.find(c => c.contract === contractAddress && c.function === functionName)?.count || 0) + 1,
            lastUsed: Date.now()
          }
        ]
      }));

      return mockResult;
    } catch (error) {
      console.error('Erro ao interagir com contrato:', error);
      throw error;
    }
  }, [wallet]);

  // Gerar NFT (simulado)
  const generateNFT = useCallback(async (metadata: NFTMetadata) => {
    if (!wallet) {
      throw new Error('Carteira não conectada');
    }

    try {
      // Simular mint de NFT
      const nftContract = contracts.find(c => c.name === 'NFT Collection');
      if (!nftContract) {
        throw new Error('Contrato NFT não encontrado');
      }

      const result = await interactWithContract(nftContract.address, 'mint', [wallet.address, metadata]);
      
      return {
        ...result,
        tokenId: Math.floor(Math.random() * 10000),
        metadata
      };
    } catch (error) {
      console.error('Erro ao gerar NFT:', error);
      throw error;
    }
  }, [wallet, contracts, interactWithContract]);

  // Salvar dados no localStorage
  const saveToStorage = useCallback(() => {
    try {
      const data = {
        web3Analytics,
        transactions: transactions.slice(0, 50), // Salvar apenas as últimas 50
        timestamp: Date.now()
      };
      localStorage.setItem('blockchain-integration', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, [web3Analytics, transactions]);

  // Carregar dados do localStorage
  const loadStoredData = useCallback(() => {
    try {
      const stored = localStorage.getItem('blockchain-integration');
      if (stored) {
        const data = JSON.parse(stored);
        setWeb3Analytics(data.web3Analytics || web3Analytics);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadSmartContracts();
    loadDeFiData();
  }, [loadSmartContracts, loadDeFiData]);

  // Salvar automaticamente
  useEffect(() => {
    saveToStorage();
  }, [web3Analytics, transactions, saveToStorage]);

  // Escutar mudanças na rede/conta
  useEffect(() => {
    if (providerRef.current && wallet) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== wallet.address) {
          setWallet(prev => prev ? { ...prev, address: accounts[0] } : null);
        }
      };

      const handleChainChanged = (chainId: string) => {
        window.location.reload(); // Recarregar para atualizar dados da rede
      };

      providerRef.current.on('accountsChanged', handleAccountsChanged);
      providerRef.current.on('chainChanged', handleChainChanged);

      return () => {
        if (providerRef.current) {
          providerRef.current.removeListener('accountsChanged', handleAccountsChanged);
          providerRef.current.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [wallet, disconnectWallet]);

  return {
    wallet,
    isConnecting,
    contracts,
    transactions,
    web3Analytics,
    deFiData,
    connectWallet,
    disconnectWallet,
    executeTransaction,
    interactWithContract,
    generateNFT
  };
}

// Componente principal do dashboard Web3
export function Web3Dashboard() {
  const {
    wallet,
    isConnecting,
    contracts,
    transactions,
    web3Analytics,
    deFiData,
    connectWallet,
    disconnectWallet
  } = useBlockchainIntegration();

  const [activeTab, setActiveTab] = useState<'wallet' | 'contracts' | 'defi' | 'analytics'>('wallet');

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '⚪';
    }
  };

  const tabs = [
    { id: 'wallet', label: 'Carteira', icon: '👛' },
    { id: 'contracts', label: 'Contratos', icon: '📜' },
    { id: 'defi', label: 'DeFi', icon: '🏦' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">⛓️</span>
          Blockchain Integration Dashboard
        </h3>

        {/* Status da conexão */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {!wallet ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Conecte sua carteira Web3 para começar
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔗</span>
                    Conectar Carteira
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-green-600">🟢</span>
                  <span className="font-medium">Conectado</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>Endereço: {formatAddress(wallet.address)}</div>
                  <div>Rede: {wallet.network}</div>
                </div>
              </div>
              <button
                onClick={disconnectWallet}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {wallet && (
          <>
            {/* Navegação das abas */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conteúdo das abas */}
            <div>
              {activeTab === 'wallet' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Histórico de Transações</h4>
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma transação encontrada
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <motion.div
                          key={tx.hash}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span>{getStatusIcon(tx.status)}</span>
                              <span className="font-medium">{formatAddress(tx.hash)}</span>
                            </div>
                            <span className={`text-sm ${getStatusColor(tx.status)}`}>
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <span>De: {formatAddress(tx.from)}</span>
                            </div>
                            <div>
                              <span>Para: {formatAddress(tx.to)}</span>
                            </div>
                            <div>
                              <span>Valor: {tx.value} ETH</span>
                            </div>
                            <div>
                              <span>Gas: {tx.gasUsed}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contracts' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Contratos Inteligentes</h4>
                  <div className="grid gap-4">
                    {contracts.map((contract) => (
                      <motion.div
                        key={contract.address}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium">{contract.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {contract.description}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            Ativo
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Endereço: {formatAddress(contract.address)}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contract.functions.map((func) => (
                            <span
                              key={func}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                            >
                              {func}()
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'defi' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">DeFi Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                        <div className="text-sm opacity-90">Total Value Locked</div>
                        <div className="text-2xl font-bold">${deFiData.totalValueLocked}</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg">
                        <div className="text-sm opacity-90">Pools Ativos</div>
                        <div className="text-2xl font-bold">{deFiData.liquidityPools.length}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Liquidity Pools</h4>
                    <div className="space-y-3">
                      {deFiData.liquidityPools.map((pool, index) => (
                        <motion.div
                          key={pool.pair}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{pool.pair}</h5>
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm px-2 py-1 rounded">
                              {pool.apr} APR
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <span>Liquidez: ${pool.liquidity}</span>
                            </div>
                            <div>
                              <span>Volume 24h: ${pool.volume24h}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Preços dos Tokens</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(deFiData.tokenPrices).map(([token, price]) => (
                        <div key={token} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
                          <div className="font-medium">{token}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">${price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Atividade da Carteira</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {web3Analytics.walletActivity.transactionCount}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Transações</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {web3Analytics.walletActivity.totalVolume}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Volume ETH</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {web3Analytics.walletActivity.averageGasUsed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Gas Médio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {web3Analytics.walletActivity.preferredTokens.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tokens</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Interações com Contratos</h4>
                    <div className="space-y-2">
                      {web3Analytics.contractInteractions.map((interaction, index) => (
                        <div
                          key={`${interaction.contract}-${interaction.function}`}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {formatAddress(interaction.contract)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {interaction.function}()
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{interaction.count}x</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(interaction.lastUsed).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Preferências de Rede</h4>
                    <div className="space-y-2">
                      {Object.entries(web3Analytics.networkPreferences).map(([network, count]) => (
                        <div key={network} className="flex items-center justify-between">
                          <span className="text-sm">{network}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / Math.max(...Object.values(web3Analytics.networkPreferences))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Componente para interação com NFTs
export function NFTInteraction() {
  const { wallet, generateNFT } = useBlockchainIntegration();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNFT, setGeneratedNFT] = useState<any>(null);

  const handleGenerateNFT = async () => {
    if (!wallet) return;

    setIsGenerating(true);
    
    try {
      const metadata: NFTMetadata = {
        name: 'Portfolio Demo NFT',
        description: 'NFT de demonstração gerado pelo portfólio',
        image: 'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Demo+NFT',
        attributes: [
          { trait_type: 'Category', value: 'Demo' },
          { trait_type: 'Rarity', value: 'Common' },
          { trait_type: 'Generation', value: Date.now() }
        ]
      };

      const result = await generateNFT(metadata);
      setGeneratedNFT(result);
    } catch (error) {
      console.error('Erro ao gerar NFT:', error);
      alert('Erro ao gerar NFT');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!wallet) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Conecte sua carteira para interagir com NFTs
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4">NFT Interaction Demo</h3>

      <div className="space-y-4">
        <button
          onClick={handleGenerateNFT}
          disabled={isGenerating}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Gerando NFT...
            </>
          ) : (
            <>
              <span className="mr-2">🎨</span>
              Gerar NFT Demo
            </>
          )}
        </button>

        {generatedNFT && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
          >
            <h4 className="font-semibold mb-2">NFT Gerado com Sucesso! 🎉</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Token ID:</strong> #{generatedNFT.tokenId}</div>
              <div><strong>Transaction Hash:</strong> {generatedNFT.txHash.slice(0, 10)}...</div>
              <div><strong>Nome:</strong> {generatedNFT.metadata.name}</div>
              <div><strong>Descrição:</strong> {generatedNFT.metadata.description}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default {
  useBlockchainIntegration,
  Web3Dashboard,
  NFTInteraction
};