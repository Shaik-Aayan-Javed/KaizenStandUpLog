const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Meeting = require("./models/Meeting");
const HistoryLog = require("./models/HistoryLog");
const TeamMember = require("./models/TeamMember");
const Group = require("./models/Group");
const ChatMessage = require("./models/ChatMessage");

dotenv.config({ path: __dirname + '/.env' });

const INITIAL_MEETINGS = [
  { time: '09:00', title: 'Daily Standup', tag: '#engineering', borderClass: 'border-secondary', leftBarBg: 'bg-secondary', tagColor: 'bg-secondary-container text-on-secondary-container', day: 14 },
  { time: '10:30', title: 'Backend Sync', tag: '#architecture', borderClass: 'border-primary', leftBarBg: 'bg-primary', tagColor: 'bg-primary-fixed text-on-primary-fixed-variant', isActive: true, day: 14 },
  { time: '13:00', title: 'Design Review', tag: '#product', borderClass: 'border-tertiary-container', leftBarBg: 'bg-tertiary-container', tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', day: 14 },
  { time: '15:00', title: 'Sprint Review', tag: '#management', borderClass: 'border-error', leftBarBg: 'bg-error', tagColor: 'bg-error-container text-on-error-container', isPinned: true, day: 14 }
];

const INITIAL_TEAM = [
  { name: 'Jordan Dai', status: 'Active', statusColor: 'bg-secondary-fixed-dim', textColor: 'text-secondary', avatar: 'https://i.pravatar.cc/60?img=1' },
  { name: 'Sarah Kim', status: 'In Focus', statusColor: 'bg-primary-fixed-dim', textColor: 'text-primary', avatar: 'https://i.pravatar.cc/60?img=2' },
  { name: 'Ryan Lee', status: 'Offline', statusColor: 'bg-outline-variant', textColor: 'text-on-surface-variant', avatar: 'https://i.pravatar.cc/60?img=3' }
];

const INITIAL_GROUPS = [
  { groupId: 'engineering-core', name: 'engineering-core', type: 'channel', members: 12, desc: 'Core development and infrastructure sync' },
  { groupId: 'product-sync', name: 'product-sync', type: 'channel', members: 8, desc: 'Product strategy and milestone alignment' },
  { groupId: 'sarah-chen', name: 'Sarah Chen', type: 'dm', status: 'Active', avatar: 'https://i.pravatar.cc/60?img=5' },
  { groupId: 'alex-rivera', name: 'Alex Rivera', type: 'dm', status: 'Active', avatar: 'https://i.pravatar.cc/60?img=6' }
];

const INITIAL_HISTORY_LOGS = [
  {
    dateGroup: 'OCT 24, 2023',
    dateGroupColor: 'bg-[#d5ecd4] text-[#4a7251]',
    user: 'Jordan Smith',
    role: 'Senior Engineer',
    time: '09:14 AM',
    dateFull: 'October 24, 2023',
    avatar: 'https://i.pravatar.cc/150?u=jordan',
    snippet: 'Completed the CI/CD pipeline integration for the mobile module. Starting on API...',
    today: 'Finalized the CI/CD pipeline integration for the new mobile module.\n\n• Resolved the failing build hook for iOS distribution.',
    tomorrow: "Starting the API refactoring to support multi-tenancy. I'll be focused on the authentication middleware first.",
    blockers: 'No critical blockers today.',
    hasBlockers: false
  }
];

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB Connected. Seeding data...");
    
    // Clear existing
    await Meeting.deleteMany();
    await HistoryLog.deleteMany();
    await TeamMember.deleteMany();
    await Group.deleteMany();
    await ChatMessage.deleteMany();

    await Meeting.insertMany(INITIAL_MEETINGS);
    await TeamMember.insertMany(INITIAL_TEAM);
    await Group.insertMany(INITIAL_GROUPS);
    await HistoryLog.insertMany(INITIAL_HISTORY_LOGS);

    console.log("Data seeded!");
    process.exit();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
