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
      {currentTab === 'profile' && <ProfileEditor initialSection="profile" />}
      {currentTab === 'about' && <ProfileEditor initialSection="about" />}
      {currentTab === 'projects' && <ProjectsManager />}
      {currentTab === 'skills' && <SkillsManager />}
      {currentTab === 'journey' && <JourneyManager />}
      {currentTab === 'contact' && (
        <div className="space-y-10">
          <ProfileEditor initialSection="contact" />
          <MessagesManager />
        </div>
      )}
      {currentTab === 'media' && <MediaManager />}
      {currentTab === 'visibility' && <SettingsManager initialSection="visibility" />}
      {currentTab === 'settings' && <SettingsManager initialSection="settings" />}
    </AdminLayout>
  );
};
