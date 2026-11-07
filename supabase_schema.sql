-- ==============================================================================
-- SHUBH DEEP — Supabase Database Migration & Security Schema
-- Aesthetic: Earthy Indian Minimalism
-- Description: Creates tables, RLS policies, storage bucket, and pre-seeds all
--              approved Shayaris, Wishes, and Website Content for live CMS.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT NOT NULL DEFAULT '🪔',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SHAYARIS & WISHES TABLE
CREATE TABLE IF NOT EXISTS public.shayaris_wishes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'shayari' CHECK (type IN ('shayari', 'wish')),
    category_id TEXT REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    hindi TEXT NOT NULL,
    english TEXT,
    tag TEXT NOT NULL DEFAULT 'Diwali Blessing',
    emoji TEXT NOT NULL DEFAULT '🪔',
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SITE CONTENT TABLE (Key-Value Dynamic CMS)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    input_type TEXT NOT NULL DEFAULT 'textarea' CHECK (input_type IN ('text', 'textarea', 'markdown')),
    display_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    authorized_email TEXT NOT NULL,
    site_title TEXT DEFAULT 'SHUBH DEEP',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES & DATABASE-LEVEL AUTHORIZATION
-- ==============================================================================

-- Helper Function: Verify if current authenticated user's email matches authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  v_authorized_email text;
BEGIN
  IF auth.role() <> 'authenticated' THEN
    RETURN false;
  END IF;

  SELECT authorized_email INTO v_authorized_email
  FROM public.admin_settings
  WHERE id = 'config';

  IF v_authorized_email IS NOT NULL AND v_authorized_email <> '' THEN
    RETURN LOWER(v_authorized_email) = LOWER(auth.jwt() ->> 'email');
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shayaris_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" 
    ON public.categories FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
CREATE POLICY "Admin can manage categories" 
    ON public.categories FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- SHAYARIS & WISHES POLICIES
DROP POLICY IF EXISTS "Public can view published shayaris and wishes" ON public.shayaris_wishes;
CREATE POLICY "Public can view published shayaris and wishes" 
    ON public.shayaris_wishes FOR SELECT 
    USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage all shayaris and wishes" ON public.shayaris_wishes;
CREATE POLICY "Admin can manage all shayaris and wishes" 
    ON public.shayaris_wishes FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- SITE CONTENT POLICIES
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content" 
    ON public.site_content FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admin can manage site content" ON public.site_content;
CREATE POLICY "Admin can manage site content" 
    ON public.site_content FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- ADMIN SETTINGS POLICIES
DROP POLICY IF EXISTS "Admin can view settings" ON public.admin_settings;
CREATE POLICY "Admin can view settings" 
    ON public.admin_settings FOR SELECT 
    TO authenticated 
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update settings" ON public.admin_settings;
CREATE POLICY "Admin can update settings" 
    ON public.admin_settings FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET FOR MEDIA
-- ==============================================================================

-- Ensure media bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access to Media" ON storage.objects;
CREATE POLICY "Public Access to Media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Upload to Media" ON storage.objects;
CREATE POLICY "Admin Upload to Media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Update Media" ON storage.objects;
CREATE POLICY "Admin Update Media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Delete Media" ON storage.objects;
CREATE POLICY "Admin Delete Media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'media' AND public.is_admin());

-- ==============================================================================
-- 8. PRE-SEED INITIAL DATA (APPROVED SHUBH DEEP CONTENT)
-- ==============================================================================

-- 8A. CATEGORIES
INSERT INTO public.categories (id, name, description, emoji, display_order)
VALUES 
    ('funny', 'Funny Shayari', 'हँसी-मज़ाक और नोक-झोंक भरी शायरी', '🍬', 1),
    ('friendship', 'Friendship Shayari', 'सच्ची दोस्ती और प्यारे दोस्तों के लिए', '💛', 2),
    ('heartwarming', 'Heartwarming Wishes', 'दिल को छू लेने वाली पावन शुभकामनाएं', '🌸', 3),
    ('flirt', 'Cute & Subtle Flirt', 'हल्की-सी शरारत और प्यारी तारीफें', '✨', 4),
    ('diwali_special', 'Diwali Special Shayari', 'माटी के दीप और उत्सव की खास रौनक', '🪔', 5),
    ('custom', 'Custom Category', 'आपकी अपनी खास बनाई हुई रचनाएं', '✍️', 6)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, emoji = EXCLUDED.emoji, display_order = EXCLUDED.display_order;

