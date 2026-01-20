'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Trash2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import DashboardShell, { useDashboardTheme } from '@/components/parent/DashboardShell';

interface Prize {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export default function ManagePrizesPage() {
  const { theme, isDark } = useDashboardTheme();
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: '1', name: '30 min screen time', description: '', cost: 100 },
    { id: '2', name: 'Ice cream trip', description: 'Trip to local ice cream shop', cost: 500 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrize: Prize = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      cost: parseInt(formData.cost),
    };
    setPrizes([...prizes, newPrize]);
    setFormData({ name: '', description: '', cost: '' });
  };

  const deletePrize = (id: string) => {
    setPrizes(prizes.filter((p) => p.id !== id));
  };

  return (
    <DashboardShell
      showBackButton
      backHref="/dashboard"
      title="Manage Prizes"
      subtitle="Create custom prizes your children can buy with coins!"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className={`mb-8 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80'} p-8 shadow-2xl backdrop-blur-xl border-4 ${theme.border}`}>
          <h2 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Add New Prize</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="prizeName"
                className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
              >
                Prize Name
              </label>
              <Input
                id="prizeName"
                type="text"
                placeholder="e.g., Extra screen time"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
              >
                Description (Optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add more details about this prize..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="text-base"
                rows={3}
              />
            </div>

            <div>
              <label
                htmlFor="cost"
                className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
              >
                Coin Cost
              </label>
              <div className="relative">
                <Crown className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-600" />
                <Input
                  id="cost"
                  type="number"
                  placeholder="100"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  className="pl-12 text-base"
                  min="1"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full bg-gradient-to-r ${theme.gradient} py-6 text-lg font-semibold text-white`}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Prize
            </Button>
          </form>
        </Card>

        <div>
          <h2 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Your Prizes</h2>
          {prizes.length === 0 ? (
            <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>No prizes yet. Add your first prize above!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {prizes.map((prize, index) => (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`flex items-center justify-between ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80'} p-6 shadow-lg backdrop-blur-sm border-4 ${theme.border}`}>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{prize.name}</h3>
                        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-bold text-yellow-700">{prize.cost}</span>
                        </div>
                      </div>
                      {prize.description && (
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{prize.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePrize(prize.id)}
                      className="text-red-600 hover:bg-red-100 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </DashboardShell>
  );
}
