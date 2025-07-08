import React from 'react';
import { Key, BarChart3, Plus, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { ApiKey, TokenUsage } from '../types';
import { StorageService } from '../utils/storage';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [tokenUsage, setTokenUsage] = React.useState<TokenUsage[]>([]);
  const [showAddKey, setShowAddKey] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [newKeyValue, setNewKeyValue] = React.useState('');
  const [showKeys, setShowKeys] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setApiKeys(StorageService.getApiKeys());
    setTokenUsage(StorageService.getTokenUsage());
  }, []);

  const handleAddKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      key: newKeyValue.trim(),
      createdAt: new Date(),
      isActive: apiKeys.length === 0
    };

    StorageService.saveApiKey(newKey);
    setApiKeys(StorageService.getApiKeys());
    setNewKeyName('');
    setNewKeyValue('');
    setShowAddKey(false);
  };

  const handleDeleteKey = (keyId: string) => {
    StorageService.deleteApiKey(keyId);
    setApiKeys(StorageService.getApiKeys());
  };

  const handleToggleActive = (keyId: string) => {
    StorageService.toggleApiKey(keyId);
    setApiKeys(StorageService.getApiKeys());
  };

  const toggleShowKey = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const totalTokens = tokenUsage.reduce((sum, usage) => sum + usage.tokens, 0);
  const totalCost = tokenUsage.reduce((sum, usage) => sum + usage.cost, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold">API Keys</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{apiKeys.length}</p>
            <p className="text-sm text-gray-400">Total keys configured</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold">Total Tokens</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{totalTokens.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Tokens consumed</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold">Total Cost</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">${totalCost.toFixed(4)}</p>
            <p className="text-sm text-gray-400">Estimated cost</p>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <button
              onClick={() => setShowAddKey(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Key
            </button>
          </div>

          {showAddKey && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New API Key</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production Key"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddKey}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Add Key
                </button>
                <button
                  onClick={() => setShowAddKey(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No API keys configured</p>
            ) : (
              apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                    key.isActive ? 'bg-green-900/20 border-green-500' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{key.name}</h3>
                      {key.isActive && (
                        <span className="px-2 py-1 bg-green-600 text-xs rounded-full">Active</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm text-gray-400 font-mono">
                        {showKeys[key.id] ? key.key : '••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleShowKey(key.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {key.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(key.id)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        key.isActive
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {key.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Token Usage Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Token Usage</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Model</th>
                  <th className="text-right py-2">Tokens</th>
                  <th className="text-right py-2">Cost</th>
                </tr>
              </thead>
              <tbody>
                {tokenUsage.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No usage data available
                    </td>
                  </tr>
                ) : (
                  tokenUsage.map((usage, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2">{usage.date}</td>
                      <td className="py-2">{usage.model}</td>
                      <td className="py-2 text-right">{usage.tokens.toLocaleString()}</td>
                      <td className="py-2 text-right">${usage.cost.toFixed(4)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};