-- 8B. ALL 27 APPROVED SHAYARIS & WISHES
INSERT INTO public.shayaris_wishes (id, type, category_id, hindi, english, tag, emoji, status, display_order)
VALUES
    -- 1. Funny Shayari (1-9)
    ('funny-1', 'shayari', 'funny', 
     'Diwali par mithai khoob khaana,\nKhushiyon ke saath selfie bhi banana,\nBas ek baat yaad rakhna,\nCalories ka hisaab kal lagana!', 
     'Eat as much mithai as your heart desires. Calorie counting starts tomorrow!', 'Mithai & Calories', '🍬', 'published', 1),
    ('funny-2', 'shayari', 'funny', 
     'Soan Papdi ka dabba ghoom-ghoom ke wapas na aa jaye,\nIs darr se humne chupke se use pehle hi kha liya!', 
     'Ate the Soan Papdi before it could be re-gifted right back to us!', 'Soan Papdi Trap', '📦', 'published', 2),
    ('funny-3', 'shayari', 'funny', 
     'Ghar ki safai mein kamar toot gayi aadhi,\nPhir bhi mummy boli—"Pankha toh saaf kiya hi nahi abhi!"\nShubh Deepavali!', 
     'Cleaned the whole house, but Mom still found that one dusty ceiling fan!', 'Diwali Ki Safai', '🧹', 'published', 3),
    ('funny-4', 'shayari', 'funny', 
     'Diwali ka plan bada simple hai boss:\nSubah mithai, dopahar ko sonaa,\nShaam ko saj-dhaj ke 50 photos lena,\nAur raat ko phir se kaju katli churaana!', 
     'Eat sweets, take a nap, click 50 photos, and raid the fridge for Kaju Katli at midnight.', 'Perfect Schedule', '📸', 'published', 4),
    ('funny-5', 'shayari', 'funny', 
     'Dost wo jo anaar jalaye toh khud pehle bhaag jaye,\nAur phooljhadi pakda kar bol de—\n"Arrey kuch nahi hota, bas pakad ke rakh!"\nHappy Diwali!', 
     'True friends run away after lighting the cracker, leaving you holding the sparkler!', 'Friendship Goals', '✨', 'published', 5),
    ('funny-6', 'shayari', 'funny', 
     'Kaju Katli ka dabba khola toh khali nikla,\nSamajh gaye ghar mein kisi shaitan bhai-behan ka chakkar hai!\nHanste rahiye, Happy Diwali!', 
     'Opened the Kaju Katli box only to find crumbs. Sibling crime detected!', 'Sibling Secrets', '🍫', 'published', 6),
    ('funny-7', 'shayari', 'funny', 
     'Diye toh jalenge poori raat shaan se,\nBas koi Soan Papdi na bhej de bholepan se!\nBaaki sab mangalmay ho!', 
     'May lamps burn bright all night, and may no one gift you Soan Papdi by mistake!', 'Festive Humor', '🪔', 'published', 7),
    ('funny-8', 'shayari', 'funny', 
     'Safai karte karte bachpan ke wo khilone mil gaye,\nJo das saal pehle "kho gaye the" keh kar mummy ne chhupa diye the!', 
     'Found childhood toys during Diwali cleaning that mom swore were lost 10 years ago!', 'Nostalgic Cleaning', '🧸', 'published', 8),
    ('funny-9', 'shayari', 'funny', 
     'Mithai khaane mein koi sharm nahi,\nDiwali saal mein ek hi baar aati hai,\nDiet chart ko bolo thoda intezaar kare!', 
     'No regrets on sweets—Diwali comes once a year, the diet chart can wait!', 'Zero Regrets', '😋', 'published', 9),

    -- 2. Heartwarming Wishes (1-9)
    ('heart-1', 'wish', 'heartwarming', 
     'May your life always be filled with happiness, warmth and beautiful little moments. Keep smiling and shining.', 
     'आपकी जिंदगी सदा खुशियों, सुकून और अनगिनत छोटी-छोटी प्यारी यादों से महकती रहे।', 'Little Moments', '🌸', 'published', 10),
    ('heart-2', 'wish', 'heartwarming', 
     'दीपक की मद्धम लौ से सजे आपका आँगन,\nखुशियों की पावन सुगंध से महके हर एक कण।\nआपको और आपके परिवार को दीपावली की असीम शुभकामनाएं।', 
     'May the gentle flame of earthen lamps grace your courtyard and fill every moment with harmony.', 'Sacred Hearth', '🪔', 'published', 11),
    ('heart-3', 'wish', 'heartwarming', 
     'May this Diwali mark the beginning of peaceful mornings, restful nights, and a year where all your quiet prayers find their answers.', 
     'ईश्वर करे यह पर्व आपके जीवन में नई उम्मीदें और दिल को सुकून देने वाली शांति लेकर आए।', 'New Beginnings', '🕊️', 'published', 12),
    ('heart-4', 'wish', 'heartwarming', 
     'जगमगाते दीपों की यह कतार आपके जीवन से हर उदासी को दूर करे,\nऔर आपके दिल में हमेशा अपनों के सच्चे प्यार का उजाला रहे।', 
     'May the rows of glowing diyas dissolve every sorrow and keep the warmth of true loved ones alive in your heart.', 'Eternal Light', '✨', 'published', 13),
    ('heart-5', 'wish', 'heartwarming', 
     'The fragrance of mango-leaf torans, the sweetness of homemade mithai, and laughter with loved ones—may your home be filled with timeless togetherness.', 
     'घर की चौखट, मीठी बातें और अपनों की मुस्कान—यही इस पावन पर्व का सच्चा आशीर्वाद है।', 'Family & Togetherness', '🏡', 'published', 14),
    ('heart-6', 'wish', 'friendship', 
     'खट्टी-मीठी यादें, सच्ची दोस्ती और चौखट पर जलता हुआ एक छोटा सा दीया—यही जिंदगी की सबसे अनमोल दौलत है। शुभ दीपावली!', 
     'Cherished memories, true friendship, and a humble diya at the door—the greatest treasures of life.', 'True Friendship', '💛', 'published', 15),
    ('heart-7', 'wish', 'heartwarming', 
     'Here is to laughter that warms the soul, conversations that linger, and a festival that leaves you with a heart full of gratitude.', 
     'दिलों को सुकून देने वाली हँसी और अपनों के साथ का यह खूबसूरत त्योहार आपके लिए यादगार बने।', 'Gratitude & Smiles', '☀️', 'published', 16),
    ('heart-8', 'wish', 'heartwarming', 
     'ईश्वर करे कि इस पावन पर्व पर आपका हर सपना एक नया सवेरा पाए,\nऔर आपकी मुस्कान सदा चाँद की तरह खिलती रहे। शुभ दीपावली!', 
     'May every quiet dream find its dawn, and may your smile remain as gentle and radiant as the moonlight.', 'Gentle Grace', '🌙', 'published', 17),
    ('heart-9', 'wish', 'heartwarming', 
     'May the gentle glow of clay lamps illuminate the kindness within you and bring countless reasons to celebrate every single day.', 
     'माटी के दीयों की रोशनी आपके भीतर की अच्छाई को और निखारे, और हर दिन को उत्सव बना दे।', 'Inner Kindness', '🌿', 'published', 18),

    -- 3. Subtle Flirting / Charming Shayari (1-9)
    ('flirt-1', 'shayari', 'flirt', 
     'Diye toh har ghar mein jalte hain,\nPar kuch log apni smile se hi poori mehfil roshan kar dete hain.', 
     'Lamps light up homes, but some people illuminate the entire room just with their smile.', 'Smile Light', '💫', 'published', 19),
    ('flirt-2', 'shayari', 'flirt', 
     'Diwali par poora shahar roshan hai,\nLekin sach kahein toh aapki hassi ke aage sabhi lightein thodi pheeki lagti hain!', 
     'The whole city is lit up for Diwali, but honestly, every light feels subtle next to your laugh.', 'City Glow', '✨', 'published', 20),
    ('flirt-3', 'shayari', 'flirt', 
     'Rangoli toh bahut dekhi aaj,\nPar aapki aankhon se zyada khoobsurat design kahin nahi dikha!', 
     'Saw many intricate rangolis today, but none quite as captivating as your eyes.', 'Rangoli Eyes', '🎨', 'published', 21),
    ('flirt-4', 'shayari', 'flirt', 
     'Sab log mithai dhoondh rahe hain,\nUnhe kya pata sabse meethi cheez toh aapki baatein hain!', 
     'Everyone is busy hunting for sweets, not realizing your conversations are the sweetest part.', 'Sweetest Talk', '🍯', 'published', 22),
    ('flirt-5', 'shayari', 'flirt', 
     'Is Diwali ek wish maangi hai—\nKi aap jab bhi traditional outfit mein photo post karo, toh thoda advance notice diya karo... dil sambhalna aasan ho jaye!', 
     'A small request this Diwali: give a little heads-up before sharing traditional outfit photos, so we can prepare!', 'Traditional Charm', '👘', 'published', 23),
    ('flirt-6', 'shayari', 'flirt', 
     'Patakhe shor machaate hain bina baat ke,\nAur aapki ek halki si nazar chupchap dil chura le jaati hai bina kisi aawaaz ke!', 
     'Firecrackers make so much noise, while your subtle gaze effortlessly steals hearts in complete silence.', 'Quiet Thief', '🎇', 'published', 24),
    ('flirt-7', 'shayari', 'flirt', 
     'Diwali ke deepak toh bas ek bahaana hain,\nAsal mein toh aapki ek jhalak hi humara poora din roshan kar deti hai.', 
     'Diwali lamps are just an occasion—in truth, a single glimpse of you brightens the entire day.', 'Day Brightener', '🕯️', 'published', 25),
    ('flirt-8', 'shayari', 'flirt', 
     'Kaju Katli sabki favourite hoti hai,\nPar lagta hai usne bhi apni sweetness aapse hi borrow ki hai!', 
     'Everyone loves Kaju Katli, but we suspect it borrowed all its sweetness from you.', 'Kaju Katli Vibe', '🍬', 'published', 26),
    ('flirt-9', 'shayari', 'flirt', 
     'Log kehte hain roshni ka festival hai...\nPar hume lagta hai sabse zyada natural glow aapke chehre par rehta hai!', 
     'People call it the festival of lights, but we think the most natural glow belongs right on your face.', 'Natural Glow', '🌟', 'published', 27),

    -- 4. Diwali Special Shayari Extra
    ('special-1', 'shayari', 'diwali_special',
     'माटी का एक छोटा सा दीया अंधियारे को मिटा देता है,\nसच्चा प्रेम और अपनापन हर गिले-शिकवे भुला देता है।\nदीपावली के पावन पर्व की मंगलकामनाएं!',
     'A humble earthen lamp dispels the deepest shadows, while genuine love dissolves all distance.', 'Sacred Flame', '🪔', 'published', 28)
