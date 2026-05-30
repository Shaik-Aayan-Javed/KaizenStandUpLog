const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Meeting = require("./models/Meeting");
const HistoryLog = require("./models/HistoryLog");
const TeamMember = require("./models/TeamMember");
const Group = require("./models/Group");
const ChatMessage = require("./models/ChatMessage");

dotenv.config({ path: __dirname + '/.env' });

// Get today and this week's dates dynamically
const today = new Date();
const getIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const todayIso = getIso(today);
const tomorrowDate = new Date(today); tomorrowDate.setDate(today.getDate() + 1);
const tomorrowIso = getIso(tomorrowDate);
const yesterdayDate = new Date(today); yesterdayDate.setDate(today.getDate() - 1);

const INITIAL_MEETINGS = [
  {
    time: '09:00', endTime: '09:30',
    title: 'Daily Standup',
    tag: '#analysis',
    borderClass: 'border-secondary', leftBarBg: 'bg-secondary', tagColor: 'bg-secondary-container text-on-secondary-container',
    day: today.getDate(), date: todayIso,
    isActive: true, isPinned: false, completed: false
  },
  {
    time: '10:30', endTime: '11:30',
    title: 'Backend Architecture Sync',
    tag: '#development',
    borderClass: 'border-tertiary-container', leftBarBg: 'bg-tertiary-container', tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    day: today.getDate(), date: todayIso,
    isActive: false, isPinned: false, completed: false
  },
  {
    time: '13:00', endTime: '14:00',
    title: 'Design Review',
    tag: '#design',
    borderClass: 'border-primary', leftBarBg: 'bg-primary', tagColor: 'bg-primary-fixed text-on-primary-fixed-variant',
    day: today.getDate(), date: todayIso,
    isActive: false, isPinned: true, completed: false
  },
  {
    time: '15:00', endTime: '15:45',
    title: 'QA & Testing Round',
    tag: '#testing',
    borderClass: 'border-error', leftBarBg: 'bg-error', tagColor: 'bg-error-container text-on-error-container',
    day: today.getDate(), date: todayIso,
    isActive: false, isPinned: false, completed: false
  },
  {
    time: '09:00', endTime: '09:30',
    title: 'Sprint Planning',
    tag: '#analysis',
    borderClass: 'border-secondary', leftBarBg: 'bg-secondary', tagColor: 'bg-secondary-container text-on-secondary-container',
    day: tomorrowDate.getDate(), date: tomorrowIso,
    isActive: false, isPinned: false, completed: false
  },
  {
    time: '11:00', endTime: '12:00',
    title: 'Frontend Dev Session',
    tag: '#development',
    borderClass: 'border-tertiary-container', leftBarBg: 'bg-tertiary-container', tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    day: tomorrowDate.getDate(), date: tomorrowIso,
    isActive: false, isPinned: false, completed: false
  }
];

const INITIAL_TEAM = [
  { name: 'Jordan Dai', role: 'Lead Engineer', status: 'Active', statusColor: 'bg-secondary-fixed-dim', textColor: 'text-secondary', avatar: 'https://i.pravatar.cc/60?img=1' },
  { name: 'Sarah Kim', role: 'Product Designer', status: 'In Focus', statusColor: 'bg-primary-fixed-dim', textColor: 'text-primary', avatar: 'https://i.pravatar.cc/60?img=2' },
  { name: 'Ryan Lee', role: 'Backend Dev', status: 'Offline', statusColor: 'bg-outline-variant', textColor: 'text-on-surface-variant', avatar: 'https://i.pravatar.cc/60?img=3' },
  { name: 'Maya Patel', role: 'QA Engineer', status: 'Active', statusColor: 'bg-secondary-fixed-dim', textColor: 'text-secondary', avatar: 'https://i.pravatar.cc/60?img=10' }
];

const INITIAL_GROUPS = [
  { groupId: 'engineering-core', name: 'engineering-core', type: 'channel', members: 12, desc: 'Core development and infrastructure sync' },
  { groupId: 'product-sync', name: 'product-sync', type: 'channel', members: 8, desc: 'Product strategy and milestone alignment' },
  { groupId: 'design-lab', name: 'design-lab', type: 'channel', members: 5, desc: 'UI/UX design discussions' },
  { groupId: 'sarah-kim', name: 'Sarah Kim', type: 'dm', status: 'Active', avatar: 'https://i.pravatar.cc/60?img=2' },
  { groupId: 'jordan-dai', name: 'Jordan Dai', type: 'dm', status: 'Active', avatar: 'https://i.pravatar.cc/60?img=1' }
];

