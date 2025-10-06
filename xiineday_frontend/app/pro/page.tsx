'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import Link from 'next/link';

export default function ProPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
              <Sprout className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">XiineDay Pro</CardTitle>
          <CardDescription className="text-center">
            Page en cours de maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Cette fonctionnalité est temporairement indisponible. Nous travaillons à la rétablir dans les plus brefs délais.
          </p>
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
              Retour à l'accueil
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
