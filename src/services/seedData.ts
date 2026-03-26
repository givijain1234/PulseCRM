import { dbService } from './db';
import { serverTimestamp } from 'firebase/firestore';

export const demoData = {
  users: [
    {
      uid: 'demo-admin-1',
      email: 'admin@pulsecrm.com',
      name: 'Aarav Mehta',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-1',
      email: 'riya@pulsecrm.com',
      name: 'Riya Sharma',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-client-1',
      email: 'kunal@gmail.com',
      name: 'Kunal Verma',
      role: 'client',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-2',
      email: 'vikram@pulsecrm.com',
      name: 'Vikram Singh',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-3',
      email: 'ananya@pulsecrm.com',
      name: 'Ananya Iyer',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-4',
      email: 'zain@pulsecrm.com',
      name: 'Zain Malik',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-5',
      email: 'priya@pulsecrm.com',
      name: 'Priya Kapoor',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-6',
      email: 'isha@pulsecrm.com',
      name: 'Isha Gupta',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-7',
      email: 'kabir@pulsecrm.com',
      name: 'Kabir Das',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-8',
      email: 'neha@pulsecrm.com',
      name: 'Neha Singh',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-9',
      email: 'rahul@pulsecrm.com',
      name: 'Rahul Khanna',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-employee-10',
      email: 'tanvi@pulsecrm.com',
      name: 'Tanvi Shah',
      role: 'employee',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'demo-client-2',
      email: 'sara@example.com',
      name: 'Sara Khan',
      role: 'client',
      createdAt: new Date().toISOString(),
    }
  ],
  clients: [
    {
      name: 'TechNova Solutions',
      email: 'contact@technova.com',
      phone: '+91 98765 43210',
      company: 'TechNova',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Key account for cloud migration project. Very satisfied with current progress.',
    },
    {
      name: 'GreenLeaf Organics',
      email: 'info@greenleaf.org',
      phone: '+91 87654 32109',
      company: 'GreenLeaf',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Interested in expanding to international markets next quarter.',
    },
    {
      name: 'BlueSky Ventures',
      email: 'hello@bluesky.vc',
      phone: '+91 76543 21098',
      company: 'BlueSky',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Initial consultation done. Follow up scheduled for next week.',
    },
    {
      name: 'Stellar Dynamics',
      email: 'ops@stellar.com',
      phone: '+91 65432 10987',
      company: 'Stellar',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Long-term partner. Focus on maintaining high service standards.',
    },
    {
      name: 'Quantum Labs',
      email: 'research@quantum.io',
      phone: '+91 43210 98765',
      company: 'Quantum',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'High-growth startup. Requires frequent updates and agile support.',
    },
    {
      name: 'Apex Logistics',
      email: 'shipping@apex.com',
      phone: '+91 32109 87654',
      company: 'Apex',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Referred by Stellar Dynamics. Looking for supply chain optimization.',
    },
    {
      name: 'Zenith Media',
      email: 'ads@zenith.com',
      phone: '+91 21098 76543',
      company: 'Zenith',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Digital marketing agency. Collaborating on several client projects.',
    },
    {
      name: 'Cloud Nine Systems',
      email: 'support@cloud9.com',
      phone: '+91 10987 65432',
      company: 'Cloud Nine',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Enterprise software provider. Interested in AI integration.',
    },
    {
      name: 'Silver Lining FinTech',
      email: 'info@silverlining.com',
      phone: '+91 09876 54321',
      company: 'Silver Lining',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Fast-growing fintech startup. Needs robust CRM for lead tracking.',
    },
    {
      name: 'Solaris Energy',
      email: 'hello@solaris.energy',
      phone: '+1 234 567 8901',
      company: 'Solaris',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Renewable energy giant. Major focus on residential solar adoption.',
    },
    {
      name: 'Nebula Gaming Studio',
      email: 'dev@nebulagaming.com',
      phone: '+44 20 7946 0123',
      company: 'Nebula',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Indie game studio looking for marketing automation for their next release.',
    },
    {
      name: 'Orion Healthcare',
      email: 'admin@orionhealth.org',
      phone: '+61 2 9876 5432',
      company: 'Orion',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Large hospital network. Implementing patient relationship management.',
    },
    {
      name: 'Titan Manufacturing',
      email: 'supply@titanmfg.com',
      phone: '+49 30 123456',
      company: 'Titan',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Heavy machinery manufacturer. Streamlining their B2B sales process.',
    },
    {
      name: 'Nova Education',
      email: 'info@novaedu.com',
      phone: '+1 415 555 0123',
      company: 'Nova',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'EdTech platform looking for student lifecycle management solutions.',
    },
    {
      name: 'Aether Logistics',
      email: 'ops@aether.logistics',
      phone: '+33 1 42 68 53 00',
      company: 'Aether',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Global freight forwarder. Integrating CRM with their tracking system.',
    },
    {
      name: 'Prism Creative Agency',
      email: 'hello@prismcreative.com',
      phone: '+1 212 555 0199',
      company: 'Prism',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Boutique design firm. Managing high-end client portfolios.',
    },
    {
      name: 'Vertex Cybersecurity',
      email: 'security@vertex.com',
      phone: '+972 3 123 4567',
      company: 'Vertex',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Cybersecurity firm. Protecting sensitive client data within the CRM.',
    },
    {
      name: 'Elysian Travel',
      email: 'bookings@elysiantravel.com',
      phone: '+30 210 123 4567',
      company: 'Elysian',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Luxury travel agency. Personalizing vacation packages for VIP clients.',
    },
    {
      name: 'Lumina Solar',
      email: 'info@luminasolar.com',
      phone: '+1 619 555 0122',
      company: 'Lumina',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Residential solar installer. High volume of leads from social media.',
    },
    {
      name: 'Ironclad Security',
      email: 'contact@ironclad.com',
      phone: '+1 202 555 0188',
      company: 'Ironclad',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Physical security firm. Expanding their digital surveillance offerings.',
    },
    {
      name: 'Swift Delivery',
      email: 'ops@swiftdelivery.com',
      phone: '+1 312 555 0177',
      company: 'Swift',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Last-mile delivery startup. Needs CRM for driver management.',
    },
    {
      name: 'Evergreen Landscaping',
      email: 'hello@evergreen.com',
      phone: '+1 503 555 0166',
      company: 'Evergreen',
      status: 'active',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Eco-friendly landscaping service. Loyal customer base.',
    },
    {
      name: 'Apex Fitness',
      email: 'join@apexfitness.com',
      phone: '+1 213 555 0155',
      company: 'Apex',
      status: 'active',
      assignedEmployeeId: 'demo-employee-1',
      notes: 'Gym chain. Implementing member retention programs.',
    },
    {
      name: 'Oceanic Research',
      email: 'info@oceanic.org',
      phone: '+1 808 555 0144',
      company: 'Oceanic',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-2',
      notes: 'Marine conservation NGO. Looking for donor management software.',
    },
    {
      name: 'BioGen Interstellar',
      email: 'contact@biogen.space',
      phone: '+1 650 555 0987',
      company: 'BioGen',
      status: 'active',
      assignedEmployeeId: 'demo-employee-3',
      notes: 'Pioneering synthetic biology for long-duration space travel. Highly sensitive data.',
    },
    {
      name: 'Xenon AI Research',
      email: 'lab@xenon.ai',
      phone: '+41 22 767 6111',
      company: 'Xenon AI',
      status: 'active',
      assignedEmployeeId: 'demo-employee-4',
      notes: 'Leading research in Artificial General Intelligence. Requires advanced security protocols.',
    },
    {
      name: 'DeepSea Mining Corp',
      email: 'ops@deepsea.com',
      phone: '+64 9 300 1234',
      company: 'DeepSea Mining',
      status: 'lead',
      assignedEmployeeId: 'demo-employee-5',
      notes: 'Exploring rare earth mineral extraction from the ocean floor. Environmental impact focus.',
    },
    {
      name: 'AeroDynamics Fusion',
      email: 'info@adfusion.com',
      phone: '+33 5 61 93 33 33',
      company: 'AD Fusion',
      status: 'active',
      assignedEmployeeId: 'demo-employee-6',
      notes: 'Developing next-gen hydrogen-powered commercial aircraft. Strategic partner.',
    },
    {
      name: 'NeuralLink Systems',
      email: 'support@neurallink.io',
      phone: '+1 512 555 0777',
      company: 'NeuralLink',
      status: 'active',
      assignedEmployeeId: 'demo-employee-7',
      notes: 'Brain-computer interface technology. Managing clinical trial participant data.',
    }
  ],
  posts: [
    {
      title: 'How to Build Strong Client Relationships',
      content: 'Building strong relationships with your clients is the cornerstone of any successful business. It starts with trust, transparency, and consistent communication. In this post, we explore the top 5 strategies to ensure your clients feel valued and heard...',
      category: 'Strategy',
      tags: ['CRM', 'Growth', 'Relationships'],
      likesCount: 24,
      commentsCount: 5,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'Top CRM Strategies in 2026',
      content: 'As we move further into 2026, the landscape of customer relationship management is evolving rapidly. Hyper-personalization and predictive analytics are no longer optional—they are essential for staying competitive...',
      category: 'Trends',
      tags: ['CRM', 'Sales', '2026'],
      likesCount: 42,
      commentsCount: 12,
      authorName: 'Riya Sharma',
      status: 'published'
    },
    {
      title: 'AI in Customer Management',
      content: 'Artificial Intelligence is revolutionizing how we interact with customers. From automated sentiment analysis to intelligent chatbots that handle complex queries, AI is making CRM smarter and more efficient than ever before...',
      category: 'Technology',
      tags: ['AI', 'CRM', 'Future'],
      likesCount: 56,
      commentsCount: 8,
      authorName: 'Vikram Singh',
      status: 'published'
    },
    {
      title: 'The Future of Remote Sales Teams',
      content: 'Remote work is here to stay, and sales teams are leading the charge. Managing a distributed sales force requires new tools and a shift in mindset. We look at how top companies are keeping their teams motivated and productive...',
      category: 'Sales',
      tags: ['Sales', 'Remote', 'Management'],
      likesCount: 18,
      commentsCount: 3,
      authorName: 'Riya Sharma',
      status: 'published'
    },
    {
      title: 'Data-Driven Decision Making in CRM',
      content: 'In the age of big data, making decisions based on intuition is a risky game. Learn how to leverage your CRM data to uncover hidden patterns and make informed choices that drive revenue growth...',
      category: 'Research',
      tags: ['Data', 'CRM', 'Analytics'],
      likesCount: 31,
      commentsCount: 7,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'Mastering the Art of the Follow-Up',
      content: 'The fortune is in the follow-up. Many sales are lost simply because the salesperson didn\'t follow up enough times. Here\'s a guide on how to stay persistent without being annoying...',
      category: 'Sales',
      tags: ['Sales', 'Follow-up', 'Persistence'],
      likesCount: 27,
      commentsCount: 4,
      authorName: 'Riya Sharma',
      status: 'published'
    },
    {
      title: 'Why Customer Experience is the New Marketing',
      content: 'In a world where products are easily replicated, customer experience is the only true differentiator. We discuss how to create a customer journey that turns buyers into brand advocates...',
      category: 'Marketing',
      tags: ['CX', 'Marketing', 'Advocacy'],
      likesCount: 39,
      commentsCount: 9,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'The Rise of Social CRM',
      content: 'Social media is no longer just for marketing; it\'s a critical channel for customer service and relationship building. Learn how to integrate social signals into your CRM strategy...',
      category: 'Strategy',
      tags: ['Social', 'CRM', 'Engagement'],
      likesCount: 15,
      commentsCount: 2,
      authorName: 'Riya Sharma',
      status: 'published'
    },
    {
      title: 'Cybersecurity for Small Business CRM',
      content: 'Protecting your customer data is non-negotiable. We break down the essential security measures every small business should implement to safeguard their CRM database...',
      category: 'Security',
      tags: ['Security', 'Data', 'Privacy'],
      likesCount: 22,
      commentsCount: 5,
      authorName: 'Vikram Singh',
      status: 'published'
    },
    {
      title: 'Personalization at Scale',
      content: 'How do you make 10,000 customers feel like they are your only client? The answer lies in smart segmentation and automated personalization triggers...',
      category: 'Marketing',
      tags: ['Personalization', 'Automation', 'Scale'],
      likesCount: 48,
      commentsCount: 11,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'The Psychology of Selling',
      content: 'Understanding the human brain is the ultimate sales hack. We dive into the cognitive biases that influence buying decisions and how to ethically use them to close more deals...',
      category: 'Psychology',
      tags: ['Sales', 'Psychology', 'Influence'],
      likesCount: 65,
      commentsCount: 14,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'Blockchain in CRM: A New Era of Trust',
      content: 'Imagine a CRM where data is immutable and verifiable. Blockchain is making this a reality, offering unprecedented transparency and security for customer records...',
      category: 'Technology',
      tags: ['Blockchain', 'CRM', 'Trust'],
      likesCount: 34,
      commentsCount: 6,
      authorName: 'Vikram Singh',
      status: 'published'
    },
    {
      title: 'The Art of Active Listening in Sales',
      content: 'Active listening is more than just hearing words; it\'s about understanding the underlying needs and emotions of your prospect. By mastering this skill, you can build deeper rapport and uncover pain points that others miss...',
      category: 'Sales',
      tags: ['Sales', 'Communication', 'Skills'],
      likesCount: 52,
      commentsCount: 15,
      authorName: 'Ananya Iyer',
      status: 'published'
    },
    {
      title: 'Why Your CRM is Your Best Friend',
      content: 'In the chaos of daily operations, your CRM is the anchor that keeps you grounded. It remembers the small details, tracks the big wins, and ensures that no lead is ever left behind. Here\'s how to treat your CRM with the respect it deserves...',
      category: 'Strategy',
      tags: ['CRM', 'Productivity', 'Mindset'],
      likesCount: 41,
      commentsCount: 9,
      authorName: 'Zain Malik',
      status: 'published'
    },
    {
      title: 'Navigating Difficult Conversations with Clients',
      content: 'Not every interaction is a win. Sometimes you have to deliver bad news or handle a frustrated client. We discuss the frameworks for staying calm, being empathetic, and turning a negative situation into a positive outcome...',
      category: 'Psychology',
      tags: ['CX', 'Conflict', 'Resolution'],
      likesCount: 63,
      commentsCount: 21,
      authorName: 'Priya Kapoor',
      status: 'published'
    },
    {
      title: 'The Impact of Emotional Intelligence on Business Growth',
      content: 'EQ is often more important than IQ in the world of business. Leaders with high emotional intelligence build more resilient teams and more loyal customer bases. Discover the science behind EQ and how to cultivate it...',
      category: 'Research',
      tags: ['EQ', 'Leadership', 'Growth'],
      likesCount: 78,
      commentsCount: 18,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'Building a Sustainable Business Model in 2026',
      content: 'Sustainability is no longer a buzzword; it\'s a survival strategy. We look at the companies that are successfully integrating environmental and social responsibility into their core business models without sacrificing profit...',
      category: 'Trends',
      tags: ['Sustainability', '2026', 'Strategy'],
      likesCount: 45,
      commentsCount: 10,
      authorName: 'Riya Sharma',
      status: 'published'
    },
    {
      title: 'The Zen of CRM: Finding Balance in Data',
      content: 'In the middle of thousands of data points, it\'s easy to lose sight of the human element. The Zen of CRM is about finding that perfect balance between automated efficiency and genuine human connection. It\'s about knowing when to let the machine work and when to pick up the phone...',
      category: 'Psychology',
      tags: ['Zen', 'Balance', 'Humanity'],
      likesCount: 89,
      commentsCount: 22,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'Quantum Computing and the Future of Databases',
      content: 'What happens when we can process entire CRM databases in the blink of an eye? Quantum computing promises to revolutionize data retrieval and analysis, making even the most complex queries instantaneous. We explore the early experiments in quantum-ready CRM architectures...',
      category: 'Technology',
      tags: ['Quantum', 'Future', 'Computing'],
      likesCount: 112,
      commentsCount: 35,
      authorName: 'Vikram Singh',
      status: 'published'
    },
    {
      title: 'The Art of Storytelling in B2B Sales',
      content: 'B2B sales doesn\'t have to be boring. In fact, the most successful sales professionals are often the best storytellers. By weaving your product into a compelling narrative that addresses your client\'s deepest pain points, you can create a memorable experience that resonates far longer than a slide deck...',
      category: 'Sales',
      tags: ['Storytelling', 'Sales', 'Narrative'],
      likesCount: 74,
      commentsCount: 19,
      authorName: 'Ananya Iyer',
      status: 'published'
    },
    {
      title: 'The Future of AI-Driven Customer Empathy',
      content: 'Can a machine truly understand human emotion? We explore the cutting edge of sentiment analysis and how AI is being trained to recognize subtle emotional cues in customer interactions, allowing for more empathetic and effective service...',
      category: 'AI',
      tags: ['AI', 'Empathy', 'Future'],
      likesCount: 95,
      commentsCount: 28,
      authorName: 'Aarav Mehta',
      status: 'published'
    },
    {
      title: 'Why Your Data Strategy is Your Culture Strategy',
      content: 'Data isn\'t just about numbers; it\'s about the values and behaviors of your organization. A truly data-driven culture requires more than just the right tools; it requires a mindset shift that prioritizes transparency, accountability, and continuous learning...',
      category: 'Culture',
      tags: ['Data', 'Culture', 'Strategy'],
      likesCount: 56,
      commentsCount: 12,
      authorName: 'Riya Sharma',
      status: 'published'
    },
    {
      title: 'The Rise of the "Human-in-the-Loop" CRM',
      content: 'Automation is powerful, but it has its limits. The most successful CRM strategies of the future will be those that seamlessly integrate AI efficiency with human intuition. We discuss the frameworks for building "human-in-the-loop" systems that empower employees rather than replacing them...',
      category: 'Strategy',
      tags: ['Automation', 'Human-Centric', 'CRM'],
      likesCount: 67,
      commentsCount: 15,
      authorName: 'Vikram Singh',
      status: 'published'
    },
    {
      title: 'Beyond the Dashboard: Visualizing Customer Journeys in 3D',
      content: 'Flat charts and graphs only tell part of the story. Imagine being able to walk through a 3D visualization of your customer\'s entire journey, seeing the touchpoints, the friction, and the moments of delight in a fully immersive environment. The future of data visualization is here...',
      category: 'Design',
      tags: ['Visualization', '3D', 'UX'],
      likesCount: 124,
      commentsCount: 42,
      authorName: 'Ananya Iyer',
      status: 'published'
    },
    {
      title: 'The Ethics of Predictive Analytics in Sales',
      content: 'With great power comes great responsibility. As predictive analytics becomes more sophisticated, we must grapple with the ethical implications of using data to influence behavior. How do we balance business goals with customer privacy and autonomy? We dive into the complex world of data ethics...',
      category: 'Ethics',
      tags: ['Ethics', 'AI', 'Sales'],
      likesCount: 82,
      commentsCount: 31,
      authorName: 'Zain Malik',
      status: 'published'
    }
  ],
  events: [
    {
      title: 'Global CRM Summit 2025',
      description: 'A look back at the biggest CRM event of last year. Recordings and transcripts now available.',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'San Francisco, USA',
      type: 'conference',
      capacity: 500,
      attendeesCount: 480
    },
    {
      title: 'PulseCRM User Meetup - London',
      description: 'Our first European meetup was a huge success! See the highlights and key takeaways.',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'London, UK',
      type: 'meeting',
      capacity: 100,
      attendeesCount: 95
    },
    {
      title: 'CRM Mastery Webinar',
      description: 'Join us for an intensive 2-hour session on mastering PulseCRM features and advanced automation workflows.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Online (Zoom)',
      type: 'webinar',
      capacity: 100,
      attendeesCount: 45
    },
    {
      title: 'Sales Growth Workshop',
      description: 'A hands-on workshop focused on scaling your sales operations and closing high-value deals.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Mumbai Tech Hub',
      type: 'workshop',
      capacity: 30,
      attendeesCount: 28
    },
    {
      title: 'AI Tools for Businesses',
      description: 'Explore the latest AI tools that can integrate with your CRM to boost productivity and customer satisfaction.',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Online (Google Meet)',
      type: 'webinar',
      capacity: 200,
      attendeesCount: 112
    },
    {
      title: 'Networking Mixer: Tech & CRM',
      description: 'An informal gathering for tech enthusiasts and CRM professionals to share ideas and build connections.',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'The Rooftop Lounge, Bangalore',
      type: 'meeting',
      capacity: 50,
      attendeesCount: 32
    },
    {
      title: 'Future of SaaS Conference',
      description: 'The premier event for SaaS founders and operators. Join us in Singapore for three days of insights.',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Singapore',
      type: 'conference',
      capacity: 1000,
      attendeesCount: 250
    },
    {
      title: 'Global Tech Expo - Tokyo',
      description: 'The world\'s largest technology gathering. PulseCRM will be showcasing our latest AI-driven features.',
      date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Tokyo, Japan',
      type: 'conference',
      capacity: 5000,
      attendeesCount: 1200
    },
    {
      title: 'SaaS Founders Retreat - Bali',
      description: 'An exclusive retreat for SaaS founders to recharge, network, and discuss the future of the industry.',
      date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Ubud, Bali',
      type: 'workshop',
      capacity: 50,
      attendeesCount: 15
    },
    {
      title: 'Digital Marketing Expo - Berlin',
      description: 'The premier event for digital marketing professionals in Europe. Explore the latest trends and tools.',
      date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Berlin, Germany',
      type: 'conference',
      capacity: 2000,
      attendeesCount: 850
    },
    {
      title: 'Customer Success Summit',
      description: 'Learn how to drive customer retention and advocacy through world-class customer success strategies.',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Online (Zoom)',
      type: 'webinar',
      capacity: 500,
      attendeesCount: 320
    },
    {
      title: 'Product Design Workshop',
      description: 'A hands-on session on designing intuitive and engaging user experiences for SaaS products.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'New York, USA',
      type: 'workshop',
      capacity: 40,
      attendeesCount: 35
    },
    {
      title: 'Startup Pitch Night',
      description: 'Watch the most promising startups pitch their ideas to a panel of expert investors.',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'San Francisco, USA',
      type: 'meeting',
      capacity: 150,
      attendeesCount: 120
    },
    {
      title: 'AI in Finance Conference',
      description: 'Explore how AI is transforming the financial services industry, from fraud detection to personalized banking.',
      date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'London, UK',
      type: 'conference',
      capacity: 800,
      attendeesCount: 450
    }
  ],
  tasks: [
    {
      title: 'Follow up with TechNova',
      description: 'Check in on the progress of the cloud migration project and address any concerns.',
      status: 'pending',
      priority: 'high',
      tags: ['Follow-up', 'TechNova'],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Prepare Q3 Sales Report',
      description: 'Compile data on sales performance for the third quarter and identify key trends.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Report', 'Sales'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Onboard GreenLeaf Organics',
      description: 'Set up the CRM account for GreenLeaf Organics and provide initial training.',
      status: 'completed',
      priority: 'high',
      tags: ['Onboarding', 'GreenLeaf'],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Review BlueSky Proposal',
      description: 'Review the proposal for BlueSky Ventures and make necessary adjustments.',
      status: 'pending',
      priority: 'medium',
      tags: ['Proposal', 'BlueSky'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Update Stellar Dynamics Contract',
      description: 'Renew the annual service contract for Stellar Dynamics with updated pricing.',
      status: 'pending',
      priority: 'high',
      tags: ['Contract', 'Stellar'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Client Feedback Survey - Q1',
      description: 'Send out the quarterly feedback survey to all active clients.',
      status: 'completed',
      priority: 'low',
      tags: ['Survey', 'Feedback'],
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Technical Support: Quantum Labs',
      description: 'Resolve the integration issue reported by the Quantum Labs dev team.',
      status: 'in-progress',
      priority: 'high',
      tags: ['Support', 'Technical'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Design New Dashboard UI',
      description: 'Create high-fidelity mockups for the new CRM dashboard interface.',
      status: 'pending',
      priority: 'medium',
      tags: ['Design', 'UI/UX'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Fix Bug in Notification System',
      description: 'Investigate and fix the issue where notifications are not being delivered in real-time.',
      status: 'in-progress',
      priority: 'high',
      tags: ['Bug', 'Technical'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Plan Team Building Event',
      description: 'Organize a team-building activity for the sales and marketing teams.',
      status: 'pending',
      priority: 'low',
      tags: ['Team', 'Event'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Research Competitor Pricing',
      description: 'Conduct a thorough analysis of competitor pricing models and identify opportunities for optimization.',
      status: 'pending',
      priority: 'medium',
      tags: ['Research', 'Sales'],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Update Documentation',
      description: 'Review and update the internal documentation for the CRM system.',
      status: 'completed',
      priority: 'low',
      tags: ['Documentation', 'Internal'],
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Optimize Database Queries',
      description: 'Identify and optimize slow database queries to improve application performance.',
      status: 'in-progress',
      priority: 'high',
      tags: ['Performance', 'Technical'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Draft Press Release',
      description: 'Write a press release announcing the launch of the new AI features.',
      status: 'pending',
      priority: 'medium',
      tags: ['Marketing', 'PR'],
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Conduct User Interviews',
      description: 'Interview key users to gather feedback on the new CRM features.',
      status: 'pending',
      priority: 'high',
      tags: ['Research', 'UX'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Implement New Search Algorithm',
      description: 'Develop and test a more efficient search algorithm for the CRM database.',
      status: 'in-progress',
      priority: 'high',
      tags: ['Technical', 'Search'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Review Marketing Campaign Performance',
      description: 'Analyze the results of the recent marketing campaign and identify areas for improvement.',
      status: 'completed',
      priority: 'medium',
      tags: ['Marketing', 'Analysis'],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Update Privacy Policy',
      description: 'Review and update the company\'s privacy policy to ensure compliance with new regulations.',
      status: 'pending',
      priority: 'high',
      tags: ['Legal', 'Compliance'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Plan Q4 Marketing Strategy',
      description: 'Develop a comprehensive marketing plan for the fourth quarter of the year.',
      status: 'pending',
      priority: 'medium',
      tags: ['Marketing', 'Strategy'],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Fix UI Bug in Mobile App',
      description: 'Investigate and fix the layout issue reported by mobile users on the dashboard.',
      status: 'in-progress',
      priority: 'high',
      tags: ['Bug', 'Mobile'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Prepare Board Meeting Presentation',
      description: 'Create a presentation for the upcoming board meeting summarizing the company\'s performance.',
      status: 'pending',
      priority: 'high',
      tags: ['Meeting', 'Presentation'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Conduct Security Audit',
      description: 'Perform a thorough security audit of the CRM system to identify and address vulnerabilities.',
      status: 'pending',
      priority: 'high',
      tags: ['Security', 'Audit'],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Optimize Landing Page SEO',
      description: 'Improve the search engine ranking of the main landing page through keyword optimization and backlink building.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Marketing', 'SEO'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Develop New Email Templates',
      description: 'Create a set of visually appealing and high-converting email templates for marketing campaigns.',
      status: 'pending',
      priority: 'medium',
      tags: ['Marketing', 'Email'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Integrate Payment Gateway',
      description: 'Connect the CRM with a secure payment gateway to allow clients to pay invoices directly.',
      status: 'pending',
      priority: 'high',
      tags: ['Technical', 'Payment'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Create Video Tutorials',
      description: 'Produce a series of short video tutorials explaining the key features of the CRM system.',
      status: 'in-progress',
      priority: 'low',
      tags: ['Education', 'Video'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Analyze Churn Rate',
      description: 'Investigate the reasons for client churn and develop strategies to improve retention.',
      status: 'pending',
      priority: 'high',
      tags: ['Analysis', 'Retention'],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Update Social Media Profiles',
      description: 'Ensure all company social media profiles are up-to-date and consistent with the brand identity.',
      status: 'completed',
      priority: 'low',
      tags: ['Marketing', 'Social'],
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Implement Multi-Factor Authentication',
      description: 'Enhance the security of the CRM system by implementing multi-factor authentication for all users.',
      status: 'pending',
      priority: 'high',
      tags: ['Security', 'Technical'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Review Legal Contracts',
      description: 'Ensure all legal contracts with clients and partners are up-to-date and legally sound.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Legal', 'Compliance'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Organize Webinar on AI Trends',
      description: 'Host a webinar featuring industry experts discussing the latest trends in artificial intelligence.',
      status: 'pending',
      priority: 'medium',
      tags: ['Marketing', 'Event'],
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Improve Application Accessibility',
      description: 'Ensure the CRM system is accessible to users with disabilities by following WCAG guidelines.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Design', 'Accessibility'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Explore AI-Powered Lead Scoring',
      description: 'Research and prototype an AI-driven lead scoring model to prioritize high-potential prospects.',
      status: 'pending',
      priority: 'high',
      tags: ['AI', 'Lead-Scoring'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Redesign Client Portal Experience',
      description: 'Gather feedback and create new wireframes for an improved client portal with better self-service options.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Design', 'Client-Portal'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Implement Dark Mode Theme',
      description: 'Develop a comprehensive dark mode theme for the entire CRM application to reduce eye strain.',
      status: 'pending',
      priority: 'low',
      tags: ['UI', 'UX', 'Theming'],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Automate Invoice Generation',
      description: 'Create a script to automatically generate and send invoices to clients at the end of each month.',
      status: 'in-progress',
      priority: 'high',
      tags: ['Automation', 'Finance'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Audit AI Bias in Lead Scoring',
      description: 'Review the current lead scoring algorithm to identify and mitigate any potential biases in the underlying data or model logic.',
      status: 'pending',
      priority: 'high',
      tags: ['AI', 'Ethics', 'Audit'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Design Holographic Client Presentation',
      description: 'Create a groundbreaking holographic presentation for the TechNova executive team to showcase our future roadmap.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Design', 'Innovation', 'TechNova'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Implement Biometric Login',
      description: 'Enhance security for high-profile client accounts by integrating biometric authentication (FaceID/TouchID) into the portal.',
      status: 'pending',
      priority: 'high',
      tags: ['Security', 'Technical', 'Biometrics'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Research Neuro-Marketing Triggers',
      description: 'Investigate the latest research in neuroscience to identify psychological triggers that can be used to optimize the Q4 marketing campaign.',
      status: 'pending',
      priority: 'medium',
      tags: ['Research', 'Marketing', 'Psychology'],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Develop "Surprise and Delight" Workflow',
      description: 'Create an automated workflow that triggers personalized gifts or exclusive offers for VIP clients based on their engagement milestones.',
      status: 'in-progress',
      priority: 'medium',
      tags: ['Automation', 'CX', 'VIP'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  logs: [
    {
      action: 'Security Scan',
      userName: 'System Sentinel',
      details: 'Automated weekly vulnerability assessment completed. 0 critical issues found.',
      type: 'security'
    },
    {
      action: 'Database Backup',
      userName: 'Cloud Engine',
      details: 'Full system snapshot successfully stored in region us-east-1.',
      type: 'system'
    },
    {
      action: 'New Integration',
      userName: 'Admin User',
      details: 'Slack notification webhook connected to #pulse-alerts channel.',
      type: 'system'
    },
    {
      action: 'Performance Alert',
      userName: 'Monitor Bot',
      details: 'API response latency spiked to 450ms in EU-West region. Auto-scaling triggered.',
      type: 'warning'
    },
    {
      action: 'User Promotion',
      userName: 'Admin User',
      details: 'Employee "Sarah Jenkins" promoted to Senior Project Manager.',
      type: 'user'
    },
    {
      action: 'Client Onboarding',
      userName: 'James Wilson',
      details: 'New client "Global Dynamics" successfully onboarded to Enterprise plan.',
      type: 'data'
    },
    {
      action: 'AI Insight Generated',
      userName: 'Pulse AI',
      details: 'Predictive analysis suggests 15% growth in Q3 based on current lead velocity.',
      type: 'ai'
    },
    {
      action: 'System Update',
      userName: 'Deploy Bot',
      details: 'PulseCRM v2.4.0 deployed successfully. New features: Batch Operations, Real-time Logs.',
      type: 'system'
    },
    {
      action: 'Anomaly Detected',
      userName: 'Security AI',
      details: 'Unusual login pattern detected from IP 192.168.1.105. Account locked for verification.',
      type: 'security'
    },
    {
      action: 'Resource Optimization',
      userName: 'Pulse AI',
      details: 'Identified 3 underutilized server instances. Shutdown initiated to reduce costs.',
      type: 'system'
    },
    {
      action: 'Sentiment Analysis',
      userName: 'Pulse AI',
      details: 'Overall client sentiment increased by 12% following the new UI update.',
      type: 'ai'
    },
    {
      action: 'Data Integrity Check',
      userName: 'System Sentinel',
      details: 'Verified 1.2M records across all collections. 100% data consistency confirmed.',
      type: 'data'
    }
  ]
};

export async function seedDatabase(currentUserId?: string) {
  console.log('Starting database seeding...');

  // Security check: Only admins should be able to seed
  if (currentUserId) {
    const { getDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    const userDoc = await getDoc(doc(db, 'users', currentUserId));
    if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
      console.error('Permission denied: Only admins can seed the database.');
      return;
    }
  }

  // Check if we already have data to avoid duplicates
  const existingClients = await dbService.getCollection('clients', [{ field: 'name', operator: '==', value: 'TechNova Solutions' }]);
  if (existingClients.length > 0) {
    console.log('Database already contains demo data. Skipping seeding.');
    return;
  }

  const { doc, collection } = await import('firebase/firestore');
  const { db } = await import('../firebase');

  try {
    await dbService.runBatch((batch) => {
      // Seed Users
      demoData.users.forEach(user => {
        const docRef = doc(db, 'users', user.uid);
        batch.set(docRef, { ...user, updatedAt: serverTimestamp() });
      });

      // If current user is provided and not in demo users, add them
      if (currentUserId && !demoData.users.find(u => u.uid === currentUserId)) {
        // We don't know their name/email here easily without more context, 
        // but they should already have a profile from the auth flow.
      }

      // Seed Posts
      demoData.posts.forEach((post, i) => {
        const docRef = doc(collection(db, 'posts'));
        batch.set(docRef, {
          ...post,
          authorId: currentUserId || 'demo-admin-1',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      // Seed Events
      demoData.events.forEach(event => {
        const docRef = doc(collection(db, 'events'));
        batch.set(docRef, {
          ...event,
          date: new Date(event.date),
          createdAt: serverTimestamp()
        });
      });

      // Seed Clients
      demoData.clients.forEach((client, i) => {
        const user = demoData.users.find(u => u.email === client.email);
        const clientId = user ? user.uid : `demo-client-id-${i}`;
        const docRef = doc(db, 'clients', clientId);
        batch.set(docRef, {
          ...client,
          id: clientId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
    });

    // Second batch for tasks and receipts
    await dbService.runBatch((batch) => {
      const employees = demoData.users.filter(u => u.role === 'employee');
      
      // Seed Tasks
      demoData.tasks.forEach((task, i) => {
        const randomClientIdx = Math.floor(Math.random() * demoData.clients.length);
        const client = demoData.clients[randomClientIdx];
        const user = demoData.users.find(u => u.email === client.email);
        const clientId = user ? user.uid : `demo-client-id-${randomClientIdx}`;
        
        // Assign some tasks to current user if they are an employee
        let assignedId = employees[Math.floor(Math.random() * employees.length)].uid;
        let assignedName = employees.find(e => e.uid === assignedId)?.name || 'Demo Employee';

        if (currentUserId && i % 3 === 0) {
          assignedId = currentUserId;
          assignedName = 'You (Employee)';
        }
        
        const docRef = doc(collection(db, 'tasks'));
        batch.set(docRef, {
          ...task,
          clientId: clientId,
          assignedToName: assignedName,
          assignedToId: assignedId,
          createdAt: serverTimestamp(),
          dueDate: new Date(task.dueDate)
        });
      });

      // Seed Receipts
      Array.from({ length: 15 }).map((_, i) => {
        const randomClientIdx = Math.floor(Math.random() * demoData.clients.length);
        const client = demoData.clients[randomClientIdx];
        const user = demoData.users.find(u => u.email === client.email);
        const clientId = user ? user.uid : `demo-client-id-${randomClientIdx}`;
        
        const docRef = doc(collection(db, 'receipts'));
        batch.set(docRef, {
          clientId: clientId,
          clientName: client?.name || 'Unknown Client',
          amount: Math.floor(Math.random() * 5000) + 500,
          date: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
          description: `Service payment for ${client?.company || 'Project'}`,
          items: [
            { description: 'Consultation Fee', quantity: 1, price: 500 },
            { description: 'Implementation', quantity: 1, price: 1500 }
          ],
          createdAt: serverTimestamp()
        });
      });

      // Seed Logs
      demoData.logs.forEach((log, i) => {
        const docRef = doc(collection(db, 'logs'));
        batch.set(docRef, {
          ...log,
          timestamp: new Date(Date.now() - i * 15 * 60 * 1000), // Spaced out by 15 mins
          createdAt: serverTimestamp()
        });
      });
    });

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error during batch seeding:', error);
    throw error;
  }
}
