import React, { useState } from 'react';
import { AdminLayout, type AdminTab } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { ProfileEditor } from './ProfileEditor';
import { ProjectsManager } from './ProjectsManager';
import { SkillsManager } from './SkillsManager';
import { JourneyManager } from './JourneyManager';
import { MessagesManager } from './MessagesManager';
import { MediaManager } from './MediaManager';
import { SettingsManager } from './SettingsManager';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onViewPublicSite={onExit}
    >
      {currentTab === 'overview' && (
        <DashboardOverview onSelectTab={setCurrentTab} onViewPublicSite={onExit} />
      )}
      {currentTab === 'profile' && <ProfileEditor />}
      {currentTab === 'about' && <ProfileEditor />}
      {currentTab === 'projects' && <ProjectsManager />}
      {currentTab === 'skills' && <SkillsManager />}
      {currentTab === 'journey' && <JourneyManager />}
      {currentTab === 'contact' && <MessagesManager />}
      {currentTab === 'media' && <MediaManager />}
      {currentTab === 'visibility' && <SettingsManager />}
      {currentTab === 'settings' && <SettingsManager />}
    </AdminLayout>
  );
};