const INITIAL_HISTORY_LOGS = [
  {
    dateGroup: 'TODAY',
    dateGroupColor: 'bg-[#d5ecd4] text-[#4a7251]',
    user: 'Jordan Dai',
    role: 'Lead Engineer',
    time: '09:10 AM',
    dateFull: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    avatar: 'https://i.pravatar.cc/150?img=1',
    snippet: 'Completed the CI/CD pipeline integration for the mobile module. Starting on API...',
    today: 'Finalized the CI/CD pipeline integration for the mobile module.\n\n• Resolved the failing build hook for iOS distribution.\n• Updated the deployment workflow to include staging checks.',
    tomorrow: "Starting the API refactoring to support multi-tenancy. Will focus on authentication middleware first.",
    blockers: 'No critical blockers today.',
    hasBlockers: false
  },
  {
    dateGroup: 'TODAY',
    dateGroupColor: 'bg-[#d5ecd4] text-[#4a7251]',
    user: 'Sarah Kim',
    role: 'Product Designer',
    time: '09:22 AM',
    dateFull: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    avatar: 'https://i.pravatar.cc/150?img=2',
    snippet: 'Wrapped up the new onboarding flow designs. Handing off to dev today...',
    today: 'Wrapped up the onboarding flow redesign and created component specs in Figma.',
    tomorrow: 'Reviewing prototype feedback and iterating on the dashboard layout.',
    blockers: 'Waiting for final copy from the marketing team for the onboarding screens.',
    hasBlockers: true
  },
  {
    dateGroup: 'YESTERDAY',
    dateGroupColor: 'bg-[#dce8f5] text-[#2e5f8a]',
    user: 'Ryan Lee',
    role: 'Backend Dev',
    time: '09:05 AM',
    dateFull: yesterdayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    avatar: 'https://i.pravatar.cc/150?img=3',
    snippet: 'Set up the new MongoDB indexes for performance. Working on query optimization...',
    today: 'Set up MongoDB indexes for the standup log queries, reducing p95 latency by ~60%.',
    tomorrow: 'Finishing query optimization and will run load tests on the meetings endpoint.',
    blockers: 'No blockers.',
    hasBlockers: false
  }
];

const INITIAL_CHAT_MESSAGES = [
  {
    groupId: 'engineering-core',
    sender: 'Jordan Dai',
    avatar: 'https://i.pravatar.cc/60?img=1',
    time: '09:15 AM',
    text: 'Morning team! CI/CD pipeline is live for the mobile module. Give it a test spin and let me know if anything looks off.',
    reactions: {}
  },
  {
    groupId: 'engineering-core',
    sender: 'Sarah Kim',
    avatar: 'https://i.pravatar.cc/60?img=2',
    time: '09:18 AM',
    text: 'Nice! Will test after the standup. Also sharing the new Figma link for the dashboard redesign shortly.',
    reactions: {}
  },
  {
    groupId: 'engineering-core',
    sender: 'Ryan Lee',
    avatar: 'https://i.pravatar.cc/60?img=3',
    time: '09:20 AM',
    text: 'Just pushed the index updates to staging. Query times are looking great 🚀',
    reactions: {}
  },
  {
    groupId: 'product-sync',
    sender: 'Sarah Kim',
    avatar: 'https://i.pravatar.cc/60?img=2',
    time: '10:05 AM',
    text: 'Onboarding flow v2 is ready for review in Figma. Tagging everyone on the product side.',
    reactions: {}
  },
  {
    groupId: 'design-lab',
    sender: 'Sarah Kim',
    avatar: 'https://i.pravatar.cc/60?img=2',
    time: '11:30 AM',
    text: 'New component library is pushed to the shared Figma workspace. Check out the updated button states!',
    reactions: {}
  }
];

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✓ MongoDB Connected. Clearing all collections...");

    await Meeting.deleteMany();
    await HistoryLog.deleteMany();
    await TeamMember.deleteMany();
    await Group.deleteMany();
    await ChatMessage.deleteMany();

    console.log("✓ All collections cleared.");

    await Meeting.insertMany(INITIAL_MEETINGS);
    console.log(`✓ ${INITIAL_MEETINGS.length} meetings seeded.`);

    await TeamMember.insertMany(INITIAL_TEAM);
    console.log(`✓ ${INITIAL_TEAM.length} team members seeded.`);

    await Group.insertMany(INITIAL_GROUPS);
    console.log(`✓ ${INITIAL_GROUPS.length} groups/DMs seeded.`);

    await HistoryLog.insertMany(INITIAL_HISTORY_LOGS);
    console.log(`✓ ${INITIAL_HISTORY_LOGS.length} history logs seeded.`);

    await ChatMessage.insertMany(INITIAL_CHAT_MESSAGES);
    console.log(`✓ ${INITIAL_CHAT_MESSAGES.length} chat messages seeded.`);

    console.log("\n✅ Database seeded successfully!");
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
