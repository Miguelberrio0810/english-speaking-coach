export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type Skill = 'speaking' | 'listening' | 'reading' | 'writing';

export interface Activity {
  id: string;
  skill: Skill;
  level: CEFRLevel;
  icon: string;
  theme: string;
  title: string;
  text: string;
  questions?: string[];
  wordTarget?: { min: number; max: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEAKING — Read the text aloud, mic records, AI evaluates pronunciation
// ─────────────────────────────────────────────────────────────────────────────

const SPEAKING: Activity[] = [
  // A1
  {
    id: 'sp-a1-1', skill: 'speaking', level: 'A1', icon: '👋', theme: 'Greetings',
    title: 'Hello and Goodbye',
    text: `Hello, my name is Maria. I am happy to meet you. I live in a small house near the park. I have one sister and one brother. My mother works in a school. My father works in a shop. I like to eat fruit and bread. I drink water and milk every day. Goodbye, and have a nice day!`,
  },
  {
    id: 'sp-a1-2', skill: 'speaking', level: 'A1', icon: '🏠', theme: 'Home',
    title: 'My Home',
    text: `This is my home. It is a small apartment. I have a bedroom, a kitchen, and a bathroom. My bedroom has a bed and a window. I have a blue chair and a brown table. My kitchen is small but clean. I cook rice and vegetables there. I like my home very much. It is my favorite place.`,
  },
  {
    id: 'sp-a1-3', skill: 'speaking', level: 'A1', icon: '🌞', theme: 'Daily Life',
    title: 'My Morning',
    text: `Every morning I wake up at seven. I open my eyes and look at the window. Then I go to the bathroom. I wash my face and brush my teeth. After that I eat breakfast. I like eggs and toast. I drink orange juice. Then I put on my shoes and go to work. The bus comes at eight. I say hello to my friends on the bus.`,
  },

  // A2
  {
    id: 'sp-a2-1', skill: 'speaking', level: 'A2', icon: '🛒', theme: 'Shopping',
    title: 'At the Supermarket',
    text: `Yesterday I went to the supermarket after work. I needed to buy some food for the week. I bought vegetables, chicken, bread, and milk. The supermarket was very busy because it was Friday evening. I waited in a long line at the checkout. The cashier was friendly and asked if I found everything I needed. I paid with my credit card and carried my bags home. It took me about twenty minutes to walk back.`,
  },
  {
    id: 'sp-a2-2', skill: 'speaking', level: 'A2', icon: '☀️', theme: 'Weather',
    title: 'Talking About the Weather',
    text: `The weather today is beautiful and sunny. The temperature is about twenty-two degrees. Last week the weather was very different. It rained every day and it was cold and grey. I did not go outside much. This weekend the forecast says it will be sunny and warm. I am planning to go to the park with my friends. We want to play sports and have a picnic. I love spending time outside when the weather is good.`,
  },
  {
    id: 'sp-a2-3', skill: 'speaking', level: 'A2', icon: '🚌', theme: 'Transport',
    title: 'Getting Around the City',
    text: `I travel around the city by bus and metro every day. The bus stop is near my apartment, just two minutes on foot. I take the number fourteen bus to the city center. Then I change to the metro line two. My journey takes about thirty-five minutes in total. In the morning the metro is always very crowded. I prefer to take the bus when I am not in a hurry because I can see the city from the window. On weekends I sometimes ride my bicycle instead.`,
  },

  // B1
  {
    id: 'sp-b1-1', skill: 'speaking', level: 'B1', icon: '💼', theme: 'Work',
    title: 'My Working Life',
    text: `I have been working as a graphic designer for three years now. I work for a small creative agency in the city center. My job involves designing logos, websites, and advertising materials for different clients. I really enjoy my work because every project brings new creative challenges. However, the deadlines can be quite stressful sometimes, especially when clients make last-minute changes. I try to manage my time well and communicate clearly with my team. In my opinion, good communication is the most important skill in any workplace.`,
  },
  {
    id: 'sp-b1-2', skill: 'speaking', level: 'B1', icon: '✈️', theme: 'Travel',
    title: 'A Memorable Trip',
    text: `Last summer I travelled to Portugal with two of my closest friends. We spent ten days exploring Lisbon and the Algarve coast. Lisbon was an incredible city with beautiful old buildings, amazing food, and very friendly people. We visited many historical sites and tried lots of local dishes. The grilled fish and pastéis de nata were absolutely delicious. The Algarve coast has some of the most stunning beaches I have ever seen in my life. We swam in the clear blue sea every afternoon. It was definitely one of the best holidays I have ever had.`,
  },
  {
    id: 'sp-b1-3', skill: 'speaking', level: 'B1', icon: '🎭', theme: 'Hobbies',
    title: 'My Free Time Activities',
    text: `In my free time I enjoy several different hobbies that help me relax and express my creativity. I have been playing the guitar for about four years and I practice for at least thirty minutes every evening. I also love reading fiction novels, particularly mystery stories that keep me guessing until the very end. Recently I started attending a weekly photography class to improve my skills. I think having hobbies is very important for your wellbeing because they give you something to look forward to outside of work and help reduce stress effectively.`,
  },

  // B2
  {
    id: 'sp-b2-1', skill: 'speaking', level: 'B2', icon: '💻', theme: 'Technology',
    title: 'The Digital Revolution',
    text: `The rapid advancement of technology over the past two decades has fundamentally transformed the way we live, work, and communicate with each other. Smartphones have become an extension of ourselves, providing instant access to virtually unlimited information and connecting us to people around the world. While these developments have brought undeniable benefits in terms of productivity and convenience, they have also introduced significant concerns regarding privacy, mental health, and the widening digital divide between those with access to technology and those without. It is essential that society develops thoughtful policies to address these challenges proactively.`,
  },
  {
    id: 'sp-b2-2', skill: 'speaking', level: 'B2', icon: '🌍', theme: 'Environment',
    title: 'Climate Change and Our Responsibility',
    text: `Climate change represents arguably the most pressing challenge of our generation, with scientific evidence overwhelming showing that human activities are driving significant and potentially irreversible changes to our planet's climate systems. The consequences — rising sea levels, more frequent extreme weather events, loss of biodiversity — disproportionately affect the world's most vulnerable populations. While individual actions such as reducing consumption and switching to renewable energy sources are meaningful, systemic change through international cooperation and government policy is absolutely essential if we are to limit warming to levels that prevent the worst predicted outcomes.`,
  },
  {
    id: 'sp-b2-3', skill: 'speaking', level: 'B2', icon: '🏢', theme: 'Society',
    title: 'Remote Work and the Future of Offices',
    text: `The widespread adoption of remote working during the pandemic has prompted a fundamental reassessment of traditional office culture and what it means to be a productive professional. Many workers discovered genuine benefits in working from home — eliminating lengthy commutes, achieving greater work-life balance, and gaining control over their working environment. However, remote work also presents real challenges: isolation from colleagues, difficulties separating professional and personal life, and reduced opportunities for spontaneous collaboration and mentoring. Organizations are now grappling with how to design hybrid models that capture the advantages of both approaches while mitigating the disadvantages of each.`,
  },

  // C1
  {
    id: 'sp-c1-1', skill: 'speaking', level: 'C1', icon: '🤖', theme: 'Ethics & Technology',
    title: 'Artificial Intelligence: Promise and Peril',
    text: `The accelerating development of artificial intelligence systems capable of performing increasingly sophisticated cognitive tasks raises profound questions about the nature of intelligence, creativity, and human identity that philosophers, scientists, and policymakers are only beginning to grapple with seriously. While the potential benefits are extraordinary — from accelerating drug discovery and addressing climate change to democratizing access to expertise previously available only to the privileged few — the risks are equally significant. Algorithmic bias encoded in training data can perpetuate and amplify existing social inequalities. The concentration of AI capabilities in a handful of powerful corporations raises serious concerns about accountability and democratic governance. Perhaps most fundamentally, the prospect of artificial general intelligence demands that we consider carefully what values we want to embed in systems that may ultimately surpass human cognitive capabilities in critical domains.`,
  },
  {
    id: 'sp-c1-2', skill: 'speaking', level: 'C1', icon: '⚖️', theme: 'Global Issues',
    title: 'Economic Inequality in the Twenty-First Century',
    text: `The extraordinary concentration of wealth in an increasingly small number of hands represents not merely an economic phenomenon but a fundamental challenge to the democratic ideals and social contracts upon which modern societies were built. Research consistently demonstrates that high levels of inequality undermine social mobility, reduce educational attainment among disadvantaged groups, erode trust in institutions, and correlate with worse health outcomes across the population. The globalization of trade and the technological revolution have simultaneously created enormous wealth and systematically undermined the bargaining power of workers, hollowing out the middle class that has historically provided economic and political stability. Addressing this challenge requires not incremental adjustment but a fundamental reconsideration of how societies distribute the gains from economic activity.`,
  },
  {
    id: 'sp-c1-3', skill: 'speaking', level: 'C1', icon: '🧠', theme: 'Philosophy',
    title: 'Free Will, Determinism, and Moral Responsibility',
    text: `The age-old philosophical debate concerning free will and determinism acquires renewed urgency in an era of advanced neuroscience that increasingly reveals the degree to which human decision-making is shaped by unconscious processes, genetic predispositions, and environmental conditioning that lie largely beyond conscious control. If our choices are ultimately the products of prior causes — biological, psychological, and social — over which we had no meaningful agency, then traditional conceptions of moral responsibility, praise, blame, and punishment require radical reexamination. Yet most people's lived experience of deliberation, choice, and the experience of authoring their own lives seems irreconcilably at odds with a purely mechanistic account of human agency, suggesting perhaps that the dichotomy itself needs questioning rather than resolution through adherence to either extreme position.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LISTENING — TTS plays text, student types what they heard
// ─────────────────────────────────────────────────────────────────────────────

const LISTENING: Activity[] = [
  // A1
  {
    id: 'li-a1-1', skill: 'listening', level: 'A1', icon: '🐶', theme: 'Animals',
    title: 'My Pet',
    text: `I have a dog. His name is Max. He is brown and white. Max is very friendly. He likes to play in the garden. He eats meat and dog food. Max sleeps in the living room. I walk him every morning. I love my dog very much.`,
  },
  {
    id: 'li-a1-2', skill: 'listening', level: 'A1', icon: '🎨', theme: 'Colors and Objects',
    title: 'My Classroom',
    text: `My classroom is big and clean. There are twenty chairs and twenty desks. The walls are white. The board is black. There are three windows. The door is brown. My teacher has a red pen. I have a blue bag. My book is on the desk.`,
  },
  {
    id: 'li-a1-3', skill: 'listening', level: 'A1', icon: '🍎', theme: 'Food',
    title: 'I Like Food',
    text: `I like to eat many things. I love apples and bananas. I eat bread every morning. I drink milk and tea. I do not like fish. My mother cooks rice and soup for dinner. On Sundays we eat pizza. My favorite food is ice cream.`,
  },

  // A2
  {
    id: 'li-a2-1', skill: 'listening', level: 'A2', icon: '📅', theme: 'Routines',
    title: 'My Daily Schedule',
    text: `On weekdays I wake up at six thirty. I shower and get dressed quickly. I eat breakfast at seven. Usually I have cereal or eggs. I leave home at seven forty-five. I walk to the bus stop and take the bus to work. I start work at nine and finish at six. In the evening I cook dinner and watch television. I go to bed at eleven.`,
  },
  {
    id: 'li-a2-2', skill: 'listening', level: 'A2', icon: '🏪', theme: 'Shopping',
    title: 'A Conversation in a Shop',
    text: `Good morning, can I help you? Yes, I am looking for a jacket. What size are you? I am a medium. What color do you prefer? I would like something dark, maybe navy blue or black. We have this black one. It is very popular. How much does it cost? It is forty-five euros. Can I try it on? Of course, the changing rooms are on the left.`,
  },
  {
    id: 'li-a2-3', skill: 'listening', level: 'A2', icon: '🎉', theme: 'Social Events',
    title: 'An Invitation',
    text: `Hi Sarah, I am having a birthday party next Saturday evening. It starts at seven o'clock at my apartment. I am going to cook Italian food and there will be music and dancing. Can you come? Please bring your partner if you want. You do not need to bring anything, just yourself. Let me know by Thursday so I can prepare enough food for everyone.`,
  },

  // B1
  {
    id: 'li-b1-1', skill: 'listening', level: 'B1', icon: '🎓', theme: 'Education',
    title: 'Choosing a University Course',
    text: `Choosing the right university course is one of the most important decisions a young person makes. You should consider both your personal interests and future job prospects. It is a good idea to research different careers and speak to people already working in fields you find interesting. Many universities offer open days where you can visit the campus, attend sample lectures, and speak with current students about their experiences. Remember that it is possible to change your direction later, so do not feel too much pressure to make the perfect choice immediately.`,
  },
  {
    id: 'li-b1-2', skill: 'listening', level: 'B1', icon: '🏥', theme: 'Health',
    title: 'Looking After Your Health',
    text: `Maintaining good health requires a balanced approach to several different aspects of your lifestyle. Regular physical activity is essential, and experts recommend at least thirty minutes of moderate exercise five times per week. Your diet is equally important, and you should aim to eat plenty of fresh vegetables, fruits, and whole grains while limiting processed foods and sugar. Getting enough sleep is often overlooked but is critical for physical recovery and mental wellbeing. Finally, managing stress through relaxation techniques, social connections, and hobbies contributes significantly to long-term health.`,
  },
  {
    id: 'li-b1-3', skill: 'listening', level: 'B1', icon: '🌆', theme: 'City Life',
    title: 'Living in a Big City',
    text: `Living in a large city has many obvious advantages. There are more job opportunities, better transportation networks, and a wider variety of cultural experiences such as museums, theatres, and restaurants. However, city life also brings significant challenges. The cost of accommodation is usually much higher than in smaller towns. Traffic and noise can be exhausting. Many city dwellers report feeling lonely despite being constantly surrounded by thousands of people. The question of whether urban or rural life is better ultimately depends on personal priorities, career ambitions, and individual personality.`,
  },

  // B2
  {
    id: 'li-b2-1', skill: 'listening', level: 'B2', icon: '📱', theme: 'Social Media',
    title: 'The Psychology of Social Media',
    text: `Research into the psychological effects of social media has produced complex and sometimes contradictory findings. While platforms designed to connect people have undeniably succeeded in facilitating communication across geographical distances, they have simultaneously introduced mechanisms that many psychologists argue are potentially harmful to mental health. The dopamine-driven feedback loops created by likes, comments, and followers can foster compulsive usage patterns. Curated images of idealized lifestyles generate social comparison and feelings of inadequacy. Algorithmic content curation creates echo chambers that reinforce existing beliefs and contribute to political polarization. Understanding these mechanisms is the first step toward developing a healthier, more intentional relationship with these powerful tools.`,
  },
  {
    id: 'li-b2-2', skill: 'listening', level: 'B2', icon: '🌱', theme: 'Sustainability',
    title: 'Sustainable Consumer Choices',
    text: `The transition toward a more sustainable economy requires fundamental changes not only in industrial production systems but also in consumer behavior and individual lifestyle choices. Research suggests that dietary changes — specifically reducing consumption of meat and dairy products — represent one of the most impactful personal actions an individual can take to reduce their environmental footprint. Equally significant is the shift from ownership to access models, with sharing platforms and rental services extending product lifecycles and reducing overall resource consumption. However, critics rightly point out that framing sustainability primarily as a matter of individual consumer choice risks deflecting attention from the systemic corporate and governmental policy changes that would have far greater aggregate impact.`,
  },
  {
    id: 'li-b2-3', skill: 'listening', level: 'B2', icon: '🎯', theme: 'Success',
    title: 'What Makes People Successful',
    text: `Decades of research into human achievement have consistently challenged the popular notion that talent or innate ability is the primary determinant of exceptional success in any field. Studies of elite performers across diverse domains — from music and sport to chess and surgery — reveal that deliberate practice, characterized by systematic effort focused specifically on improving performance weaknesses with expert feedback, accounts for far more of the variance in achievement than natural aptitude. This finding has profound implications for how we design educational systems and develop organizational talent. It suggests that with the right environmental conditions, mentorship, and sustained effort, far more people are capable of high-level performance than our talent-focused culture typically assumes or encourages.`,
  },

  // C1
  {
    id: 'li-c1-1', skill: 'listening', level: 'C1', icon: '🧬', theme: 'Science',
    title: 'The Gene Editing Revolution',
    text: `The development of CRISPR-Cas9 gene editing technology has ushered in an era of biological engineering that offers remarkable therapeutic potential while simultaneously raising profound ethical questions that societies are ill-equipped to answer through existing regulatory frameworks. The ability to precisely edit the genetic code of living organisms opens pathways to treatments for previously incurable hereditary conditions, enhanced agricultural resilience in the face of climate change, and potentially the elimination of disease vectors such as malaria-carrying mosquitoes. However, the same technology that enables therapeutic somatic cell editing can theoretically be applied to germline modifications that would be heritable across generations, raising concerns about genetic enhancement, social equity in access to biological advantages, and the potential for unintended ecological consequences of releasing genetically modified organisms into complex natural systems.`,
  },
  {
    id: 'li-c1-2', skill: 'listening', level: 'C1', icon: '🌐', theme: 'Geopolitics',
    title: 'The Shifting Global Order',
    text: `The international order that emerged from the Second World War and consolidated after the Cold War — characterized by American hegemony, multilateral institutions, rules-based trade, and the gradual spread of liberal democratic norms — faces unprecedented challenges from multiple directions simultaneously. The rise of China as an economic and military power of continental scale has introduced strategic competition into domains ranging from technological standards and supply chain architecture to military posture in contested maritime regions. Simultaneously, democratic backsliding in countries across all continents has undermined the assumption that liberal democracy represents the inevitable endpoint of political development. These trends demand that scholars and policymakers develop more sophisticated frameworks for understanding a genuinely multipolar world in which ideological competition and great power rivalry may be enduring structural features rather than transitional phenomena.`,
  },
  {
    id: 'li-c1-3', skill: 'listening', level: 'C1', icon: '🎭', theme: 'Arts & Culture',
    title: 'Art in the Age of Artificial Intelligence',
    text: `The emergence of generative artificial intelligence systems capable of producing sophisticated visual art, music, and literature at scale raises fundamental questions about creativity, authorship, and the cultural value of human artistic expression that the art world is only beginning to seriously grapple with. When an algorithm trained on millions of existing artworks can produce aesthetically compelling images in seconds, what becomes of the centuries-old narrative connecting artistic value to the struggle, intention, and personal vision of an individual creator? Early responses have ranged from categorical rejection to enthusiastic embrace, but neither extreme adequately addresses the genuine complexity of a moment when the tools available to human creators are being radically augmented and the boundaries between human and machine authorship are becoming genuinely difficult to delineate.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// READING — Show passage, answer comprehension questions
// ─────────────────────────────────────────────────────────────────────────────

const READING: Activity[] = [
  // A1
  {
    id: 're-a1-1', skill: 'reading', level: 'A1', icon: '🐱', theme: 'Animals',
    title: 'Tom the Cat',
    text: `Tom is a cat. He is orange and white. Tom lives in a small house with a family. The family has a mother, a father, and two children. Tom likes to sleep on the sofa. He eats fish and milk. He plays with a ball every evening. The children love Tom very much. Tom is happy.`,
    questions: [
      'What color is Tom?',
      'Where does Tom sleep?',
      'What does Tom eat?',
    ],
  },
  {
    id: 're-a1-2', skill: 'reading', level: 'A1', icon: '🌳', theme: 'Nature',
    title: 'The Park',
    text: `Near my home there is a park. The park is big and green. There are many trees and flowers. Children play there every day. There is a small lake with ducks. Old people sit on the benches and talk. Dogs run and play on the grass. I go to the park every Saturday morning. I like the park because it is quiet and beautiful.`,
    questions: [
      'What is in the lake at the park?',
      'When does the writer go to the park?',
      'Why does the writer like the park?',
    ],
  },
  {
    id: 're-a1-3', skill: 'reading', level: 'A1', icon: '👨‍👩‍👧', theme: 'Family',
    title: 'My Family',
    text: `My name is Ana. I have a small family. I have a mother and a father. I also have one brother. His name is Carlos. He is eight years old. My mother is a teacher. My father works in a hospital. We live in an apartment. On Sundays we eat lunch together. My family is very important to me.`,
    questions: [
      'How many people are in Ana\'s family?',
      'What is Carlos\'s age?',
      'What does Ana\'s mother do for work?',
    ],
  },

  // A2
  {
    id: 're-a2-1', skill: 'reading', level: 'A2', icon: '🚴', theme: 'Sport',
    title: 'My Running Club',
    text: `Every Tuesday and Thursday morning I go running with a group of people from my neighborhood. We meet at the park at seven o'clock. There are about fifteen people in our group. Some people run fast and some run slowly. We always run together and nobody is left behind. After running for about forty minutes we stop and drink water. Then we talk and laugh together. I joined the club six months ago and now I am much fitter. I have also made some good new friends.`,
    questions: [
      'When does the running club meet?',
      'How long do they run for?',
      'What two benefits did the writer get from joining the club?',
    ],
  },
  {
    id: 're-a2-2', skill: 'reading', level: 'A2', icon: '🍕', theme: 'Food',
    title: 'Learning to Cook',
    text: `Last year I decided to learn how to cook. Before that, I always ate takeaway food or ready meals from the supermarket. I bought a simple cookbook and started with easy recipes. In the beginning I made mistakes. Once I burned the pasta and another time I put too much salt in the soup. But I did not give up. Now I can cook fifteen different meals. My friends say my cooking is delicious. Cooking is cheaper than eating out and I think it is a very useful life skill.`,
    questions: [
      'What did the writer eat before learning to cook?',
      'What mistakes did the writer make when learning?',
      'Why does the writer think cooking is good?',
    ],
  },
  {
    id: 're-a2-3', skill: 'reading', level: 'A2', icon: '📚', theme: 'School',
    title: 'A School Trip',
    text: `Last month our class went on a school trip to the science museum. We traveled there by bus and it took about an hour. At the museum we saw exhibitions about space, the human body, and the history of machines. Our favorite part was the interactive section where we could do experiments with electricity and water. We had lunch in the museum café. After lunch a scientist gave us a talk about her work studying volcanoes. We arrived back at school at four o'clock. Everyone agreed it was a wonderful day.`,
    questions: [
      'How did the class travel to the museum?',
      'What was the class\'s favorite part of the museum?',
      'Who gave a talk at the museum and what was it about?',
    ],
  },

  // B1
  {
    id: 're-b1-1', skill: 'reading', level: 'B1', icon: '🏡', theme: 'Housing',
    title: 'The Rise of Co-Living',
    text: `A growing number of young professionals in major cities are choosing co-living arrangements over traditional apartments as a solution to soaring housing costs and social isolation. Co-living spaces offer private bedrooms combined with shared kitchen, dining, and living areas, along with regular social events organized by the building management. Residents pay a single monthly fee that typically includes rent, utilities, internet, and cleaning services. Supporters argue that co-living offers an affordable entry point into expensive housing markets while fostering genuine community in an era when loneliness among young adults is recognized as a serious public health issue. Critics, however, question whether the premium charged by co-living operators truly represents value for money compared to sharing a conventional apartment with flatmates.`,
    questions: [
      'Why are young professionals choosing co-living according to the text?',
      'What is typically included in the monthly co-living fee?',
      'What is the main criticism of co-living spaces mentioned in the text?',
      'What social problem does co-living aim to address beyond housing costs?',
    ],
  },
  {
    id: 're-b1-2', skill: 'reading', level: 'B1', icon: '🎵', theme: 'Music',
    title: 'Music and the Brain',
    text: `Scientists have long been fascinated by the powerful effects that music has on human emotion, memory, and cognitive function. Brain imaging studies reveal that listening to music activates multiple regions of the brain simultaneously, including areas associated with movement, planning, attention, and memory. One of the most remarkable phenomena is the so-called "Mozart effect," the observation that people temporarily perform better on certain spatial reasoning tasks after listening to classical music, although more recent research suggests this effect may be due simply to improved mood and arousal rather than any specific property of classical music itself. More robustly established is music therapy's effectiveness in supporting patients with Alzheimer's disease, helping them recall memories and emotions even in advanced stages of cognitive decline when other forms of communication have become difficult.`,
    questions: [
      'What does brain imaging show happens when we listen to music?',
      'What is the "Mozart effect" as described in the passage?',
      'Why might the Mozart effect occur according to newer research?',
      'How does music therapy help patients with Alzheimer\'s disease?',
    ],
  },
  {
    id: 're-b1-3', skill: 'reading', level: 'B1', icon: '🌊', theme: 'Environment',
    title: 'Plastic in Our Oceans',
    text: `Every year, approximately eight million metric tons of plastic waste enters the world's oceans, posing a devastating threat to marine ecosystems. Unlike organic materials, most plastics do not biodegrade but instead gradually break down into microscopic particles known as microplastics that now permeate the entire marine food chain. Seabirds, turtles, and whales ingest plastic debris, often with fatal consequences. The Great Pacific Garbage Patch, a vast accumulation of marine debris concentrated by ocean currents in the North Pacific Ocean, covers an estimated area larger than twice the size of France. While large-scale ocean cleanup projects have attracted significant attention and funding, many scientists argue that the only long-term solution is drastically reducing plastic production at the source, rather than attempting to manage the consequences of the current system.`,
    questions: [
      'What happens to most plastics in the ocean instead of biodegrading?',
      'Name two types of animals harmed by plastic in the ocean.',
      'How large is the Great Pacific Garbage Patch according to the text?',
      'What do many scientists say is the only long-term solution to ocean plastic?',
    ],
  },

  // B2
  {
    id: 're-b2-1', skill: 'reading', level: 'B2', icon: '🧠', theme: 'Psychology',
    title: 'The Science of Habit Formation',
    text: `Neuroscientific research has revealed that habits — behavioral patterns that are triggered automatically by specific environmental cues — are encoded in the basal ganglia, a region of the brain associated with procedural learning, rather than in the prefrontal cortex where conscious, deliberate decision-making takes place. This neurological architecture explains why established habits are notoriously resistant to change even when individuals are strongly motivated to do so: the behavioral routine has essentially been "chunked" into a single automatic unit that bypasses higher-level cognitive control. The habit loop — comprising a cue, a routine, and a reward — provides a framework for both understanding existing habits and engineering new ones deliberately. Research suggests that the most effective behavior change strategies exploit this loop by maintaining existing cues and rewards while substituting the routine connecting them, rather than attempting to eliminate the habit entirely through willpower alone.`,
    questions: [
      'Where in the brain are habits stored and why is this significant?',
      'What are the three components of the habit loop?',
      'According to the text, what is the most effective approach to changing an existing habit?',
      'Why are habits difficult to change even when people are highly motivated?',
    ],
  },
  {
    id: 're-b2-2', skill: 'reading', level: 'B2', icon: '🏙️', theme: 'Urbanization',
    title: 'Smart Cities: Promise and Reality',
    text: `The concept of the "smart city" — urban environments that leverage networked sensors, big data analytics, and artificial intelligence to optimize infrastructure, services, and resource use — has attracted enormous investment and ambitious planning from governments and technology companies worldwide. Proponents argue that smart city technologies can dramatically improve quality of life by reducing traffic congestion, improving emergency response times, optimizing energy consumption, and enabling more responsive, data-driven public administration. However, implementation has frequently fallen short of the rhetoric. Technology-driven solutions can prove expensive to maintain, create new forms of digital exclusion for populations lacking the devices or literacy to access digital services, and raise profound civil liberties concerns when ubiquitous sensor networks enable pervasive surveillance of citizens' movements and behaviors. The most successful implementations appear to be those that involve citizens meaningfully in design decisions rather than imposing top-down technological solutions.`,
    questions: [
      'What technologies does a "smart city" use according to the text?',
      'Give two claimed benefits of smart city technologies mentioned in the passage.',
      'What civil liberties concern does the author raise about sensor networks?',
      'What characteristic distinguishes the most successful smart city implementations?',
    ],
  },
  {
    id: 're-b2-3', skill: 'reading', level: 'B2', icon: '📖', theme: 'Literature',
    title: 'Why Fiction Matters',
    text: `Despite living in an era saturated with information, argument, and factual content, fiction retains a unique and arguably irreplaceable function in human culture. Reading literary fiction — as distinct from consuming news, data, or explicit argument — activates in readers a distinctively empathetic mode of engagement in which we imaginatively inhabit other subjectivities, experiencing the world from perspectives radically different from our own. Research in cognitive psychology has demonstrated that habitual fiction readers display greater "theory of mind" — the capacity to attribute mental states to others and predict their behavior — than those who primarily read non-fiction. Literature also provides a uniquely safe space to encounter morally ambiguous situations, to experience the emotional consequences of choices without bearing their real-world costs, and to develop the tolerance for uncertainty and complexity that characterizes psychological maturity. In this sense, novels are not a luxury but a form of cognitive and moral education.`,
    questions: [
      'What makes the engagement of reading literary fiction different from consuming other content?',
      'What does research show about habitual fiction readers?',
      'How does literature provide a "safe space" according to the author?',
      'What is the author\'s overall argument about whether fiction is important?',
    ],
  },

  // C1
  {
    id: 're-c1-1', skill: 'reading', level: 'C1', icon: '⚖️', theme: 'Law & Ethics',
    title: 'Corporate Personhood and Democratic Accountability',
    text: `The legal doctrine of corporate personhood — the principle that corporations possess certain legal rights and protections traditionally associated with natural persons — has generated sustained controversy among legal scholars, political theorists, and democratic reformers since its establishment in nineteenth-century jurisprudence. The extension of First Amendment speech protections to corporate political expenditures in landmark decisions has dramatically amplified the political influence of large corporations relative to individual citizens, raising foundational questions about whether the democratic ideal of political equality can coexist with radical economic inequality in a system where money functions as speech. Critics argue that the conflation of corporate associations with the natural persons of their shareholders illegitimately prioritizes the instrumental interests of capital accumulation over the expressive and political interests of actual human beings, while defenders contend that restricting corporate speech necessarily impinges on the rights of the shareholders, employees, and communities whose interests those corporations represent and aggregate.`,
    questions: [
      'What is the legal doctrine of corporate personhood?',
      'What tension does the author identify between political and economic equality?',
      'Summarize the two opposing positions on corporate speech restrictions.',
      'What historical period saw the establishment of corporate personhood in jurisprudence?',
    ],
  },
  {
    id: 're-c1-2', skill: 'reading', level: 'C1', icon: '🔬', theme: 'Science & Society',
    title: 'The Replication Crisis in Science',
    text: `The revelation that a substantial proportion of published findings in psychology, medicine, and other empirical sciences cannot be reproduced by independent researchers attempting to replicate the original studies has precipitated what commentators have termed a "replication crisis" that strikes at the foundations of the scientific enterprise. Multiple factors have been identified as contributing to this systemic failure. Publication bias — the tendency of academic journals to preferentially accept positive findings over null results — creates systematic distortion in the published scientific record. Practices such as p-hacking, in which researchers selectively report or reanalyze data until they achieve statistically significant results, and HARKing (Hypothesizing After Results are Known) undermine the inferential legitimacy of statistical tests. The incentive structures of academic careers, which reward novelty and publication volume over methodological rigor and replication, create perverse incentives that predictably generate unreliable science. Proposed reforms include pre-registration of study designs and hypotheses, mandatory sharing of raw data and analysis code, and the development of publication venues that reward methodological quality and replication attempts regardless of their findings.`,
    questions: [
      'What is the "replication crisis" and why is it significant?',
      'Explain what "p-hacking" means in the context of this passage.',
      'What structural incentive problem does the author identify in academic science?',
      'List three proposed reforms to address the replication crisis mentioned in the text.',
    ],
  },
  {
    id: 're-c1-3', skill: 'reading', level: 'C1', icon: '🌍', theme: 'Globalization',
    title: 'The Limits of Global Governance',
    text: `The paradox at the heart of contemporary global governance is that the challenges most urgently requiring coordinated international responses — climate change, pandemic preparedness, nuclear proliferation, financial system stability — are precisely those that are most difficult to address through existing multilateral institutions, which were designed for a world of relatively bounded national sovereignty and face fundamental legitimacy deficits in an era of democratic nationalism and popular suspicion of supranational authority. The architecture of global governance reflects the power configurations of the post-war world and has proven resistant to reform despite the dramatic shifts in relative economic and military power that subsequent decades have produced. Meanwhile, the functional demands placed on international institutions have expanded far beyond their original mandates as the deepening interdependencies of globalized production, finance, and communication create transboundary externalities that no national government can address unilaterally. This mismatch between the global scale of key problems and the primarily national scale of legitimate political authority represents perhaps the defining governance challenge of the twenty-first century.`,
    questions: [
      'What paradox about global governance does the author identify at the outset?',
      'Why does the author say existing multilateral institutions face "legitimacy deficits"?',
      'What does the author mean by "transboundary externalities"?',
      'In the author\'s view, what is the defining governance challenge of the 21st century?',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WRITING — Show prompt, student writes response
// ─────────────────────────────────────────────────────────────────────────────

const WRITING: Activity[] = [
  // A1
  {
    id: 'wr-a1-1', skill: 'writing', level: 'A1', icon: '🙋', theme: 'About Me',
    title: 'Introduce Yourself',
    text: `Write a short introduction about yourself. Include your name, where you live, your family, and one or two things you like. Use simple present tense sentences. Try to write 4–6 sentences.`,
    wordTarget: { min: 30, max: 60 },
  },
  {
    id: 'wr-a1-2', skill: 'writing', level: 'A1', icon: '🏠', theme: 'Home',
    title: 'Describe Your Home',
    text: `Write about your home or apartment. How many rooms are there? What color are the walls? What furniture do you have? Write 4–6 simple sentences.`,
    wordTarget: { min: 30, max: 60 },
  },
  {
    id: 'wr-a1-3', skill: 'writing', level: 'A1', icon: '🍽️', theme: 'Food',
    title: 'My Favorite Food',
    text: `Write about your favorite food. What is it? Where do you eat it? Do you cook it yourself? Why do you like it? Write 4–6 simple sentences.`,
    wordTarget: { min: 30, max: 60 },
  },

  // A2
  {
    id: 'wr-a2-1', skill: 'writing', level: 'A2', icon: '📅', theme: 'Routines',
    title: 'My Weekly Routine',
    text: `Write about what you do during a typical week. Mention your work or study schedule, what you do in the evenings, and what you enjoy at the weekend. Use time expressions like "usually", "every day", "on Saturdays". Write 6–9 sentences.`,
    wordTarget: { min: 60, max: 100 },
  },
  {
    id: 'wr-a2-2', skill: 'writing', level: 'A2', icon: '🏖️', theme: 'Holidays',
    title: 'A Holiday I Enjoyed',
    text: `Write about a holiday or trip you enjoyed. Where did you go? When did you go? Who did you go with? What did you do there? Why did you enjoy it? Use past tense and include specific details. Write 6–9 sentences.`,
    wordTarget: { min: 60, max: 100 },
  },
  {
    id: 'wr-a2-3', skill: 'writing', level: 'A2', icon: '🤝', theme: 'Relationships',
    title: 'My Best Friend',
    text: `Write about your best friend or a person who is important to you. Describe what they look like, their personality, how you met, and why they are special to you. Write 6–9 sentences using a variety of adjectives.`,
    wordTarget: { min: 60, max: 100 },
  },

  // B1
  {
    id: 'wr-b1-1', skill: 'writing', level: 'B1', icon: '💻', theme: 'Technology',
    title: 'Technology in Daily Life',
    text: `Write about how technology has changed your daily life. Discuss both positive and negative effects. Give specific examples from your own experience. Express your personal opinion on whether technology makes life better. Aim for 100–140 words.`,
    wordTarget: { min: 100, max: 140 },
  },
  {
    id: 'wr-b1-2', skill: 'writing', level: 'B1', icon: '🌍', theme: 'Travel',
    title: 'A Place I Would Like to Visit',
    text: `Choose a country or city you would like to visit and explain why. Describe what you know about it, what you would like to see and do there, and what you think you would learn from the experience. Use modal verbs like "would", "could", and "might". Aim for 100–140 words.`,
    wordTarget: { min: 100, max: 140 },
  },
  {
    id: 'wr-b1-3', skill: 'writing', level: 'B1', icon: '🎓', theme: 'Education',
    title: 'The Importance of Learning English',
    text: `Write about why you are learning English and how you think it will help you in the future. Discuss what challenges you have faced in your learning journey and what strategies have helped you most. Give your opinion on the most effective way to learn a language. Aim for 100–140 words.`,
    wordTarget: { min: 100, max: 140 },
  },

  // B2
  {
    id: 'wr-b2-1', skill: 'writing', level: 'B2', icon: '🌆', theme: 'Society',
    title: 'Urban vs Rural Life',
    text: `Write a discursive essay discussing the advantages and disadvantages of living in a city versus living in the countryside. Present arguments on both sides before giving your own conclusion. Use a formal, balanced tone with appropriate discourse markers such as "however", "on the other hand", and "in contrast". Aim for 170–220 words.`,
    wordTarget: { min: 170, max: 220 },
  },
  {
    id: 'wr-b2-2', skill: 'writing', level: 'B2', icon: '📱', theme: 'Social Media',
    title: 'Social Media: More Harm Than Good?',
    text: `Write an opinion essay arguing either for or against the statement: "Social media has done more harm than good to society." Support your position with specific examples, evidence, or reasoning. Acknowledge counter-arguments before refuting them. Use a range of vocabulary and complex sentence structures. Aim for 170–220 words.`,
    wordTarget: { min: 170, max: 220 },
  },
  {
    id: 'wr-b2-3', skill: 'writing', level: 'B2', icon: '💼', theme: 'Work',
    title: 'The Ideal Working Arrangement',
    text: `In recent years, remote work, hybrid models, and flexible hours have become increasingly common. Write an essay discussing what you consider the ideal working arrangement and why. Consider factors such as productivity, work-life balance, collaboration, and employee wellbeing. Use formal register and sophisticated vocabulary. Aim for 170–220 words.`,
    wordTarget: { min: 170, max: 220 },
  },

  // C1
  {
    id: 'wr-c1-1', skill: 'writing', level: 'C1', icon: '🤖', theme: 'Technology & Ethics',
    title: 'Artificial Intelligence and Human Creativity',
    text: `Write a sophisticated essay examining whether artificial intelligence systems that generate art, music, and literature represent a genuine threat to human creative expression, or whether they offer new tools that can augment and enhance human creativity. Draw on philosophical arguments about what creativity fundamentally is, consider the economic implications for creative industries, and develop a nuanced conclusion. Use precise academic vocabulary, complex syntactic structures, and coherent argumentation. Aim for 250–320 words.`,
    wordTarget: { min: 250, max: 320 },
  },
  {
    id: 'wr-c1-2', skill: 'writing', level: 'C1', icon: '⚖️', theme: 'Ethics',
    title: 'The Ethics of Global Wealth Inequality',
    text: `Write an academic essay examining the ethical dimensions of extreme global wealth inequality. Consider whether the concentration of wealth in the hands of a small number of individuals is a moral problem in itself, or only insofar as it produces harmful consequences. Engage with competing ethical frameworks (utilitarian, deontological, virtue-based) in developing your argument. Your essay should demonstrate sophisticated reasoning, precise use of abstract vocabulary, and careful qualification of claims. Aim for 250–320 words.`,
    wordTarget: { min: 250, max: 320 },
  },
  {
    id: 'wr-c1-3', skill: 'writing', level: 'C1', icon: '🌍', theme: 'Global Issues',
    title: 'Democracy Under Pressure',
    text: `Write a formal analytical essay examining the apparent global trend toward democratic backsliding and the erosion of liberal democratic institutions. Consider the structural, economic, and cultural factors that may explain this trend. Assess whether liberal democracy is genuinely in crisis or whether current challenges represent a cyclical stress test that democratic systems have historically proved capable of weathering. Your response should demonstrate command of political and sociological vocabulary, subtle argumentation, and the ability to synthesize complex evidence into a coherent analytical position. Aim for 250–320 words.`,
    wordTarget: { min: 250, max: 320 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined export
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITIES: Activity[] = [
  ...SPEAKING,
  ...LISTENING,
  ...READING,
  ...WRITING,
];

export function getActivities(skill: Skill, level: CEFRLevel): Activity[] {
  return ACTIVITIES.filter(a => a.skill === skill && a.level === level);
}

export const CEFR_LEVELS: { value: CEFRLevel; label: string; desc: string }[] = [
  { value: 'A1', label: 'A1 — Beginner',     desc: 'Simple words and phrases, present tense, basic vocabulary' },
  { value: 'A2', label: 'A2 — Elementary',   desc: 'Short sentences, past tense, everyday topics' },
  { value: 'B1', label: 'B1 — Intermediate', desc: 'Connected sentences, opinions, complex ideas' },
  { value: 'B2', label: 'B2 — Upper-Int.',   desc: 'Abstract topics, sophisticated vocabulary, debate' },
  { value: 'C1', label: 'C1 — Advanced',     desc: 'Academic/professional, nuanced language, complex argument' },
];
