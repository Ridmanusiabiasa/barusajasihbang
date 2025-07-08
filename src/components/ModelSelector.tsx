import React from 'react';
import { ChevronDown, Zap, Crown, Star } from 'lucide-react';
import { ModelType } from '../types';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const models: Array<{
  id: ModelType;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: 'basic' | 'pro' | 'premium';
}> = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient',
    icon: <Zap className="w-4 h-4" />,
    tier: 'basic'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Advanced reasoning',
    icon: <Star className="w-4 h-4" />,
    tier: 'pro'
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    description: 'Latest mini model',
    icon: <Zap className="w-4 h-4" />,
    tier: 'basic'
  },
  {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano',
    description: 'Ultra-fast responses',
    icon: <Zap className="w-4 h-4" />,
    tier: 'basic'
  },
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: 'Most capable model',
    icon: <Crown className="w-4 h-4" />,
    tier: 'premium'
  }
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedModelData = models.find(m => m.id === selectedModel);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'text-blue-400';
      case 'pro': return 'text-purple-400';
      case 'premium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
      >
        <div className={getTierColor(selectedModelData?.tier || 'basic')}>
          {selectedModelData?.icon}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white">
            {selectedModelData?.name}
          </span>
          <span className="text-xs text-gray-400">
            {selectedModelData?.description}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  selectedModel === model.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className={getTierColor(model.tier)}>
                  {model.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-400">{model.description}</div>
                </div>
                {selectedModel === model.id && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};