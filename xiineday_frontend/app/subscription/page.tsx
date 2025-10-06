'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Crown, Zap, Shield, TrendingUp, Users, Cloud, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  price: number;
  features: any;
}

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'Gratuit',
    description: 'Parfait pour débuter',
    icon: Cloud,
    color: 'from-gray-400 to-gray-600',
    features: [
      { name: 'Prévisions météo 3 jours', included: true },
      { name: '1 champ maximum', included: true },
      { name: 'Recommandations de base', included: true },
      { name: 'Alertes météo', included: false },
      { name: 'Analyse climatique avancée', included: false },
      { name: 'Support prioritaire', included: false },
      { name: 'Recommandations IA', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 4999,
    period: 'mois',
    description: 'Pour les agriculteurs sérieux',
    icon: Zap,
    color: 'from-green-500 to-emerald-600',
    popular: true,
    features: [
      { name: 'Prévisions météo 14 jours', included: true },
      { name: 'Champs illimités', included: true },
      { name: 'Recommandations avancées', included: true },
      { name: 'Alertes météo en temps réel', included: true },
      { name: 'Analyse climatique complète', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Recommandations IA', included: false },
    ],
  },
  {
    name: 'Premium',
    price: 9999,
    period: 'mois',
    description: 'La solution complète',
    icon: Crown,
    color: 'from-yellow-500 to-orange-600',
    features: [
      { name: 'Prévisions météo 30 jours', included: true },
      { name: 'Champs illimités', included: true },
      { name: 'Recommandations premium', included: true },
      { name: 'Alertes personnalisées', included: true },
      { name: 'Analyse prédictive IA', included: true },
      { name: 'Support dédié 24/7', included: true },
      { name: 'Recommandations IA avancées', included: true },
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/pro';
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setCurrentSubscription(data);
    }
  };

  const handleSubscribe = async (planName: string, price: number) => {
    setLoading(true);

    if (currentSubscription) {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', currentSubscription.id);
    }

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const features = plans.find(p => p.name === planName)?.features.filter(f => f.included).map(f => f.name) || [];

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          plan_name: planName,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: planName === 'Free' ? null : endDate.toISOString(),
          price: price / 100,
          features: { list: features },
        },
      ])
      .select()
      .maybeSingle();

    if (!error && data) {
      setCurrentSubscription(data);
      setTimeout(() => {
        router.push(redirect);
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent px-4">
            Choisissez votre plan
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Débloquez tout le potentiel de XiineDay Pro et optimisez vos rendements agricoles
          </p>
        </motion.div>

        {currentSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Abonnement actuel</CardTitle>
                      <CardDescription className="text-sm">
                        Plan {currentSubscription.plan_name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">Actif</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Prix</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {currentSubscription.price === 0 ? 'Gratuit' : `${currentSubscription.price} FCFA/mois`}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Début</p>
                    <p className="text-base sm:text-lg font-semibold">
                      {new Date(currentSubscription.start_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Renouvellement</p>
                    <p className="text-base sm:text-lg font-semibold">
                      {currentSubscription.end_date
                        ? new Date(currentSubscription.end_date).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentSubscription?.plan_name === plan.name;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`relative overflow-hidden border-2 transition-all hover:shadow-xl h-full flex flex-col ${
                    plan.popular
                      ? 'border-green-500 shadow-lg md:scale-105'
                      : isCurrentPlan
                      ? 'border-blue-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-bl-lg">
                      POPULAIRE
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${plan.color}`}>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      {isCurrentPlan && (
                        <Badge variant="outline" className="border-blue-500 text-blue-600 text-xs">
                          Plan actuel
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{plan.description}</CardDescription>
                    <div className="mt-3 sm:mt-4">
                      <span className="text-3xl sm:text-4xl font-bold">
                        {plan.price === 0 ? 'Gratuit' : `${plan.price} FCFA`}
                      </span>
                      {plan.price > 0 && <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">/{plan.period}</span>}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4 flex-1">
                    <div className="space-y-2 sm:space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3">
                          <div
                            className={`mt-0.5 rounded-full p-0.5 sm:p-1 flex-shrink-0 ${
                              feature.included
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                          >
                            {feature.included ? (
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            )}
                          </div>
                          <span
                            className={`text-xs sm:text-sm ${
                              feature.included
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-400 dark:text-gray-600'
                            }`}
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto">
                    <Button
                      className="w-full text-sm sm:text-base"
                      size="lg"
                      variant={plan.popular ? 'default' : 'outline'}
                      disabled={loading || isCurrentPlan}
                      onClick={() => handleSubscribe(plan.name, plan.price)}
                    >
                      {loading
                        ? 'Chargement...'
                        : isCurrentPlan
                        ? 'Plan actif'
                        : plan.name === 'Free'
                        ? 'Commencer gratuitement'
                        : 'Souscrire'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto border-2">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Pourquoi choisir XiineDay Pro ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Augmentez vos rendements</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Optimisez vos cultures avec des recommandations basées sur les données météo
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                    <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Anticipez la météo</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Prévisions précises jusqu'à 30 jours pour mieux planifier vos activités
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Support expert</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Bénéficiez d'un accompagnement personnalisé par des experts agricoles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