ON CONFLICT (id) DO UPDATE
SET hindi = EXCLUDED.hindi, english = EXCLUDED.english, tag = EXCLUDED.tag, emoji = EXCLUDED.emoji, status = EXCLUDED.status;

-- 8C. ALL DYNAMIC WEBSITE CONTENT
INSERT INTO public.site_content (id, section, label, value, input_type, display_order)
VALUES
    -- Hero Section
    ('hero_badge', 'hero', 'Hero Top Label Badge', 'A FESTIVAL OF LIGHT', 'text', 1),
    ('hero_heading_hindi', 'hero', 'Main Hindi Heading', 'शुभ दीपावली', 'text', 2),
    ('hero_subtitle', 'hero', 'Hero Subtitle', 'A Little Light, A Lot of Happiness.', 'text', 3),
    ('hero_intro_quote', 'hero', 'Hero Introductory Message', '"May this beautiful festival bring peace, happiness, and countless little reasons to smile."', 'textarea', 4),
    ('hero_enter_btn', 'hero', 'Enter Celebration Button Text', 'Enter Celebration', 'text', 5),

    -- Festive Intro Section
    ('intro_badge', 'festive_intro', 'Intro Top Badge', 'The Spirit of Deepavali', 'text', 10),
    ('intro_heading', 'festive_intro', 'Intro Section Heading', 'दीपक की ज्योति से आलोकित हो संसार', 'text', 11),
    ('intro_quote', 'festive_intro', 'Intro Section Quote', '"May the flame of every earthen lamp illuminate the world with peace."', 'text', 12),
    ('intro_narrative', 'festive_intro', 'Intro Main Narrative Paragraph', 'Diwali is a return to simplicity. It is the fragrance of raw river clay baking in the potter''s kiln, the deliberate geometry of rice-flour rangoli adorning courtyard steps, and the warmth of reuniting with loved ones. When an earthen lamp is lit, it asks for neither fanfare nor extravagance—only a drop of oil to offer unconditional brightness. In that quiet gesture lies the true soul of SHUBH DEEP: a mindful celebration of light, harmony, and renewed hope.', 'textarea', 13),

    -- Wishes Section
    ('wishes_badge', 'wishes', 'Wishes Section Badge', 'Festive Verses & Heartfelt Wishes', 'text', 20),
    ('wishes_heading', 'wishes', 'Wishes Section Heading', 'शब्दों में दीपावली की मिठास', 'text', 21),
    ('wishes_subtitle', 'wishes', 'Wishes Section Subtitle', 'Spreading warmth, lighthearted laughter, and heartfelt blessings to celebrate this festival of lights.', 'textarea', 22),
    ('wishes_next_btn', 'wishes', 'Next Wish Button Label', 'Next Wish', 'text', 23),
    ('wishes_copy_btn', 'wishes', 'Copy Wish Button Label', 'Copy Wish', 'text', 24),

    -- Gift Reveal & Final Surprise Section
    ('gift_badge', 'surprise', 'Gift Section Badge', 'The Final Blessing', 'text', 30),
    ('gift_heading', 'surprise', 'Gift Section Heading', 'A Little Surprise For You...', 'text', 31),
    ('gift_subtitle', 'surprise', 'Gift Section Subtitle', 'Because every beautiful celebration deserves a little extra happiness.', 'textarea', 32),
    ('gift_open_btn', 'surprise', 'Open Gift Button Label', 'Open Your Gift', 'text', 33),
    ('gift_unveiling_hindi', 'surprise', 'Opening Animation Hindi Text', '॥ उपहार खुल रहा है... ॥', 'text', 34),
    ('gift_unveiling_en', 'surprise', 'Opening Animation English Text', 'Unveiling your celebration...', 'text', 35),
    ('poem_line_1', 'surprise', 'Special Poem - Line 1', 'जिंदगी में रोशनी हमेशा बनी रहे,', 'text', 36),
    ('poem_line_2', 'surprise', 'Special Poem - Line 2', 'चेहरे पर मुस्कान कभी कम न हो।', 'text', 37),
    ('poem_line_3', 'surprise', 'Special Poem - Line 3', 'हर ख्वाब पूरा हो तुम्हारा,', 'text', 38),
    ('poem_line_4', 'surprise', 'Special Poem - Line 4', 'और खुशियों का कोई अंत न हो।', 'text', 39),
    ('poem_line_5', 'surprise', 'Special Poem - Line 5 (Playful)', 'वैसे एक छोटी सी बात...', 'text', 40),
    ('poem_line_6', 'surprise', 'Special Poem - Line 6', 'Diwali ke diye toh har koi jalata hai,', 'text', 41),
    ('poem_line_7', 'surprise', 'Special Poem - Line 7', 'par kuch log apni smile se hi celebration complete kar dete hain! 😉', 'text', 42),
    ('poem_final_title', 'surprise', 'Poem Final Greeting Title', 'Happy Diwali to You and Your Family!', 'text', 43),
    ('poem_final_subtitle', 'surprise', 'Poem Final Greeting Subtitle', 'May Peace & Joy Abound', 'text', 44),
    ('final_screen_heading', 'surprise', 'Final Screen Heading', 'शुभ दीपावली', 'text', 45),
    ('final_screen_sub', 'surprise', 'Final Screen Subtitle', 'Happy Diwali!', 'text', 46),
    ('final_screen_quote', 'surprise', 'Final Screen Heartfelt Line', '"Keep smiling. Keep shining. Keep spreading happiness."', 'text', 47),
    ('final_replay_btn', 'surprise', 'Replay Magic Button Label', 'Replay Magic ✨', 'text', 48),

    -- Footer
    ('footer_shloka', 'footer', 'Footer Sanskrit Shloka', '"दीप ज्योति परब्रह्म दीप ज्योति जनार्दनः। दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तुते॥"', 'text', 50),
    ('footer_greeting', 'footer', 'Footer Blessing Message', 'Wishing you and your loved ones an auspicious Deepavali blessed with serene health, quiet fulfillment, and lasting peace.', 'textarea', 51),
    ('footer_peace_shloka', 'footer', 'Footer Peace Shloka Badge', '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥', 'text', 52),
    ('footer_copyright', 'footer', 'Footer Copyright Text', '© 2026 SHUBH DEEP. All Rights Reserved.', 'text', 53)
ON CONFLICT (id) DO UPDATE
SET value = EXCLUDED.value, label = EXCLUDED.label, section = EXCLUDED.section;

-- 8D. DEFAULT ADMIN CONFIG
INSERT INTO public.admin_settings (id, authorized_email, site_title)
VALUES ('config', 'admin@shubhdeep.com', 'SHUBH DEEP')
ON CONFLICT (id) DO NOTHING;
