'use client';

import React, { useState } from 'react';
import { Settings, Globe, Share2, Search, Wrench, Briefcase, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries';
import GeneralSettingsForm from '@/components/admin/settings/site-settings/GeneralSettingsForm';
import ContactSettingsForm from '@/components/admin/settings/site-settings/ContactSettingsForm';
import SocialSettingsForm from '@/components/admin/settings/site-settings/SocialSettingsForm';
import SeoSettingsForm from '@/components/admin/settings/site-settings/SeoSettingsForm';
import MaintenanceSettingsForm from '@/components/admin/settings/site-settings/MaintenanceSettingsForm';
import IntegrationsSettingsForm from '@/components/admin/settings/site-settings/IntegrationsSettingsForm';

export default function SiteSettingsPage() {
  const { useSiteSettings } = useSiteSettingsQueries();
  const { data: settings, isLoading } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General & Logos', icon: Settings },
    { id: 'contact', label: 'Contact Info', icon: Briefcase },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'SEO & Meta', icon: Search },
    { id: 'integrations', label: 'Integrations', icon: Server },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (!settings) return null;

    let content = null;
    switch (activeTab) {
      case 'general':
        content = <GeneralSettingsForm data={settings.general} />;
        break;
      case 'contact':
        content = <ContactSettingsForm data={settings.contact} />;
        break;
      case 'social':
        content = <SocialSettingsForm data={settings.social} />;
        break;
      case 'seo':
        content = <SeoSettingsForm data={settings.seo} />;
        break;
      case 'integrations':
        content = <IntegrationsSettingsForm />;
        break;
      case 'maintenance':
        content = <MaintenanceSettingsForm data={settings.maintenance} />;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-4 border-b border-gray-200/50 flex items-center justify-between transition-all duration-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your website's global configuration</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation for Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 p-1 overflow-x-auto lg:overflow-visible sticky top-[72px] lg:top-44 bg-gray-50/95 backdrop-blur-sm z-20 no-scrollbar lg:bg-white lg:rounded-lg lg:p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                   flex-shrink-0 cursor-pointer flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-full lg:rounded-xl text-sm font-medium transition-all whitespace-nowrap
                   ${isActive
                    ? 'bg-blue-600 text-white shadow-md border border-transparent lg:bg-blue-50 lg:text-blue-600 lg:shadow-sm lg:border-0'
                    : 'bg-white text-gray-600 border border-gray-200 lg:bg-transparent lg:border-0 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-white lg:text-blue-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}