import React, { useState, useEffect } from 'react';
import { User, Briefcase, Bell, Lock, Zap, Upload, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Settings({ isSidebarOpen, user }) {
  const { updateAuthUser } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.name || 'Alex Rivera',
    title: user?.title || 'Lead Frontend Engineer',
    email: user?.email || 'alex.rivera@kaizen.io',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=47'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name,
        title: user.title || 'Lead Frontend Engineer',
        email: user.email,
        avatar: user.avatar || 'https://i.pravatar.cc/150?img=47'
      });
    }
  }, [user]);

  const [workspaceData, setWorkspaceData] = useState({
    workspaceName: 'Kaizen',
    workspaceUrl: 'kaizen.io/',
    workspaceSlug: 'eng-workspace',
    workspaceLogo: null
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    pushNotifications: true
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [savedWorkspace, setSavedWorkspace] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const res = await updateAuthUser(user._id || user.id, {
      name: profileData.fullName,
      email: profileData.email,
      title: profileData.title,
      avatar: profileData.avatar
    });
    setIsSavingProfile(false);
    
    if (res.success) {
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2000);
    } else {
      alert(res.message);
    }
  };

  const handleSaveWorkspace = () => {
    setIsSavingWorkspace(true);
    setTimeout(() => {
      setIsSavingWorkspace(false);
      setSavedWorkspace(true);
      setTimeout(() => setSavedWorkspace(false), 2000);
    }, 800);
  };

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleWorkspaceChange = (field, value) => {
    setWorkspaceData({ ...workspaceData, [field]: value });
  };

  const fileInputRef = React.useRef(null);

  const handleNotificationToggle = (field) => {
    setNotifications({ ...notifications, [field]: !notifications[field] });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleProfileChange('avatar', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className={`px-4 sm:px-5 lg:px-6 py-6 sm:py-7 lg:py-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[clamp(1.8rem,2.5vw,2.2rem)] font-bold text-on-surface leading-tight">Settings</h1>
          <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-on-surface-variant mt-2">Manage your personal and workspace preferences.</p>
        </div>

        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-outline-variant p-6 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Profile</h2>
          </div>

          <div className="flex gap-6 mb-6">
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <div className="relative">
              <img src={profileData.avatar} alt="Profile" className="w-24 h-24 rounded-full border-2 border-outline-variant object-cover" />
              <button onClick={triggerFileInput} className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full hover:bg-primary-container transition-colors cursor-pointer shadow-sm">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-4">PROFILE PICTURE</p>
              <p className="text-sm text-on-surface-variant mb-3">PNG, JPG up to 5MB</p>
              <button onClick={triggerFileInput} className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors cursor-pointer self-start">
                Change
              </button>
            </div>
          </div>

          <hr className="border-outline-variant/50 my-6" />

          <div className="space-y-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-2 block">FULL NAME</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-2 block">TITLE</label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => handleProfileChange('title', e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-2 block">EMAIL ADDRESS</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end items-center gap-3">
            {savedProfile && <span className="text-green-600 text-sm font-medium animate-pulse">Changes saved!</span>}
            <button 
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors text-sm disabled:opacity-70 flex items-center justify-center min-w-[140px]"
            >
              {isSavingProfile ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* Workspace Section */}
        <section className="bg-white rounded-2xl border border-outline-variant p-6 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Workspace</h2>
            <span className="ml-auto px-2 py-1 rounded-full bg-secondary-fixed-dim/40 text-secondary text-[11px] font-bold">Admin View</span>
          </div>

          <div className="flex gap-6 mb-6 pb-6 border-b border-outline-variant/50">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-surface-container flex items-center justify-center border-2 border-outline-variant">
                <Briefcase className="w-8 h-8 text-on-surface-variant" />
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:bg-primary-container transition-colors text-xs font-bold">
                Change
              </button>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-2">WORKSPACE LOGO</p>
              <p className="text-sm text-on-surface-variant">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-2 block">WORKSPACE NAME</label>
              <input
                type="text"
                value={workspaceData.workspaceName}
                onChange={(e) => handleWorkspaceChange('workspaceName', e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-2 block">WORKSPACE URL</label>
                <div className="flex gap-2">
                  <span className="px-4 py-2.5 bg-slate-50 border border-outline-variant rounded-lg text-sm font-medium text-on-surface-variant">async.io/</span>
                  <input
                    type="text"
                    value={workspaceData.workspaceSlug}
                    onChange={(e) => handleWorkspaceChange('workspaceSlug', e.target.value)}
                    className="flex-1 bg-slate-50 border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end items-center gap-3">
            {savedWorkspace && <span className="text-green-600 text-sm font-medium animate-pulse">Workspace updated!</span>}
            <button 
              onClick={handleSaveWorkspace}
              disabled={isSavingWorkspace}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors text-sm disabled:opacity-70 flex items-center justify-center min-w-[140px]"
            >
              {isSavingWorkspace ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-2xl border border-outline-variant p-6 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Notifications</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-outline-variant/50">
              <div>
                <p className="font-semibold text-on-surface">Email Digest</p>
                <p className="text-sm text-on-surface-variant mt-1">Receive weekly summary of logs.</p>
              </div>
              <button
                onClick={() => handleNotificationToggle('emailDigest')}
                className={`relative w-12 h-6 rounded-full transition-colors ${notifications.emailDigest ? 'bg-secondary' : 'bg-outline-variant'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.emailDigest ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-outline-variant/50">
              <div>
                <p className="font-semibold text-on-surface">Push Notifications</p>
                <p className="text-sm text-on-surface-variant mt-1">Get real-time notifications on your device.</p>
              </div>
              <button
                onClick={() => handleNotificationToggle('pushNotifications')}
                className={`relative w-12 h-6 rounded-full transition-colors ${notifications.pushNotifications ? 'bg-secondary' : 'bg-outline-variant'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.pushNotifications ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-2xl border border-outline-variant p-6 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-outline-variant/50 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer">
              <div>
                <p className="font-semibold text-on-surface">Change Password</p>
                <p className="text-sm text-on-surface-variant mt-1">Update your password regularly for security.</p>
              </div>
              <Eye className="w-5 h-5 text-on-surface-variant" />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-outline-variant/50 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer">
              <div>
                <p className="font-semibold text-on-surface">Two-Factor Authentication</p>
                <p className="text-sm text-on-surface-variant mt-1">Add an extra layer of security to your account.</p>
              </div>
              <Eye className="w-5 h-5 text-on-surface-variant" />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-outline-variant/50 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer">
              <div>
                <p className="font-semibold text-on-surface">Active Sessions</p>
                <p className="text-sm text-on-surface-variant mt-1">Manage your logged-in devices and sessions.</p>
              </div>
              <Eye className="w-5 h-5 text-on-surface-variant" />
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="bg-white rounded-2xl border border-outline-variant p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Integrations</h2>
          </div>

          <p className="text-on-surface-variant mb-6">Connect your favorite tools and services to enhance your workflow.</p>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-outline-variant/50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-semibold text-on-surface">Slack</p>
                <p className="text-sm text-on-surface-variant mt-1">Get notified in Slack about your standups.</p>
              </div>
              <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold hover:bg-white transition-colors">
                Connect
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-outline-variant/50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-semibold text-on-surface">Microsoft Teams</p>
                <p className="text-sm text-on-surface-variant mt-1">Sync meetings with Microsoft Teams.</p>
              </div>
              <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold hover:bg-white transition-colors">
                Connect
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-outline-variant/50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-semibold text-on-surface">Google Calendar</p>
                <p className="text-sm text-on-surface-variant mt-1">Integrate with your Google Calendar events.</p>
              </div>
              <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold hover:bg-white transition-colors">
                Connect
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;
