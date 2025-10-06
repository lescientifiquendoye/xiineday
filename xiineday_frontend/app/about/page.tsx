'use client';

import { motion } from 'framer-motion';
import { Cloud, Users, Target, Zap, Heart, Shield, Leaf, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const features = [
    {
      icon: Cloud,
      title: 'Données météo précises',
      description: 'Prévisions météorologiques détaillées et mises à jour en temps réel pour une planification optimale.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Leaf,
      title: 'Agriculture intelligente',
      description: 'Recommandations personnalisées pour vos cultures basées sur les conditions climatiques.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Target,
      title: 'Planification d\'événements',
      description: 'Trouvez le meilleur créneau pour vos événements avec notre système de scoring intelligent.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Alertes en temps réel',
      description: 'Recevez des notifications pour les conditions météo importantes et les risques potentiels.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Fiabilité', icon: Shield },
    { value: '10k+', label: 'Utilisateurs actifs', icon: Users },
    { value: '24/7', label: 'Support disponible', icon: Heart },
    { value: '100+', label: 'Cultures suivies', icon: TrendingUp },
  ];

  const team = [
    {
      name: 'Équipe XiineDay',
      role: 'Innovation & Développement',
      description: 'Des experts passionnés par l\'agriculture et la météorologie',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="inline-block"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="p-4 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 inline-block shadow-xl"
              >
                <Cloud className="h-16 w-16 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold"
            >
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                À propos de XiineDay
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              XiineDay est votre partenaire intelligent pour la planification agricole et événementielle.
              Nous combinons des données météorologiques précises avec des algorithmes avancés pour vous
              aider à prendre les meilleures décisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {[
                { label: 'Agriculture de précision', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
                { label: 'Météorologie avancée', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                { label: 'IA & Prédiction', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
              ].map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge className={`px-4 py-2 text-sm ${badge.color}`}>
                    {badge.label}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 1 + index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="border-2 text-center hover:shadow-2xl transition-all overflow-hidden relative group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="pt-6 space-y-3 relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-block p-3 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30"
                    >
                      <stat.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.15, type: "spring", stiffness: 200 }}
                      className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Nos fonctionnalités
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Des outils puissants conçus pour simplifier votre quotidien et optimiser vos résultats
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: 90 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    type: "spring"
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="border-2 h-full hover:shadow-2xl transition-all overflow-hidden relative group">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10`}
                      transition={{ duration: 0.3 }}
                    />
                    <CardHeader className="relative z-10">
                      <motion.div
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                        className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-3 shadow-lg`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Notre mission
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800 max-w-4xl mx-auto shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4 text-center">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      Nous croyons que la technologie peut révolutionner l'agriculture et la planification d'événements.
                      Notre mission est de rendre les données météorologiques accessibles et exploitables pour tous.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      En combinant intelligence artificielle et expertise agronomique, nous aidons agriculteurs et
                      organisateurs d'événements à optimiser leurs activités tout en respectant l'environnement.
                    </motion.p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t">
                    {[
                      { title: 'Innovation', color: 'text-green-600 dark:text-green-400', text: 'Technologies de pointe pour des prédictions précises' },
                      { title: 'Simplicité', color: 'text-blue-600 dark:text-blue-400', text: 'Interface intuitive accessible à tous' },
                      { title: 'Durabilité', color: 'text-emerald-600 dark:text-emerald-400', text: 'Optimisation des ressources naturelles' },
                    ].map((value, index) => (
                      <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        className="text-center space-y-2"
                      >
                        <div className={`text-3xl font-bold ${value.color}`}>{value.title}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {value.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Notre équipe
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Des passionnés dédiés à votre succès
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="border-2 hover:shadow-2xl transition-all">
                    <CardHeader className="text-center">
                      <motion.div
                        whileHover={{
                          rotate: 360,
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                        className="inline-block p-4 rounded-full bg-gradient-to-br from-green-500 to-blue-500 mb-4 mx-auto shadow-xl"
                      >
                        <Users className="h-12 w-12 text-white" />
                      </motion.div>
                      <CardTitle className="text-2xl">{member.name}</CardTitle>
                      <CardDescription className="text-lg">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">{member.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6 pb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Rejoignez-nous
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Que vous soyez agriculteur, organisateur d'événements ou simplement curieux,
              XiineDay est là pour vous accompagner dans tous vos projets.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Card className="p-6 border-2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-gray-100">Contact:</strong> info@xiineday.com
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
