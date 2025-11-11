-- Test Blog Posts for TinyTalks
-- Run this SQL in your Supabase SQL Editor to create 5 test blog articles

-- Make sure the blog_posts table exists first (run supabase-setup.sql if needed)

INSERT INTO public.blog_posts (id, title, content, excerpt, slug, meta_description, published, created_at, updated_at)
VALUES
(
  uuid_generate_v4(),
  '5 Tips to Improve Your English Speaking Confidence',
  '<h2>Introduction</h2><p>Speaking English confidently is one of the biggest challenges for language learners. Here are 5 proven tips to help you build your speaking confidence.</p><h2>1. Practice Daily</h2><p>The key to confidence is consistency. Even 15 minutes of daily practice can make a huge difference. Try speaking about your day, describing what you see, or practicing common phrases.</p><h2>2. Don''t Fear Mistakes</h2><p>Remember: mistakes are part of learning! Every native speaker makes mistakes too. The important thing is to keep communicating, even if it''s not perfect.</p><h2>3. Record Yourself</h2><p>Recording yourself speaking can help you notice areas for improvement. Listen back and identify pronunciation, grammar, or vocabulary that needs work.</p><h2>4. Find a Speaking Partner</h2><p>Practice with someone at a similar level or find a conversation partner online. The more you speak, the more comfortable you''ll become.</p><h2>5. Celebrate Small Wins</h2><p>Every conversation you have in English is progress! Celebrate when you successfully order coffee, ask for directions, or have a small conversation.</p><h2>Conclusion</h2><p>Building confidence takes time, but with consistent practice and a positive attitude, you can achieve your English speaking goals!</p>',
  'Discover 5 practical tips to boost your confidence when speaking English. Learn how daily practice, embracing mistakes, and finding practice partners can accelerate your progress.',
  '5-tips-improve-english-speaking-confidence',
  'Learn 5 effective tips to improve your English speaking confidence and build fluency faster.',
  true,
  NOW() - INTERVAL ''5 days'',
  NOW() - INTERVAL ''5 days''
),
(
  uuid_generate_v4(),
  'How to Learn English Vocabulary Effectively',
  '<h2>The Challenge of Vocabulary</h2><p>Learning new vocabulary can feel overwhelming, but with the right strategies, you can expand your word bank effectively.</p><h2>Use Context, Not Just Lists</h2><p>Instead of memorizing random word lists, learn words in context. Read sentences, listen to conversations, and see how words are actually used. This helps you remember them better and use them correctly.</p><h2>Create Associations</h2><p>Connect new words to things you already know. Create mental images, find connections to your native language, or link words to personal experiences. The stronger the association, the easier it is to remember.</p><h2>Review Regularly</h2><p>Use spaced repetition techniques. Review new words after 1 day, 3 days, 1 week, and 1 month. This helps move words from short-term to long-term memory.</p><h2>Practice Actively</h2><p>Don''t just recognize words - use them! Write sentences, have conversations, and create your own examples. Active use solidifies your learning.</p><h2>Learn Word Families</h2><p>When you learn a word, learn its family: happy (adjective), happiness (noun), happily (adverb). This multiplies your vocabulary efficiently.</p><h2>Conclusion</h2><p>Effective vocabulary learning is about quality over quantity. Focus on mastering words you''ll actually use, and practice them in meaningful contexts.</p>',
  'Master the art of learning English vocabulary with proven techniques like context-based learning, spaced repetition, and active practice.',
  'how-learn-english-vocabulary-effectively',
  'Discover effective methods for learning and remembering English vocabulary, including context-based learning and spaced repetition.',
  true,
  NOW() - INTERVAL ''4 days'',
  NOW() - INTERVAL ''4 days''
),
(
  uuid_generate_v4(),
  'Understanding English Grammar: Common Mistakes to Avoid',
  '<h2>Grammar Doesn''t Have to Be Scary</h2><p>Many English learners struggle with grammar, but understanding common mistakes can help you avoid them and improve faster.</p><h2>Mistake #1: Articles (a, an, the)</h2><p>Many languages don''t have articles, making them tricky. Remember: use "a/an" for general things (a book), "the" for specific things (the book on the table), and no article for general concepts (love, happiness).</p><h2>Mistake #2: Prepositions</h2><p>Prepositions can be confusing because they don''t always translate directly. Learn common combinations: "interested in", "good at", "afraid of". Practice them as phrases, not just individual words.</p><h2>Mistake #3: Present Perfect vs. Past Simple</h2><p>Use present perfect for actions that started in the past but continue now, or when the time is not important (I have lived here for 5 years). Use past simple for completed actions at a specific time (I moved here in 2019).</p><h2>Mistake #4: Subject-Verb Agreement</h2><p>Always match your verb to your subject. "He goes" not "He go". "They are" not "They is". Pay special attention with "he/she/it" - they need verbs with -s.</p><h2>Mistake #5: Word Order</h2><p>English follows specific word order: Subject + Verb + Object. "I read books" is correct. "Books I read" sounds unnatural in most situations.</p><h2>Tips for Improvement</h2><p>Read a lot, notice patterns, and practice writing. Grammar improves naturally when you see correct structures repeatedly. Don''t try to learn all rules at once!</p>',
  'Avoid these 5 common English grammar mistakes and improve your accuracy. Learn about articles, prepositions, tenses, and more.',
  'understanding-english-grammar-common-mistakes',
  'Learn about 5 common English grammar mistakes learners make and how to avoid them to improve your accuracy and fluency.',
  true,
  NOW() - INTERVAL ''3 days'',
  NOW() - INTERVAL ''3 days''
),
(
  uuid_generate_v4(),
  'The Power of Consistent Practice: Your English Learning Journey',
  '<h2>Why Consistency Matters</h2><p>Learning English is like building a house - you need a strong foundation, built brick by brick, consistently over time. Here''s why consistent practice is more powerful than intensive cramming.</p><h2>Small Daily Steps Beat Big Weekly Sessions</h2><p>Studies show that 15-30 minutes daily is more effective than 3 hours once a week. Your brain needs regular exposure to create strong neural pathways. Consistency keeps English fresh in your mind and prevents forgetting.</p><h2>How to Build a Practice Routine</h2><p><strong>Start Small:</strong> Begin with just 10 minutes a day. This feels manageable and prevents burnout.</p><p><strong>Same Time, Same Place:</strong> Create a routine. Practice at the same time each day - maybe with your morning coffee or before bed. This creates a habit.</p><p><strong>Mix It Up:</strong> Don''t do the same thing every day. Monday: reading, Tuesday: listening, Wednesday: speaking, etc. Variety keeps it interesting.</p><h2>What Counts as Practice?</h2><p>Practice doesn''t always mean textbooks! Listening to English music, watching movies with subtitles, reading news articles, chatting with friends, or even thinking in English all count.</p><h2>Track Your Progress</h2><p>Keep a simple log: "Today I practiced for 20 minutes" or "I learned 5 new words." Seeing your streak of practice days is motivating!</p><h2>Dealing with Missed Days</h2><p>Life happens! If you miss a day, don''t give up. Just start again the next day. One missed day doesn''t erase weeks of progress.</p><h2>Conclusion</h2><p>Remember: slow and steady wins the race. Consistency beats intensity. Build a sustainable practice routine, and you''ll see progress that lasts!</p>',
  'Learn why consistent daily practice beats intensive study sessions. Discover how to build a sustainable English learning routine that really works.',
  'power-consistent-practice-english-learning',
  'Discover why consistent daily practice is key to English learning success and how to build a sustainable study routine.',
  true,
  NOW() - INTERVAL ''2 days'',
  NOW() - INTERVAL ''2 days''
),
(
  uuid_generate_v4(),
  'Fun Ways to Practice English Outside the Classroom',
  '<h2>Learning Beyond the Books</h2><p>English isn''t just for classrooms! Here are engaging ways to practice English in your everyday life that feel more like fun than work.</p><h2>1. Change Your Phone Language</h2><p>Switch your phone, computer, or apps to English. You''ll learn tech vocabulary naturally as you navigate your devices daily.</p><h2>2. Follow English Social Media</h2><p>Follow accounts that interest you - cooking, travel, tech, whatever you love - but in English. Your feed becomes a daily English practice opportunity!</p><h2>3. Cook in English</h2><p>Find English recipes online and follow them. You''ll learn food vocabulary while creating something delicious. Try English cooking channels on YouTube!</p><h2>4. Play English Games</h2><p>Switch your video games to English, or try word games like crosswords, Scrabble, or online quiz games. Games make learning feel like play!</p><h2>5. Think in English</h2><p>Start with simple thoughts: "I''m going to make coffee" or "The weather is nice today." Gradually expand to more complex thinking. This internal practice is incredibly valuable.</p><h2>6. Join Online Communities</h2><p>Find forums or groups about your hobbies in English. Reddit, Discord, or Facebook groups are great places to read and write English about topics you care about.</p><h2>7. Watch with English Subtitles</h2><p>Watch movies, shows, or YouTube videos in English with English subtitles. Your reading and listening improve simultaneously!</p><h2>Conclusion</h2><p>The best English practice fits naturally into your life. When learning feels like living, not studying, you''ll progress faster and have more fun!</p>',
  'Discover 7 fun and practical ways to practice English in your daily life. From changing your phone language to playing games, make learning enjoyable!',
  'fun-ways-practice-english-outside-classroom',
  'Learn 7 engaging and practical ways to practice English outside traditional lessons, making learning feel natural and fun.',
  true,
  NOW() - INTERVAL ''1 day'',
  NOW() - INTERVAL ''1 day''
);

