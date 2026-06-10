/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 20 }: LucideIconProps) {
  // Safe-guard to fall back to Sparkles if icon name doesn't exist
  const IconComponent = (Icons as any)[name] || Icons.Sparkles;
  return <IconComponent className={className} size={size} />;
}
