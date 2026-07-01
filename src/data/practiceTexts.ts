export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Topic {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface PracticeText {
  topic: string;
  level: Level;
  title: string;
  text: string;
}

export const TOPICS: Topic[] = [
  { id: 'job-interview',    label: 'Job Interview',     icon: '💼', description: 'Practice common interview phrases' },
  { id: 'customer-support', label: 'Customer Support',  icon: '🎧', description: 'Handle customer inquiries professionally' },
  { id: 'traveling',        label: 'Traveling',         icon: '✈️', description: 'Navigate airports, hotels & directions' },
  { id: 'daily-life',       label: 'Daily Life',        icon: '🏠', description: 'Describe everyday routines and activities' },
  { id: 'small-talk',       label: 'Small Talk',        icon: '💬', description: 'Master casual social conversations' },
  { id: 'money-work',       label: 'Money & Work',      icon: '💰', description: 'Discuss finances and career topics' },
  { id: 'short-story',      label: 'Short Story',       icon: '📖', description: 'Read engaging narrative passages' },
  { id: 'personal-growth',  label: 'Personal Growth',   icon: '🌱', description: 'Talk about habits and self-improvement' },
  { id: 'ordering-food',    label: 'Ordering Food',     icon: '🍽️', description: 'Speak confidently at restaurants' },
  { id: 'surprise',         label: 'Surprise',          icon: '🎉', description: 'Express emotions and reactions' },
  { id: 'news',             label: 'News',              icon: '📰', description: 'Discuss current events and analysis' },
  { id: 'tongue-twisters',  label: 'Tongue Twisters',   icon: '👅', description: 'Challenge your pronunciation skills' },
];

export const PRACTICE_TEXTS: PracticeText[] = [
  // ─── JOB INTERVIEW ────────────────────────────────────────────────────────
  {
    topic: 'job-interview', level: 'beginner',
    title: 'Tell Me About Yourself',
    text: `Hello, my name is Sarah. I am applying for the customer service position. I have two years of experience working in a retail store. I am a friendly and hardworking person. I enjoy helping customers and solving problems every day. I am always punctual and I learn new things very quickly. I believe I would be a great fit for your team and I am excited to contribute.`,
  },
  {
    topic: 'job-interview', level: 'intermediate',
    title: 'Sales Professional Interview',
    text: `Thank you so much for meeting with me today. I have been working in sales for the past four years, and I have consistently exceeded my quarterly targets by at least fifteen percent. My key strengths include building strong client relationships and identifying new business opportunities. I am particularly proud of a campaign I led that brought in twenty new accounts in just three months. I am genuinely excited about this opportunity because your company is a recognized leader in sustainable products, which aligns perfectly with my personal values and professional goals.`,
  },
  {
    topic: 'job-interview', level: 'advanced',
    title: 'Senior Leadership Position',
    text: `I appreciate the opportunity to interview for this senior leadership role. Throughout my career, I have developed a strategic approach to organizational growth, focusing on building high-performing teams and driving operational efficiency. In my previous position, I orchestrated a complete restructuring of the customer success department, resulting in a forty-two percent reduction in churn rate and a significantly improved net promoter score. I am particularly drawn to this role because of the company's ambitious expansion plans into emerging markets, an area where I have substantial experience and well-established professional networks that could prove immediately valuable.`,
  },

  // ─── CUSTOMER SUPPORT ─────────────────────────────────────────────────────
  {
    topic: 'customer-support', level: 'beginner',
    title: 'Basic Customer Call',
    text: `Good afternoon, thank you for calling us today. How can I help you? I understand your product is not working properly. I am so sorry to hear that. Can you please tell me your order number? I will look into this right away. I can send you a brand new one or give you a full refund. Which would you prefer? I want to make sure you are completely satisfied with our service.`,
  },
  {
    topic: 'customer-support', level: 'intermediate',
    title: 'Shipping Delay Complaint',
    text: `I understand how frustrating this situation must be for you, and I sincerely apologize for the inconvenience caused by our shipping delay. After reviewing your account carefully, I can see that your order was dispatched five days ago, but unfortunately there seems to have been a problem at the distribution center. I am going to escalate this to our priority fulfillment team right now and personally ensure that your replacement package ships out today with express delivery at absolutely no additional cost to you whatsoever.`,
  },
  {
    topic: 'customer-support', level: 'advanced',
    title: 'Service Outage Escalation',
    text: `I completely understand your concerns about the service disruption, and I want to assure you that we take this matter extremely seriously. Upon reviewing the technical logs associated with your account, it is clear that the outage resulted from an unforeseen conflict during our scheduled maintenance window, which unfortunately fell outside our standard change management protocols. I am escalating this directly to our senior engineering team and our customer success director. Furthermore, I would like to offer you a comprehensive service credit that covers not only the downtime period but also compensates for any measurable business impact you may have experienced during this time.`,
  },

  // ─── TRAVELING ────────────────────────────────────────────────────────────
  {
    topic: 'traveling', level: 'beginner',
    title: 'Asking for Directions',
    text: `Excuse me, could you tell me where the train station is? I need to get to the city center as soon as possible. How long does it usually take? Is there a bus I can take from here? Oh, that sounds easy enough, thank you very much. And one more question — do you know any good hotels near the city park? I need a room for two nights and I have a moderate budget. Any recommendations would be very helpful.`,
  },
  {
    topic: 'traveling', level: 'intermediate',
    title: 'Wrong Hotel Room',
    text: `I would like to report a problem with my reservation. I booked a double room with a sea view for three nights, but when I checked in this morning, I was given a single room facing the parking lot instead. I have the confirmation email right here clearly showing what I originally booked. I understand the hotel might be fully booked at the moment, but I would sincerely appreciate it if you could either move me to the correct room type when one becomes available, or provide a meaningful discount on my stay in light of this inconvenience.`,
  },
  {
    topic: 'traveling', level: 'advanced',
    title: 'Flight Cancellation & Insurance',
    text: `I am afraid there has been a rather significant complication with my travel itinerary. My connecting flight from Dubai was cancelled due to adverse weather conditions, which has triggered a cascade of problems with my pre-arranged ground transportation and hotel bookings in Singapore. I was under the clear impression that your premium travel insurance package would cover exactly these kinds of contingencies, including emergency rebooking fees and accommodation costs during extended layovers. Could you clarify precisely what compensation and logistical assistance I am entitled to under these specific circumstances, and what the timeline for resolution typically looks like?`,
  },

  // ─── DAILY LIFE ───────────────────────────────────────────────────────────
  {
    topic: 'daily-life', level: 'beginner',
    title: 'My Morning Routine',
    text: `Every morning I wake up at seven o'clock. The first thing I do is brush my teeth and wash my face with cold water. Then I go to the kitchen to make breakfast. I usually like to eat eggs and toast with some orange juice. After breakfast I take my dog for a walk in the park nearby. The park is very beautiful in the early morning light. After that I take the bus to work. I finish work at five o'clock and come home for dinner.`,
  },
  {
    topic: 'daily-life', level: 'intermediate',
    title: 'Busy Weekday Schedule',
    text: `My weekday routine has become quite hectic ever since I started my new job downtown. I usually set two alarms just to make sure I do not accidentally oversleep, because the commute alone takes at least forty-five minutes on a good traffic day. I have been trying to meal prep on Sundays to save valuable time during the week, but I constantly run out of creative ideas for healthy recipes that are genuinely quick and easy to prepare. My gym membership has been going completely to waste recently because by the time I get home in the evening, I barely have enough energy to cook dinner, let alone exercise for an hour.`,
  },
  {
    topic: 'daily-life', level: 'advanced',
    title: 'Work-Life Balance Challenges',
    text: `Balancing the demands of a full-time career with meaningful personal relationships and genuine self-care has become an increasingly complex juggling act that I navigate on a daily basis. I have been experimenting with time-blocking techniques to ensure I dedicate quality, focused time to different areas of my life without constantly feeling overwhelmed by competing priorities pulling me in opposite directions. The most challenging aspect has been establishing clear, consistent boundaries between professional responsibilities and personal time, particularly since remote work has significantly blurred those boundaries. I have found that scheduling specific time for creative pursuits and physical activity early each morning tends to be the most psychologically sustainable approach overall.`,
  },

  // ─── SMALL TALK ───────────────────────────────────────────────────────────
  {
    topic: 'small-talk', level: 'beginner',
    title: 'Meeting a New Neighbor',
    text: `Hello there, how are you doing today? The weather is really beautiful today, isn't it? I just love sunny days like this one. Do you live around here? I actually just moved into this neighborhood last week. It seems like such a friendly and welcoming place to live. Do you happen to know any good restaurants around here? I absolutely love trying new food from different cuisines. Maybe we could even go together to one sometime if you are interested.`,
  },
  {
    topic: 'small-talk', level: 'intermediate',
    title: 'End of Summer Chat',
    text: `Can you believe how incredibly quickly this summer has gone by? It honestly feels like just yesterday we were all complaining about the heat, and now the leaves are already beginning to change their colors beautifully. Did you manage to do anything exciting over the summer holiday? I was lucky enough to take a whole week off and visit my sister in Barcelona, which was truly absolutely wonderful. The food, the architecture, the warm people — everything about it was simply incredible. Have you ever had the chance to visit Spain yourself?`,
  },
  {
    topic: 'small-talk', level: 'advanced',
    title: 'Technology and Social Connection',
    text: `It is quite remarkable how profoundly the nature of social interaction has shifted over the past decade with the widespread proliferation of smartphones and social media platforms. I find myself having increasingly meaningful and genuine conversations with people I meet at industry events like this one, largely because there is a shared, unspoken understanding that authentic human connection has become somewhat rare in our hyper-connected yet paradoxically isolated modern world. What is your perspective on how technology has fundamentally affected the quality of professional networking? I am genuinely curious whether you find these in-person conferences more or less valuable now compared to several years ago.`,
  },

  // ─── MONEY & WORK ─────────────────────────────────────────────────────────
  {
    topic: 'money-work', level: 'beginner',
    title: 'My Monthly Budget',
    text: `I get paid every two weeks at my current job. I always try to save some money every single month, no matter what. I pay my rent on the first of the month and buy groceries every week. Sometimes I treat myself by buying new clothes or going out to eat. But I try very hard not to spend too much money on things I do not really need. I am saving up to go on a vacation next summer. I hope to visit my family in another country very soon.`,
  },
  {
    topic: 'money-work', level: 'intermediate',
    title: 'Improving My Finances',
    text: `I have been carefully reviewing my monthly budget and I realized that nearly thirty percent of my total income goes toward discretionary spending that I could easily cut back on if I were more intentional. I am seriously thinking about setting up automatic transfers to a high-yield savings account each payday so that I never have a chance to spend that money impulsively on things I do not need. My long-term financial goal is to build a solid emergency fund that covers at least six months of all living expenses before I even begin to think about making any significant investments in the market.`,
  },
  {
    topic: 'money-work', level: 'advanced',
    title: 'Investment Strategy Discussion',
    text: `From a personal finance perspective, I firmly believe that diversification across different asset classes is absolutely critical in the current economic climate, particularly given the persistent inflationary pressures and the considerable uncertainty surrounding future interest rate trajectories. I have been gradually reallocating a meaningful portion of my portfolio from traditional fixed-income instruments toward a carefully selected combination of broad index funds, inflation-protected securities, and certain alternative investments with low correlation to public markets. The fundamental guiding principle I try consistently to follow is maintaining a risk-adjusted allocation that genuinely aligns with both my investment time horizon and my psychological capacity for short-term volatility.`,
  },

  // ─── SHORT STORY ──────────────────────────────────────────────────────────
  {
    topic: 'short-story', level: 'beginner',
    title: 'Emma and the Lost Puppy',
    text: `One sunny afternoon, a little girl named Emma found a small puppy sitting alone in the park. The puppy looked lost and very scared. Emma wanted to help it right away. She gently sat down beside it and gave it some water and a biscuit from her bag. Then she carefully picked it up and carried it home with her. When her parents saw the puppy, they smiled warmly and said she could keep it forever. Emma was so happy that she jumped for joy. She named the puppy Lucky, and they became the very best of friends from that day on.`,
  },
  {
    topic: 'short-story', level: 'intermediate',
    title: 'The Abandoned Lighthouse',
    text: `The old lighthouse had been abandoned for nearly twenty years when Maria first stumbled upon it during her early morning run along the rugged coastal path. Something about its weathered stone exterior and the way the pale morning light caught the rusted lantern room drew her instinctively closer. Inside, scattered among decades of accumulated dust and dried sea salt, she discovered a collection of beautifully hand-painted journals belonging to a lighthouse keeper named Thomas, who had documented his long and lonely vigils at sea with remarkable artistic detail and emotional depth. As she carefully turned the fragile, yellowed pages, she felt an unexpected and profound connection to this man who had lived and loved in this same remote place a full century before her arrival.`,
  },
  {
    topic: 'short-story', level: 'advanced',
    title: 'An Unexpected Diagnosis',
    text: `The diagnosis arrived on an otherwise entirely unremarkable Tuesday afternoon, delivered with the practiced clinical precision that experienced medical professionals develop as a kind of necessary emotional armor against the crushing weight of what they must regularly convey to strangers. For a man who had spent three decades meticulously planning every conceivable contingency — whose elaborate spreadsheets contained detailed projections extending decades into an imagined future — the sudden and violent confrontation with an outcome that defied all preparation was simultaneously terrifying and, in the strangest and most unexpected way, quietly liberating. In the bewildering weeks that followed, William began to understand with startling clarity that the elaborate scaffolding of control he had so carefully constructed around every aspect of his life had simultaneously protected him from and profoundly deprived him of the raw, unfiltered, irreplaceable experience of being truly and completely alive.`,
  },

  // ─── PERSONAL GROWTH ──────────────────────────────────────────────────────
  {
    topic: 'personal-growth', level: 'beginner',
    title: 'Small Daily Improvements',
    text: `I want to become a better person every single day. I read books to learn new and interesting things about the world. I try to exercise at least three times a week to stay healthy and full of energy. I do my best to eat good food and drink plenty of water throughout the day. I spend my free time with people who make me feel happy and inspired. I always try to say please and thank you to everyone I meet. Every night before I sleep, I think of one good thing that happened to me that day. Small steps every day can lead to very big changes over time.`,
  },
  {
    topic: 'personal-growth', level: 'intermediate',
    title: 'Building Consistent Habits',
    text: `I have been on a conscious and deliberate journey of self-improvement for the past eighteen months, and the most genuinely valuable lesson I have learned along the way is that meaningful, lasting change requires consistency rather than occasional bursts of intense effort. I started by carefully identifying three core habits I truly wanted to develop — daily journaling, regular meditation, and purposeful reading — and I made a firm commitment to spending just ten quiet minutes on each one every morning before ever checking my phone. The remarkable compounding effect of these seemingly small daily practices has been genuinely transformative in ways that occasional dramatic gestures of self-improvement never once managed to achieve for me.`,
  },
  {
    topic: 'personal-growth', level: 'advanced',
    title: 'Self-Acceptance and Growth',
    text: `The deep philosophical tension between radical self-acceptance and the relentless drive for self-improvement is something I have grappled with extensively and honestly, and I have gradually come to believe that the resolution lies not in choosing one orientation over the other, but in understanding their fundamentally complementary and mutually reinforcing nature. True and sustainable growth, I have discovered through direct experience, emerges from a place of honest self-awareness rather than harsh self-criticism — the cultivated ability to observe one's ingrained patterns, acknowledged limitations, and persistent blind spots with the same generous, compassionate curiosity that one might naturally extend to a close and trusted friend. The most significant psychological breakthrough in my entire personal development journey has been learning to clearly distinguish between the fixed and limiting narratives I had unconsciously constructed about my own capabilities and the far more fluid, dynamic reality of human potential when properly nurtured, challenged, and supported over meaningful time.`,
  },

  // ─── ORDERING FOOD ────────────────────────────────────────────────────────
  {
    topic: 'ordering-food', level: 'beginner',
    title: 'At a Fast Food Restaurant',
    text: `Hello, I would like to order a cheeseburger, please. Could I have it made without onions? I do not like onions very much. I would also like a medium order of French fries and a large Coca-Cola to drink. How much does all of that cost in total? Oh, can I pay with a credit card? Thank you so much. Actually, one more small thing — could I please have some extra ketchup on the side as well? I really appreciate it.`,
  },
  {
    topic: 'ordering-food', level: 'intermediate',
    title: 'Fine Dining with Dietary Needs',
    text: `Good evening, I made a reservation for four people under the name Johnson at seven o'clock. We have one person in our group with a severe tree nut allergy, so I want to confirm whether the salmon dish is prepared in a shared kitchen space with any nut-based products or sauces. I also have a quick question about the mushroom risotto on the menu — is it possible to prepare it completely dairy-free? My friend is lactose intolerant and would love to try it. Could we also see the wine list when you have a moment? We were hoping to start with something light and crisp, perhaps a Sauvignon Blanc to complement the seafood appetizers.`,
  },
  {
    topic: 'ordering-food', level: 'advanced',
    title: 'Molecular Gastronomy Restaurant',
    text: `We have genuinely been looking forward to dining here this evening, having heard so much about the chef's innovative and celebrated approach to molecular gastronomy. I was wondering whether the full tasting menu can be thoughtfully adapted for our party — we have one guest who follows a strict pescatarian diet and another who has quite a sophisticated and adventurous palate but a documented sensitivity to highly acidic ingredients, which can be genuinely problematic with certain preparations that heavily feature citrus reductions or fermented components. Would it also be possible to speak briefly with the sommelier this evening? We were hoping to arrange a proper wine pairing experience, but wanted to ensure the selections genuinely complement the adapted courses rather than simply defaulting to the standard pairing that accompanies the regular menu. I completely understand this requires additional coordination with the kitchen team.`,
  },

  // ─── SURPRISE ─────────────────────────────────────────────────────────────
  {
    topic: 'surprise', level: 'beginner',
    title: 'A Wonderful Surprise Party',
    text: `Oh my goodness! I simply cannot believe this is happening! You all did this just for me? Thank you so very much from the bottom of my heart! I am so unbelievably happy right now, I could cry. I had absolutely no idea at all! This is seriously the best day of my entire life. You are all such wonderful and thoughtful people. I honestly do not even know what to say right now. This is such a huge and beautiful surprise. Thank you, thank you, thank you so much everyone!`,
  },
  {
    topic: 'surprise', level: 'intermediate',
    title: 'Surprise Office Celebration',
    text: `I honestly cannot believe what just happened to me. I was absolutely convinced this meeting was just a regular quarterly performance review, and then suddenly everyone jumped out from behind their desks shouting congratulations at the top of their lungs. I am genuinely speechless right now, which is really saying something because I am usually the one talking far too much in these social situations. The fact that you all managed to keep this wonderful secret for two entire weeks is arguably even more impressive than whatever I actually did to deserve this recognition and celebration. I am so deeply touched and grateful for all of you.`,
  },
  {
    topic: 'surprise', level: 'advanced',
    title: 'Unexpected Project Approval',
    text: `I find myself in the rather unusual and genuinely disorienting position of being comprehensively and completely surprised — something that very rarely happens to someone who has spent the better part of their career in strategic planning and has consequently developed what I have always considered an occasionally inconvenient ability to anticipate likely outcomes well before they actually unfold in reality. The revelation that my proposal had not only been unanimously approved by the board but had been fast-tracked with substantially additional resources represents a meaningful departure from every organizational precedent I have carefully observed during my tenure here. What moves me most profoundly, however, is not the project approval itself, but the compelling evidence it provides of a level of institutional trust in my judgment that I honestly did not realize had been so firmly established.`,
  },

  // ─── NEWS ─────────────────────────────────────────────────────────────────
  {
    topic: 'news', level: 'beginner',
    title: 'Local City News',
    text: `Today on the local news, I heard that a beautiful new public park will open in our city next month. The park will have many tall trees, colorful flowers, and a peaceful small lake in the center. Families and children can spend time there on weekends and holidays. The city government also announced exciting plans to build new bicycle paths connecting different neighborhoods. This is wonderful news for everyone who enjoys spending time outdoors. The forecast says the weather today will be mostly sunny with warm temperatures all week.`,
  },
  {
    topic: 'news', level: 'intermediate',
    title: 'Urban Renewal Project',
    text: `According to official reports released earlier today, the city council has voted to approve a comprehensive and ambitious urban renewal project valued at over two hundred million dollars. The multi-year initiative will focus primarily on revitalizing three historically significant and currently underserved neighborhoods through major infrastructure upgrades, the creation of new affordable housing units, and the thoughtful development of modern community spaces designed to serve residents of all different age groups and backgrounds. Local business owners have expressed measured and cautious optimism about the potential economic benefits, though several community advocacy groups have raised important and legitimate concerns about the potential displacement of long-term residents during the extended construction phase.`,
  },
  {
    topic: 'news', level: 'advanced',
    title: 'Central Bank Interest Rate Decision',
    text: `The far-reaching implications of the central bank's controversial decision to maintain current interest rates despite mounting and persistent inflationary pressures are likely to be complex and deeply consequential in their gradual unfolding across global markets. Prominent economists remain genuinely and sharply divided on whether this represents a prudent and measured exercise in institutional patience — allowing recent and carefully targeted supply-side policy interventions additional time to propagate meaningfully through the interconnected economic system — or a potentially costly and ultimately counterproductive delay in decisively addressing what several respected analysts are now characterizing as structurally embedded rather than purely transitory inflationary dynamics. The currency markets have responded this week with notable and sustained volatility, accurately reflecting the profound uncertainty currently prevailing among institutional investors regarding the medium-term trajectory of monetary policy normalization.`,
  },

  // ─── TONGUE TWISTERS ──────────────────────────────────────────────────────
  {
    topic: 'tongue-twisters', level: 'beginner',
    title: 'Classic Tongue Twisters',
    text: `She sells seashells by the seashore. The shells she sells are surely seashells. Peter Piper picked a peck of pickled peppers. If Peter Piper picked a peck of pickled peppers, where is the peck of pickled peppers Peter Piper picked? Red lorry, yellow lorry. Big black bug bit a big black bear. Toy boat, toy boat, toy boat. I scream, you scream, we all scream for ice cream.`,
  },
  {
    topic: 'tongue-twisters', level: 'intermediate',
    title: 'Moderate Pronunciation Challenge',
    text: `How much wood would a woodchuck chuck if a woodchuck could chuck wood? A woodchuck would chuck as much wood as a woodchuck could chuck if a woodchuck could chuck wood. Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter, but a bit of better butter will surely make my batter better. So Betty Botter bought a bit of better butter and it made her batter better. Whether the weather is warm, whether the weather is hot, we have to put up with the weather whether we like it or not.`,
  },
  {
    topic: 'tongue-twisters', level: 'advanced',
    title: 'Expert Pronunciation Mastery',
    text: `The sixth sick sheikh's sixth sheep is sick. I saw Susie sitting in a shoeshine shop. Where she sits she shines, and where she shines she sits. Pad kid poured curd pulled cod. A proper copper coffee pot. Rory the warrior and Roger the worrier were reared wrongly in a rural brewery. Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair, Fuzzy Wuzzy wasn't very fuzzy, was he? I wish to wish the wish you wish to wish, but if you wish the wish the witch wishes, I won't wish the wish you wish to wish. Can you can a can as a canner can can a can?`,
  },
];

export function getPracticeText(topicId: string, level: Level): PracticeText | undefined {
  return PRACTICE_TEXTS.find(t => t.topic === topicId && t.level === level);
}
